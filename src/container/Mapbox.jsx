import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import * as ReactDOM from 'react-dom'
import 'mapbox-gl/dist/mapbox-gl.css' // 必须使用 不然会有问题 比如marker位置不正确
import { mockRoad , mockPolygon } from './mock'
export default function Mapbox() {
  const mapRef = useRef()
  const stateObj =  useRef({
    circleList:[]
  })
  useEffect(()=>{
    initMap()
    return destory
  },[])
 
  // 初始化map
  const initMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFuYXNsdW8iLCJhIjoiY2p6d2R0dnQxMGw1OTNjcWltdzg5NzRzeCJ9.OQx44V543mOsS8RerbiIdQ';
    mapRef.current = new mapboxgl.Map({
      container: 'map', // container ID
      // style: 'mapbox://styles/mapbox/streets-v11', // style URL
      style: {
        version: 8,
        glyphs: '/font/{fontstack}/{range}.pbf',
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['/darkblue_whhb/tiles/{z}/{x}/{y}.png'],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 9,
            maxzoom: 18
          }
        ]
      },
      // center: [-74.5, 40], // starting position [lng, lat]
      center: [114.298572,30.584355], // 武汉 
      zoom: 9, // starting zoom，
      minZoom: 9,
      maxZoom: 16
    });
    mapRef.current.on('load', () => {
      mapLoaded()
    })
  }
  const destory = () => {
    mapRef.current.remove()
  }
  // 地图加载完
  const mapLoaded = () => {
    // const curBounds = map.current.getBounds()
    const mockMarker = {
      name:'marker',
      center: [114.298572, 30.584355],
      num: 10
    }
    showPolymerization(mockMarker)
    addRoad()
    addPolygon()
  }
  // 显示marker
  const showPolymerization = (data) => {
      if (!data.center || data.num === 0) {
        return
      }
      const el = document.createElement('div')
      ReactDOM.render(
        <div style={{color:'red',width:100,height:100}}>
          <div>{data.name}</div>
          <div>
            <span className="type-word">
              演示
            </span>
          </div>
        </div>,
        el
      )
      el.className = 'situation'
  
      const [lag, lat] = data.center
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lag, lat])
        .addTo(mapRef.current)
      console.log(marker,'marker')
      // 保存marker 用于删除
      stateObj.current.circleList.push(marker)
      // 点击事件
      el.addEventListener('click', async () => {
        console.log(123)
      })
  }

  // 添加线
  const addRoad = () => {
    const map  = mapRef.current
    // 添加数据资源
    map.addSource('line', {
      type: 'geojson',
      lineMetrics: true,
      data: mockRoad
    });
    // 添加layer
    map.addLayer({
        type: 'line',
        source: 'line',
        id: 'line',
        paint: {
          'line-color': 'red',
          'line-width': 4,
          // 'line-gradient' must be specified using an expression
          // with the special 'line-progress' property
          'line-gradient': [
          'interpolate',
          ['linear'],
          ['line-progress'],
          0,
          'blue',
          0.1,
          'royalblue',
          0.3,
          'cyan',
          0.5,
          'lime',
          0.7,
          'yellow',
          1,
          'red'
          ]
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      });
  }
  // 添加面
  const addPolygon = () => {
    const map  = mapRef.current
    // 添加资源
    map.addSource('maine', {
      type: 'geojson',
      data: mockPolygon
    });
    // 添加面
    map.addLayer({
      'id': 'maine',
      'type': 'fill',
      'source': 'maine', // reference the data source
      'layout': {},
      'paint': {
      'fill-color': '#0080ff', // blue color fill
      'fill-opacity': 0.5
      }
    });
    // 添加线
    map.addLayer({
      'id': 'outline',
      'type': 'line',
      'source': 'maine',
      'layout': {},
      'paint': {
      'line-color': '#FF9431',
      'line-width': 3
      }
    });
  }
  return <div id="map" style={{width:'100%',height:'100%'}}>
    
  </div>
}