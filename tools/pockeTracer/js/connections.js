const Connections = (() => {
  let list = [];
  let currentType = 'straight';
  let connectingFrom = null;
  let previewLine = null;
  let selectedIndex = null;
  let selectedIndices = [];

  const normalize = (t) => {
    const s = String(t || '').toLowerCase().trim();
    // Ethernet / copper / RJ45 / LAN / WAN-ethernet — всичко физически медна RJ45 връзка
    if (['ethernet','lan','wan','gigabit','fast-ethernet','ge','fe','rj45',
         'eth','nic','network','copper','tp','utp','cat5','cat6',
         'fastethernet','gigabitethernet','10/100','10/100/1000',
         // Home router specific port types
         'internet','wan-port','lan-port','rj45-lan','rj45-wan',
         'switch-port','uplink'].includes(s)) return 'ethernet';
    // Fiber / SFP
    if (['fiber','sfp','sfp+','ftth','optical','fo','sc','lc','sm','mm'].includes(s)) return 'fiber';
    // Serial / WAN serial
    if (['serial','rs232','rs-232','s0/0/0','db60','smart-serial'].includes(s)) return 'serial';
    // Console
    if (['console','con','rollover'].includes(s)) return 'console';
    // Coax
    if (['coax','coaxial','wan-coax','bnc','cable','tv'].includes(s)) return 'coax';
    // Phone / DSL
    if (['phone','dsl','rj11','pstn','pots','fxs','fxo','analog'].includes(s)) return 'phone';
    // USB
    if (['usb','usb-a','usb-b','usb-c','usb2','usb3','micro-usb'].includes(s)) return 'usb';
    // WiFi / Wireless
    if (['wifi','wlan','wireless','802.11','wi-fi','ant','antenna'].includes(s)) return 'wifi';
    // Fallback: ако не е разпознат — третираме като ethernet (физически порт)
    // Това покрива всякакви непознати типове от devices-catalog
    return 'ethernet';
  };

  const COMPAT = {
    straight:   ['ethernet'],
    crossover:  ['ethernet'],
    fiber:      ['fiber'],
    serial:     ['serial'],
    console:    ['console'],
    coaxial:    ['coax'],
    telephone:  ['phone'],
    usb:        ['usb'],
    wifi:       ['wifi']
  };

  // Check if a port type is compatible with current cable type
  const isPortCompatible = (portType) => {
    if (!portType) return true; // unknown type — allow and check at connection time
    if (currentType === 'wifi') return normalize(portType) === 'wifi';
    return (COMPAT[currentType] || []).includes(normalize(portType));
  };

  // Restore all port visual states from actual connection data
  const resetPortStates = () => {
    // Remove all transient states
    Utils.qsa('.port').forEach(p => {
      p.classList.remove('selecting', 'candidate', 'port-incompatible');
    });
    // Re-apply .connected from current list
    Utils.qsa('.port').forEach(p => p.classList.remove('connected'));
    list.forEach(conn => {
      const fromEl = Utils.qs(`[data-device-id="${conn.from.deviceId}"][data-port-index="${conn.from.portIndex}"]`);
      const toEl   = Utils.qs(`[data-device-id="${conn.to.deviceId}"][data-port-index="${conn.to.portIndex}"]`);
      fromEl?.classList.add('connected');
      toEl?.classList.add('connected');
    });
  };

  const selectType = (type) => {
    currentType = type;
    CLI.log('info', `🔌 Cable: ${type}`);
  };

  const handlePortClick = (deviceId, portIndex) => {
    if (!connectingFrom) {
      connectingFrom = { deviceId, portIndex };
      const portEl = Utils.qs(`[data-device-id="${deviceId}"][data-port-index="${portIndex}"]`);
      portEl?.classList.add('selecting');
      CLI.log('info', '🔌 Select a destination port...');
    } else {
      if (connectingFrom.deviceId === deviceId) {
        CLI.log('error', '❌ Cannot connect a device to itself');
        resetPortStates();
        setIndicator('select', 'Select');
        connectingFrom = null;
        return;
      }
      const fromDev = Devices.list.find(d => d.id === connectingFrom.deviceId);
      const toDev   = Devices.list.find(d => d.id === deviceId);
      const fromPort = (fromDev?.ports || [])[connectingFrom.portIndex];
      const toPort   = (toDev?.ports  || [])[portIndex];
      const fromType = normalize(fromPort?.type);
      const toType   = normalize(toPort?.type);
      const isWifi   = currentType === 'wifi';

      const isEthernetPair = fromType === 'ethernet' && toType === 'ethernet';
      const isFiberPair    = fromType === 'fiber'    && toType === 'fiber';
      const isSerialPair   = fromType === 'serial'   && toType === 'serial';

      // ── Групи устройства ────────────────────────────────────────────────
      const END_DEVICES = ['pc','pc-coax','pc-ring','laptop','tablet','smartphone','server','printer','camera','phone'];
      const SWITCHES    = ['switch-2960','switch-2960-8','switch-3650','switch-3560-24ps','hub-8','token-ring-mau'];
      const ROUTERS     = ['router-2911','home-router'];
      const CLOUD       = ['cloud-isp'];
      const AP          = ['access-point'];

      const catA = fromDev.type;
      const catB = toDev.type;
      const isEnd   = t => END_DEVICES.includes(t);
      const isSw    = t => SWITCHES.includes(t);
      const isRt    = t => ROUTERS.includes(t);
      const isCloud = t => CLOUD.includes(t);
      const isAP    = t => AP.includes(t);
      const isNet   = t => isSw(t) || isRt(t) || isCloud(t) || isAP(t); // мрежово оборудване

      // ── Straight-Through vs Cross-Over rules ───────────────────────────
      if (isEthernetPair && (currentType === 'straight' || currentType === 'crossover')) {
        const needsStraight =
          (isEnd(catA) && isSw(catB))    || (isSw(catA)    && isEnd(catB))   ||
          (isEnd(catA) && isRt(catB))    || (isRt(catA)    && isEnd(catB))   ||
          (isEnd(catA) && isAP(catB))    || (isAP(catA)    && isEnd(catB))   ||
          (isEnd(catA) && isCloud(catB)) || (isCloud(catA) && isEnd(catB))   ||
          (isRt(catA)  && isSw(catB))    || (isSw(catA)    && isRt(catB))    ||
          (isRt(catA)  && isCloud(catB)) || (isCloud(catA) && isRt(catB))    ||
          (isSw(catA)  && isCloud(catB)) || (isCloud(catA) && isSw(catB))    ||
          (isAP(catA)  && isSw(catB))    || (isSw(catA)    && isAP(catB))    ||
          (isAP(catA)  && isRt(catB))    || (isRt(catA)    && isAP(catB));
        const needsCrossover =
          (isEnd(catA) && isEnd(catB))  ||
          (isSw(catA)  && isSw(catB))   ||
          (isRt(catA)  && isRt(catB))   ||
          (isAP(catA)  && isAP(catB));
        if (needsStraight && currentType === 'crossover') {
          CLI.log('error', `❌ <b>${fromDev.name}</b> ↔ <b>${toDev.name}</b> requires a <b>Straight-Through</b> cable`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
        if (needsCrossover && currentType === 'straight') {
          CLI.log('error', `❌ <b>${fromDev.name}</b> ↔ <b>${toDev.name}</b> requires a <b>Cross-Over</b> cable (identical devices)`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
      }

      // ── Fiber cable — only between network gear with fiber ports ───────
      if (currentType === 'fiber' && !isFiberPair) {
        CLI.log('error', `❌ Fiber cable requires fiber (SFP/SFP+) ports on both ends`);
        resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
      }

      // ── Serial cable — only between routers (WAN serial ports) ────────
      if (currentType === 'serial') {
        if (!isSerialPair) {
          CLI.log('error', `❌ Serial cable requires Serial (WAN) ports on both ends`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
        if (!isRt(catA) || !isRt(catB)) {
          CLI.log('error', `❌ Serial cable is used only between routers (Router ↔ Router)`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
      }

      // ── Console cable — PC/Laptop → Router/Switch (management) ────────
      if (currentType === 'console') {
        const fromConsole = normalize(fromPort?.type) === 'console';
        const toConsole   = normalize(toPort?.type)   === 'console';
        const fromEth     = normalize(fromPort?.type) === 'ethernet';
        const toEth       = normalize(toPort?.type)   === 'ethernet';
        const validPair =
          (fromConsole && toConsole) ||
          (fromEth && toConsole && isEnd(catA) && isNet(catB)) ||
          (toEth   && fromConsole && isEnd(catB) && isNet(catA));
        if (!validPair) {
          CLI.log('error', `❌ Console cable: connects PC/Laptop (COM) → Console port on router/switch`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
      }

      // ── Telephone cable — only phone/DSL ports ────────────────────────
      if (currentType === 'telephone') {
        const fType = normalize(fromPort?.type);
        const tType = normalize(toPort?.type);
        if (fType !== 'phone' && tType !== 'phone') {
          CLI.log('error', `❌ Telephone cable requires telephone (RJ11/DSL) ports`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
      }

      // ── USB cable — between end devices or PC→Printer ────────────────
      if (currentType === 'usb') {
        const fType = normalize(fromPort?.type);
        const tType = normalize(toPort?.type);
        if (fType !== 'usb' && tType !== 'usb') {
          CLI.log('error', `❌ USB cable requires USB ports`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
        if (isNet(catA) || isNet(catB)) {
          CLI.log('error', `❌ USB cable is not used for network equipment`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
      }

      // ── WiFi — end device or AP ←→ end device/AP ─────────────────────
      if (currentType === 'wifi') {
        const fType = normalize(fromPort?.type);
        const tType = normalize(toPort?.type);
        if (fType !== 'wifi' && tType !== 'wifi') {
          CLI.log('error', `❌ WiFi connection requires a wireless interface`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
      }

      // ── Generic check — port types must match ─────────────────────────
      if (currentType !== 'wifi' && currentType !== 'console') {
        const typesOk = isPortCompatible(fromPort?.type) && isPortCompatible(toPort?.type);
        if (!typesOk) {
          CLI.log('error', `❌ Incompatible "<b>${currentType}</b>" cable for ports: ${fromPort?.type || '?'} ↔ ${toPort?.type || '?'}`);
          resetPortStates(); setIndicator('select', 'Select'); connectingFrom = null; return;
        }
      }

      const portBusy = list.some(conn =>
        (conn.from.deviceId === connectingFrom.deviceId && conn.from.portIndex === connectingFrom.portIndex) ||
        (conn.to.deviceId   === connectingFrom.deviceId && conn.to.portIndex   === connectingFrom.portIndex) ||
        (conn.from.deviceId === deviceId                && conn.from.portIndex === portIndex) ||
        (conn.to.deviceId   === deviceId                && conn.to.portIndex   === portIndex)
      );
      if (portBusy) {
        CLI.log('error', '❌ Port already has an active connection');
        resetPortStates();
        setIndicator('select', 'Select');
        connectingFrom = null;
        return;
      }

      const duplicate = list.some(conn =>
        (conn.from.deviceId === connectingFrom.deviceId && conn.from.portIndex === connectingFrom.portIndex &&
         conn.to.deviceId   === deviceId                && conn.to.portIndex   === portIndex) ||
        (conn.to.deviceId   === connectingFrom.deviceId && conn.to.portIndex   === connectingFrom.portIndex &&
         conn.from.deviceId === deviceId                && conn.from.portIndex === portIndex)
      );
      if (duplicate) {
        CLI.log('error', '❌ Connection already exists between these ports');
        resetPortStates();
        setIndicator('select', 'Select');
        connectingFrom = null;
        return;
      }

      create(connectingFrom, { deviceId, portIndex });
      resetPortStates();
      setIndicator('select', 'Select');
      connectingFrom = null;
    }
  };

  const begin = (deviceId, portIndex) => {
    connectingFrom = { deviceId, portIndex };
    const fromEl = Utils.qs(`[data-device-id="${deviceId}"][data-port-index="${portIndex}"]`);
    if (!fromEl) return;
    Utils.qsa('.port').forEach(p => {
      const pType = p.dataset.portType || '';
      if (isPortCompatible(pType)) {
        p.classList.add('candidate');
      } else {
        p.classList.add('port-incompatible');
      }
    });

    setIndicator('draw', `Drawing: Cable (${currentType})`);
    const wsRect   = App.getWorkspace().getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const x1 = (fromRect.left - wsRect.left + fromRect.width  / 2) / App.zoom;
    const y1 = (fromRect.top  - wsRect.top  + fromRect.height / 2) / App.zoom;
    previewLine = Utils.createEl('div', { className: `connection cable-line ${currentType}` });
    previewLine.style.left  = x1 + 'px';
    previewLine.style.top   = y1 + 'px';
    previewLine.style.width = '0px';
    App.getWorkspace().appendChild(previewLine);
  };

  const updatePreviewToMouse = (e) => {
    if (!previewLine || !connectingFrom) return;
    const wsRect   = App.getWorkspace().getBoundingClientRect();
    const fromEl   = Utils.qs(`[data-device-id="${connectingFrom.deviceId}"][data-port-index="${connectingFrom.portIndex}"]`);
    if (!fromEl) return;
    const fromRect = fromEl.getBoundingClientRect();
    const x1 = (fromRect.left - wsRect.left + fromRect.width  / 2) / App.zoom;
    const y1 = (fromRect.top  - wsRect.top  + fromRect.height / 2) / App.zoom;
    const x2 = (e.clientX - wsRect.left) / App.zoom;
    const y2 = (e.clientY - wsRect.top)  / App.zoom;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    previewLine.style.width     = length + 'px';
    previewLine.style.transform = `rotate(${angle}deg)`;
    previewLine.style.left      = x1 + 'px';
    previewLine.style.top       = y1 + 'px';
  };

  const finish = (deviceId, portIndex) => {
    if (!connectingFrom) return;
    if (previewLine) { previewLine.remove(); previewLine = null; }
    Utils.qsa('.port').forEach(p => p.classList.remove('candidate', 'port-incompatible'));
    setIndicator('select', 'Select');
    handlePortClick(deviceId, portIndex);
  };

  const create = (from, to) => {
    const conn    = { from, to, type: currentType };
    list.push(conn);
    const fromDev = Devices.list.find(d => d.id === from.deviceId);
    const toDev   = Devices.list.find(d => d.id === to.deviceId);
    CLI.log('success', `✅ ${fromDev.name} ↔ ${toDev.name} (${currentType})`);
    update();
    App.updateStats();
    History.save();
  };

  const update = () => {
    // Normalize cable types (Straight vs Cross-Over) for existing ethernet links
    const END_DEVICES = ['pc','laptop','tablet','smartphone','server','printer','camera','phone'];
    const SWITCHES    = ['switch-2960','switch-3650'];
    const ROUTERS     = ['router-2911','home-router'];
    const CLOUD       = ['cloud-isp'];
    const AP          = ['access-point'];
    const isEnd   = t => END_DEVICES.includes(t);
    const isSw    = t => SWITCHES.includes(t);
    const isRt    = t => ROUTERS.includes(t);
    const isCloud = t => CLOUD.includes(t);
    const isAP    = t => AP.includes(t);
    list = list.map(conn => {
      const fromDev = Devices.list.find(d => d.id === conn.from.deviceId);
      const toDev   = Devices.list.find(d => d.id === conn.to.deviceId);
      const fromPort = (fromDev?.ports || [])[conn.from.portIndex];
      const toPort   = (toDev?.ports  || [])[conn.to.portIndex];
      const fType = normalize(fromPort?.type);
      const tType = normalize(toPort?.type);
      if (fType === 'ethernet' && tType === 'ethernet') {
        const a = fromDev?.type, b = toDev?.type;
        const sameLevel =
          (isEnd(a) && isEnd(b)) || (isSw(a) && isSw(b)) || (isRt(a) && isRt(b)) || (isAP(a) && isAP(b));
        const isRouterCloud = (isRt(a) && isCloud(b)) || (isCloud(a) && isRt(b));
        const desired = (sameLevel || isRouterCloud) ? 'crossover' : 'straight';
        if (conn.type !== desired) conn = { ...conn, type: desired };
      }
      return conn;
    });
    Utils.qsa('.connection').forEach(c => c.remove());
    Utils.qsa('.port').forEach(p => p.classList.remove('connected'));
    list.forEach(conn => {
      const fromEl = Utils.qs(`[data-device-id="${conn.from.deviceId}"][data-port-index="${conn.from.portIndex}"]`);
      const toEl   = Utils.qs(`[data-device-id="${conn.to.deviceId}"][data-port-index="${conn.to.portIndex}"]`);
      if (!fromEl || !toEl) return;
      const fromRect = fromEl.getBoundingClientRect();
      const toRect   = toEl.getBoundingClientRect();
      const wsRect   = App.getWorkspace().getBoundingClientRect();
      const x1 = (fromRect.left - wsRect.left + fromRect.width  / 2) / App.zoom;
      const y1 = (fromRect.top  - wsRect.top  + fromRect.height / 2) / App.zoom;
      const x2 = (toRect.left   - wsRect.left + toRect.width    / 2) / App.zoom;
      const y2 = (toRect.top    - wsRect.top  + toRect.height   / 2) / App.zoom;
      const length = Math.hypot(x2 - x1, y2 - y1);
      const angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      const line = Utils.createEl('div', { className: `connection cable-line ${conn.type}` });
      line.style.width     = length + 'px';
      line.style.left      = x1 + 'px';
      line.style.top       = y1 + 'px';
      line.style.transform = `rotate(${angle}deg)`;
      line.dataset.connIndex = String(list.indexOf(conn));
      Utils.on(line, 'click', (e) => {
        e.stopPropagation();
        select(parseInt(line.dataset.connIndex, 10));
      });
      Utils.on(line, 'contextmenu', (e) => {
        e.preventDefault();
        select(parseInt(line.dataset.connIndex, 10));
      });
      App.getWorkspace().appendChild(line);
      fromEl.classList.add('connected');
      toEl.classList.add('connected');
    });
    const set = new Set(selectedIndices);
    Utils.qsa('.connection').forEach(el => {
      const idx = parseInt(el.dataset.connIndex || '-1', 10);
      if (set.has(idx)) el.classList.add('selected');
    });
  };

  const select = (index) => {
    selectedIndex = index;
    if (!selectedIndices.includes(index)) selectedIndices.push(index);
    Utils.qsa('.connection').forEach(el => {
      const idx = parseInt(el.dataset.connIndex || '-1', 10);
      el.classList.toggle('selected', selectedIndices.includes(idx));
    });
  };

  const deleteSelected = () => {
    if (selectedIndices.length === 0 && selectedIndex === null) return;
    const toDelete = selectedIndices.length > 0 ? new Set(selectedIndices) : new Set([selectedIndex]);
    if (toDelete.size === 0 || (toDelete.size === 1 && toDelete.has(null))) return;
    list = list.filter((_, idx) => !toDelete.has(idx));
    selectedIndex   = null;
    selectedIndices = [];
    update();
    App.updateStats();
    CLI.log('info', '🔌 Кабел изтрит');
    History.save();
  };

  const selectMulti = (indices) => {
    selectedIndices = Array.from(new Set(indices));
    Utils.qsa('.connection').forEach(el => {
      const idx = parseInt(el.dataset.connIndex || '-1', 10);
      el.classList.toggle('selected', selectedIndices.includes(idx));
    });
  };

  const clearSelection = () => {
    selectedIndex   = null;
    selectedIndices = [];
    Utils.qsa('.connection').forEach(el => el.classList.remove('selected'));
  };

  const cancel = () => {
    if (!connectingFrom) return;
    if (previewLine) { previewLine.remove(); previewLine = null; }
    resetPortStates();
    setIndicator('select', 'Избор');
    connectingFrom = null;
  };

  // Highlight connections for a specific port (used on port hover)
  const showForPort = (deviceId, portIndex) => {
    const indices = [];
    list.forEach((c, i) => {
      if ((c.from.deviceId === deviceId && c.from.portIndex === portIndex) ||
          (c.to.deviceId   === deviceId && c.to.portIndex   === portIndex)) {
        indices.push(i);
      }
    });
    Utils.qsa('.connection').forEach(el => el.classList.remove('visible'));
    indices.forEach(i => Utils.qs(`.connection[data-conn-index="${i}"]`)?.classList.add('visible'));
  };

  // Remove hover highlights (keep selected visible)
  const hideHover = () => {
    Utils.qsa('.connection').forEach(el => {
      const idx = parseInt(el.dataset.connIndex || '-1', 10);
      if (!selectedIndices.includes(idx)) el.classList.remove('visible');
    });
  };

  return {
    get list()        { return list; },
    set list(v)       { list = v; },
    get currentType() { return currentType; },
    selectType,
    handlePortClick,
    begin,
    updatePreviewToMouse,
    finish,
    create,
    update,
    deleteSelected,
    selectMulti,
    clearSelection,
    cancel,
    showForPort,
    hideHover
  };
})();
