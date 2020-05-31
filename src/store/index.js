import Vue from 'vue'
import Vuex from 'vuex'
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'Milan',
    width: 210,
    height: 310,
    pixels: {
      '0-0-0': 20000,
      '200-0-0': 16000,
      '0-120-0': 8000
    }
  },
  mutations: {
      updatePixels (state, n) {
        state.pixels = n
      },
      newName (state, n) {
        const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
        n ? state.name = n : state.name = randomName
      }
  },
  actions: {
  },
  modules: {
  }
})
