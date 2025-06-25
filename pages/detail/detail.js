// pages/detail/detail.js
const products = require('../../data/products.js');

Page({
  data: {
    product: {}
  },
  onLoad(options) {
    const id = Number(options.id);
    const product = products.list.find(item => item.id === id);
    if (product) {
      this.setData({ product });
    }
  }
});