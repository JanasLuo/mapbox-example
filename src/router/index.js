/*
 * @Date: 2021-04-23 10:14:26
 * @LastEditors: mark
 * @LastEditTime: 2021-04-23 11:10:16
 * @Description: Do not edit
 */
import Index from '../container/Index'
import About from '../container/About'
import Mapbox from '../container/Mapbox'

const routes = [
  {
    path: "/",
    component: Index
  },
  {
    path: "/about",
    component: About
  },
  {
    path: "/mapbox",
    component: Mapbox
  }
];

export default routes
