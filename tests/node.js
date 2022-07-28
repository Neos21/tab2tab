/** Node.js での利用サンプル・兼・動作テスト */

const fs = require('fs');
const path = require('path');
const tab2tab = require('../index');

// Google Spread Sheets などで書いたタブ区切りのタブ譜
const text = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');

// 変換して出力する
const tab = tab2tab(text);
console.log(tab);
