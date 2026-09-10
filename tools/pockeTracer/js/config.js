// Global configuration
const CONFIG = (() => {
  const devicePrices = {
    'router-2911': 2500,
    'home-router': 300,
    'switch-2960': 800,
    'switch-2960-8': 500,
    'switch-3560-24ps': 1200,
    'hub-8': 150,
    'coax-backbone': 0,
    'coax-tap': 20,
    'token-ring-mau': 400,
    'access-point': 200,
    'cloud-isp': 0,
    'pc': 500,
    'pc-coax': 500,
    'pc-ring': 500,
    'laptop': 800,
    'tablet': 400,
    'smartphone': 600,
    'server': 2000,
    'printer': 300,
    'camera': 400,
    'phone': 200
  };

  const cablePrices = {
    'straight': 2,
    'crossover': 3,
    'fiber': 15,
    'serial': 5,
    'console': 3,
    'coaxial': 4,
    'telephone': 2,
    'usb': 1,
    'wifi': 0
  };

  const deviceIcons = {
    'router-2911': '🔀',
    'home-router': '📶',
    'switch-2960': '⚡',
    'switch-2960-8': '⚡',
    'switch-3560-24ps': '🔷',
    'hub-8': '🧩',
    'coax-backbone': '▬',
    'coax-tap': '┬',
    'token-ring-mau': '⭕',
    'access-point': '📡',
    'cloud-isp': '☁️',
    'pc': '🖥️',
    'pc-coax': '💻',
    'pc-ring': '💻',
    'laptop': '💻',
    'tablet': '📱',
    'smartphone': '📲',
    'server': '🖥️',
    'printer': '🖨️',
    'camera': '📹',
    'phone': '📞'
  };

  const GRID_SIZE = 40;

  const devicePorts = (() => {
    const map = {};
    (DEVICE_CATALOG.network.concat(DEVICE_CATALOG.end)).forEach(d => {
      map[d.type] = d.ports || [];
    });
    return map;
  })();

  return {
    devicePrices,
    cablePrices,
    deviceIcons,
    GRID_SIZE,
    devicePorts,
    DEVICE_CATALOG,
    CABLE_CATALOG
  };
})();
