/*
 * @Date: 2021-06-23 12:41:51
 * @LastEditors: mark
 * @LastEditTime: 2021-06-23 15:16:20
 * @Description: 画多边形，并支持切换
 */
import React, { useRef } from 'react'
import { Modal } from 'antd'
import DrawMap from './drawMap2'
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css'
// import Top from './addTop'
// import perceptionService from 'src/services/perception'

//  部位管理-叠加剖面图-采集坐标
const Collocated3 = (props) => {
  const { editData, closeThis, getTableList } = props
  const partsBoundary = useRef({
    floorUpperRigth: null, // 右上
    floorUpperLeft: null, // 左上
    floorLowerLeft: null, // 左下
    floorLowerRigth: null // 右下
  })
  // 楼层坐标采集提交
  const editCircle = async () => {
    // const res: any = await perceptionService.saveFloorLocation({
    //   id: editData.id, // 楼层ID
    //   ...partsBoundary.current
    // })
    // if (res.status === 0) {
    //   message.success('修改成功')
    //   closeThis()
    //   getTableList()
    // } else {
    //   message.error(res.msg)
    // }
  }
  const getData = (index, data) => {
    if (index === 0) {
      partsBoundary.current.floorUpperLeft = data
    }
    if (index === 1) {
      partsBoundary.current.floorUpperRigth = data
    }
    if (index === 2) {
      partsBoundary.current.floorLowerLeft = data
    }
    if (index === 3) {
      partsBoundary.current.floorLowerRigth = data
    }
  }

  return (
    <Modal
      wrapClassName="village-all-modal"
      visible={true}
      width="90%"
      onCancel={closeThis}
      onOk={editCircle}
    >
      <div className="modal-title">采集坐标</div>
      {/* <Top ></Top> */}
      <DrawMap emitData={getData} editData={editData}></DrawMap>
    </Modal>
  )
}

export default Collocated3
