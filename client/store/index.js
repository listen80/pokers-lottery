import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    me: null,
    lottery: null,
    prizes: null,
  },
  mutations: {
    setMe (state, me) {
      state.me = me
    },
    setLottery (state, lottery) {
      state.lottery = lottery
    },
    setPrizes (state, prizes) {
      state.prizes = prizes
    },
  },
})

export default store
