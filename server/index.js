// server/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const PRODUCTS_PATH = path.join(__dirname, 'products.json');

// 读取商品数据
function getProducts() {
  try {
    const data = fs.readFileSync(PRODUCTS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

app.use(express.static(__dirname)); // 允许访问本地静态文件（如 house.png）

// 静态网页展示
app.get('/web', (req, res) => {
  res.sendFile(path.join(__dirname, 'shop.html'));
});

// 新增 /shop 路由，兼容直接访问
app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'shop.html'));
});

// 获取所有商品
app.get('/products', (req, res) => {
  res.json(getProducts());
});

// 获取单个商品
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: '商品未找到' });
  }
});

// 可选：添加/编辑/删除商品接口（如需后台管理）

app.listen(PORT, () => {
  console.log(`楚楚小店商品API已启动，端口：${PORT}`);
});