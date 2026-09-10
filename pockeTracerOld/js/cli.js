const CLI = (() => {
  let cmdHistory = [];
  let historyIndex = -1;
  let currentDeviceId = null;
  let mode = 'user';
  let iface = null;
  let ifaceRange = null;
  let vlanId = null;
  let dhcpPool = null;

  // ─── Logging ────────────────────────────────────────────────────────────────

  const log = (type, msg) => {
    const el = Utils.qs('#cliConsole');
    const line = Utils.createEl('div', { className: `cli-line ${type}` });
    line.innerHTML = msg;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  };

  const setPrompt = () => {
    const el = Utils.qs('#cliPrompt');
    if (!currentDeviceId) { el.textContent = 'PockeTracer>'; return; }
    const dev = Devices.list.find(d => d.id === currentDeviceId);
    if (!dev) { currentDeviceId = null; el.textContent = 'PockeTracer>'; return; }
    const suffixes = {
      user: '>', priv: '#', config: '(config)#', if: '(config-if)#',
      vlan: '(config-vlan)#', svi: '(config-if)#', dhcp: '(dhcp-config)#'
    };
    el.textContent = `${dev.name}${suffixes[mode] || '>'}`;
  };

  // ─── Interface name normalizer ──────────────────────────────────────────────

  const normalizeIf = (txt) => {
    const t = (txt || '').toLowerCase().trim();
    if (t.startsWith('gigabitethernet')) return `Gi${txt.split(/gigabitethernet/i)[1].trim()}`;
    if (t.startsWith('gi'))             return `Gi${txt.slice(2).trim()}`;
    if (t.startsWith('fastethernet'))   return `Fa${txt.split(/fastethernet/i)[1].trim()}`;
    if (t.startsWith('fa'))             return `Fa${txt.slice(2).trim()}`;
    if (t.startsWith('vlan'))           return `Vlan${txt.replace(/vlan\s*/i,'').trim()}`;
    return txt;
  };

  const requireDevice = () => {
    if (!currentDeviceId) {
      log('error', 'Няма активна конзолна сесия. Използвай: <b>connect &lt;device-name&gt;</b>');
      return false;
    }
    return true;
  };

  const refreshConfig = (dev) => {
    if (dev && Devices.selected.includes(dev.id)) UI.showConfig(dev);
  };

  const applyIfProp = (dev, names, fn) => {
    const list = Array.isArray(names) ? names : [names];
    list.forEach(n => {
      const k = normalizeIf(n);
      const c = dev.config.interfaces[k] || {};
      fn(c);
      dev.config.interfaces[k] = c;
    });
    refreshConfig(dev);
  };

  // ─── IP / Network Utilities ─────────────────────────────────────────────────

  const ipToNum = (ip) => {
    if (!ip) return 0;
    return ip.split('.').reduce((a, o) => (a << 8) + parseInt(o, 10), 0) >>> 0;
  };

  const maskToNum = (mask) => {
    if (!mask) return 0;
    if (mask.includes('/')) {
      const bits = parseInt(mask.slice(1), 10);
      return bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
    }
    return ipToNum(mask);
  };

  const numToIp = (n) => {
    n = n >>> 0;
    return [(n>>>24)&0xFF,(n>>>16)&0xFF,(n>>>8)&0xFF,n&0xFF].join('.');
  };

  const maskToCidr = (mask) => {
    if (!mask) return '?';
    const n = maskToNum(mask);
    let c = 0;
    for (let i = 31; i >= 0; i--) if ((n >>> i) & 1) c++;
    return c;
  };

  const networkOf = (ip, mask) => numToIp(ipToNum(ip) & maskToNum(mask));

  const sameNetwork = (ip1, mask1, ip2) => {
    const m = maskToNum(mask1);
    return (ipToNum(ip1) & m) === (ipToNum(ip2) & m);
  };

  // All IPs assigned on a device (interfaces + SVIs + management)
  const getDeviceIPs = (dev) => {
    const ips = [];
    if (dev.config.ip && dev.config.mask)
      ips.push({ ip: dev.config.ip, mask: dev.config.mask, src: 'management' });
    Object.entries(dev.config.interfaces || {}).forEach(([name, ic]) => {
      if (ic.ip && ic.mask && ic.shutdown !== true)
        ips.push({ ip: ic.ip, mask: ic.mask, src: name });
    });
    Object.entries(dev.config.svi || {}).forEach(([name, s]) => {
      if (s.ip && s.mask && s.shutdown !== true)
        ips.push({ ip: s.ip, mask: s.mask, src: name });
    });
    return ips;
  };

  const deviceHasIP = (dev, ip) => getDeviceIPs(dev).some(e => e.ip === ip);

  const getNeighborIds = (devId) => {
    const ids = [];
    Connections.list.forEach(c => {
      if (c.from.deviceId === devId) ids.push(c.to.deviceId);
      else if (c.to.deviceId === devId) ids.push(c.from.deviceId);
    });
    return [...new Set(ids)];
  };

  // BFS routing simulation — returns { dev, path, hops } or null
  const findRoute = (srcDev, targetIP, maxHops = 30) => {
    const visited = new Set();
    const queue = [{ devId: srcDev.id, path: [srcDev.id], hops: 0 }];

    while (queue.length) {
      const { devId, path, hops } = queue.shift();
      if (hops > maxHops || visited.has(devId)) continue;
      visited.add(devId);

      const dev = Devices.list.find(d => d.id === devId);
      if (!dev || !dev.powered) continue;

      if (deviceHasIP(dev, targetIP)) return { dev, path, hops };

      // Forwarding policy:
      // - L3: routers, L3 switches, cloud (ipRouting=true or known L3 types)
      // - L2 bridging: classic switches, hubs, taps, APs
      // - Ring PCs (with In/Out) forward in-ring
      const L3_FORWARD = ['router-2911','home-router','switch-3650','switch-3560-24ps','cloud-isp'];
      const L2_FORWARD = ['switch-2960','switch-2960-8','hub-8','coax-tap','access-point','token-ring-mau'];
      const RING_FORWARD = ['pc-ring'];
      const canRoute = dev.config.ipRouting ||
        L3_FORWARD.includes(dev.type) ||
        L2_FORWARD.includes(dev.type) ||
        RING_FORWARD.includes(dev.type);

      if (canRoute || path.length === 1) {
        getNeighborIds(devId).forEach(nId => {
          if (!visited.has(nId)) queue.push({ devId: nId, path: [...path, nId], hops: hops + 1 });
        });
      }
    }
    return null;
  };

  // Full ping simulation with gateway check
  const simulatePing = (srcDev, targetIP) => {
    // Self-ping
    if (deviceHasIP(srcDev, targetIP))
      return { success: true, hops: 0, path: [srcDev.id] };

    const targetDev = Devices.list.find(d => deviceHasIP(d, targetIP));
    if (!targetDev)
      return { success: false, reason: `Destination host unreachable — ${targetIP} не е назначен на нито едно устройство` };
    if (!targetDev.powered)
      return { success: false, reason: `Host ${targetIP} е изключен` };

    const srcIPs = getDeviceIPs(srcDev);
    if (!srcIPs.length)
      return { success: false, reason: `${srcDev.name} няма конфигуриран IP адрес` };

    // Cross-network: check gateway
    const mainIP = srcIPs[0];
    if (!sameNetwork(mainIP.ip, mainIP.mask, targetIP)) {
      const gw = srcDev.config.gateway;
      if (!gw) return { success: false, reason: `Няма Default Gateway на ${srcDev.name}` };
      const gwExists = Devices.list.some(d => deviceHasIP(d, gw));
      if (!gwExists) return { success: false, reason: `Default Gateway ${gw} не е достъпен` };
    }

    const result = findRoute(srcDev, targetIP);
    if (!result) return { success: false, reason: 'Request timeout — няма маршрут до дестинацията' };
    return { success: true, hops: result.hops, path: result.path };
  };

  // Traceroute simulation
  const simulateTraceroute = (srcDev, targetIP) => {
    const result = findRoute(srcDev, targetIP);
    if (!result) return null;
    return result.path.map((devId, i) => {
      const d = Devices.list.find(x => x.id === devId);
      const ips = d ? getDeviceIPs(d) : [];
      const ip = ips.length ? ips[0].ip : targetIP;
      const ms = 1 + i * 2 + Math.floor(Math.random() * 3);
      return { hop: i + 1, name: d ? d.name : '?', ip, ms };
    });
  };

  // ─── Renderers ──────────────────────────────────────────────────────────────

  const renderRunningConfig = (dev) => {
    const c = dev.config;
    const L = [];
    L.push(`<span style="color:#569cd6">!</span>`);
    L.push(`<span style="color:#569cd6">! ${dev.type} — Running Configuration</span>`);
    L.push(`<span style="color:#569cd6">!</span>`);
    L.push(`hostname <b>${dev.name}</b>`);
    if (c.ipRouting) L.push('ip routing');
    L.push('!');

    // ACL
    Object.entries(c.acl || {}).forEach(([num, rules]) =>
      rules.forEach(r => L.push(`access-list ${num} ${r.action} ${r.network||''} ${r.wildcard||''}`))
    );

    // VLANs
    Object.entries(c.vlans || {}).forEach(([id, v]) => {
      L.push(`vlan ${id}`); if (v.name) L.push(` name ${v.name}`); L.push('!');
    });

    // DHCP
    (c.dhcp?.excluded || []).forEach(e =>
      L.push(`ip dhcp excluded-address ${e.from}${e.to ? ' ' + e.to : ''}`)
    );
    Object.entries(c.dhcp?.pools || {}).forEach(([name, p]) => {
      L.push(`ip dhcp pool ${name}`);
      if (p.network)       L.push(` network ${p.network.network} ${p.network.mask}`);
      if (p.defaultRouter) L.push(` default-router ${p.defaultRouter}`);
      if (p.dnsServer)     L.push(` dns-server ${p.dnsServer}`);
      L.push('!');
    });

    // Interfaces
    Object.entries(c.interfaces || {}).forEach(([name, ic]) => {
      L.push(`interface <b>${name}</b>`);
      if (ic.description) L.push(` description ${ic.description}`);
      if (ic.routed)      L.push(' no switchport');
      if (ic.trunkEncap)  L.push(` switchport trunk encapsulation ${ic.trunkEncap}`);
      if (ic.switchport) {
        L.push(` switchport mode ${ic.switchport.mode}`);
        if (ic.switchport.accessVlan) L.push(` switchport access vlan ${ic.switchport.accessVlan}`);
      }
      if (ic.ip)       L.push(` ip address ${ic.ip} ${ic.mask||''}`);
      if (ic.natRole)  L.push(` ip nat ${ic.natRole}`);
      if (ic.portfast) L.push(' spanning-tree portfast');
      L.push(ic.shutdown === true ? ' shutdown' : ' no shutdown');
      L.push('!');
    });

    // SVIs
    Object.entries(c.svi || {}).forEach(([name, s]) => {
      L.push(`interface <b>${name}</b>`);
      if (s.ip) L.push(` ip address ${s.ip} ${s.mask||''}`);
      L.push(s.shutdown === true ? ' shutdown' : ' no shutdown');
      L.push('!');
    });

    // Static routes
    (c.routes || []).forEach(r => L.push(`ip route ${r.prefix} ${r.mask} ${r.nextHop}`));

    // NAT
    if (c.nat)
      L.push(`ip nat inside source list ${c.nat.acl} interface ${c.nat.outInterface}${c.nat.overload ? ' overload' : ''}`);

    // End-device IP
    if (c.ip && c.mask) {
      L.push(`ip address ${c.ip} ${c.mask}`);
      if (c.gateway) L.push(`ip default-gateway ${c.gateway}`);
    }

    L.push('!'); L.push('end');
    return L.join('<br>');
  };

  const renderIPRoute = (dev) => {
    const c = dev.config;
    const L = [`<span style="color:#75beff">Codes: C - connected, S - static, * - candidate default</span>`, ''];
    let any = false;

    Object.entries(c.interfaces || {}).forEach(([name, ic]) => {
      if (ic.ip && ic.mask && ic.shutdown !== true) {
        L.push(`<span style="color:#89d185">C   ${networkOf(ic.ip, ic.mask)}/${maskToCidr(ic.mask)} is directly connected, ${name}</span>`);
        any = true;
      }
    });
    Object.entries(c.svi || {}).forEach(([name, s]) => {
      if (s.ip && s.mask && s.shutdown !== true) {
        L.push(`<span style="color:#89d185">C   ${networkOf(s.ip, s.mask)}/${maskToCidr(s.mask)} is directly connected, ${name}</span>`);
        any = true;
      }
    });
    if (c.ip && c.mask) {
      L.push(`<span style="color:#89d185">C   ${networkOf(c.ip, c.mask)}/${maskToCidr(c.mask)} is directly connected</span>`);
      any = true;
    }
    (c.routes || []).forEach(r => {
      const star = r.prefix === '0.0.0.0' ? '*' : ' ';
      L.push(`<span style="color:#dcdcaa">S${star}  ${r.prefix}/${maskToCidr(r.mask)} [1/0] via ${r.nextHop}</span>`);
      any = true;
    });
    if (!any) L.push('<span style="color:var(--text-muted)">Routing table is empty</span>');
    return L.join('<br>');
  };

  const renderIPIntBrief = (dev) => {
    const c = dev.config;
    const L = [`<b style="color:#75beff">Interface           IP-Address      OK? Method Status    Protocol</b>`];

    const printRow = (name, ic) => {
      const ip  = ic.ip || 'unassigned';
      const ok  = ic.ip ? 'YES' : 'NO ';
      const st  = ic.shutdown === true
        ? '<span style="color:var(--accent-red)">down</span>'
        : '<span style="color:var(--accent-green)">up</span>';
      const pro = ic.shutdown === true
        ? '<span style="color:var(--accent-red)">down</span>'
        : '<span style="color:var(--accent-green)">up</span>';
      L.push(`${name.padEnd(20)}${ip.padEnd(16)}${ok}  manual   ${st}      ${pro}`);
    };

    // Physical ports
    (CONFIG.devicePorts[dev.type] || []).forEach(p => {
      const k = normalizeIf(p.name);
      printRow(k, c.interfaces?.[k] || { shutdown: false });
    });
    // SVIs
    Object.entries(c.svi || {}).forEach(([k, s]) => printRow(k, s));
    // Management
    if (c.ip) printRow('Management', { ip: c.ip, mask: c.mask, shutdown: false });

    return L.join('<br>');
  };

  const renderInterfaces = (dev, filterName) => {
    const c = dev.config;
    const L = [];
    const allIf = {};
    (CONFIG.devicePorts[dev.type] || []).forEach(p => {
      const k = normalizeIf(p.name);
      allIf[k] = c.interfaces?.[k] || { shutdown: false };
    });
    Object.entries(c.svi || {}).forEach(([k, v]) => { allIf[k] = v; });

    const printIf = (name, ic) => {
      const up = ic.shutdown !== true;
      const statusColor = up ? 'var(--accent-green)' : 'var(--accent-red)';
      const status = up ? 'up' : 'down';
      L.push(`<b>${name}</b> is <span style="color:${statusColor}">${status}</span>, line protocol is <span style="color:${statusColor}">${status}</span>`);
      if (ic.description) L.push(`  Description: ${ic.description}`);
      if (ic.ip) L.push(`  Internet address is <span style="color:var(--accent)">${ic.ip}/${maskToCidr(ic.mask)}</span>`);
      if (ic.switchport) {
        L.push(`  Switchport mode: <span style="color:var(--accent-yellow)">${ic.switchport.mode}</span>${ic.switchport.accessVlan ? ', Access VLAN ' + ic.switchport.accessVlan : ''}`);
      }
      if (ic.trunkEncap)  L.push(`  Trunk encapsulation: ${ic.trunkEncap}`);
      if (ic.natRole)     L.push(`  NAT role: <span style="color:var(--accent-green)">${ic.natRole}</span>`);
      if (ic.portfast)    L.push(`  Spanning-tree portfast: enabled`);
      if (ic.routed)      L.push(`  Routed port (no switchport)`);
      L.push('');
    };

    if (filterName) {
      const k = normalizeIf(filterName);
      if (allIf[k]) printIf(k, allIf[k]);
      else L.push(`<span style="color:var(--accent-red)">Interface ${k} не е намерен</span>`);
    } else {
      Object.entries(allIf).forEach(([k, v]) => printIf(k, v));
    }

    return L.join('<br>') || 'Няма интерфейси';
  };

  const renderVlan = (dev) => {
    const L = [
      '<b style="color:#75beff">VLAN  Name                 Status    Ports</b>',
      '─────────────────────────────────────────────────────────'
    ];
    const vlans = dev.config.vlans || {};
    if (!Object.keys(vlans).length) {
      L.push('<span style="color:var(--text-muted)">Няма конфигурирани VLANs</span>');
    }
    Object.entries(vlans).forEach(([id, v]) => {
      const ports = Object.entries(dev.config.interfaces || {})
        .filter(([, ic]) => ic.switchport?.accessVlan === parseInt(id))
        .map(([n]) => n).join(', ');
      L.push(`${String(id).padEnd(6)}${(v.name || '').padEnd(21)}active    ${ports}`);
    });
    return L.join('<br>');
  };

  const renderARP = (dev) => {
    const L = ['<b style="color:#75beff">Protocol  Address         Age(min)  Hardware Addr       Type</b>'];
    let found = false;
    getNeighborIds(dev.id).forEach(nId => {
      const n = Devices.list.find(d => d.id === nId);
      if (!n) return;
      getDeviceIPs(n).forEach(e => {
        const mac = 'aabb.' + nId.replace(/[^a-zA-Z0-9]/g,'').slice(-4).padStart(4,'0') + '.0001';
        L.push(`Internet  ${e.ip.padEnd(16)}0         ${mac}  ARPA`);
        found = true;
      });
    });
    if (!found) L.push('<span style="color:var(--text-muted)">ARP table is empty</span>');
    return L.join('<br>');
  };

  const renderIPConfig = (dev) => {
    const c = dev.config;
    const L = [`<b style="color:#75beff">Windows IP Configuration — ${dev.name}</b>`, ''];
    const ports = CONFIG.devicePorts[dev.type] || [];

    if (ports.length) {
      ports.forEach(p => {
        const k  = normalizeIf(p.name);
        const ic = c.interfaces?.[k] || {};
        const ip   = ic.ip   || c.ip   || '';
        const mask = ic.mask || c.mask || '';
        L.push(`<b>Ethernet adapter ${p.name}:</b>`);
        L.push(`   IPv4 Address  . . : <span style="color:var(--accent)">${ip || 'не е конфигуриран'}</span>`);
        L.push(`   Subnet Mask . . . : ${mask || '—'}`);
        L.push(`   Default Gateway . : ${c.gateway || '—'}`);
        L.push('');
      });
    } else {
      L.push(`IPv4 Address  . . : <span style="color:var(--accent)">${c.ip || 'не е конфигуриран'}</span>`);
      L.push(`Subnet Mask . . . : ${c.mask || '—'}`);
      L.push(`Default Gateway . : ${c.gateway || '—'}`);
    }
    return L.join('<br>');
  };

  // ─── Main executor ─────────────────────────────────────────────────────────

  const execute = (cmd) => {
    const prompt = Utils.qs('#cliPrompt').textContent;
    log('', `<span style="color:#fff;font-weight:700">${prompt}</span> <span style="color:#ccc">${cmd}</span>`);

    const raw   = cmd.trim();
    const parts = raw.toLowerCase().trim().split(/\s+/);
    const [p0, p1, p2, p3, p4] = parts;

    // ── Global (no device needed) ──────────────────────────────────────────

    if (p0 === 'help' || p0 === '?') {
      log('info', [
        '<b style="color:#75beff">=== PockeTracer CLI — Команди ===</b>', '',
        '<b style="color:#dcdcaa">── Глобални ──</b>',
        '  help / ?                         — помощ',
        '  clear                            — изчисти конзолата',
        '  show devices                     — всички устройства и IPs',
        '  show connections                 — всички кабели',
        '  show topology                    — тип топология',
        '  connect &lt;name&gt;                   — конзола към устройство',
        '  disconnect                       — прекъсни сесията',
        '',
        '<b style="color:#dcdcaa">── Cisco (след connect) ──</b>',
        '  enable / disable',
        '  configure terminal  (conf t)',
        '  hostname &lt;name&gt;',
        '  interface &lt;Gi0/0 | Fa0/1 | Vlan10&gt;',
        '  interface range &lt;Fa0/1-24&gt;',
        '  ip address &lt;ip&gt; &lt;mask&gt;',
        '  ip default-gateway &lt;ip&gt;',
        '  ip routing',
        '  ip route &lt;net&gt; &lt;mask&gt; &lt;nexthop&gt;',
        '  no ip route &lt;net&gt; &lt;mask&gt; [nexthop]',
        '  ip nat inside / outside',
        '  ip nat inside source list &lt;acl&gt; interface &lt;if&gt; overload',
        '  ip dhcp excluded-address &lt;from&gt; [to]',
        '  ip dhcp pool &lt;name&gt;  →  network / default-router / dns-server',
        '  access-list &lt;num&gt; permit/deny &lt;net&gt; &lt;wildcard&gt;',
        '  vlan &lt;id&gt;  /  name &lt;name&gt;',
        '  switchport mode access/trunk',
        '  switchport access vlan &lt;id&gt;',
        '  switchport trunk encapsulation dot1q',
        '  switchport trunk allowed vlan &lt;list&gt;',
        '  no switchport',
        '  spanning-tree portfast',
        '  description &lt;text&gt;',
        '  shutdown  /  no shutdown',
        '  write memory  (wr)',
        '  end  /  exit',
        '',
        '<b style="color:#dcdcaa">── Show ──</b>',
        '  show running-config   (sh run)',
        '  show ip route',
        '  show ip interface brief   (sh ip int br)',
        '  show interfaces [name]',
        '  show vlan',
        '  show arp',
        '  show version',
        '',
        '<b style="color:#dcdcaa">── Крайни устройства (PC/Laptop/Server) ──</b>',
        '  ipconfig',
        '  ping &lt;ip&gt;',
        '  traceroute &lt;ip&gt;  /  tracert &lt;ip&gt;',
      ].join('<br>'));
      return;
    }

    if (p0 === 'clear') { Utils.qs('#cliConsole').innerHTML = ''; return; }

    if (p0 === 'show' && p1 === 'devices') {
      if (!Devices.list.length) { log('info', 'Няма устройства'); return; }
      Devices.list.forEach(d => {
        const ips = getDeviceIPs(d).map(e => `<span style="color:var(--accent)">${e.ip}</span>`).join(', ') || '<span style="color:var(--text-muted)">—</span>';
        log('', `${d.powered ? '🟢' : '🔴'} <b>${d.name}</b> (${d.type}) — ${ips}`);
      });
      return;
    }

    if (p0 === 'show' && p1 === 'connections') {
      if (!Connections.list.length) { log('info', 'Няма кабели'); return; }
      Connections.list.forEach(c => {
        const from = Devices.list.find(d => d.id === c.from.deviceId);
        const to   = Devices.list.find(d => d.id === c.to.deviceId);
        log('', `<b>${from?.name}</b> ↔ <b>${to?.name}</b> <span style="color:var(--text-muted)">(${c.type})</span>`);
      });
      return;
    }

    if (p0 === 'show' && p1 === 'topology') {
      const t = Topology.detect(Devices.list, Connections.list);
      log('info', `${t.icon} <b>${t.name}</b>`);
      return;
    }

    if (p0 === 'triangle') { Utils.qs('#topologyModal').classList.add('active'); return; }

    if (p0 === 'connect') {
      const name = raw.slice('connect'.length).trim();
      const dev  = Devices.list.find(d => d.name.toLowerCase() === name.toLowerCase());
      if (!dev) { log('error', `Устройство "<b>${name}</b>" не е намерено`); return; }
      currentDeviceId = dev.id;
      mode = 'user'; iface = null; ifaceRange = null; vlanId = null; dhcpPool = null;
      setPrompt();
      log('success', `✅ Конзолна сесия към <b>${dev.name}</b> (${dev.type})`);
      return;
    }

    if (p0 === 'disconnect') {
      const name = Devices.list.find(d => d.id === currentDeviceId)?.name || '—';
      currentDeviceId = null; mode = 'user';
      iface = null; ifaceRange = null; vlanId = null; dhcpPool = null;
      setPrompt();
      log('info', `Конзолата към ${name} е прекъсната`);
      return;
    }

    // ── Ping / Traceroute / IPConfig (need device) ─────────────────────────

    if (p0 === 'ping' || p0 === 'traceroute' || p0 === 'tracert' || p0 === 'ipconfig') {
      if (!requireDevice()) return;
      const srcDev = Devices.list.find(d => d.id === currentDeviceId);
      if (!srcDev) return;

      if (p0 === 'ipconfig') { log('', renderIPConfig(srcDev)); return; }

      const targetIP = parts[1];
      if (!targetIP) { log('error', `Използване: ${p0} &lt;ip-address&gt;`); return; }

      if (p0 === 'ping') {
        log('info', `Pinging <b>${targetIP}</b> from <b>${srcDev.name}</b> with 32 bytes of data:`);
        const result = simulatePing(srcDev, targetIP);
        if (result.success) {
          for (let i = 0; i < 4; i++) {
            const ms = (result.hops || 1) * 2 + 1 + Math.floor(Math.random() * 4);
            const ttl = Math.max(1, 128 - (result.hops || 0));
            log('success', `Reply from <b>${targetIP}</b>: bytes=32 time=<b>${ms}ms</b> TTL=${ttl}`);
          }
          log('success', [
            '',
            `Ping statistics for ${targetIP}:`,
            `    Packets: Sent = 4, Received = <b>4</b>, Lost = 0 <span style="color:var(--accent-green)">(0% loss)</span>`,
          ].join('<br>'));
        } else {
          for (let i = 0; i < 4; i++)
            log('error', `Request timeout for icmp_seq ${i+1}`);
          log('error', `<br>⚠ ${result.reason}`);
        }
        return;
      }

      // traceroute / tracert
      log('info', `Tracing route to <b>${targetIP}</b>, maximum 30 hops:`);
      const hops = simulateTraceroute(srcDev, targetIP);
      if (!hops) { log('error', `Няма маршрут до ${targetIP}`); return; }
      hops.forEach(h => {
        log('', `  <span style="color:var(--text-muted)">${String(h.hop).padEnd(3)}</span> ${h.ms}ms  ${h.ms+1}ms  ${h.ms+2}ms  <span style="color:var(--accent)">${h.ip}</span>  <b>${h.name}</b>`);
      });
      log('info', 'Trace complete.');
      return;
    }

    // show running-config (without requireDevice guard above)
    if ((p0 === 'show' && p1 === 'running-config') || (p0 === 'sh' && p1 === 'run')) {
      if (!requireDevice()) return;
      log('', renderRunningConfig(Devices.list.find(d => d.id === currentDeviceId)));
      return;
    }

    if (!requireDevice()) return;
    const dev = Devices.list.find(d => d.id === currentDeviceId);

    // ── show (with device) ─────────────────────────────────────────────────

    if (p0 === 'show' || p0 === 'sh') {
      if (p1 === 'ip' && p2 === 'route')                        { log('', renderIPRoute(dev));    return; }
      if (p1 === 'ip' && p2 === 'interface')                    { log('', renderIPIntBrief(dev)); return; }
      if (p1 === 'interfaces' || p1 === 'interface') {
        const name = parts.slice(2).join(' ');
        log('', renderInterfaces(dev, name || null)); return;
      }
      if (p1 === 'vlan')    { log('', renderVlan(dev)); return; }
      if (p1 === 'arp')     { log('', renderARP(dev));  return; }
      if (p1 === 'version') {
        log('info', [`<b>PockeTracer — ${dev.type}</b>`,`Hostname: <b>${dev.name}</b>`,`Status: ${dev.powered ? '🟢 ON' : '🔴 OFF'}`,`Interfaces: ${(CONFIG.devicePorts[dev.type]||[]).length}`].join('<br>'));
        return;
      }
      log('error', `% Unknown show command: ${raw}`); return;
    }

    // ── Mode transitions ───────────────────────────────────────────────────

    if (p0 === 'enable')  { mode = 'priv';   setPrompt(); return; }
    if (p0 === 'disable') { mode = 'user';   setPrompt(); return; }

    if ((p0 === 'configure' || p0 === 'conf') && (p1 === 'terminal' || p1 === 't')) {
      if (mode === 'priv' || mode === 'config') { mode = 'config'; setPrompt(); }
      else log('error', 'Нужен е enable режим');
      return;
    }

    if (p0 === 'end') {
      mode = 'priv'; iface = null; ifaceRange = null; vlanId = null; dhcpPool = null;
      setPrompt(); return;
    }

    if (p0 === 'exit') {
      if      (mode === 'dhcp')               { mode = 'config'; dhcpPool = null; }
      else if (mode === 'if' || mode === 'svi') { mode = 'config'; iface = null; ifaceRange = null; }
      else if (mode === 'vlan')               { mode = 'config'; vlanId = null; }
      else if (mode === 'config')             { mode = 'priv'; }
      else if (mode === 'priv')               { mode = 'user'; }
      setPrompt(); return;
    }

    // ── Configuration ──────────────────────────────────────────────────────

    if (p0 === 'hostname' && mode !== 'user') {
      const name = raw.split(/\s+/).slice(1).join(' ').trim();
      if (name) { Devices.updateProp(dev.id, 'name', name); setPrompt(); }
      return;
    }

    // interface / interface range
    if (p0 === 'interface' && mode === 'config') {
      if (p1 === 'range') {
        const rest = raw.split(/interface\s+range/i)[1].trim();
        const m = rest.match(/(fa(?:stethernet)?)\s*([0-9]+)\/([0-9]+)\s*-\s*([0-9]+)/i) ||
                  rest.match(/(gi(?:gabitethernet)?)\s*([0-9]+)\/([0-9]+)\s*-\s*([0-9]+)/i);
        if (m) {
          const prefix = m[1].toLowerCase().startsWith('gi') ? 'Gi' : 'Fa';
          const slot = m[2], start = parseInt(m[3]), end = parseInt(m[4]);
          ifaceRange = [];
          for (let i = start; i <= end; i++) ifaceRange.push(`${prefix}${slot}/${i}`);
          iface = null; mode = 'if'; setPrompt();
          log('info', `Range: ${ifaceRange[0]} – ${ifaceRange[ifaceRange.length-1]} (${ifaceRange.length} ports)`);
        } else log('error', `Невалиден interface range: ${rest}`);
        return;
      }
      const ifName = normalizeIf(raw.split(/\s+/).slice(1).join(' ').trim());
      if (ifName.startsWith('Vlan')) {
        const num = parseInt(ifName.replace(/[^0-9]/g,''), 10);
        vlanId = isNaN(num) ? null : num;
        mode = 'svi'; iface = ifName; ifaceRange = null; setPrompt();
      } else {
        iface = ifName; ifaceRange = null; mode = 'if'; setPrompt();
      }
      return;
    }

    if (p0 === 'description' && mode === 'if') {
      applyIfProp(dev, ifaceRange || iface, c => { c.description = raw.split(/\s+/).slice(1).join(' '); });
      return;
    }

    // ip address
    if (p0 === 'ip' && p1 === 'address') {
      const ip = parts[2], mask = parts[3];
      if (!ip || !mask) { log('error', 'Използване: ip address &lt;ip&gt; &lt;mask&gt;'); return; }
      if (mode === 'if') {
        applyIfProp(dev, ifaceRange || iface, c => { c.ip = ip; c.mask = mask; c.shutdown = false; });
      } else if (mode === 'svi') {
        const k = iface || `Vlan${vlanId}`;
        const conf = dev.config.svi[k] || {};
        conf.ip = ip; conf.mask = mask; conf.shutdown = false;
        dev.config.svi[k] = conf; refreshConfig(dev);
      } else {
        dev.config.ip = ip; dev.config.mask = mask; refreshConfig(dev);
        log('success', `IP address set: ${ip}/${maskToCidr(mask)}`);
      }
      return;
    }

    if (p0 === 'ip' && p1 === 'default-gateway') {
      const gw = parts[2];
      if (!gw) { log('error', 'Използване: ip default-gateway &lt;ip&gt;'); return; }
      dev.config.gateway = gw; refreshConfig(dev);
      log('success', `Default gateway: <b>${gw}</b>`);
      return;
    }

    if (p0 === 'ip' && p1 === 'routing' && mode !== 'user') {
      dev.config.ipRouting = true; refreshConfig(dev);
      log('success', 'IP Routing: <span style="color:var(--accent-green)">enabled</span>');
      return;
    }

    if (p0 === 'no' && p1 === 'ip' && p2 === 'routing') {
      dev.config.ipRouting = false; refreshConfig(dev);
      log('info', 'IP Routing: disabled');
      return;
    }

    if (p0 === 'ip' && p1 === 'route' && mode !== 'user') {
      const net = parts[2], mask = parts[3], nh = parts[4];
      if (!net || !mask || !nh) { log('error', 'Използване: ip route &lt;network&gt; &lt;mask&gt; &lt;next-hop&gt;'); return; }
      dev.config.routes.push({ prefix: net, mask, nextHop: nh });
      refreshConfig(dev);
      log('success', `Route: ${net}/${maskToCidr(mask)} via <b>${nh}</b>`);
      return;
    }

    if (p0 === 'no' && p1 === 'ip' && p2 === 'route' && mode !== 'user') {
      const net = parts[3], mask = parts[4], nh = parts[5];
      dev.config.routes = dev.config.routes.filter(r =>
        !(r.prefix === net && r.mask === mask && (!nh || r.nextHop === nh)));
      refreshConfig(dev); log('info', 'Route removed');
      return;
    }

    if (p0 === 'ip' && p1 === 'nat' && p2 === 'inside' && p3 === 'source' && p4 === 'list') {
      const aclNum = parts[5], outIf = normalizeIf(parts[7] || '');
      const overload = raw.includes('overload');
      dev.config.nat = { acl: aclNum, outInterface: outIf, overload };
      refreshConfig(dev);
      log('success', `NAT PAT: ACL ${aclNum} → <b>${outIf}</b>${overload ? ' (overload)' : ''}`);
      return;
    }

    if (p0 === 'ip' && p1 === 'nat' && (p2 === 'inside' || p2 === 'outside') && mode === 'if') {
      applyIfProp(dev, ifaceRange || iface, c => { c.natRole = p2; });
      log('success', `NAT ${p2} set`);
      return;
    }

    if (p0 === 'access-list' && mode !== 'user') {
      const num = parts[1], action = parts[2], network = parts[3], wildcard = parts[4];
      dev.config.acl[num] = dev.config.acl[num] || [];
      dev.config.acl[num].push({ action, network, wildcard });
      refreshConfig(dev);
      log('success', `ACL ${num}: ${action} ${network||''} ${wildcard||''}`);
      return;
    }

    if (p0 === 'no' && p1 === 'shutdown' && (mode === 'if' || mode === 'svi')) {
      if (mode === 'if') {
        applyIfProp(dev, ifaceRange || iface, c => { c.shutdown = false; });
      } else {
        const k = iface || `Vlan${vlanId}`;
        const conf = dev.config.svi[k] || {};
        conf.shutdown = false; dev.config.svi[k] = conf; refreshConfig(dev);
      }
      return;
    }

    if (p0 === 'shutdown' && mode === 'if') {
      applyIfProp(dev, ifaceRange || iface, c => { c.shutdown = true; });
      log('warning', 'Interface administratively down');
      return;
    }

    if (p0 === 'vlan' && (mode === 'config' || mode === 'vlan')) {
      const num = parseInt(p1, 10);
      if (!isNaN(num)) {
        vlanId = num;
        dev.config.vlans[num] = dev.config.vlans[num] || { name: '' };
        mode = 'vlan'; setPrompt();
        log('info', `VLAN ${num} ${dev.config.vlans[num].name ? '("'+dev.config.vlans[num].name+'")' : '(unnamed)'}`);
      }
      return;
    }

    if (p0 === 'name' && mode === 'vlan') {
      const val = raw.split(/\s+/).slice(1).join(' ');
      if (vlanId != null) {
        dev.config.vlans[vlanId] = dev.config.vlans[vlanId] || {};
        dev.config.vlans[vlanId].name = val;
        refreshConfig(dev);
        log('success', `VLAN ${vlanId} → "<b>${val}</b>"`);
      }
      return;
    }

    if (p0 === 'switchport' && mode === 'if') {
      if (p1 === 'mode' && p2 === 'trunk') {
        applyIfProp(dev, ifaceRange || iface, c => { c.switchport = { mode: 'trunk' }; });
        log('success', 'Switchport mode: trunk');
        return;
      }
      if (p1 === 'mode' && p2 === 'access') {
        applyIfProp(dev, ifaceRange || iface, c => { c.switchport = c.switchport || {}; c.switchport.mode = 'access'; });
        log('success', 'Switchport mode: access');
        return;
      }
      if (p1 === 'access' && p2 === 'vlan') {
        const num = parseInt(p3, 10);
        applyIfProp(dev, ifaceRange || iface, c => {
          c.switchport = c.switchport || { mode: 'access' };
          c.switchport.accessVlan = num;
        });
        log('success', `Access VLAN: <b>${num}</b>`);
        return;
      }
      if (p1 === 'trunk' && p2 === 'encapsulation' && p3 === 'dot1q') {
        applyIfProp(dev, ifaceRange || iface, c => { c.trunkEncap = 'dot1q'; });
        return;
      }
      if (p1 === 'trunk' && p2 === 'allowed' && p3 === 'vlan') {
        const vlist = parts.slice(4).join('');
        applyIfProp(dev, ifaceRange || iface, c => { c.trunkAllowed = vlist; });
        log('success', `Trunk allowed VLANs: ${vlist}`);
        return;
      }
    }

    if (p0 === 'no' && p1 === 'switchport' && mode === 'if') {
      applyIfProp(dev, ifaceRange || iface, c => { c.routed = true; delete c.switchport; });
      log('success', 'Port converted to routed (no switchport)');
      return;
    }

    if (p0 === 'spanning-tree' && p1 === 'portfast' && mode === 'if') {
      applyIfProp(dev, ifaceRange || iface, c => { c.portfast = true; });
      log('success', 'PortFast enabled');
      return;
    }

    if (p0 === 'ip' && p1 === 'dhcp' && p2 === 'excluded-address' && mode !== 'user') {
      const from = parts[3], to = parts[4];
      if (!from) { log('error', 'Използване: ip dhcp excluded-address &lt;from&gt; [to]'); return; }
      dev.config.dhcp.excluded.push({ from, to });
      log('success', `Excluded: ${from}${to ? ' – ' + to : ''}`);
      return;
    }

    if (p0 === 'ip' && p1 === 'dhcp' && p2 === 'pool' && mode !== 'user') {
      dhcpPool = raw.split(/\s+/).slice(3).join(' ');
      dev.config.dhcp.pools[dhcpPool] = dev.config.dhcp.pools[dhcpPool] || {};
      mode = 'dhcp'; setPrompt();
      log('success', `DHCP pool "<b>${dhcpPool}</b>"`);
      return;
    }

    if (p0 === 'network' && mode === 'dhcp') {
      const pool = dev.config.dhcp.pools[dhcpPool] || {};
      pool.network = { network: parts[1], mask: parts[2] };
      dev.config.dhcp.pools[dhcpPool] = pool; refreshConfig(dev);
      log('success', `Network: ${parts[1]} ${parts[2]}`);
      return;
    }
    if (p0 === 'default-router' && mode === 'dhcp') {
      const pool = dev.config.dhcp.pools[dhcpPool] || {};
      pool.defaultRouter = parts[1];
      dev.config.dhcp.pools[dhcpPool] = pool; refreshConfig(dev);
      log('success', `Default router: ${parts[1]}`);
      return;
    }
    if (p0 === 'dns-server' && mode === 'dhcp') {
      const pool = dev.config.dhcp.pools[dhcpPool] || {};
      pool.dnsServer = parts[1];
      dev.config.dhcp.pools[dhcpPool] = pool; refreshConfig(dev);
      log('success', `DNS server: ${parts[1]}`);
      return;
    }

    if ((p0 === 'write' && p1 === 'memory') || p0 === 'wr') {
      log('success', `✅ <b>${dev.name}</b> — конфигурацията е записана (write memory)`);
      History.save(); return;
    }

    log('error', `% Unknown command: <b>${cmd}</b> &nbsp;<span style="color:var(--text-muted)">(въведи <b>help</b> за команди)</span>`);
  };

  // ─── Input setup ────────────────────────────────────────────────────────────

  const setup = () => {
    const input = Utils.qs('#cliInput');
    Utils.on(input, 'keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (cmd) { execute(cmd); cmdHistory.push(cmd); historyIndex = cmdHistory.length; }
        input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) { historyIndex--; input.value = cmdHistory[historyIndex]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < cmdHistory.length - 1) { historyIndex++; input.value = cmdHistory[historyIndex]; }
        else { historyIndex = cmdHistory.length; input.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const val = input.value.toLowerCase().trim();
        const completions = [
          'enable','disable','configure terminal','end','exit','hostname',
          'interface ','interface range ','ip address ','ip default-gateway ',
          'ip routing','ip route ','ip nat inside','ip nat outside',
          'ip nat inside source list ','ip dhcp pool ','ip dhcp excluded-address ',
          'access-list ','vlan ','name ','switchport mode access',
          'switchport mode trunk','switchport access vlan ','switchport trunk encapsulation dot1q',
          'switchport trunk allowed vlan ','no switchport','no shutdown','shutdown',
          'spanning-tree portfast','description ','write memory',
          'show running-config','show ip route','show ip interface brief',
          'show interfaces','show vlan','show arp','show version',
          'show devices','show connections','show topology',
          'ping ','traceroute ','tracert ','ipconfig','connect ','disconnect','clear','help'
        ];
        const match = completions.find(c => c.startsWith(val) && c !== val);
        if (match) input.value = match;
      }
    });
  };

  return { log, execute, setup };
})();
