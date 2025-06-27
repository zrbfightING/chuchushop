/**
 * pages/index/index.js
 * 商品列表页：从服务器动态获取商品数据
 */
Page({
  data: {
    products: []
  },
  onLoad() {
    wx.request({
      url: 'http://localhost:3000/products', // 部署后请替换为你的服务器地址
      method: 'GET',
      success: (res) => {
        this.setData({
          products: res.data
        });
      },
      fail: () => {
        wx.showToast({ title: '商品加载失败', icon: 'none' });
      }
    });
  },
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  }
});