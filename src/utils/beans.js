/*
 * @Date: 2021-06-21 19:05:12
 * @LastEditors: mark
 * @LastEditTime: 2021-06-21 19:05:21
 * @Description: Do not edit
 */
export default class Bean {
  static COOP_STATUS_MAP = {
    0: '发起',
    1: '已接收',
    2: '已反馈',
    3: '已完成'
  }
  static CENTER = [116.023483, 28.647418] // 地图中心点
  static ZOOM = 9.285782070032383

  static MAP_THEME = {
    light: '/gaodemap',
    darkblue: '/darkblue'
  }
  static COLOR_RANGE = [
    'rgb(89, 211, 220)',
    'rgb(1, 152, 189)',
    'rgb(225, 232, 52)',
    'rgb(239, 138, 28)',
    'rgb(255, 0, 0)'
  ]
}
