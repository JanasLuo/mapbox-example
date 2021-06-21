import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import * as ReactDOM from 'react-dom'
import 'mapbox-gl/dist/mapbox-gl.css' // 必须使用 不然会有问题 比如marker位置不正确
import { mockRoad , mockPolygon } from './mock'
import {Button} from 'antd'
import './mapbox.less'
import nanAnZui from '@/assets/nan-an-zui.jpg'
import F1 from '@/assets/geo-json/f1.json' 
import ProfileMap from '@/utils/profile_map.js'
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
      zoom: 13, // starting zoom，
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
    // 获取屏幕左上、右上、右下、左下四个点，可以在显示点位等数据时，传给后端，要后端只显示屏幕内等数据，减少渲染
    const curBounds = mapRef.current.getBounds()
    console.log(curBounds,'curBounds')
    // const mockMarker = {
    //   name:'marker',
    //   center: [114.298572, 30.584355],
    //   num: 10
    // }
    // showPolymerization(mockMarker)
    // addRoad()
    // addPolygon()
    addFloorPic()
    addFloorData()
  }
  /**
   * 添加点线面一般都是先添加资源（addSource）
   * 然后再添加layer
   */
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
      // console.log(marker,'marker')
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
  /** */
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
  // 添加楼层剖面图图片 图片会固定在上下左右四个点上 随地图变动
  function addFloorPic () {
   mapRef.current.addSource('overlay', {
      type: 'image',
      url: nanAnZui,
      coordinates: [   
          [
            114.2847204208374,
            30.560468693004776
          ],
          [
            114.2847204208374,
            30.56638116950817
          ],
          [
            114.27738189697266,
            30.56638116950817
          ],[
            114.27738189697266,
            30.560468693004776
          ]
      ]
    })
   mapRef.current.addLayer(
      {
        id: 'overlay',
        source: 'overlay',
        type: 'raster',
        paint: { 'raster-opacity': 0.85 }
      },
      // 'SpecialMap' + mapObj.current.floorBefore 图片显示到哪个layer前面
    )
  }
  // 添加楼层剖面图数据 只有过南昌的 要注意数据格式
  function addFloorData () {
      // 剖面图对象
      const ProfileMapObj = new ProfileMap(mapRef.current)
      let i = 0
      while (i < F1.features.length) {
        ProfileMapObj.addMapLay(
          F1.features[i],
          'floor' + i,
          // 'SpecialMap' + mapObj.current.floorBefore
        )
        i++
      }

  }
  // 添加marker，div
  // 路径规划
    
  // 热力图
  // 蜂窝
  // 画圆、面
  /**
   * @description: 删除所有图层
   * @param {*}
   * @return {*}
   */  
  const clearAll = () => {
    // 清除撒点
    for(const item of stateObj.current.circleList) {
      item.remove()
    }
    stateObj.current.circleList = []
    // 清除线
    // 清除面
  }
  /**
   * @description: 点击按钮要执行的代码
   * @param {*} type
   * @return {*}
   */  
  const btnOption = (type) => {
    const map = mapRef.current
    switch (type) {
      case 1:
        const mockMarker = {
          name:'marker',
          center: [114.298572, 30.584355],
          num: 10
        }
        showPolymerization(mockMarker)
        break
      case 2: 
        addRoad()
        break
      case 3:
        addPolygon()
        break
      case 4:
        clearAll()
        break
      case 5:
        map.flyTo({
          zoom: 16,
          center: [114.298572, 30.584355],
          speed: 2
        })
          break
      case 6:
        map.flyTo({
          zoom: 16,
          center: [115.7878042881879, 28.627611233044647],
          speed: 2
        })
        break
    }
  }
  return <>  
  <div id="map" style={{width:'100%',height:'100%'}}></div>
  <div className="map-btns">
    <Button type="primary" onClick={()=>{btnOption(1)}}>点</Button>
    <Button type="primary" onClick={()=>{btnOption(2)}}>线</Button>
    <Button type="primary" onClick={()=>{btnOption(3)}}>面</Button>
    <Button type="primary" onClick={()=>{btnOption(5)}}>武汉</Button>
    <Button type="primary" onClick={()=>{btnOption(6)}}>南昌</Button>
    <Button type="primary" onClick={()=>{btnOption(4)}}>清除</Button>

  </div>
  </>

}