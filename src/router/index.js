import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Home_Old from "../views/Home_Old"
import changelog from "../views/changelog"
import manual from "../views/manual"
import sacrifice from "../views/sacrifice"
import draw from "../views/draw"

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
    {
      path: '/v1',
      name: 'Home_Old',
      component: Home_Old
    },
    {
      path: '/sacrifice',
      name: 'sacrifice',
      component: sacrifice
    },
    {
      path: '/draw',
      name: 'draw',
      component: draw
    },
    {
      path: '/changelog',
      name: 'Changelog',
      component: changelog
    },
    {
      path: '/manual',
      name: 'manual',
      component: manual
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
