const fs = require('fs');
let css = fs.readFileSync('styles/components.css', 'utf8');

// We don't necessarily need to add a style for .fill-text-wrapper,
// it should flow naturally since it's an inline-block/flex container.
// But we might want to make sure the row works well if it's display: flex;
// Currently .fill-sentence-row is display: flex; align-items: center; flex-wrap: wrap;
// .fill-text-wrapper can just be the remaining width.
css += `
.fill-text-wrapper {
  flex: 1;
  line-height: 1.8;
}
input.fill-input-text {
  padding: 4px 10px;
  border: 2px dashed #94a3b8;
  border-radius: 6px;
  background: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  min-width: 140px;
  outline: none;
  transition: all 0.2s ease;
  text-align: center;
  margin: 0 4px;
}
input.fill-input-text:focus {
  border-style: solid;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
`;

fs.writeFileSync('styles/components.css', css);
console.log('updated css for inline fill');
