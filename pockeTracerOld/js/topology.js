const Topology = (() => {
  const detect = (devices, connections) => {
    if (devices.length === 0) return { icon: '🌐', name: 'Празна' };
    if (connections.length === 0) return { icon: '📍', name: 'Изолирани' };
    const counts = {};
    connections.forEach(c => {
      counts[c.from.deviceId] = (counts[c.from.deviceId] || 0) + 1;
      counts[c.to.deviceId] = (counts[c.to.deviceId] || 0) + 1;
    });
    const maxConn = Math.max(...Object.values(counts));
    if (maxConn >= devices.length - 1) return { icon: '⭐', name: 'Звездна (Star)' };
    const twoConn = Object.values(counts).filter(c => c === 2).length;
    if (twoConn === devices.length - 2) return { icon: '➖', name: 'Шина (Bus)' };
    if (Object.values(counts).every(c => c === 2)) return { icon: '⭕', name: 'Пръстен (Ring)' };
    if (connections.length > devices.length) return { icon: '🕸️', name: 'Мрежа (Mesh)' };
    return { icon: '🔀', name: 'Хибридна' };
  };
  const draw = (type) => {
    Devices.list = [];
    Connections.list = [];
    Utils.qs('#workspace').innerHTML = '';
    const centerX = 400, centerY = 300, step = CONFIG.GRID_SIZE * 3;
    if (type === 'star') {
      Devices.add('switch-2960', centerX, centerY);
      const s = Devices.list[0];
      for (let i = 0; i < 5; i++) {
        const angle = i * (2 * Math.PI / 5);
        const x = centerX + Math.cos(angle) * step * 3;
        const y = centerY + Math.sin(angle) * step * 3;
        Devices.add('pc', x, y);
        const d = Devices.list[Devices.list.length - 1];
        Connections.create({ deviceId: s.id, portIndex: i % 4 }, { deviceId: d.id, portIndex: 0 });
      }
    } else if (type === 'bus') {
      for (let i = 0; i < 6; i++) {
        Devices.add('pc', centerX + i * step, centerY);
      }
      for (let i = 0; i < 5; i++) {
        const a = Devices.list[i], b = Devices.list[i + 1];
        Connections.create({ deviceId: a.id, portIndex: 0 }, { deviceId: b.id, portIndex: 0 });
      }
    } else if (type === 'ring') {
      const nodes = [];
      for (let i = 0; i < 6; i++) {
        const angle = i * (2 * Math.PI / 6);
        const x = centerX + Math.cos(angle) * step * 3;
        const y = centerY + Math.sin(angle) * step * 3;
        Devices.add('pc', x, y);
        nodes.push(Devices.list[Devices.list.length - 1]);
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i], b = nodes[(i + 1) % nodes.length];
        Connections.create({ deviceId: a.id, portIndex: 0 }, { deviceId: b.id, portIndex: 0 });
      }
    } else if (type === 'mesh') {
      const nodes = [];
      for (let i = 0; i < 5; i++) {
        const angle = i * (2 * Math.PI / 5);
        const x = centerX + Math.cos(angle) * step * 3;
        const y = centerY + Math.sin(angle) * step * 3;
        Devices.add('pc', x, y);
        nodes.push(Devices.list[Devices.list.length - 1]);
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          Connections.create({ deviceId: nodes[i].id, portIndex: 0 }, { deviceId: nodes[j].id, portIndex: 0 });
        }
      }
    } else if (type === 'tree') {
      Devices.add('router-2911', centerX, centerY - step);
      const r = Devices.list[0];
      Devices.add('switch-2960', centerX - step * 2, centerY + step);
      Devices.add('switch-2960', centerX + step * 2, centerY + step);
      const s1 = Devices.list[1], s2 = Devices.list[2];
      Connections.create({ deviceId: r.id, portIndex: 0 }, { deviceId: s1.id, portIndex: 0 });
      Connections.create({ deviceId: r.id, portIndex: 1 }, { deviceId: s2.id, portIndex: 0 });
      for (let i = 0; i < 3; i++) {
        Devices.add('pc', centerX - step * 3 + i * step, centerY + step * 3);
        const d = Devices.list[Devices.list.length - 1];
        Connections.create({ deviceId: s1.id, portIndex: i % 4 }, { deviceId: d.id, portIndex: 0 });
      }
      for (let i = 0; i < 3; i++) {
        Devices.add('pc', centerX + step + i * step, centerY + step * 3);
        const d = Devices.list[Devices.list.length - 1];
        Connections.create({ deviceId: s2.id, portIndex: i % 4 }, { deviceId: d.id, portIndex: 0 });
      }
    }
    App.updateStats();
    History.save();
  };
  return { detect, draw };
})();
