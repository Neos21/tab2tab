/*! Tab2Tab */
((global, factory) => {
  if(typeof exports === 'object' && typeof module !== 'undefined') {  // CommonJS (Node.js)
    module.exports = factory();
  }
  else if(typeof define === 'function' && define.amd) {  // AMD
    define([], factory);
  }
  else {  // Browser Globals
    global.tab2tab = factory();
  }
})(this, () => {
  /**
   * タブ譜の1行を構築する
   * 
   * @param {string} text タブ文字で区切られた譜面の文字列
   * @return {string} ハイフンで整形した譜面の文字列
   */
  const convertLine = text => {
    // 行・列の二次元配列にする
    const cells = text.split('\n').map(line => line.split('\t'));
    // タブ文字が少ない行などがあってもループを回せるように、一番多い列数を取得する
    const longestLength = Math.max(...cells.map(row => row.length));
    
    // 各列の桁数を揃えておく (ハイフンでパディングする)
    for(let columnIndex = 0; columnIndex < longestLength; columnIndex++) {
      // 各列の文字数をカウントし一番多い文字数を取得する
      const longestColumnStringLength = Math.max(...cells.map(row => (row[columnIndex] ?? '').length));
      if(longestColumnStringLength === 0) {  // 当該列に一切値がなかった場合は、区切り用の列とみなす
        cells.forEach(row => row[columnIndex] = '|');
      }
      else {  // 右詰めでハイフンを付与する
        cells.forEach(row => row[columnIndex] = ('-'.repeat(longestColumnStringLength) + (row[columnIndex] ?? '')).slice(-longestColumnStringLength));
      }
    }
    
    // 行の定義と、先頭列に区切りを入れておく
    const addedCells = cells.map(() => ['|']);
    // 列間に隙間や区切りを入れるかどうか判定しながら処理していく
    for(let columnIndex = 0; columnIndex < longestLength; columnIndex++) {
      const columns = cells.map(row => row[columnIndex]);
      
      // 先頭列
      if(columnIndex === 0) {
        if(columns.map(cell => cell.toUpperCase()).some(cell => ['A', 'B', 'C', 'D', 'E', 'F', 'G'].some(character => cell.match(character)))) {
          // 音階名がある場合、音階のあとに区切りを入れる
          addedCells.forEach((row, rowIndex) => row.push(columns[rowIndex], '|-'));
        }
        else {
          // 音階名がなければ手前にも隙間を置く
          addedCells.forEach((row, rowIndex) => row.push('-', columns[rowIndex], '-'));
        }
        // 先頭列が同時に末尾列の場合、最後に区切りを入れる
        if(columnIndex === longestLength - 1) {
          addedCells.forEach(row => row.push('|'));
        }
        continue;
      }
      // 末尾列の場合、最後に区切りを入れる
      if(columnIndex === longestLength - 1) {
        addedCells.forEach((row, rowIndex) => row.push(columns[rowIndex], '-|'));
        continue;
      }
      
      // 当該列のどこかにグリッサンド・スライド・ハンマリングオン・プリングオフ・チョーキングアップ・チョーキングダウン記号があれば、次の列との空白を作らない
      if(columns.some(cell => ['g', 's', 'h', 'p', 'c', 'd'].includes(cell))) {
        addedCells.forEach((row, rowIndex) => row.push(columns[rowIndex]));
        continue;
      }
      // 次の列のどこかに記号があれば、次の列との空白を作らない (次の列にグリッサンドがある場合は空白を作るようにする)
      const nextColumns = cells.map(row => row[columnIndex + 1]);
      if(nextColumns.some(nextCell => ['s', 'h', 'p', 'c', 'd'].includes(nextCell))) {
        addedCells.forEach((row, rowIndex) => row.push(columns[rowIndex]));
        continue;
      }
      
      // 通常の列は、後ろに1文字分の隙間を置く
      addedCells.forEach((row, rowIndex) => row.push(columns[rowIndex], '-'));
    }
    
    // 列・行を結合する
    return addedCells.map(row => row.join('')).join('\n');
  };
  
  /**
   * Tab2Tab : タブ譜を構築する
   * 
   * @param {string} text タブ文字で区切られた譜面の文字列
   * @return {string} ハイフンで整形した譜面の文字列
   */
  const tab2tab = text => text
    .replace((/^\n*/), '')                    // 先頭の改行を削る
    .replace((/\n*$/), '')                    // 末尾の改行を削る
    .split('\n')                              // 行ごとに分割する
    .map(line => line.replace((/\t+$/), ''))  // 各行末の連続するタブ文字は削除する・あわせてタブ文字のみの行は空行とみなせるようにする
    .join('\n')                               // 一度結合する
    .replace((/\n{3,}/g), '\n\n')             // 3つ以上の改行は2つに直す
    .split('\n\n')                            // 空行で区切り配列に分割する
    .map(convertLine)                         // 配列の要素ごとに譜面を作る
    .join('\n\n');                            // 空行を開けて連結する
  
  return tab2tab;
});
