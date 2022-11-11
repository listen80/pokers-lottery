import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    step: 0,
    lottery: null,
    prizes: null,
    whites: [],
    signIn: [],
  },
  mutations: {
    setStep (state, step) {
      state.step = step
    },
    setLottery (state, lottery) {
      state.lottery = lottery
    },
    setPrizes (state, prizes) {
      state.prizes = prizes
    },
    setWhites (state, whites) {
      state.whites = whites
    },
    setSignIn (state, signIn) {
      state.signIn = signIn
    },
  },
})

export default store
