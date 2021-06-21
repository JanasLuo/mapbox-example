/*
 * @Date: 2021-06-21 19:00:48
 * @LastEditors: mark
 * @LastEditTime: 2021-06-21 19:03:38
 * @Description: Do not edit
 */

// import mapboxgl from 'mapbox-gl'
// import Bean from 'src/beans'
import { formartFeatures, formartFeaturesByDate, formartGeo, getCenter } from './format'
class SectionMap {
  constructor(map, data) {
    this.map = map;
    this.data = null;
    this.addMapLay = this.addMapLay.bind(this);
    this.removeMapLay = this.removeMapLay.bind(this);
    this.filterBy = this.filterBy.bind(this);
    // this.dataUrl = Bean.ISERVER_BASE_PATH;
  }
  addMapLay(data, value, type, color) {

    let features = type == 1 ? formartFeatures(data, value, 'LineString') : formartFeaturesByDate(data, value, 'LineString')
    console.log('SectionMap features', features)
    this.map.addLayer({
      "id": "SectionMap",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": features
      },
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      "paint": {
        "line-color": '#5bf9ff',
        // "line-color": {
        //   'type': 'identity',
        //   'property': 'color'
        // }, /* 填充的颜色 */
        "line-width": 4,
        'line-blur': 0,
        "line-opacity": 1,     /* 透明度 */
        // "line-opacity": [
        //   'case',
        //   ['boolean', ['feature-state', 'hover'], false],
        //   0.4,
        //   0.3
        // ]
      },
    });
    this.map.addLayer({
      "id": "addSectionMap",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": []
        }
      },
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      "paint": {
        "line-color": 'red',
        "line-width": 2,
        'line-blur': 0,
        "line-opacity": 1      /* 透明度 */
      },
    });
    type == 1 && this.filterBy(0);
  }
  addSectionLayer(data, color) {

    let features = []
    let x = 0
    let y = 0
    data.forEach((item) => {
      let zb = formartGeo(item)
      let obj = {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'properties': {
            'center': getCenter(zb)
          },
          'coordinates': zb
        }
      }
      x += getCenter(zb)[0]
      y += getCenter(zb)[1]
      features.push(obj)
    })
    let centerx = x / data.length
    let centery = y / data.length
    this.map.addLayer({
      "id": "addSectionMap",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": features
        }
      },
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      "paint": {
        "line-color": color ? color : 'rgb(0, 255, 255)',
        "line-width": 8,
        'line-blur': 2,
        "line-opacity": 1      /* 透明度 */
      },
    });
    const config = JSON.parse(window.localStorage.getItem('profile')).config
    const zoom = config ? config.map_zoom : 13
    setTimeout(() => {
      this.map.flyTo({
        center: [centerx, centery],
        zoom,
        speed: 0.5
      })
    }, 500)
    return [centerx, centery]
  }
  filterBy(time) {
    let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]];
    if (this.map.getLayer("SectionMap")) {
      this.map.setFilter('SectionMap', filters);
    }
  }
  removeMapLay(hideLoader) {
    if (this.map.getLayer("SectionMap")) {
      this.map.removeLayer("SectionMap");
      this.map.removeSource("SectionMap");
    }
    if (this.map.getLayer("addSectionMap")) {
      this.map.removeLayer("addSectionMap");
      this.map.removeSource("addSectionMap");
    }
  }
}
export default SectionMap;

