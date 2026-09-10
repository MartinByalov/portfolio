const UI = (() => {
    const setupResize = () => {
        const handle = Utils.qs('#resizeHandle');
        const bottomPanel = Utils.qs('#bottomPanel');
        let isResizing = false, startY = 0, startHeight = 0;
        Utils.on(handle, 'mousedown', (e) => {
            isResizing = true; startY = e.clientY; startHeight = bottomPanel.offsetHeight;
            document.body.style.cursor = 'ns-resize';
        });
        Utils.on(document, 'mousemove', (e) => {
            if (!isResizing) return;
            const deltaY = startY - e.clientY;
            const newHeight = Math.min(Math.max(startHeight + deltaY, 200), 600);
            bottomPanel.style.height = newHeight + 'px';
        });
        Utils.on(document, 'mouseup', () => {
            if (isResizing) { isResizing = false; document.body.style.cursor = ''; }
        });
    };

    const setupEvents = () => {
        const workspaceLogical = Utils.qs('#workspaceLogical');
        const container = Utils.qs('#canvasContainer');
        Utils.qsa('.device-item').forEach(item => {
            item.setAttribute('draggable', 'true');
            Utils.on(item, 'dragstart', (e) => {
                e.dataTransfer.setData('deviceType', item.dataset.type);
                Utils.qsa('.device-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            });
            Utils.on(item, 'dragend', () => {
                Utils.qsa('.device-item').forEach(i => i.classList.remove('selected'));
            });
        });
        Utils.on(container, 'dragover', (e) => e.preventDefault());
        Utils.on(container, 'drop', (e) => {
            e.preventDefault();
            if (App.mode !== 'logical') return;
            const type = e.dataTransfer.getData('deviceType');
            if (!type) return;
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left + container.scrollLeft) / App.zoom;
            const y = (e.clientY - rect.top + container.scrollTop) / App.zoom;
            Devices.add(type, x, y);
            Utils.qsa('.device-item').forEach(i => i.classList.remove('selected'));
        });
        Utils.on(container, 'mousemove', (e) => {
            if (App.mode !== 'logical') return;
            Connections.updatePreviewToMouse(e);
        });
        let selecting = false;
        let selectStart = { x: 0, y: 0 };
        let selectionEl = null;
        Utils.on(workspaceLogical, 'mousedown', (e) => {
            if (App.mode !== 'logical') return;
            if (e.target.closest('.placed-device') || e.target.closest('.connection')) return;
            Connections.cancel();
            selecting = true;
            const wsRect = workspaceLogical.getBoundingClientRect();
            selectStart = { x: (e.clientX - wsRect.left) / App.zoom, y: (e.clientY - wsRect.top) / App.zoom };
            selectionEl = Utils.createEl('div', { className: 'selection-box' });
            selectionEl.style.left = selectStart.x + 'px';
            selectionEl.style.top = selectStart.y + 'px';
            selectionEl.style.width = '0px';
            selectionEl.style.height = '0px';
            workspaceLogical.appendChild(selectionEl);
            Connections.clearSelection();
            Devices.selected = [];
            Utils.qsa('.placed-device').forEach(el => el.classList.remove('selected'));
        });
        Utils.on(document, 'mousemove', (e) => {
            if (!selecting) return;
            const wsRect = workspaceLogical.getBoundingClientRect();
            const cur = { x: (e.clientX - wsRect.left) / App.zoom, y: (e.clientY - wsRect.top) / App.zoom };
            const left = Math.min(selectStart.x, cur.x);
            const top = Math.min(selectStart.y, cur.y);
            const width = Math.abs(cur.x - selectStart.x);
            const height = Math.abs(cur.y - selectStart.y);
            selectionEl.style.left = left + 'px';
            selectionEl.style.top = top + 'px';
            selectionEl.style.width = width + 'px';
            selectionEl.style.height = height + 'px';
        });
        Utils.on(document, 'mouseup', (e) => {
            if (!selecting) return;
            selecting = false;
            const wsRect = workspaceLogical.getBoundingClientRect();
            const end = { x: (e.clientX - wsRect.left) / App.zoom, y: (e.clientY - wsRect.top) / App.zoom };
            const rect = {
                left: Math.min(selectStart.x, end.x),
                top: Math.min(selectStart.y, end.y),
                right: Math.max(selectStart.x, end.x),
                bottom: Math.max(selectStart.y, end.y)
            };
            const devs = [];
            Utils.qsa('.placed-device').forEach(el => {
                const r = el.getBoundingClientRect();
                const er = {
                    left: (r.left - wsRect.left) / App.zoom,
                    top: (r.top - wsRect.top) / App.zoom,
                    right: (r.right - wsRect.left) / App.zoom,
                    bottom: (r.bottom - wsRect.top) / App.zoom
                };
                const intersects = !(er.left > rect.right || er.right < rect.left || er.top > rect.bottom || er.bottom < rect.top);
                if (intersects) devs.push(el.id);
            });
            devs.forEach(id => {
                Utils.qs(`#${id}`)?.classList.add('selected');
            });
            Devices.selected = devs;
            const connIndices = [];
            Utils.qsa('.connection').forEach((el, idx) => {
                const r = el.getBoundingClientRect();
                const er = {
                    left: (r.left - wsRect.left) / App.zoom,
                    top: (r.top - wsRect.top) / App.zoom,
                    right: (r.right - wsRect.left) / App.zoom,
                    bottom: (r.bottom - wsRect.top) / App.zoom
                };
                const intersects = !(er.left > rect.right || er.right < rect.left || er.top > rect.bottom || er.bottom < rect.top);
                if (intersects) connIndices.push(parseInt(el.dataset.connIndex || String(idx), 10));
            });
            Connections.selectMulti(connIndices);
            selectionEl?.remove();
            selectionEl = null;
        });
        Utils.on(document, 'keydown', (e) => {
            if (e.key === 'Delete') {
                Connections.deleteSelected();
                Devices.deleteSelected();
            } else if (e.key === 'Escape') {
                Utils.qs('#canvasContainer').style.cursor = '';
                setIndicator('select', 'Избор');
                Connections.cancel();
            }
        });
        Utils.on(container, 'wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                e.deltaY < 0 ? App.zoomIn() : App.zoomOut();
            }
        }, { passive: false });
        let isPanning = false, panStart = { x: 0, y: 0 };
        Utils.on(container, 'mousedown', (e) => {
            if (e.button === 1 || (e.button === 0 && App.currentTool === 'move')) {
                e.preventDefault();
                isPanning = true;
                panStart = { x: e.clientX - container.scrollLeft, y: e.clientY - container.scrollTop };
                container.style.cursor = 'grabbing';
            }
        });
        Utils.on(document, 'mousemove', (e) => {
            if (isPanning) {
                container.scrollLeft = panStart.x - e.clientX;
                container.scrollTop = panStart.y - e.clientY;
            }
        });
        Utils.on(document, 'mouseup', () => {
            if (isPanning) { isPanning = false; container.style.cursor = ''; }
        });
        Utils.on(workspaceLogical, 'contextmenu', (e) => {
            const deviceEl = e.target.closest('.placed-device');
            const connEl = e.target.closest('.connection');
            if (deviceEl) {
                e.preventDefault();
                if (!Devices.selected.includes(deviceEl.id)) {
                    Devices.select(deviceEl.id, true);
                }
                showContextMenu(e.clientX, e.clientY);
            } else if (connEl) {
                e.preventDefault();
                const idx = parseInt(connEl.dataset.connIndex ?? '-1', 10);
                if (idx >= 0) Connections.select(idx);
                showConnectionContextMenu(e.clientX, e.clientY);
            }
        });
        Utils.on(document, 'click', () => Utils.qs('#contextMenu').classList.add('hidden'));

        Utils.qsa('#topologyModal .topology-option').forEach(opt => {
            Utils.on(opt, 'click', () => {
                Utils.qs('#topologyModal').classList.remove('active');
                Topology.draw(opt.dataset.topo);
            });
        });

        Utils.on(Utils.qs('#topologyModal'), 'click', (e) => {
            if (e.target.id === 'topologyModal') Utils.qs('#topologyModal').classList.remove('active');
        });
    };

    const showContextMenu = (x, y) => {
        const menu = Utils.qs('#contextMenu');
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.remove('hidden');
    };
    const showConnectionContextMenu = (x, y) => {
        const menu = Utils.createEl('div', { className: 'context-menu' });
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        const delItem = Utils.createEl('div', { className: 'context-item danger' }, '<span>🗑️</span> Delete cable');
        Utils.on(delItem, 'click', () => {
            Connections.deleteSelected();
            menu.remove();
        });
        menu.appendChild(delItem);
        document.body.appendChild(menu);
        const remove = () => menu.remove();
        setTimeout(() => Utils.on(document, 'click', remove, { once: true }));
    };

    const switchMode = (mode) => {
        App.mode = 'logical';
        setIndicator('select', 'Избор');
    };

    const switchBottomTab = (tab, evt) => {
        Utils.qsa('.bottom-tab, .bottom-content').forEach(el => el.classList.remove('active'));
        const target = evt ? evt.target : Utils.qs(`.bottom-tab[onclick*="${tab}"]`);
        if (target) target.classList.add('active');
        Utils.qs(`#${tab}Content`).classList.add('active');
    };

    const switchConfigTab = (tab, evt) => {
        Utils.qsa('.panel-tab, .panel-content').forEach(el => el.classList.remove('active'));
        const target = evt ? evt.target : Utils.qs(`.panel-tab[onclick*="${tab}"]`);
        if (target) target.classList.add('active');
        // 'config' → Device Info + Interfaces; 'settings' → форма за настройки извън терминала
        const content = Utils.qs(tab === 'settings' ? '#settingsContent' : '#configContent');
        if (content) content.classList.add('active');
    };

    const showConfig = (device) => {
        const expandPort = (name) => {
            if (!name) return name;
            const n = name.trim();
            if (/^GigabitEthernet/i.test(n)) return n;
            if (/^FastEthernet/i.test(n))    return n;
            if (/^Serial/i.test(n))          return n;
            if (/^Gi([0-9/]+)$/.test(n))     return 'GigabitEthernet' + n.slice(2);
            if (/^gi([0-9/]+)$/i.test(n))    return 'GigabitEthernet' + n.slice(2);
            if (/^Fa([0-9/]+)$/.test(n))     return 'FastEthernet'    + n.slice(2);
            if (/^fa([0-9/]+)$/i.test(n))    return 'FastEthernet'    + n.slice(2);
            if (/^Eth([0-9]+)$/i.test(n))    return 'Ethernet'        + n.slice(3);
            if (/^eth([0-9]+)$/i.test(n))    return 'Ethernet'        + n.slice(3);
            if (/^Se([0-9/]+)$/.test(n))     return 'Serial'          + n.slice(2);
            if (/^console$/i.test(n))        return 'Console';
            if (/^wifi$/i.test(n))           return 'Wireless';
            return n;
        };

        const ports = CONFIG.devicePorts[device.type] || [];

        const configContent = Utils.qs('#configContent');
        configContent.innerHTML = `
          <div class="config-section">
            <div class="config-title">Device Info</div>
            <div style="background:var(--bg-light);padding:12px;border-radius:6px;font-size:0.85em;">
              <div style="margin-bottom:6px;"><strong>Model:</strong> ${device.type}</div>
              <div style="margin-bottom:6px;"><strong>Hostname:</strong> ${device.name}</div>
              <div><strong>Status:</strong> ${device.powered ? '🟢 On' : '🔴 Off'}</div>
            </div>
          </div>
          <div class="config-section">
            <div class="config-title">Interfaces</div>
            <div style="background:var(--bg-light);border-radius:6px;overflow:hidden;">
              ${ports.map(p => {
                const fullName = expandPort(p.name);
                const ifCfg = device.config.interfaces?.[fullName] || device.config.interfaces?.[p.name] || {};
                const ip = ifCfg.ip ? `<span style="color:var(--accent)">${ifCfg.ip}/${ifCfg.mask||''}</span>` : '<span style="color:var(--text-muted)">unassigned</span>';
                const status = ifCfg.shutdown === true
                  ? '<span style="color:var(--accent-red)">down</span>'
                  : '<span style="color:var(--accent-green)">up</span>';
                const nat = ifCfg.natRole ? ` · NAT <b>${ifCfg.natRole}</b>` : '';
                const sw = ifCfg.switchport ? ` · ${ifCfg.switchport.mode}${ifCfg.switchport.accessVlan ? ' VLAN'+ifCfg.switchport.accessVlan : ''}` : '';
                return `<div style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:0.78em;">
                  <div style="font-weight:700;color:var(--accent);margin-bottom:2px;">${fullName}</div>
                  <div style="color:var(--text-muted)">${p.type.toUpperCase()} · ${p.speed || ''} · ${status}${nat}${sw}</div>
                  <div>${ip}</div>
                </div>`;
              }).join('') || '<div style="padding:12px;color:var(--text-muted)">Няма портове</div>'}
            </div>
          </div>
        `;

        // Settings табът — настройките, които могат да се зададат извън терминала
        const settingsContent = Utils.qs('#settingsContent');
        settingsContent.innerHTML = `
          <div class="config-section">
            <div class="config-title">Device Name</div>
            <input type="text" class="config-input" value="${device.name}" 
                   onchange="App.updateDevice('${device.id}', 'name', this.value)">
          </div>
          <div class="config-section">
            <div class="config-title">IP Address</div>
            <input type="text" class="config-input" value="${device.config.ip}" 
                   placeholder="192.168.1.1"
                   onchange="App.updateDevice('${device.id}', 'ip', this.value)">
          </div>
          <div class="config-section">
            <div class="config-title">Subnet Mask</div>
            <input type="text" class="config-input" value="${device.config.mask}" 
                   placeholder="255.255.255.0"
                   onchange="App.updateDevice('${device.id}', 'mask', this.value)">
          </div>
          <div class="config-section">
            <div class="config-title">Default Gateway</div>
            <input type="text" class="config-input" value="${device.config.gateway}" 
                   placeholder="192.168.1.1"
                   onchange="App.updateDevice('${device.id}', 'gateway', this.value)">
          </div>
          <div class="config-section">
            <div class="config-title">Power Status</div>
            <select class="config-select" onchange="App.updateDevice('${device.id}', 'powered', this.value === 'true')">
              <option value="true" ${device.powered ? 'selected' : ''}>🟢 ON</option>
              <option value="false" ${!device.powered ? 'selected' : ''}>🔴 OFF</option>
            </select>
          </div>
          <div class="config-section">
            <button class="menu-btn" style="width:100%;background:var(--accent-red);color:#fff;" 
                    onclick="App.deleteSelected()">
              🗑️ Delete Device
            </button>
          </div>
        `;
    };

    const renderAll = () => {
        App.getWorkspace().innerHTML = '';
        Devices.list.forEach(d => Devices.renderDevice(d));
        Connections.update();
        App.updateStats();
    };

    const applyZoom = () => {
        App.getWorkspace().style.transform = `scale(${App.zoom})`;
        Utils.qs('#zoomValue').textContent = Math.round(App.zoom * 100) + '%';
        Connections.update();
    };

    return {
        setupResize, setupEvents, showConfig, renderAll, applyZoom,
        showContextMenu, switchMode, switchBottomTab, switchConfigTab
    };
})();

const setIndicator = (kind, text) => {
    const el = Utils.qs('#modeIndicator');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('draw', 'select');
    el.classList.add(kind === 'draw' ? 'draw' : 'select');
};
