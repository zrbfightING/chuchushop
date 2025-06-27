// server/download-image.js
// 用法：node download-image.js <图片URL> <保存文件名>
const fs = require('fs');
const path = require('path');
const axios = require('axios');

if (process.argv.length < 4) {
  console.log('用法: node download-image.js <图片URL> <保存文件名>');
  process.exit(1);
}

const url = process.argv[2];
const filename = process.argv[3];
const savePath = path.join(__dirname, 'images', filename);

axios({
  method: 'get',
  url: url,
  responseType: 'stream',
  headers: {
    'User-Agent': 'Mozilla/5.0',
    'Referer': url // 有些站点需要
  }
}).then(response => {
  response.data.pipe(fs.createWriteStream(savePath))
    .on('finish', () => {
      console.log('图片已保存到', savePath);
    });
}).catch(err => {
  console.error('下载出错:', err.message);
  console.log('如多次失败，请用浏览器手动下载图片后放到 server/images/ 目录。');
});