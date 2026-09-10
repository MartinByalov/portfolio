// Device and cable catalog
const DEVICE_CATALOG = {
  network: [
    {
      type: 'router-2911', name: 'Router 2911', price: 2500,
      ports: [
        { name: 'Gi0/0', type: 'gigabit', speed: '1 Gbps' },
        { name: 'Gi0/1', type: 'gigabit', speed: '1 Gbps' },
        { name: 'Fa0/0', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/1', type: 'fast', speed: '100 Mbps' }
      ]
    },
    {
      type: 'home-router', name: 'Home Router', price: 300,
      ports: [
        { name: 'WAN', type: 'wan', speed: '1 Gbps' },
        { name: 'LAN1', type: 'fast', speed: '100 Mbps' },
        { name: 'LAN2', type: 'fast', speed: '100 Mbps' },
        { name: 'WiFi', type: 'wifi', speed: '300 Mbps' }
      ]
    },
    {
      type: 'switch-2960', name: 'Switch 2960', price: 800,
      ports: [
        { name: 'Fa0/1', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/2', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/3', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/4', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/5', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/6', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/7', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/8', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/9', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/10', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/11', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/12', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/13', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/14', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/15', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/16', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/17', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/18', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/19', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/20', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/21', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/22', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/23', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/24', type: 'fast', speed: '100 Mbps' },
        { name: 'Gi0/1', type: 'gigabit', speed: '1 Gbps' },
        { name: 'Gi0/2', type: 'gigabit', speed: '1 Gbps' }
      ]
    },
    {
      type: 'switch-2960-8', name: 'Switch 2960 (8-port compact)', price: 500,
      ports: [
        { name: 'Fa0/1', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/2', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/3', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/4', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/5', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/6', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/7', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/8', type: 'fast', speed: '100 Mbps' },
        { name: 'Gi0/1', type: 'gigabit', speed: '1 Gbps' },
        { name: 'Gi0/2', type: 'gigabit', speed: '1 Gbps' }
      ]
    },
    {
      type: 'switch-3560-24ps', name: 'Switch 3560-24PS', price: 1200,
      ports: [
        { name: 'Fa0/1', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/2', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/3', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/4', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/5', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/6', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/7', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/8', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/9', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/10', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/11', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/12', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/13', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/14', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/15', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/16', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/17', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/18', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/19', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/20', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/21', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/22', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/23', type: 'fast', speed: '100 Mbps' },
        { name: 'Fa0/24', type: 'fast', speed: '100 Mbps' },
        { name: 'Gi0/1', type: 'gigabit', speed: '1 Gbps' },
        { name: 'Gi0/2', type: 'gigabit', speed: '1 Gbps' }
      ]
    },
    {
      type: 'access-point', name: 'Access Point', price: 200,
      ports: [
        { name: 'LAN', type: 'fast', speed: '100 Mbps' },
        { name: 'WiFi', type: 'wifi', speed: '300 Mbps' }
      ]
    },
    {
      type: 'hub-8', name: 'Ethernet Hub (8-port)', price: 150,
      ports: [
        { name: 'Eth1', type: 'fast', speed: '100 Mbps' },
        { name: 'Eth2', type: 'fast', speed: '100 Mbps' },
        { name: 'Eth3', type: 'fast', speed: '100 Mbps' },
        { name: 'Eth4', type: 'fast', speed: '100 Mbps' },
        { name: 'Eth5', type: 'fast', speed: '100 Mbps' },
        { name: 'Eth6', type: 'fast', speed: '100 Mbps' },
        { name: 'Eth7', type: 'fast', speed: '100 Mbps' },
        { name: 'Eth8', type: 'fast', speed: '100 Mbps' }
      ]
    },
    {
      type: 'coax-backbone', name: 'Coax Backbone', price: 0,
      ports: [
        { name: 'Tap1', type: 'coax', speed: '10 Mbps' },
        { name: 'Tap2', type: 'coax', speed: '10 Mbps' },
        { name: 'Tap3', type: 'coax', speed: '10 Mbps' },
        { name: 'Tap4', type: 'coax', speed: '10 Mbps' },
        { name: 'Tap5', type: 'coax', speed: '10 Mbps' },
        { name: 'Tap6', type: 'coax', speed: '10 Mbps' },
        { name: 'Tap7', type: 'coax', speed: '10 Mbps' },
        { name: 'Tap8', type: 'coax', speed: '10 Mbps' },
        { name: 'Tap9', type: 'coax', speed: '10 Mbps' },
        { name: 'Tap10', type: 'coax', speed: '10 Mbps' }
      ]
    },
    {
      type: 'coax-tap', name: 'Coax Tap', price: 20,
      ports: [
        { name: 'In',   type: 'coax', speed: '10 Mbps' },
        { name: 'Out',  type: 'coax', speed: '10 Mbps' },
        { name: 'Drop', type: 'coax', speed: '10 Mbps' }
      ]
    },
    {
      type: 'token-ring-mau', name: 'Token Ring MAU', price: 400,
      ports: [
        { name: 'Port1', type: 'coax', speed: '16 Mbps' },
        { name: 'Port2', type: 'coax', speed: '16 Mbps' },
        { name: 'Port3', type: 'coax', speed: '16 Mbps' },
        { name: 'Port4', type: 'coax', speed: '16 Mbps' },
        { name: 'Port5', type: 'coax', speed: '16 Mbps' },
        { name: 'Port6', type: 'coax', speed: '16 Mbps' },
        { name: 'Port7', type: 'coax', speed: '16 Mbps' },
        { name: 'Port8', type: 'coax', speed: '16 Mbps' }
      ]
    },
    {
      type: 'cloud-isp', name: 'Cloud/ISP', price: 0,
      ports: [
        { name: 'WAN1', type: 'wan', speed: '1 Gbps' },
        { name: 'WAN2', type: 'wan', speed: '1 Gbps' }
      ]
    }
  ],
  end: [
    { type: 'pc', name: 'PC', price: 500, ports: [{ name: 'Eth0', type: 'fast', speed: '100 Mbps' }] },
    { type: 'laptop', name: 'Laptop', price: 800, ports: [{ name: 'Eth0', type: 'fast', speed: '100 Mbps' }, { name: 'WiFi', type: 'wifi', speed: '300 Mbps' }] },
    { type: 'tablet', name: 'Tablet', price: 400, ports: [{ name: 'WiFi', type: 'wifi', speed: '300 Mbps' }] },
    { type: 'smartphone', name: 'Smartphone', price: 600, ports: [{ name: 'WiFi', type: 'wifi', speed: '300 Mbps' }] },
    { type: 'server', name: 'Server', price: 2000, ports: [{ name: 'Gi0', type: 'gigabit', speed: '1 Gbps' }, { name: 'Gi1', type: 'gigabit', speed: '1 Gbps' }] },
    { type: 'printer', name: 'Printer', price: 300, ports: [{ name: 'Eth0', type: 'fast', speed: '100 Mbps' }] }, // NEW
    { type: 'phone', name: 'Phone', price: 200, ports: [{ name: 'Eth0', type: 'fast', speed: '100 Mbps' }] },     // NEW
    { type: 'camera', name: 'IP Camera', price: 400, ports: [{ name: 'Eth0', type: 'fast', speed: '100 Mbps' }] } // NEW
    ,
    { type: 'pc-coax', name: 'PC (Coax NIC)', price: 500, ports: [{ name: 'Coax0', type: 'coax', speed: '10 Mbps' }] }
    ,
    { type: 'pc-ring', name: 'PC (Ring NIC In/Out)', price: 500, ports: [
      { name: 'RingIn',  type: 'coax', speed: '10 Mbps' },
      { name: 'RingOut', type: 'coax', speed: '10 Mbps' }
    ] }
  ]
};

const CABLE_CATALOG = [
  { type: 'straight', name: 'Straight', gradient: 'linear-gradient(90deg, var(--accent-green), var(--accent))', price: 2 },
  { type: 'crossover', name: 'Cross-Over', gradient: 'linear-gradient(90deg, var(--accent-red), var(--accent-yellow))', price: 3 },
  { type: 'fiber', name: 'Fiber', gradient: 'linear-gradient(90deg, #a55eea, var(--accent))', price: 15 },
  { type: 'serial', name: 'Serial', gradient: 'linear-gradient(90deg, #ffa502, #ff4757)', price: 5 },
  { type: 'console', name: 'Console', gradient: 'linear-gradient(90deg, #2ed573, #1e90ff)', price: 3 },
  { type: 'coaxial', name: 'Coaxial', gradient: 'linear-gradient(90deg, #ff6b6b, #ee5a6f)', price: 4 },
  { type: 'telephone', name: 'Telephone', gradient: 'linear-gradient(90deg, #ffd93d, #6bcf7f)', price: 2 },
  { type: 'usb', name: 'USB', gradient: 'linear-gradient(90deg, #667eea, #764ba2)', price: 1 },
  { type: 'wifi', name: 'WiFi', gradient: 'linear-gradient(90deg, #00d4ff, #a55eea)', price: 0, dashed: true } // NEW
];
