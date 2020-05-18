import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    width: 250,
    height: 325,
    pixels: {
      '0-0-0': 20000,
      '200-0-0': 16000,
      '0-120-0': 8000
    }
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
