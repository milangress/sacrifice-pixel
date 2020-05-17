import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    width: 200,
    height: 325,
    pixels: {}
  },
  mutations: {
      updatePixels (state, n) {
        state.pixels = n
      }
  },
  actions: {
  },
  modules: {
  }
})
