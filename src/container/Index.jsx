// Index/index.jsx
import React from 'react'
import {Button} from 'antd'
// import { get } from '../utils'
export default function Index() {
  console.log('import.meta.env', import.meta.env)
  // useEffect(() => {
  //   get('/index-infos').then(() => {

  //   })
  // }, [])
  return <div>
    Index1
    <Button type="primary">Button</Button>
  </div>
}