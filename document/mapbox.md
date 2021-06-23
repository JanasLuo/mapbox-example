<!--
 * @Date: 2021-04-23 11:31:56
 * @LastEditors: mark
 * @LastEditTime: 2021-06-23 15:43:19
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
- 使用 getBounds 配合获取四个点后端减少渲染请求
- 是因为 DivIcon 的实现原理是在 HTML 页面中添加 DOM 元素，并在地图平移、缩放时不断的修改 DOM 元素的属性，而大量添加和修改 DOM 元素会拉低浏览器的显示性能，出现卡顿等现象。

# 问题

1. 图片重叠
   在 addLayer 的 layout 对象中，添加 "icon-allow-overlap": true //自动避让属性
2. 图片定位不准，显示位置不对（使用 marker 添加图片，因为图片的中心点无法计算，所以会无法确定图片的定位）
   使用 css 的 div 嵌套父子关系，父级宽高 1，负责定位到地图上，子级通过 positon absolute 确定要显示的位置，这样可以灵活控制图片位置
3. layer 之间的层叠关系
   可以使用 addLayer 的第二个参数,beforeId（也就是 addLayer 的时候 使用的 id）
   > beforeId 要在之前插入新图层的现有图层的 ID，导致新图层在视觉上出现在现有图层下方。如果未指定此参数，则图层将附加到图层数组的末尾，并在视觉上显示在所有其他图层之上。
   > 详情可以查看文档 https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer
4. 添加地图阴影，使地图立体
   使用 addLayer 的第二个参数,beforeId，添加一个新的图层到地图下方，并对数据的经纬度进行向下、向右的偏移即可
