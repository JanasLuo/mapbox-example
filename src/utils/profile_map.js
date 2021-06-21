/*
 * @Date: 2021-06-20 17:16:25
 * @LastEditors: mark
 * @LastEditTime: 2021-06-20 18:02:26
 * @Description: Do not edit
 */

class ProfileMap {
  constructor(map, data) {
    this.map = map;
    this.data = null;
    this.addMapLay = this.addMapLay.bind(this);
    this.removeMapLay = this.removeMapLay.bind(this);
    // this.dataUrl = Bean.ISERVER_BASE_PATH;
    this.index = 0
    this.sufs = []
    this.colors = {
      style0: {
        fill: "#ffffff",
        'fill-opacity': 1,
        stroke: "#555555",
        'stroke-opacity': 1,
        'stroke-width': 1,
      },
      style1: {
        fill: "#accdf4",
        "fill-opacity": 1,
        stroke: "#555555",
        "stroke-opacity": 1,
        "stroke-width": 0.3,
      },
      style2: {
        fill: "#accdf4",
        'fill-opacity': 1,
        stroke: "#555555",
        'stroke-opacity': 1,
        'stroke-width': 0.3,
      },
      style3: {
        fill: "#aafbb8",
        "fill-opacity": 1,
        stroke: "#555555",
        "stroke-opacity": 1,
        "stroke-width": 0.3,
      },
      style4: {
        fill: "#fbfbbd",
        'fill-opacity': 1,
        stroke: "#555555",
        'stroke-opacity': 1,
        'stroke-width': 0.3,
      },
      style5: {
        fill: "#fae0fc",
        "fill-opacity": 1,
        stroke: "#555555",
        "stroke-opacity": 1,
        "stroke-width": 0.3,
      }
      ,
      style6: {
        fill: "#dcf4fc",
        "fill-opacity": 0.5,
        stroke: "#555555",
        "stroke-opacity": 1,
        "stroke-width": 0.3,
      }, style7: {
        fill: "#dcf4fc",
        "fill-opacity": 0.5,
        stroke: "#555555",
        "stroke-opacity": 1,
        "stroke-width": 0.3,
      }, style8: {
        fill: "#dcf4fc",
        "fill-opacity": 0.5,
        stroke: "#555555",
        "stroke-opacity": 1,
        "stroke-width": 0.3,
      }, style9: {
        fill: "#dcf4fc",
        "fill-opacity": 0.5,
        stroke: "#555555",
        "stroke-opacity": 1,
        "stroke-width": 0.3,
      }, style10: {
        fill: "#dcf4fc",
        "fill-opacity": 0.5,
        stroke: "#555555",
        "stroke-opacity": 1,
        "stroke-width": 0.3,
      }, style11: {
        fill: "#dcf4fc",
        "fill-opacity": 0.5,
        stroke: "#555555",
        "stroke-opacity": 1,
        "stroke-width": 0.3,
      }
    }
  }
  randomAnchor() {
    const w = this.index % 2
    this.index++
    // console.log(w, this.index)
    if (w === 0) {
      return 'top-left'
    } else {
      return 'bottom-right'
    }

  }
  addMapLay(data, suf, before) {
    this.sufs.push(suf)
    this.removeMapLay(suf)
    // console.log(data, 'data')

    const map = this.map
    // const color =
    // console.log(GeoUtil, 'GeoUtil')
    //   localStorage.getItem('mapTheme') === 'darkblue' ? '#fcf9f2' : '#000'
    // const coordinates = []
    // console.log(data, 'data')
    // 转换逻辑
    // for (const item of data.geometry.coordinates) {
    //   // GeoUtil.transform({ lat: Number(data[1]), lng: Number(data[0]) }, "wgs84", "gcj02");
    //   // console.log(item, 'item')
    //   const arr = []
    //   for (const points of item) {
    //     const a = GeoUtil.transform({
    //       lng: points[0],
    //       lat: points[1]
    //     }, 'bd09ll', 'wgs84')
    //     arr.push([a.lng, a.lat])
    //   }
    //   coordinates.push(arr)
    // }
    // data.geometry.coordinates = coordinates
    // console.log(data, 'data----')
    this.map.addSource('SpecialStates' + suf, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: data.geometry
      }
    });

    this.map.addLayer({
      "id": 'ProfileMap' + suf,
      "type": "fill",
      "source": 'SpecialStates' + suf,
      "paint": {
        "fill-opacity": data.properties['fill-opacity'] || this.colors[data.properties['color-type']]['fill-opacity'],
        "fill-color": data.properties.fill || this.colors[data.properties['color-type']].fill
      }
    }, before);

    this.map.addLayer({
      id: 'SpecialBorder' + suf,
      type: 'line',
      source: 'SpecialStates' + suf,
      layout: {},
      paint: {
        'line-color': data.properties.stroke || this.colors[data.properties['color-type']]['stroke'],
        'line-width': data.properties['stroke-width'] || this.colors[data.properties['color-type']]['stroke-width'],
        'line-opacity': data.properties['stroke-opacity'] || this.colors[data.properties['color-type']]['stroke-opacity']
      }
    }, before);

    // return data
  }
  removeAllMaplay() {
    for (const item of this.sufs) {
      this.removeMapLay(item)
    }
    this.sufs = []
  }
  removeMapLay(suf = '') {

    if (this.map.getLayer("ProfileMap" + suf)) {
      // console.log('remove1')
      this.map.removeLayer("ProfileMap" + suf);
    }
    if (this.map.getLayer("count" + suf)) {
      // console.log('remove2')
      this.map.removeLayer("count" + suf);
      this.map.removeSource("count" + suf);
    }
    if (this.map.getLayer("SpecialBorder" + suf)) {
      // console.log('remove3')
      this.map.removeLayer("SpecialBorder" + suf);
    }
    if (this.map.getSource("SpecialStates" + suf)) {
      // console.log('remove4')
      this.map.removeSource("SpecialStates" + suf);
    }
  }
}
export default ProfileMap;
