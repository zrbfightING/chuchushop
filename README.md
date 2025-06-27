# 楚楚小店 - 微信小程序（动态商品管理版）

## 项目简介
楚楚小店是一个简洁温馨的微信小程序，用于展示和贩卖商品。**商品数据由独立 server 提供，小程序端实时获取，无需每次上架/修改商品都重新发布小程序。**

---

## 目录结构
```
├── app.js
├── app.json
├── app.wxss
├── server/                 # 商品API服务端
│   ├── index.js
│   └── package.json
├── pages/
│   ├── index/
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── detail/
│       ├── detail.js
│       ├── detail.json
│       ├── detail.wxml
│       └── detail.wxss
└── README.md
```

---

## 部署方法

### 1. 启动商品API服务端

1. 进入 `server/` 目录，安装依赖并启动服务：
   ```bash
   cd server
   npm install
   npm start
   ```
   默认监听 3000 端口。你可以将其部署到云服务器、Vercel、Railway 等平台。

2. **商品图片**  
   - 商品图片需使用公网可访问的图片链接（如七牛云、OSS、GitHub、Vercel 静态资源等）。
   - 在 `server/index.js` 的 `products` 数组中，`image` 字段填写图片的完整 URL。

### 2. 配置小程序端 API 地址

- 在 [`pages/index/index.js`](pages/index/index.js) 和 [`pages/detail/detail.js`](pages/detail/detail.js) 中，将
  ```
  http://localhost:3000
  ```
  替换为你实际部署的 server 地址（如 `https://your-domain.com`）。

### 3. 导入并预览小程序

- 打开微信开发者工具，导入本项目目录，AppID 可用测试号。
- 预览即可实时获取 server 上的商品数据。

---

## 如何上架/修改商品

1. 打开 [`server/index.js`](server/index.js) 文件，找到 `products` 数组。
2. 按如下格式添加或修改商品对象：

```js
{
  id: 4,
  name: "商品名称",
  image: "https://your-image-host/your_image.jpg",
  price: 99,
  desc: "商品详细介绍"
}
```
- `id`：每个商品唯一编号，不能重复。
- `name`：商品名称。
- `image`：商品图片公网链接。
- `price`：商品价格（数字）。
- `desc`：商品详细介绍。

3. 保存后，重启 server 服务（或支持热更新的可直接生效）。
4. 小程序端刷新即可看到最新商品内容，无需重新发布小程序。

---

## 进阶：后台管理
如需更方便的商品管理，可在 server 端扩展商品的增删改接口，配合简单的管理后台或 Postman 操作。

---

## 页面风格
- 整体风格简洁、温馨，色调柔和，适合小店展示。

---

如有疑问可参考微信官方文档或联系开发者。