/*
 * @Date: 2021-04-23 10:14:26
 * @LastEditors: mark
 * @LastEditTime: 2021-04-27 10:42:08
 * @Description: Do not edit
 */
import Index from '../container/Index'
import About from '../container/About'
import Mapbox from '../container/Mapbox'
import Leaflet from '../container/Leaflet'

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
  },
  {
    path: "/leaflet",
    component: Leaflet
  }
];

export default routes
