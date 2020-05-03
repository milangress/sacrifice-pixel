import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import changelog from "../views/changelog"
import manual from "../views/manual"

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
