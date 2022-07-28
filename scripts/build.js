const fs   = require('fs');
const path = require('path');

console.log(new Date().toISOString(), 'Build Start');

const distDirectoryPath = path.resolve(__dirname, '../dist');
if(fs.existsSync(distDirectoryPath)) fs.rmdirSync(distDirectoryPath, { recursive: true });
fs.mkdirSync(distDirectoryPath);

// JS
fs.copyFileSync(path.resolve(__dirname, '../index.js'), path.resolve(__dirname, '../dist/tab2tab.js'));

// HTML : Replace Script Line
const html = fs.readFileSync(path.resolve(__dirname, '../tests/browser.html'), 'utf-8');
const scriptLine = '<script src="../index.js"></script>  <!-- Import Tab2Tab -->';
if(!html.match(scriptLine)) throw new Error('The Script Line Not Found');
const replacedHtml = html.replace(scriptLine, '<script src="./tab2tab.js"></script>');
fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), replacedHtml, 'utf-8');

// HTML Assets : HTML 中のパスは移動後の相対パスで既に書いてある
fs.copyFileSync(path.resolve(__dirname, '../readme-excel.png'), path.resolve(__dirname, '../dist/excel.png'));
fs.copyFileSync(path.resolve(__dirname, '../readme-google-spread-sheets.png'), path.resolve(__dirname, '../dist/google-spread-sheets.png'));

console.log(new Date().toISOString(), 'Build Finished');
