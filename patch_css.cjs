const fs = require('fs');
let css = fs.readFileSync('styles/components.css', 'utf8');

// find .titled-image img
css = css.replace('.titled-image img {\n  width: 100%;\n  height: auto;', 
'.titled-image img {\n  width: 100%;\n  height: auto;\n  max-height: 400px;\n  object-fit: contain;');

// find .lb-image {
//   margin: 18px 0;
// }
// make sure margin has enough space at the bottom so it's not glued to the text below it!
// user said: "текста отдолу е твърде долепен до изображението"
css = css.replace('.titled-image {\n  margin: 0 auto;', '.titled-image {\n  margin: 0 auto 32px auto;');

fs.writeFileSync('styles/components.css', css);
console.log('patched css');
