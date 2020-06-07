import Vue from 'vue'
import Vuex from 'vuex'
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'Milan',
    width: 240,
    height: 300,
    pixels: {
      '0-0-0': 20000,
      '200-0-0': 16000,
      '0-120-0': 8000
    },
    colorNameMap: {}
  },
  mutations: {
      updatePixels (state, n) {
        state.pixels = n
      },
      updateColorNameMap (state, n) {
        state.colorNameMap = n
      },
      newName (state, n) {
        const randomName = uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: '-'
        }); // big-red-donkey
        n ? state.name = n : state.name = randomName
      }
  },
  actions: {
  },
  modules: {
  }
})
