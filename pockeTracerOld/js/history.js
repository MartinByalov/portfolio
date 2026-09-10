// History management
const History = (() => {
  let stack = [];
  let index = -1;

  const snapshot = () => ({
    devices: JSON.parse(JSON.stringify(Devices.list)),
    connections: JSON.parse(JSON.stringify(Connections.list)),
    rooms: JSON.parse(JSON.stringify(Physical.rooms))
  });

  const save = () => {
    const state = snapshot();
    // Truncate forward history
    stack = stack.slice(0, index + 1);
    stack.push(state);
    index = stack.length - 1;
    updateButtons();
  };

  const restore = (state) => {
    Devices.list = JSON.parse(JSON.stringify(state.devices || []));
    Connections.list = JSON.parse(JSON.stringify(state.connections || []));
    Physical.rooms = JSON.parse(JSON.stringify(state.rooms || []));
    UI.renderAll();
  };

  const undo = () => {
    if (index <= 0) return;
    index--;
    restore(stack[index]);
    updateButtons();
  };

  const redo = () => {
    if (index >= stack.length - 1) return;
    index++;
    restore(stack[index]);
    updateButtons();
  };

  const updateButtons = () => {
    // Hook for enabling/disabling undo/redo UI buttons (if present)
  };

  return {
    get stack() { return stack; },
    get index() { return index; },
    save, undo, redo, restore, updateButtons
  };
})();
