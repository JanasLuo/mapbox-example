// Index/index.jsx
import React from 'react'
import {Button} from 'antd'

// import { history } from 'history'
// import { get } from '../utils'
export default function Index(props) {
  console.log('import.meta.env', import.meta.env)
  console.log(Route)
  const go = () => {
    console.log(props,'props')
    // Route.push('/mapbox')
  }
  return <div>
    地图演示
    <Button type="primary" onClick={go}>Mapbox</Button>
  </div>
}