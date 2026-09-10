const App = (() => {
  let zoom = 1;
  let mode = 'logical';
  let currentTool = 'select';

  const init = () => {
    UI.setupEvents();
    UI.setupResize();
    CLI.setup();
    CLI.log('success', '✅ PockeTracer ready!');
    CLI.log('info', '💡 Drag devices onto the canvas');
    updateStats();
  };

  const setTool = (tool) => {
    currentTool = tool;
    Utils.qsa('.tool-btn').forEach(b => b.classList.remove('active'));
    Utils.qs(`[data-tool="${tool}"]`)?.classList.add('active');
  };

  const selectCable = (type) => {
    Connections.selectType(type);
    // Visual selection in catalog
    Utils.qsa('.cable-item').forEach(el => el.classList.toggle('selected', el.dataset.cable === type));
  };

  const switchBottomTab = (tab) => UI.switchBottomTab(tab);
  const switchConfigTab = (tab) => UI.switchConfigTab(tab);

  const zoomIn = () => { zoom = Math.min(zoom + 0.1, 2); UI.applyZoom(); };
  const zoomOut = () => { zoom = Math.max(zoom - 0.1, 0.5); UI.applyZoom(); };
  const resetZoom = () => { zoom = 1; UI.applyZoom(); };

  const updateDevice = (id, prop, value) => Devices.updateProp(id, prop, value);

  const getWorkspace = () => Utils.qs('#workspaceLogical');

  const newProject = () => {
    if (confirm('New project? Unsaved changes will be lost.')) {
      Devices.list = [];
      Connections.list = [];
      Devices.selected = [];
      const ws = Utils.qs('#workspaceLogical');
      if (ws) ws.innerHTML = '';
      updateStats();
      CLI.log('info', '📄 New project');
      History.save();
    }
  };

  const saveProject = () => {
    const data = {
      devices: Devices.list,
      connections: Connections.list
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pocketracer-project.json';
    a.click();
    CLI.log('success', '💾 Project saved');
  };

  const openProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          // Clear current state
          Devices.list = [];
          Connections.list = [];
          Devices.selected = [];
          const ws = Utils.qs('#workspaceLogical');
          if (ws) ws.innerHTML = '';
          // Restore devices with full saved state (names, config, powered)
          if (data.devices) {
            data.devices.forEach(saved => {
              // Build full device object from saved data
              const restored = {
                id: saved.id,
                type: saved.type,
                x: saved.x,
                y: saved.y,
                name: saved.name,
                powered: saved.powered !== false,
                config: saved.config || {
                  ip:'', mask:'', gateway:'', interfaces:{}, vlans:{}, svi:{},
                  routes:[], acl:{}, nat:null, dhcp:{excluded:[],pools:{}}, ipRouting:false
                },
                ports: (CONFIG.devicePorts[saved.type] || []).map((p,i) => ({...p, index:i}))
              };
              Devices.list.push(restored);
              Devices.renderDevice(restored);
            });
          }
          if (data.connections) {
            Connections.list = data.connections;
            Connections.update();
          }
          CLI.log('success', `📂 Project loaded — ${Devices.list.length} devices, ${Connections.list.length} cables`);
          updateStats();
          History.save();
        } catch (err) {
          CLI.log('error', '❌ Invalid file: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const importProject = () => openProject();

  const updateStats = () => {
    Utils.qs('#deviceCount').textContent = Devices.list.length;
    Utils.qs('#connectionCount').textContent = Connections.list.length;
    const topo = Topology.detect(Devices.list, Connections.list);
    Utils.qs('#topologyDisplay').innerHTML = `
      <div class="topology-icon">${topo.icon}</div>
      <div class="topology-name">${topo.name}</div>
    `;
    const deviceCost = Devices.list.reduce((sum, d) => sum + (CONFIG.devicePrices[d.type] || 0), 0);
    const cableCost = Connections.list.reduce((sum, c) => sum + (CONFIG.cablePrices[c.type] || 0), 0);
    const total = deviceCost + cableCost;
    Utils.qs('#deviceCost').textContent = deviceCost + ' €';
    Utils.qs('#cableCost').textContent = cableCost + ' €';
    Utils.qs('#totalCost').textContent = total + ' €';
  };

  const deleteSelected = () => {
    Connections.deleteSelected();
    Devices.deleteSelected();
  };

  const duplicateDevice = () => {
    const ids = [...Devices.selected];
    if (!ids.length) return;
    ids.forEach(id => {
      const dev = Devices.list.find(d => d.id === id);
      if (dev) Devices.add(dev.type, dev.x + 80, dev.y + 80);
    });
  };

  return {
    init,
    get zoom() { return zoom; },
    set zoom(v) { zoom = v; },
    get mode() { return mode; },
    set mode(v) { mode = v; },
    get currentTool() { return currentTool; },
    setTool, selectCable,
    switchBottomTab, switchConfigTab,
    zoomIn, zoomOut, resetZoom,
    updateStats, updateDevice,
    newProject, saveProject, openProject, importProject,
    getWorkspace,
    deleteSelected,
    duplicateDevice
  };
})();

// expose for inline handlers in HTML
window.App = App;
window.app = App;
// init
document.addEventListener('DOMContentLoaded', () => App.init());