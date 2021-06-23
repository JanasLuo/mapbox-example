/*
 * @Date: 2021-06-23 15:20:28
 * @LastEditors: mark
 * @LastEditTime: 2021-06-23 15:21:45
 * @Description: Do not edit
 */

import turf from 'turf';
import MapboxCircle from 'mapbox-gl-circle'
class Circle {
  constructor(map, center, handler) {
    this.map = map;
    this.lngLat = center
    this.circleCenterChanged = handler.circleCenterChanged
    this.circleRadiusChanged = handler.circleRadiusChanged
    this.removeMapLay = this.removeCircle.bind(this);
    this.drawCircle = this.drawCircle.bind(this);
    this.myCircleList = [];
    this.myCircle = null
  }
  boundsTo5percentRadius(bounds) {
    const radius = Math.round(
      turf.distance(bounds.getSouthWest().toArray(), bounds.getNorthEast().toArray(), 'meters') * .05);
    return radius
  }
  drawCircle = () => {
    if (!this.lngLat) {
      return
    }
    const that = this

    // const radius = this.boundsTo5percentRadius(this.map.getBounds())
    // console.log(radius, this.map.getBounds(), 'this.map.getBounds()')
    const myCircle = new MapboxCircle(this.lngLat, 80, {
      editable: true,
      minRadius: 80,
      strokeColor: '#1890ff',
      strokeOpacity: 0.7,
      strokeWeight: 4,
      refineStroke: true,
      fillColor: localStorage.getItem('mapTheme') == 'darkblue' ? "#ccc" : "#333",
      fillOpacity: 0.1
    }).addTo(this.map);
    // .once('click', function (mapMouseEvent) {
    //   console.log('Click:', mapMouseEvent);
    //   // that.removeCircle()
    // })
    this.myCircleList.push(myCircle)

    myCircle.on('centerchanged', (circleObj) => {
      this.circleCenterChanged && this.circleCenterChanged(circleObj.getCenter())
    });

    myCircle.on('radiuschanged', (circleObj) => {
      this.circleRadiusChanged && this.circleRadiusChanged(circleObj.getRadius())
    });

    // myCircle.on('click', (mapMouseEvent) => {

    //   mapMouseEvent.originalEvent.stopPropagation()
    //   mapMouseEvent.originalEvent.preventDefault();
    // });
  }
  removeCircle() {
    const myCircleList = this.myCircleList
    for (const item of myCircleList) {
      item.remove()
    }
    this.myCircleList = []
  }
}
export default Circle;
