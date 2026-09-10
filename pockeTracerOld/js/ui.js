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
        const workspacePhysical = Utils.qs('#workspacePhysical');
        const container = Utils.qs('#canvasContainer');
        // Logical drag & drop
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
        // Cable preview while dragging in logical
        Utils.on(container, 'mousemove', (e) => {
            if (App.mode !== 'logical') return;
            Connections.updatePreviewToMouse(e);
        });
        // Marquee selection in logical workspace
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
        // Keyboard
        Utils.on(document, 'keydown', (e) => {
            if (e.key === 'Delete') {
                if (App.mode === 'physical') {
                    Array.from(Utils.qsa('.rack.selected, .label.selected, .phys-cable.selected')).forEach(el => el.remove());
                } else {
                    Connections.deleteSelected();
                    Devices.deleteSelected();
                }
            } else if (e.key === 'Escape') {
                Utils.qsa('.tool-mode-btn, .tool-item').forEach(i => i.classList.remove('active', 'selected'));
                Physical.selectTool(null);
                Utils.qs('#canvasContainer').style.cursor = '';
                setIndicator('select', 'Избор');
                Connections.cancel();
            }
        });
        // Wheel zoom
        Utils.on(container, 'wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                e.deltaY < 0 ? App.zoomIn() : App.zoomOut();
            }
        }, { passive: false });
        // Middle mouse pan or move tool
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
        // Context menu
        Utils.on(workspaceLogical, 'contextmenu', (e) => {
            const deviceEl = e.target.closest('.placed-device');
            const connEl = e.target.closest('.connection');
            if (deviceEl) {
                e.preventDefault();
                // Select the device first so deleteSelected works
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

        // Tool selection highlight and cursor
        const setPhysicalTool = (tool) => {
            Utils.qsa('.tool-mode-btn').forEach(b => b.classList.remove('active'));
            Utils.qs(`.tool-mode-btn[data-tool="${tool}"]`)?.classList.add('active');
            Utils.qsa('.tool-item').forEach(i => i.classList.remove('selected'));
            Utils.qs(`.tool-item[data-tool="${tool}"]`)?.classList.add('selected');
            if (tool === 'hand') {
                Physical.selectTool(null);
                Utils.qs('#canvasContainer').style.cursor = '';
                setIndicator('select', 'Избор');
            } else if (tool === 'line') {
                Physical.selectTool('line');
                Physical.setLineType('phys-cable');
                Utils.qs('#canvasContainer').style.cursor = 'crosshair';
                setIndicator('draw', 'Чертане: Линия');
            } else if (tool === 'wall') {
                Physical.selectTool('line');
                Physical.setLineType('wall');
                Utils.qs('#canvasContainer').style.cursor = 'crosshair';
                setIndicator('draw', 'Чертане: Стена');
            } else if (tool === 'pcable') {
                Physical.selectTool('line');
                Physical.setLineType('phys-cable');
                Utils.qs('#canvasContainer').style.cursor = 'crosshair';
                setIndicator('draw', 'Чертане: Линия');
            } else {
                Physical.selectTool(tool);
            }
        };
        Utils.qsa('.tool-item').forEach(item => {
            Utils.on(item, 'click', () => {
                setPhysicalTool(item.dataset.tool);
            });
            if (item.dataset.tool === 'rack') {
                item.setAttribute('draggable', 'true');
            }
        });
        Utils.qsa('.tool-mode-btn').forEach(btn => {
            Utils.on(btn, 'click', () => {
                setPhysicalTool(btn.dataset.tool);
            });
        });
        let rackDragging = false;
        const rackTool = Utils.qs('.tool-item[data-tool="rack"]');
        if (rackTool) {
            Utils.on(rackTool, 'dragstart', () => {
                rackDragging = true;
                Utils.qsa('.tool-item').forEach(i => i.classList.remove('selected'));
                rackTool.classList.add('selected');
            });
            Utils.on(rackTool, 'dragend', () => {
                rackDragging = false;
                rackTool.classList.remove('selected');
            });
        }
        Utils.on(container, 'drop', (e) => {
            if (App.mode !== 'physical' || !rackDragging) return;
            const targetEl = document.elementFromPoint(e.clientX, e.clientY);
            const wsRect = workspacePhysical.getBoundingClientRect();
            const rx = (e.clientX - wsRect.left) / App.zoom;
            const ry = (e.clientY - wsRect.top) / App.zoom;
            const rack = Utils.createEl('div', { className: 'rack' });
            rack.style.left = Utils.snapToGrid(rx) + 'px';
            rack.style.top = Utils.snapToGrid(ry) + 'px';
            workspacePhysical.appendChild(rack);
            makeRackDraggable(rack);
            makeRackResizable(rack);
            showRackSelector(rack);
            rackDragging = false;
            rackTool?.classList.remove('selected');
            setIndicator('select', 'Избор');
        });

        Utils.qsa('#topologyModal .topology-option').forEach(opt => {
            Utils.on(opt, 'click', () => {
                Utils.qs('#topologyModal').classList.remove('active');
                Topology.draw(opt.dataset.topo);
            });
        });

        Utils.on(Utils.qs('#topologyModal'), 'click', (e) => {
            if (e.target.id === 'topologyModal') Utils.qs('#topologyModal').classList.remove('active');
        });

        // Physical: hand or line
        let pSelecting = false, pSelectStart = { x: 0, y: 0 }, pSelectionEl = null;
        Utils.on(workspacePhysical, 'mousedown', (e) => {
            if (App.mode !== 'physical') return;
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left + container.scrollLeft) / App.zoom;
            const y = (e.clientY - rect.top + container.scrollTop) / App.zoom;
            if (!Physical.tool) {
                if (e.target.closest('.rack') || e.target.closest('.label') || e.target.closest('.phys-cable')) return;
                const wsRect = workspacePhysical.getBoundingClientRect();
                pSelecting = true;
                pSelectStart = { x: (e.clientX - wsRect.left) / App.zoom, y: (e.clientY - wsRect.top) / App.zoom };
                pSelectionEl = Utils.createEl('div', { className: 'selection-box' });
                pSelectionEl.style.left = pSelectStart.x + 'px';
                pSelectionEl.style.top = pSelectStart.y + 'px';
                pSelectionEl.style.width = '0px';
                pSelectionEl.style.height = '0px';
                workspacePhysical.appendChild(pSelectionEl);
                Utils.qsa('.rack, .label, .phys-cable').forEach(el => el.classList.remove('selected'));
            } else if (Physical.tool === 'line') {
                const startX = x, startY = y;
                const typeClass = Physical.lineType === 'wall' ? 'wall' : 'phys-cable';
                const cable = Utils.createEl('div', { className: typeClass });
                cable.style.left = Utils.snapToGrid(startX) + 'px';
                cable.style.top = Utils.snapToGrid(startY) + 'px';
                cable.style.width = '0px';
                workspacePhysical.appendChild(cable);
                setIndicator('draw', Physical.lineType === 'wall' ? 'Чертане: Стена' : 'Чертане: Линия');
                let drawing = true;
                const moveHandler = (ev) => {
                    if (!drawing) return;
                    const mx = (ev.clientX - rect.left + container.scrollLeft) / App.zoom;
                    const my = (ev.clientY - rect.top + container.scrollTop) / App.zoom;
                    if (Physical.lineType === 'wall') {
                        const dx = Utils.snapToGrid(mx) - Utils.snapToGrid(startX);
                        const dy = Utils.snapToGrid(my) - Utils.snapToGrid(startY);
                        if (Math.abs(dx) >= Math.abs(dy)) {
                            cable.style.width = Math.abs(dx) + 'px';
                            cable.style.height = '3px';
                            cable.style.left = (dx < 0 ? Utils.snapToGrid(mx) : Utils.snapToGrid(startX)) + 'px';
                            cable.style.top = Utils.snapToGrid(startY) + 'px';
                            cable.style.transform = '';
                        } else {
                            cable.style.width = '3px';
                            cable.style.height = Math.abs(dy) + 'px';
                            cable.style.left = Utils.snapToGrid(startX) + 'px';
                            cable.style.top = (dy < 0 ? Utils.snapToGrid(my) : Utils.snapToGrid(startY)) + 'px';
                            cable.style.transform = '';
                        }
                    } else {
                        const dx = mx - startX, dy = my - startY;
                        const length = Math.hypot(dx, dy);
                        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                        cable.style.width = length + 'px';
                        cable.style.transform = `rotate(${angle}deg)`;
                        cable.style.left = Utils.snapToGrid(startX) + 'px';
                        cable.style.top = Utils.snapToGrid(startY) + 'px';
                    }
                };
                const upHandler = () => {
                    drawing = false;
                    document.removeEventListener('mousemove', moveHandler);
                    document.removeEventListener('mouseup', upHandler);
                    // Keep tool active
                    // selection
                    Utils.on(cable, 'click', (ev) => {
                        ev.stopPropagation();
                        Utils.qsa('.phys-cable').forEach(el => el.classList.remove('selected'));
                        cable.classList.add('selected');
                    });
                    // drag move
                    let draggingCable = false, sX = 0, sY = 0, iL = 0, iT = 0, groupInitial = null;
                    Utils.on(cable, 'mousedown', (ev) => {
                        ev.stopPropagation();
                        if (Physical.tool) return;
                        draggingCable = true;
                        sX = ev.clientX; sY = ev.clientY;
                        iL = parseInt(cable.style.left || 0, 10);
                        iT = parseInt(cable.style.top || 0, 10);
                        const selectedEls = Array.from(Utils.qsa('.rack.selected, .label.selected, .phys-cable.selected'));
                        if (selectedEls.length > 1 || (selectedEls.length === 1 && selectedEls[0] !== cable)) {
                            groupInitial = selectedEls.map(el => ({
                                el,
                                left: parseInt(el.style.left || 0, 10),
                                top: parseInt(el.style.top || 0, 10)
                            }));
                        } else {
                            groupInitial = null;
                        }
                    });
                    Utils.on(document, 'mousemove', (ev) => {
                        if (!draggingCable) return;
                        const ddx = (ev.clientX - sX) / App.zoom;
                        const ddy = (ev.clientY - sY) / App.zoom;
                        if (groupInitial) {
                            groupInitial.forEach(it => {
                                it.el.style.left = Utils.snapToGrid(it.left + ddx) + 'px';
                                it.el.style.top = Utils.snapToGrid(it.top + ddy) + 'px';
                            });
                        } else {
                            cable.style.left = Utils.snapToGrid(iL + ddx) + 'px';
                            cable.style.top = Utils.snapToGrid(iT + ddy) + 'px';
                        }
                    });
                    Utils.on(document, 'mouseup', () => { draggingCable = false; });
                    // context menu
                    Utils.on(cable, 'contextmenu', (ev) => {
                        ev.preventDefault();
                        Utils.qsa('.phys-cable').forEach(el => el.classList.remove('selected'));
                        cable.classList.add('selected');
                        showPhysicalCableContextMenu(ev.clientX, ev.clientY);
                    });
                };
                document.addEventListener('mousemove', moveHandler);
                document.addEventListener('mouseup', upHandler);
            }
        });
        // Physical marquee move handlers
        Utils.on(document, 'mousemove', (e) => {
            if (!pSelecting) return;
            const wsRect = workspacePhysical.getBoundingClientRect();
            const cur = { x: (e.clientX - wsRect.left) / App.zoom, y: (e.clientY - wsRect.top) / App.zoom };
            const left = Math.min(pSelectStart.x, cur.x);
            const top = Math.min(pSelectStart.y, cur.y);
            const width = Math.abs(cur.x - pSelectStart.x);
            const height = Math.abs(cur.y - pSelectStart.y);
            pSelectionEl.style.left = left + 'px';
            pSelectionEl.style.top = top + 'px';
            pSelectionEl.style.width = width + 'px';
            pSelectionEl.style.height = height + 'px';
        });
        Utils.on(document, 'mouseup', (e) => {
            if (!pSelecting) return;
            pSelecting = false;
            const wsRect = workspacePhysical.getBoundingClientRect();
            const end = { x: (e.clientX - wsRect.left) / App.zoom, y: (e.clientY - wsRect.top) / App.zoom };
            const rectSel = {
                left: Math.min(pSelectStart.x, end.x),
                top: Math.min(pSelectStart.y, end.y),
                right: Math.max(pSelectStart.x, end.x),
                bottom: Math.max(pSelectStart.y, end.y)
            };
            Utils.qsa('.rack, .label, .phys-cable').forEach(el => {
                const r = el.getBoundingClientRect();
                const er = {
                    left: (r.left - wsRect.left) / App.zoom,
                    top: (r.top - wsRect.top) / App.zoom,
                    right: (r.right - wsRect.left) / App.zoom,
                    bottom: (r.bottom - wsRect.top) / App.zoom
                };
                const intersects = !(er.left > rectSel.right || er.right < rectSel.left || er.top > rectSel.bottom || er.bottom < rectSel.top);
                if (intersects) el.classList.add('selected');
            });
            pSelectionEl?.remove();
            pSelectionEl = null;
        });
        // Click selection in physical
        Utils.on(workspacePhysical, 'click', (e) => {
            if (App.mode !== 'physical' || Physical.tool) return;
            const el = e.target.closest('.rack, .label, .phys-cable');
            if (!el) {
                Utils.qsa('.rack, .label, .phys-cable').forEach(x => x.classList.remove('selected'));
            } else {
                Utils.qsa('.rack, .label, .phys-cable').forEach(x => x.classList.remove('selected'));
                el.classList.add('selected');
            }
        });
        // Rack context menu
        Utils.on(workspacePhysical, 'contextmenu', (e) => {
            if (App.mode !== 'physical') return;
            const rack = e.target.closest('.rack');
            const pcable = e.target.closest('.phys-cable');
            if (rack) {
                e.preventDefault();
                showRackContextMenu(e.clientX, e.clientY, rack);
            } else if (pcable) {
                e.preventDefault();
                Utils.qsa('.phys-cable').forEach(el => el.classList.remove('selected'));
                pcable.classList.add('selected');
                showPhysicalCableContextMenu(e.clientX, e.clientY);
            }
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
    const showPhysicalCableContextMenu = (x, y) => {
        const menu = Utils.createEl('div', { className: 'context-menu' });
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        const delItem = Utils.createEl('div', { className: 'context-item danger' }, '<span>🗑️</span> Delete cable');
        Utils.on(delItem, 'click', () => {
            Utils.qs('.phys-cable.selected')?.remove();
            menu.remove();
        });
        menu.appendChild(delItem);
        document.body.appendChild(menu);
        const remove = () => menu.remove();
        setTimeout(() => Utils.on(document, 'click', remove, { once: true }));
    };
    const showRackContextMenu = (x, y, rackEl) => {
        const menu = Utils.createEl('div', { className: 'context-menu' });
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        const addItem = Utils.createEl('div', { className: 'context-item' }, '<span>➕</span> Add devices');
        const delItem = Utils.createEl('div', { className: 'context-item danger' }, '<span>🗑️</span> Delete rack');
        Utils.on(addItem, 'click', () => {
            showRackSelector(rackEl);
            menu.remove();
        });
        Utils.on(delItem, 'click', () => {
            rackEl.remove();
            menu.remove();
        });
        menu.appendChild(addItem);
        menu.appendChild(Utils.createEl('div', { className: 'context-divider' }));
        menu.appendChild(delItem);
        document.body.appendChild(menu);
        const remove = () => menu.remove();
        setTimeout(() => Utils.on(document, 'click', remove, { once: true }));
    };

    const switchMode = (mode) => {
        App.mode = mode;
        Utils.qsa('.mode-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        Utils.qs('#logicalPanel').classList.toggle('hidden', mode !== 'logical');
        Utils.qs('#physicalPanel').classList.toggle('hidden', mode !== 'physical');
        Utils.qs('#workspaceLogical').classList.toggle('hidden', mode !== 'logical');
        Utils.qs('#workspacePhysical').classList.toggle('hidden', mode !== 'physical');
        Utils.qs('#canvasContainer').style.cursor = (mode === 'physical' && (Physical.tool === 'wall')) ? 'crosshair' : '';
        setIndicator('select', 'Избор');
        CLI.log('info', `🔄 Mode: ${mode === 'logical' ? 'Логически' : 'Физически'}`);
    };

    const switchBottomTab = (tab) => {
        Utils.qsa('.bottom-tab, .bottom-content').forEach(el => el.classList.remove('active'));
        event.target.classList.add('active');
        Utils.qs(`#${tab}Content`).classList.add('active');
    };

    const switchConfigTab = (tab) => {
        Utils.qsa('.panel-tab, .panel-content').forEach(el => el.classList.remove('active'));
        event.target.classList.add('active');
        if (tab === 'physical') Utils.qs('#physicalContent').classList.add('active');
        else if (tab === 'config') Utils.qs('#configContent').classList.add('active');
    };

    const showConfig = (device) => {
        // Helper: expand abbreviated → full Cisco port name
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
        const physicalContent = Utils.qs('#physicalContent');
        physicalContent.innerHTML = `
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

        const configContent = Utils.qs('#configContent');
        configContent.innerHTML = `
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
        // Use renderDevice (NOT add) so we don't push duplicates to list or trigger History.save
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

const showRackSelector = (rackEl) => {
    const modal = Utils.qs('#topologyModal');
    const content = Utils.qs('#topologyModal .modal-content');
    content.innerHTML = '';
    const list = Utils.createEl('div');
    Devices.list.forEach(d => {
        const item = Utils.createEl('label');
        const cb = Utils.createEl('input');
        cb.type = 'checkbox';
        cb.value = d.id;
        item.appendChild(cb);
        item.appendChild(document.createTextNode(' ' + d.name));
        list.appendChild(item);
        list.appendChild(document.createElement('br'));
    });
    const btn = Utils.createEl('button', {}, 'Add to rack');
    Utils.on(btn, 'click', () => {
        const ids = Array.from(list.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);
        let y = 8;
        ids.forEach(id => {
            const d = Devices.list.find(dd => dd.id === id);
            if (!d) return;
            const row = Utils.createEl('div');
            row.style.margin = '4px 8px';
            row.style.color = 'var(--text)';
            row.textContent = d.name;
            rackEl.appendChild(row);
            y += 16;
        });
        modal.classList.remove('active');
    });
    content.appendChild(list);
    content.appendChild(btn);
    modal.classList.add('active');
};

const makeRoomDraggable = (room) => {
    let dragging = false, startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
    Utils.on(room, 'mousedown', (e) => {
        if (e.target.classList.contains('room-resize-handle')) return;
        if (Physical.tool) return;
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        initialLeft = parseInt(room.style.left || 0, 10);
        initialTop = parseInt(room.style.top || 0, 10);
    });
    Utils.on(document, 'mousemove', (e) => {
        if (!dragging) return;
        const dx = (e.clientX - startX) / App.zoom;
        const dy = (e.clientY - startY) / App.zoom;
        room.style.left = Utils.snapToGrid(initialLeft + dx) + 'px';
        room.style.top = Utils.snapToGrid(initialTop + dy) + 'px';
    });
    Utils.on(document, 'mouseup', () => { dragging = false; });
};

const makeRoomResizable = (room) => {
    const handles = room.querySelectorAll('.room-resize-handle');
    handles.forEach(h => {
        Utils.on(h, 'mousedown', (e) => {
            e.stopPropagation();
            if (Physical.tool) return;
            let resizing = true;
            const startX = e.clientX, startY = e.clientY;
            const startW = parseInt(room.style.width || room.offsetWidth, 10);
            const startH = parseInt(room.style.height || room.offsetHeight, 10);
            const startL = parseInt(room.style.left || 0, 10);
            const startT = parseInt(room.style.top || 0, 10);
            const dir = h.classList.contains('room-resize-se') ? 'se' :
                h.classList.contains('room-resize-ne') ? 'ne' :
                    h.classList.contains('room-resize-sw') ? 'sw' : 'nw';
            const move = (ev) => {
                if (!resizing) return;
                const dx = (ev.clientX - startX) / App.zoom;
                const dy = (ev.clientY - startY) / App.zoom;
                let w = startW, hgt = startH, left = startL, top = startT;
                if (dir === 'se') { w = Utils.snapToGrid(startW + dx); hgt = Utils.snapToGrid(startH + dy); }
                if (dir === 'ne') { w = Utils.snapToGrid(startW + dx); hgt = Utils.snapToGrid(startH - dy); top = Utils.snapToGrid(startT + dy); }
                if (dir === 'sw') { w = Utils.snapToGrid(startW - dx); hgt = Utils.snapToGrid(startH + dy); left = Utils.snapToGrid(startL + dx); }
                if (dir === 'nw') { w = Utils.snapToGrid(startW - dx); hgt = Utils.snapToGrid(startH - dy); left = Utils.snapToGrid(startL + dx); top = Utils.snapToGrid(startT + dy); }
                w = Math.max(w, 80); hgt = Math.max(hgt, 60);
                room.style.width = w + 'px';
                room.style.height = hgt + 'px';
                room.style.left = left + 'px';
                room.style.top = top + 'px';
            };
            const up = () => {
                resizing = false;
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    });
};

const makeRackDraggable = (rack) => {
    let dragging = false, startX = 0, startY = 0, initialLeft = 0, initialTop = 0, groupInitial = null;
    Utils.on(rack, 'mousedown', (e) => {
        if (e.target.classList.contains('rack-resize-handle')) return;
        e.stopPropagation();
        if (Physical.tool) return;
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        initialLeft = parseInt(rack.style.left || 0, 10);
        initialTop = parseInt(rack.style.top || 0, 10);
        const selectedEls = Array.from(Utils.qsa('.rack.selected, .label.selected, .phys-cable.selected'));
        if (selectedEls.length > 1 || (selectedEls.length === 1 && selectedEls[0] !== rack)) {
            groupInitial = selectedEls.map(el => ({
                el,
                left: parseInt(el.style.left || 0, 10),
                top: parseInt(el.style.top || 0, 10)
            }));
        } else {
            groupInitial = null;
        }
    });
    Utils.on(document, 'mousemove', (e) => {
        if (!dragging) return;
        const dx = (e.clientX - startX) / App.zoom;
        const dy = (e.clientY - startY) / App.zoom;
        if (groupInitial) {
            groupInitial.forEach(it => {
                it.el.style.left = Utils.snapToGrid(it.left + dx) + 'px';
                it.el.style.top = Utils.snapToGrid(it.top + dy) + 'px';
            });
        } else {
            rack.style.left = Utils.snapToGrid(initialLeft + dx) + 'px';
            rack.style.top = Utils.snapToGrid(initialTop + dy) + 'px';
        }
    });
    Utils.on(document, 'mouseup', () => { dragging = false; });
};

const makeRackResizable = (rack) => {
    ['nw', 'ne', 'sw', 'se'].forEach(dir => {
        const h = Utils.createEl('div', { className: `rack-resize-handle rack-resize-${dir}` });
        rack.appendChild(h);
        Utils.on(h, 'mousedown', (e) => {
            e.stopPropagation();
            let resizing = true;
            const startX = e.clientX, startY = e.clientY;
            const startW = parseInt(rack.style.width || rack.offsetWidth, 10);
            const startH = parseInt(rack.style.height || rack.offsetHeight, 10);
            const startL = parseInt(rack.style.left || 0, 10);
            const startT = parseInt(rack.style.top || 0, 10);
            const move = (ev) => {
                if (!resizing) return;
                const dx = (ev.clientX - startX) / App.zoom;
                const dy = (ev.clientY - startY) / App.zoom;
                let w = startW, hgt = startH, left = startL, top = startT;
                if (dir === 'se') { w = Utils.snapToGrid(startW + dx); hgt = Utils.snapToGrid(startH + dy); }
                if (dir === 'ne') { w = Utils.snapToGrid(startW + dx); hgt = Utils.snapToGrid(startH - dy); top = Utils.snapToGrid(startT + dy); }
                if (dir === 'sw') { w = Utils.snapToGrid(startW - dx); hgt = Utils.snapToGrid(startH + dy); left = Utils.snapToGrid(startL + dx); }
                if (dir === 'nw') { w = Utils.snapToGrid(startW - dx); hgt = Utils.snapToGrid(startH - dy); left = Utils.snapToGrid(startL + dx); top = Utils.snapToGrid(startT + dy); }
                w = Math.max(w, 80); hgt = Math.max(hgt, 60);
                rack.style.width = w + 'px';
                rack.style.height = hgt + 'px';
                rack.style.left = left + 'px';
                rack.style.top = top + 'px';
            };
            const up = () => {
                resizing = false;
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    });
};

const setIndicator = (kind, text) => {
    const el = Utils.qs('#modeIndicator');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('draw', 'select');
    el.classList.add(kind === 'draw' ? 'draw' : 'select');
};