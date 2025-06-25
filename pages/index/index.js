// pages/index/index.js
const products = require('../../data/products.js');

Page({
  data: {
    products: []
  },
  onLoad() {
    this.setData({
      products: products.list
    });
  },
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  }
});