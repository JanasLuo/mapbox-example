/*
 * @Date: 2021-04-27 11:17:09
 * @LastEditors: mark
 * @LastEditTime: 2021-04-27 14:24:30
 * @Description: Do not edit
 */
import * as L from 'leaflet'
// import 'proj4'
// import 'proj4leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect } from 'react'
// import mapStore from 'src/stores/modules/map'
// import Bus from 'src/utils/eventBus'
// import { parseWkt } from 'src/utils/map_layer/format.js'
// import './index.styl'
const LeafletMap = (props) => {
  // 初始化地图
  function initMap() {
   
    const mapOptions = {
      preferCanvas: true,
      center: [30.584355,114.298572],// 地图初始化中心点
      zoom: 9, // starting zoom，
      minZoom: 9,
      maxZoom: 16,
      attributionControl: false, // 是否去除右下角标志
      zoomControl: false

    }
    // if (config.map_type === 'EPSG:4326') {
    //   initMapCrs(config, mapOptions)
    // }
    const map = L.map('leafletMap', mapOptions)
    console.log(map,'map')
    initMapEvents(map)
    // map.setView([mapstate.center[1], mapstate.center[0]], mapstate.zoom)
    // const url = mapstate.style.sources['raster-tiles'].tiles[0]
    const baseLayer = L.tileLayer('/darkblue_whhb/tiles/{z}/{x}/{y}.png', {
      maxZoom: 18
    })
    baseLayer.addTo(map)
    // 缩放控制器放右下角
    // L.control
    //   .zoom({
    //     position: 'bottomright'
    //   })
    //   .addTo(map)
    // mapStore.leafletMapObj = map
  }

  /* 初始化地图事件 */
  function initMapEvents(map) {
    // map.on('load', () => {
    //   initMapInfo(map)
    // })
    // map.on('moveend', () => {
    //   Bus.emit('dragend', map)
    // })
    // map.on('zoomend', () => {
    //   Bus.emit('zoomend', map)
    // })
  }
  /**
   * 初始化map当前 zoom、center、bound信息
   *
   */
  function initMapInfo(map) {
    mapStore.curBounds = map.getBounds()
    mapStore.curCenter = map.getCenter()
    mapStore.curZoom = map.getZoom()
  }
  // getBounds
  // EPSG:4326投影配置
  // function initMapCrs(config, mapOptions) {
  //   if (config.map_crs) {
  //     // 有比例尺和图片尺寸配置
  //     const crs = new L.Proj.CRS(
  //       'EPSG:4326',
  //       '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
  //       {
  //         origin: config.map_crs.origin,
  //         resolutions: config.map_crs.resolutions
  //       }
  //     )
  //     mapOptions.crs = crs
  //   } else {
  //     mapOptions.crs = L.CRS.EPSG4326
  //   }
  // }
  useEffect(() => {
    initMap()
  }, [])
  return (
    <div className="leaflet-map-container" style={{width:'100%',height:'100%'}}>
      <div id="leafletMap" className="leaflet-map" style={{width:'100%',height:'100%'}}></div>
    </div>
  )
}

export default LeafletMap
