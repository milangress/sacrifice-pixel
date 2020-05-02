import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import changelog from "../views/changelog"

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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
