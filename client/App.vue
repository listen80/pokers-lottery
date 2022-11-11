<template>
  <div id="app">
    <!-- <div style="height: 48px;background: #fff;"></div> -->
    <Back :needFirewords="['signIn'].includes(routeName)" />
    <router-view v-if="lottery && me && prizes" />
    <Footer v-show="!['preheat', 'lottery', 'end'].includes(routeName)" />
  </div>
</template>

<script>
/* eslint-disable camelcase */
import Back from './components/Back.vue'
import Footer from './components/Footer.vue'
import { mapState, mapMutations } from 'vuex'

import { getSSOToken, clientInfo, toast } from '@seatalk/web-app-sdk'

const key = 'userInfo'
let userInfo = null

try {
  userInfo = localStorage.getItem(JSON.parse(key))
} catch (e) {}

userInfo = {}

export default {
  name: 'App',
  components: { Back, Footer },
  created () {
    this.$onmessage(this.handle)
    this.$send({ type: 'getStep' })
    this.$send({ type: 'getLottery' })
    this.$send({ type: 'getPrizes' })
    if (clientInfo.appVersion === '0.0.0') {
      return
    }
    if (userInfo) {
      this.setMe(userInfo)
    } else {
      getSSOToken({
        onSuccess: (token) => {
          this.$send({ type: 'getUserInfo', data: token })
        },
      })
    }
  },
  beforeDestroy () {
    this.$removemessage(this.handle)
  },
  computed: {
    ...mapState(['lottery', 'me', 'prizes']),
    routeName () {
      return this.$route.name
    },
  },
  methods: {
    ...mapMutations(['setLottery', 'setPrizes', 'setMe']),
    handle ({ type, data, msg, error }) {
      if (type === 'msg') {
        toast({ message: msg })
      } else if (type === 'getStep') {
        this.step = data
        const { path } = this.$route
        const next = this.$router.options.routes[this.step].path
        if (next !== path) {
          this.$router.replace(next)
        }
      } else if (type === 'getLottery') {
        this.setLottery(data)
      } else if (type === 'getPrizes') {
        this.setPrizes(data)
      } else if (type === 'getUserInfo') {
        const { email, name, avatar } = data
        const me = [email, name, avatar]
        localStorage.setItem(key, JSON.stringify(me))
        this.setMe(me)
      }
    },
  },
}
</script>
<style>
html,
body {
  margin: 0;
  height: 100%;
  background-color: #193362;
}
body {
  padding: 0;
}
img {
  max-width: 100%;
  max-height: 100%;
}
</style>
<style scoped>
#app {
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  color: white;
  max-width: 500px;
  margin: auto;
  position: relative;
}

.back {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -1;
}
.back > img {
  position: absolute;
}

.back > img.left {
  top: 10%;
}

.back > img.right {
  right: 0;
}

.back > .logo {
  bottom: 20px;
  left: 50%;
  transform: translate(-50%);
}
</style>
