import React, { useRef, useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
// import Mapbox from 'src/components/map/mapbox2.jsx'
import MapboxDraw from 'mapbox-gl-draw'
import mapboxgl from 'mapbox-gl'
// import Bus from 'src/utils/eventBus'
import wkt from 'terraformer-wkt-parser'
import { Input, message } from 'antd'
// import styl from './index.styl'
// import { parseWkt } from 'src/utils/map_layer/format.js'
// import dot from 'src/assets/dot.svg'
const { Search } = Input

//  部位管理-采集坐标地图内容
const DrawMap = (props) => {
  const { emitData, editData } = props
  const reg = /[A-Z]+\s?/gi
  const mapRef = useRef()
  const mapObj = useRef({
    map: null,
    draw: null,
    circleType: 0,
    markerDetail: [null, null, null, null]
  })
  // const zoomNum = useRef(12)
  const [zoomNum, setZoomNum] = useState(12)
  const circleData = useRef([null, null, null, null]) // 0左上 1右上 2左下 3右下 数据
  const [circleType, setCircleType] = useState(0) // 0左上 1右上 2左下 3右下
  useEffect(() => {
    // Bus.addListener('mapLoad', getMap)
    initMap()
    return willOut
  }, [])
  // 初始化map
  const initMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFuYXNsdW8iLCJhIjoiY2p6d2R0dnQxMGw1OTNjcWltdzg5NzRzeCJ9.OQx44V543mOsS8RerbiIdQ';
    mapRef.current = new mapboxgl.Map({
      container: 'map2', // container ID
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
      getMap(mapRef.current)
     
    })
  }
  const getMap = (map) => {
    mapObj.current.map = map
    initDraw()
  }

  const echoMap = (i, data) => {
    const feature = {
      id: editData.id + i,
      type: 'Feature',
      properties: {},
      geometry: JSON.parse(JSON.stringify(parseWkt(data)))
    }
    circleData.current[i] = feature
    mapObj.current.draw.add(feature)
    emitData(i, data)
    DetailMarker(circleData.current[i], i)
  }

  const initDraw = () => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: false,
        line_string: false,
        point: true,
        trash: true
      }
    })

    mapObj.current.map.addControl(draw)
    mapObj.current.draw = draw

    mapObj.current.map.on('draw.create', updateArea)
    mapObj.current.map.on('draw.delete', updateArea)
    mapObj.current.map.on('draw.update', updateArea)

    if (editData.floorUpperLeft) {
      echoMap(0, editData.floorUpperLeft)
    }
    if (editData.floorUpperRigth) {
      echoMap(1, editData.floorUpperRigth)
    }
    if (editData.floorLowerLeft) {
      echoMap(2, editData.floorLowerLeft)
    }
    if (editData.floorLowerRigth) {
      echoMap(3, editData.floorLowerRigth)
    }
    if (
      editData.floorUpperLeft !== null &&
      editData.floorUpperRigth !== null &&
      editData.floorLowerRigth !== null &&
      editData.floorLowerLeft !== null &&
      editData.floorProfilePath !== null
    ) {
      showPicture()
    }
  }

  const updateArea = (e) => {
    console.log('updateArea', e)
    const feature = e.features[0]

    if (e.type === 'draw.delete') {
      circleData.current.map((item, index) => {
        if (item !== null) {
          if (item.id === feature.id) {
            mapObj.current.draw.delete(item.id)
            closeMarkerDetail(index)
            circleData.current[index] = null
          }
        }
      })
    } else if (e.type === 'draw.create') {
      // 生成的时候 如果之前的点已经有了数据，那么删掉老得（只能保存一个的情况）
      const n = circleData.current[mapObj.current.circleType]
      if (n) {
        mapObj.current.draw.delete(n.id)
        closeMarkerDetail(mapObj.current.circleType)
      }
      circleData.current[mapObj.current.circleType] = feature
      DetailMarker(feature, mapObj.current.circleType)
    }

    let i = 0
    for (const item of circleData.current) {
      if (item) {
        const wktstr = 'POINT ' + wkt.convert(item.geometry).replace(reg, '')
        emitData(i, wktstr)
      } else {
        emitData(i, '')
      }
      i++
    }
  }

  function willOut() {
    Bus.removeListener('mapLoad', getMap)
  }

  // 经纬度搜索定位
  const flyTo = (value) => {
    const center = value.split(',')
    if (center && center[0] && center[1]) {
      mapObj.current.map.flyTo({
        center,
        zoom: 16,
        speed: 2
      })
    } else {
      message.error('请输入正确的经纬度')
    }
  }

  const changeType = (type) => {
    mapObj.current.circleType = type
    setCircleType(type)
  }

  // 添加点
  const DetailMarker = (data, i) => {
    const coordinates = data.geometry.coordinates
    const el = document.createElement('div')
    const name = i === 0 ? '左上' : i === 1 ? '右上' : i === 2 ? '左下' : '右下'
    ReactDOM.render(
      <div className="dot-box">
        <div className="name">{name}</div>
        <img src={dot}></img>
      </div>,
      el
    )
    const centroid = [coordinates[0], coordinates[1]]
    const marker = new mapboxgl.Marker(el)
      .setLngLat(centroid)
      .addTo(mapObj.current.map)

    mapObj.current.markerDetail[i] = marker
  }

  // 删除点
  const closeMarkerDetail = (i) => {
    mapObj.current.markerDetail[i].remove()
  }

  // 放大缩小
  const changeZoom = (i) => {
    if (zoomNum === 18 && i === 1) {
      message.info('亲，已经最大了，不能再放大了哦')
      return
    }
    if (zoomNum === 7 && i === -1) {
      message.info('亲，已经最小了，不能再缩小了哦')
      return
    }
    setZoomNum(zoomNum + i)
    console.log('zoomNum', zoomNum)
    mapObj.current.map.setZoom(zoomNum)
  }

  const getReallyCord = (data) => {
    if (data.length === 0) {
      return
    }
    const arr = data.slice(7, data.length - 8).split(' ')
    return [Number(arr[0]), Number(arr[1])]
  }

  // 根据坐标点往地图上添加图片
  const showPicture = () => {
    mapObj.current.map.addSource('overlay', {
      type: 'image',
      url: editData.floorProfilePath,
      coordinates: [
        getReallyCord(editData.floorUpperLeft),
        getReallyCord(editData.floorUpperRigth),
        getReallyCord(editData.floorLowerRigth),
        getReallyCord(editData.floorLowerLeft)
      ]
    })
    mapObj.current.map.addLayer({
      id: 'overlay',
      source: 'overlay',
      type: 'raster',
      paint: { 'raster-opacity': 0.85 }
    })
  }

  return (
    <div className="draw-map" style={{ height: '736px' }}>
      <div className="top-tab">
        <div
          onClick={() => {
            changeType(0)
          }}
          className={circleType === 0 ? 'active' : ''}
        >
          左上
        </div>
        <div
          onClick={() => {
            changeType(1)
          }}
          className={circleType === 1 ? 'active' : ''}
        >
          右上
        </div>
        <div
          onClick={() => {
            changeType(2)
          }}
          className={circleType === 2 ? 'active' : ''}
        >
          左下
        </div>
        <div
          onClick={() => {
            changeType(3)
          }}
          className={circleType === 3 ? 'active' : ''}
        >
          右下
        </div>
      </div>
      <div className="search-input">
        <Search
          placeholder="输入经纬度搜索如 115.82,28.67"
          onSearch={value => flyTo(value)}
        />
      </div>
      <div className="zoom-box">
        <span
          className="add"
          onClick={() => {
            changeZoom(1)
          }}
        >
          +
        </span>
        <span className="num">{zoomNum}</span>
        <span
          className="reduce"
          onClick={() => {
            changeZoom(-1)
          }}
        >
          -
        </span>
      </div>
      <div id="map2" style={{width:'100%',height:'100%'}}></div>
      {/* <Mapbox></Mapbox> */}
    </div>
  )
}

export default DrawMap
