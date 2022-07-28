#!/usr/bin/env node

/*! CLI 実行用 */

const fs = require('fs');
const tab2tab = require('./index');

const isExist = targetPath => {
  try {
    fs.statSync(targetPath);
    return true;
  }
  catch(_error) {
    return false;
  }
};

// Main
try {
  const filePath = process.argv[2];
  if(!filePath) return console.error('Tab2Tab : Please Input File Path');
  if(!isExist(filePath)) return console.error('Tab2Tab : The Input File Does Not Exist');
  const text = fs.readFileSync(filePath, 'utf-8');
  const tab = tab2tab(text);
  console.log(tab);
}
catch(error) {
  console.error('Tab2Tab : An Error Has Occured');
  console.error(error);
}
