/*
 * @Date: 2021-06-23 12:53:40
 * @LastEditors: mark
 * @LastEditTime: 2021-06-23 14:06:29
 * @Description: Do not edit
 */
import React from 'react'
// import styl from './index.styl'

//  部位管理-采集坐标头部内容
const addTop = (props) => {
  return (
    <div className="circle-top">
      <div className="one">
        <div className="label">楼层名称</div>
        {/* <div className="value">{floorNum || '-'}</div> */}
      </div>
      <div>
        <div className="label">楼层顺序</div>
        {/* <div className="value">{sortNo}</div> */}
      </div>
    </div>
  )
}

export default addTop
