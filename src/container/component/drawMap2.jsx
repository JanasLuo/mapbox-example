import React, { useRef, useState, useEffect } from 'react'
// import Mapbox from 'src/components/map/mapbox2.jsx'
import MapboxDraw from 'mapbox-gl-draw'
// import Bus from 'src/utils/eventBus'
import wkt from 'terraformer-wkt-parser'
import mapboxgl from 'mapbox-gl'
// import styl from './index.styl'
import { Input, message } from 'antd'
import SpecialMap from '@/utils/special_map.js'
import { parseWkt } from '@/utils/format.js'
const { Search } = Input
const DrawMap = (props) => {
  const mapRef = useRef()
  const { emitData, editData } = props
  const reg = /[A-Z]+\s?/gi
  const mapObj = useRef({
    map: null,
    draw: null,
    core: null,
    control: null,
    out: null,
    specialMapObj: null,
    circleType: 0
  })
  const circleData = useRef([null, null, null]) // 0核心圈 1管控圈 2外围圈
  // const [polygonData, setPolygonData] = useState()
  const [circleType, setCircleType] = useState(0) // 0核心圈 1管控圈 2外围圈
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
    console.log(map, 'mmmm')
    mapObj.current.map = map
    mapObj.current.specialMapObj = new SpecialMap(map)
    initDraw()
  }
  const echoMap = () => {
    // controllCircle: '',
    // coreCircle: '',
    // ambitusCircle: ''
    console.log(editData, 'dddddd')
    if (editData.coreCircle) {
      // 添加draw
      const feature = {
        id: editData.id + '0',
        type: 'Feature',
        properties: {},
        geometry: JSON.parse(JSON.stringify(parseWkt(editData.coreCircle)))
      }
      // mapObj.current.core = feature
      circleData.current[0] = feature
      mapObj.current.draw.add(feature)
      emitData(0, editData.coreCircle)
    }
    if (editData.controllCircle) {
      mapPolygan(1, editData.controllCircle)
      emitData(1, editData.controllCircle)
      const feature = {
        id: editData.id + '1',
        type: 'Feature',
        properties: {},
        geometry: JSON.parse(JSON.stringify(parseWkt(editData.controllCircle)))
      }
      circleData.current[1] = feature
      // mapObj.current.control = feature
    }
    if (editData.ambitusCircle) {
      mapPolygan(2, editData.ambitusCircle)
      emitData(2, editData.ambitusCircle)
      const feature = {
        id: editData.id + '2',
        type: 'Feature',
        properties: {},
        geometry: JSON.parse(JSON.stringify(parseWkt(editData.ambitusCircle)))
      }
      circleData.current[2] = feature
      // mapObj.current.out = feature
    }
  }
  const initDraw = () => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: false,
        point: false,
        trash: true
      }
    })
    // console.log(MapboxDraw, 'MapboxDraw')
    mapObj.current.map.addControl(draw)
    mapObj.current.draw = draw
    // console.log(draw, 'draw')
    mapObj.current.map.on('draw.create', updateArea)
    mapObj.current.map.on('draw.delete', updateArea)
    mapObj.current.map.on('draw.update', updateArea)
    echoMap()
    // const feature = {
    //   id: 'unique-id',
    //   type: 'Feature',
    //   properties: {},
    //   geometry: {
    //     type: 'Polygon',
    //     coordinates: [
    //       [
    //         [115.77392578125, 28.852492288154508],
    //         [115.61874389648438, 28.507315578441784],
    //         [116.07879638671874, 28.466880437528896],
    //         [116.1199951171875, 28.79534277085327],
    //         [115.77392578125, 28.852492288154508]
    //       ]
    //     ]
    //   }
    // }
    // draw.add(feature)

    // mapStore.setDrawObj(draw)
    // console.log('mapStore.getDrawObj()', mapStore.getDrawObj())
    // mapObj.current.draw = mapStore.getDrawObj()
  }

  const updateArea = (e) => {
    // console.log('updateArea', e)
    const feature = e.features[0]

    if (e.type === 'draw.delete') {
      // console.log(mapObj.current.circleType, 'circleType')
      circleData.current[mapObj.current.circleType] = null
    } else if (e.type === 'draw.create') {
      // 生成的时候 如果之前此圈已经有了数据，那么删掉老得（只能保存一个的情况）
      const n = circleData.current[mapObj.current.circleType]
      if (n) {
        mapObj.current.draw.delete(n.id)
      }
      circleData.current[mapObj.current.circleType] = feature
    } else {
      circleData.current[mapObj.current.circleType] = feature
    }
    let i = 0
    for (const item of circleData.current) {
      // console.log(item, 'item----')
      if (item) {
        const wktstr = 'POLYGON ' + wkt.convert(item.geometry).replace(reg, '')
        emitData(i, wktstr)
      }
      i++
    }
    // 如果是create 判断当前是哪个圈，覆盖到对应的圈上

    // 如果是update  判断当前是哪个圈，覆盖到对应的圈上
    // 如果是delete 判断当前是哪个圈，删除对应的圈

    // const data = mapObj.current.draw.getAll()

    // var answer = document.getElementById('calculated-area');
    // if (data.features.length > 0) {
    //   // 如果大于1
    //   console.log(data, 'data')
    //   const wktstr = wkt.convert(data.features[0].geometry).replace(reg, '')
    //   console.log(wktstr, 'wktstr')
    //   // POLYGON
    //   const obj = JSON.stringify(data.features[0])
    //   setPolygonData(obj)
    //   console.log(polygonData, 'polygonData')
    //   // const area = turf.area(data)
    //   // console.log('area', area)
    //   // restrict to area to 2 decimal points
    //   // var rounded_area = Math.round(area * 100) / 100;
    //   // answer.innerHTML = '<p><strong>' + rounded_area + '</strong></p><p>square meters</p>';
    // }
  }

  function willOut() {
    Bus.removeListener('mapLoad', getMap)
  }
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
  const mapPolygan = (type, geometry) => {
    const arr = [
      {
        name: type === 0 ? '核心圈' : type === 1 ? '管控圈' : '外围圈',
        id: type + 'id',
        num: 1,
        origin_id: type,
        drill: false,
        geometry
      }
    ]
    // 画圈
    mapObj.current.specialMapObj.addMapLay(arr, undefined, true, 'type' + type)
  }
  // 当圈的类型改变的时候
  useEffect(() => {
    if (mapObj.current.specialMapObj) {
      mapObj.current.specialMapObj.removeMapLay('type0')
      mapObj.current.specialMapObj.removeMapLay('type1')
      mapObj.current.specialMapObj.removeMapLay('type2')
    }

    // 遍历3个圈
    // 当前的圈，如果有数据 那么就add
    // 如果不是当前的圈，如果有数据那么首先删掉这个圈，然后再加一个图形上去
    let i = 0
    console.log(circleData.current, ' circleData.current')
    for (const item of circleData.current) {
      if (i === circleType) {
        if (item) {
          mapObj.current.draw.add(item)
        }
      } else {
        if (item) {
          mapObj.current.draw.delete(item.id)
          const wktstr =
            'POLYGON ' + wkt.convert(item.geometry).replace(reg, '')
          // console.log(mapPolygan)
          mapPolygan(i, wktstr)
        }
      }
      i++
    }
    // console.log(circleData.current, 'circleData.current')
  }, [circleType])

  const changeType = (type) => {
    mapObj.current.circleType = type
    setCircleType(type)
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
          核心圈
        </div>
        <div
          onClick={() => {
            changeType(1)
          }}
          className={circleType === 1 ? 'active' : ''}
        >
          管控圈
        </div>
        <div
          onClick={() => {
            changeType(2)
          }}
          className={circleType === 2 ? 'active' : ''}
        >
          外围圈
        </div>
      </div>
      <div className="search-input">
        <Search
          placeholder="输入经纬度搜索如 115.82,28.67"
          onSearch={value => flyTo(value)}
        />
      </div>
      <div id="map2" style={{width:'100%',height:'100%'}}></div>
      {/* <Mapbox></Mapbox> */}
    </div>
  )
}

export default DrawMap
