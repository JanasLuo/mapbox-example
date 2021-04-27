<!--
 * @Date: 2021-04-23 11:31:56
 * @LastEditors: mark
 * @LastEditTime: 2021-04-27 11:28:43
 * @Description: 分享内容
 * 0. 分享当前地图做过到一些效果
 * 1. mapbox/leaflet从0到1
 * 2. mapbox/leaflet配置
 * 3. mapbox/leaflet绘制点线面
 * 4. 使用geojson.io工具获取地图数据
 * 5. 地图知识
 * 6. 其他工具 L7
-->

# 工具

- geojson.io
- dataV

# mapbox

### 安装

npm install mapbox-gl --save

### 文档

- api
  https://docs.mapbox.com/mapbox-gl-js/api/
- 演示文档
  https://docs.mapbox.com/mapbox-gl-js/example/

### 完成过的功能

- 绘制多边形、圆形
- 剖面图
- 立体效果图

### 其他、性能

- canvas 性能优于 svg
- marker 默认都是 div 添加，可以使用插件转为 canvas 添加
- 使用 getBounds 配合后端减少渲染请求
- 是因为 DivIcon 的实现原理是在 HTML 页面中添加 DOM 元素，并在地图平移、缩放时不断的修改 DOM 元素的属性，而大量添加和修改 DOM 元素会拉低浏览器的显示性能，出现卡顿等现象。
