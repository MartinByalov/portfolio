const Physical = (() => {
  let tool = null;
  let rooms = [];
  let lineType = 'phys-cable';
  const selectTool = (t) => { tool = t; };
  const setLineType = (t) => { lineType = t; };
  return {
    get tool() { return tool; },
    selectTool,
    get rooms() { return rooms; },
    set rooms(v) { rooms = v; },
    get lineType() { return lineType; },
    setLineType
  };
})();
