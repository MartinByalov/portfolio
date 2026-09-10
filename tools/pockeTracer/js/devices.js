const Devices = (() => {
    let list = [];
    let selected = [];

    // Expand abbreviated port names → full Cisco-style names
    const expandPortName = (name) => {
        if (!name) return name;
        const n = name.trim();
        if (/^GigabitEthernet/i.test(n)) return 'GigabitEthernet' + n.replace(/^GigabitEthernet/i, '');
        if (/^FastEthernet/i.test(n)) return 'FastEthernet' + n.replace(/^FastEthernet/i, '');
        if (/^Serial/i.test(n)) return 'Serial' + n.replace(/^Serial/i, '');
        if (/^Console/i.test(n)) return 'Console';
        if (/^Gi([0-9/]+)$/.test(n)) return 'GigabitEthernet' + n.slice(2);
        if (/^gi([0-9/]+)$/i.test(n)) return 'GigabitEthernet' + n.slice(2);
        if (/^Fa([0-9/]+)$/.test(n)) return 'FastEthernet' + n.slice(2);
        if (/^fa([0-9/]+)$/i.test(n)) return 'FastEthernet' + n.slice(2);
        if (/^Se([0-9/]+)$/.test(n)) return 'Serial' + n.slice(2);
        if (/^Eth([0-9]+)$/i.test(n)) return 'Ethernet' + n.slice(3);
        if (/^eth([0-9]+)$/i.test(n)) return 'Ethernet' + n.slice(3);
        if (/^Vlan([0-9]+)$/i.test(n)) return 'Vlan' + n.replace(/[^0-9]/g, '');
        if (/^wifi$/i.test(n)) return 'Wireless';
        if (/^wlan([0-9]*)$/i.test(n)) return 'WLAN' + n.replace(/[^0-9]/g, '');
        return n;
    };

    // Render device DOM element from a saved state object (used by History.restore)
    // Does NOT push to list or call History.save
    const renderDevice = (device) => {
        const el = Utils.createEl('div', { className: 'placed-device', id: device.id });
        el.style.left = device.x + 'px';
        el.style.top = device.y + 'px';
        el.innerHTML = `
      <div class="device-header">
        <div class="device-icon-large">${CONFIG.deviceIcons[device.type] || '📦'}</div>
        <div class="device-status ${device.powered ? 'on' : ''}"></div>
      </div>
      <div class="device-title">${device.name}</div>
      <div class="device-subtitle">${device.type}</div>
    `;

        const portDefs = device.ports || (CONFIG.devicePorts[device.type] || []).map((p, i) => ({ ...p, index: i }));
        const positions = computePortPositions(portDefs.length || 1);
        portDefs.forEach((p, i) => {
            const port = Utils.createEl('div', { className: 'port' });
            Object.assign(port.style, positions[i] || positions[0]);
            port.dataset.deviceId = device.id;
            port.dataset.portIndex = i;
            port.dataset.portName = expandPortName(p.name);
            port.dataset.portType = p.type;
            Utils.on(port, 'click', (e) => { e.stopPropagation(); Connections.handlePortClick(device.id, i); });
            Utils.on(port, 'mousedown', (e) => { e.stopPropagation(); Connections.begin(device.id, i); });
            Utils.on(port, 'mouseup', (e) => { e.stopPropagation(); Connections.finish(device.id, i); });
            Utils.on(port, 'mouseenter', (e) => { e.stopPropagation(); Connections.showForPort(device.id, i); });
            Utils.on(port, 'mouseleave', (e) => { e.stopPropagation(); Connections.hideHover(); });
            el.appendChild(port);
        });

        Utils.on(el, 'click', (e) => { e.stopPropagation(); select(device.id, !e.ctrlKey); });
        makeDraggable(el, device);
        App.getWorkspace().appendChild(el);
    };

    const computePortPositions = (count) => {
        const pos = [];
        const perSide = Math.ceil(count / 4);
        for (let i = 0; i < perSide && pos.length < count; i++)
            pos.push({ left: '-7px', top: `${(i + 1) * (100 / (perSide + 1))}%`, transform: 'translateY(-50%)' });
        for (let i = 0; i < perSide && pos.length < count; i++)
            pos.push({ right: '-7px', top: `${(i + 1) * (100 / (perSide + 1))}%`, transform: 'translateY(-50%)' });
        for (let i = 0; i < perSide && pos.length < count; i++)
            pos.push({ left: `${(i + 1) * (100 / (perSide + 1))}%`, top: '-7px', transform: 'translateX(-50%)' });
        for (let i = 0; i < perSide && pos.length < count; i++)
            pos.push({ left: `${(i + 1) * (100 / (perSide + 1))}%`, bottom: '-7px', transform: 'translateX(-50%)' });
        return pos.slice(0, count);
    };

    const add = (type, x, y) => {
        const id = Utils.generateId(type);
        const device = {
            id, type,
            x: Utils.snapToGrid(x),
            y: Utils.snapToGrid(y),
            name: type.toUpperCase().replace(/-/g, '_') + '_' + list.filter(d => d.type === type).length,
            powered: true,
            config: {
                ip: '', mask: '', gateway: '',
                interfaces: {}, vlans: {}, svi: {},
                routes: [], acl: {}, nat: null,
                dhcp: { excluded: [], pools: {} },
                ipRouting: false
            },
            ports: (CONFIG.devicePorts[type] || []).map((p, idx) => ({ ...p, index: idx }))
        };
        list.push(device);
        renderDevice(device);
        CLI.log('success', `✅ ${device.name}`);
        App.updateStats();
        History.save();
    };

    const makeDraggable = (el, device) => {
        let dragging = false;
        let startX, startY, initialX, initialY;
        let groupInitial = null;

        Utils.on(el, 'mousedown', (e) => {
            if (e.target.classList.contains('port') || App.currentTool !== 'select') return;
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = device.x;
            initialY = device.y;
            if (Devices.selected.includes(device.id)) {
                groupInitial = Devices.selected.map(id => {
                    const d = list.find(dd => dd.id === id);
                    return { id, x: d.x, y: d.y };
                });
            } else {
                groupInitial = null;
            }
        });

        Utils.on(document, 'mousemove', (e) => {
            if (!dragging) return;
            const dx = (e.clientX - startX) / App.zoom;
            const dy = (e.clientY - startY) / App.zoom;
            if (groupInitial && groupInitial.length > 0) {
                groupInitial.forEach(g => {
                    const d = list.find(dd => dd.id === g.id);
                    d.x = Utils.snapToGrid(g.x + dx);
                    d.y = Utils.snapToGrid(g.y + dy);
                    const el2 = Utils.qs(`#${g.id}`);
                    if (el2) {
                        el2.style.left = d.x + 'px';
                        el2.style.top = d.y + 'px';
                    }
                });
            } else {
                device.x = Utils.snapToGrid(initialX + dx);
                device.y = Utils.snapToGrid(initialY + dy);
                el.style.left = device.x + 'px';
                el.style.top = device.y + 'px';
            }
            Connections.update();
        });

        Utils.on(document, 'mouseup', () => { dragging = false; });
    };

    const select = (id, clearOthers = true) => {
        if (clearOthers) {
            Utils.qsa('.placed-device').forEach(el => el.classList.remove('selected'));
            selected = [];
        }
        const el = Utils.qs(`#${id}`);
        if (el) el.classList.add('selected');
        if (!selected.includes(id)) selected.push(id);
        const device = list.find(d => d.id === id);
        UI.showConfig(device);
    };

    const updateProp = (id, prop, value) => {
        const device = list.find(d => d.id === id);
        if (!device) return;
        if (prop === 'name') {
            device.name = value;
            Utils.qs(`#${id} .device-title`).textContent = value;
        } else if (prop === 'powered') {
            device.powered = value;
            Utils.qs(`#${id} .device-status`).classList.toggle('on', value);
        } else {
            device.config[prop] = value;
        }
        CLI.log('info', `📝 ${device.name}: ${prop} = ${value}`);
        History.save();
    };

    const deleteSelected = () => {
        if (selected.length === 0) return;
        selected.forEach(id => {
            list = list.filter(d => d.id !== id);
            Connections.list = Connections.list.filter(c => c.from.deviceId !== id && c.to.deviceId !== id);
            Utils.qs(`#${id}`)?.remove();
        });
        selected = [];
        Connections.update();
        App.updateStats();
        CLI.log('info', '🗑️ Devices deleted');
        const configPanel = Utils.qs('#configContent');
        if (configPanel) configPanel.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚙️</div>
        <div class="empty-title">Configuration</div>
        <div class="empty-hint">Select a device</div>
      </div>
    `;
        History.save();
    };

    return {
        get list() { return list; },
        set list(v) { list = v; },
        get selected() { return selected; },
        set selected(v) { selected = v; },
        add, select, updateProp, deleteSelected, renderDevice
    };
})();
