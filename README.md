# 楚楚小店 - 微信小程序

## 项目简介
楚楚小店是一个简洁温馨的微信小程序，用于展示和贩卖商品。首页展示商品图片和价格，点击可查看详细介绍。

---

## 目录结构
```
├── app.js
├── app.json
├── app.wxss
├── data/
│   └── products.js      # 商品数据
├── images/              # 商品图片（需自行添加）
│   ├── soap.jpg
│   ├── mug.jpg
│   └── scarf.jpg
└── pages/
    ├── index/
    │   ├── index.js
    │   ├── index.json
    │   ├── index.wxml
    │   └── index.wxss
    └── detail/
        ├── detail.js
        ├── detail.json
        ├── detail.wxml
        └── detail.wxss
```

---

## 部署方法

1. **安装微信开发者工具**  
   下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。

2. **导入项目**  
   - 打开微信开发者工具，选择“导入项目”。
   - 选择本项目文件夹作为项目目录。
   - 设置 AppID（可用测试号），项目名称自定义。

3. **添加商品图片**  
   - 在 `images/` 目录下，添加商品图片文件（如 `soap.jpg`、`mug.jpg`、`scarf.jpg`）。
   - 图片文件名需与 `data/products.js` 中的 `image` 字段一致。

4. **预览与上传**  
   - 在微信开发者工具中点击“预览”即可在手机上查看效果。
   - 完善后可上传并发布小程序。

---

## 如何上架/添加商品

1. 打开 [`data/products.js`](data/products.js) 文件。
2. 按如下格式添加商品对象到 `list` 数组中：

```js
{
  id: 4,
  name: "商品名称",
  image: "/images/your_image.jpg",
  price: 99,
  desc: "商品详细介绍"
}
```
- `id`：每个商品唯一编号，不能重复。
- `name`：商品名称。
- `image`：商品图片路径，需放在 `images/` 目录下。
- `price`：商品价格（数字）。
- `desc`：商品详细介绍。

3. 保存后，刷新小程序即可看到新商品。

---

## 页面风格
- 整体风格简洁、温馨，色调柔和，适合小店展示。

---

如有疑问可参考微信官方文档或联系开发者。