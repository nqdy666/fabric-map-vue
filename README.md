# fabric-map-vue

[![version](https://img.shields.io/npm/v/fabric-map-vue.svg)](https://www.npmjs.com/package/fabric-map-vue)
[![download](https://img.shields.io/npm/dm/fabric-map-vue.svg)](https://www.npmjs.com/package/fabric-map-vue)
[![license](https://img.shields.io/github/license/nqdy666/fabric-map-vue.svg)](https://github.com/nqdy666/fabric-map-vue/blob/dev/LICENSE)

> 基于fabric的地图定位，SVG热力地图

基于 [fabricjs](http://fabricjs.com/) v2.4.5 开发，热力图基于 [heatmap.js](https://www.patrick-wied.at/static/heatmapjs/) v2.0.5+ 开发，依赖 [Vue.js](https://vuejs.org/) v2.2.6+.

#### 特性
- IE9+
- Support Typescript
- Auto resize
- 热力地图
- 地图定位
- 距离绘制
- 地图切换

## 文档
- **[Demo](https://nqdy666.github.io/fabric-map-vue/)**
- **[Example on JSBin](https://jsbin.com/hukeko/edit?html,css,js,output)**

## 功能预览

**热力地图 [示例源码](https://github.com/nqdy666/fabric-map-vue/blob/dev/docs/pages/index.vue)**

![热力地图](docs/assets/images/heatmap.gif)

**缩放类型 [示例源码](https://github.com/nqdy666/fabric-map-vue/blob/dev/docs/pages/zoom.vue)**

![缩放类型](docs/assets/images/zoom.gif)

**地图定位 [示例源码](https://github.com/nqdy666/fabric-map-vue/blob/dev/docs/pages/coord.vue)**

![地图定位](docs/assets/images/coord.gif)

**距离绘制 [示例源码](https://github.com/nqdy666/fabric-map-vue/blob/dev/docs/pages/distance.vue)**

![距离绘制](docs/assets/images/distance.gif)

**地图切换 [示例源码](https://github.com/nqdy666/fabric-map-vue/blob/dev/docs/pages/mapswitch.vue)**

![地图切换](docs/assets/images/mapswitch.gif)

**背景设置 [示例源码](https://github.com/nqdy666/fabric-map-vue/blob/dev/docs/pages/background.vue)**

![背景设置](docs/assets/images/background.gif)

## 安装

#### NPM
安装npm包.

```bash
$ npm install fabric-map-vue
```

先需要引用fabric.js

```html
<script script="https://cdn.jsdelivr.net/npm/fabric-map-vue@0.0.8/dist/fabric.min.js"></script>
```

组件注册

```js
import Vue from 'vue'
import FabricMapVue from 'fabric-map-vue'
Vue.use(FabricMapVue)
```

现在可以使用该组件

```html
<fabric-map-vue svg-map-url="https://qiniu.qjzd.net/cf.svg"></fabric-map-vue>
```

#### CDN

包含 `vue` 、`fabric.js`、`heatmap.js`、 `fabric-map-vue.js`、`fabric-map-vue.css`

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fabric-map-vue@0.0.8/dist/fabric-map-vue.css"/>
```

```html
<script src="https://cdn.jsdelivr.net/npm/vue@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/fabric-map-vue@0.0.8/dist/fabric.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/heatmap.js@2.0.5/build/heatmap.min.js"></script>
<!-- 使用最新版本 -->
<script src="https://cdn.jsdelivr.net/npm/fabric-map-vue@latest"></script>
<!-- 或指定某一个版本 -->
<script src="https://cdn.jsdelivr.net/npm/fabric-map-vue@0.0.8"></script>
```

现在可以使用该组件

```html
<fabric-map-vue svg-map-url="https://qiniu.qjzd.net/cf.svg"></fabric-map-vue>
```

## 本地开发

开发
```bash
$ npm i
$ npm run docs-dev
```

发布
```bash
$ npm install -g babel-cli@6.26.0
$ npm install -g rollup@0.67.3
$ chmod a+x scripts/build
$ npm run release
$ git push --follow-tags origin dev && npm publish
```
如果您使用的是windows系统，您不能直接执行`npm run release`，您需要安装git bash软件，然后使用git bash执行命令`./scripts/build`和`npm run release:only`。

文档发布
```bash
$ npm install -g gh-pages
$ chmod a+x scripts/docs-publish
$ npm run docs-publish
```
如果您使用windows系统，您不能直接执行`npm run docs-publish`，您需要安装git bash软件，然后使用git bash执行`./scripts/docs-publish`命令。

## 捐赠
如果你觉得有用，您可以请我们喝杯咖啡。

<img width="650" src="https://raw.githubusercontent.com/nqdy666/fabric-map-vue/dev/docs/assets/images/qrcode-donation.png" alt="donation">

## 许可证

[MIT](https://github.com/nianqin/fabric-map-vue/blob/dev/LICENSE.md)

Copyright (c) 2019-present, Qin Nian
