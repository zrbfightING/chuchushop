/**
 * pages/detail/detail.js
 * 商品详情页：从服务器动态获取商品详情
 */
Page({
  data: {
    product: {}
  },
  onLoad(options) {
    const id = Number(options.id);
    wx.request({
      url: `http://localhost:3000/products/${id}`, // 部署后请替换为你的服务器地址
      method: 'GET',
      success: (res) => {
        this.setData({ product: res.data });
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  }
});