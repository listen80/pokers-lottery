<template>
  <div class="signIn">
    <div class="title">CONTENT SERVICES & VIDEO</div>
    <div class="image">
      <img :src="signInface" alt="" />
    </div>
    <div class="expect">
      <template v-if="loading">
        <Button :buttonStyle="buttonStyle">
          <img :src="loadingImage" alt="" class="loading" />
        </Button>
      </template>
      <template v-else>
        <div v-if="isSignIn">签到成功</div>
        <Button :buttonStyle="buttonStyle" v-else @click="postSignIn"
          >签到</Button
        >
      </template>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

import Button from '../components/Button.vue'
import { mapState } from 'vuex'
const signInface = require('@assets/deck/signInface.png')
const loadingImage = require('@assets/loading.png')

export default {
  name: 'signIn',
  components: { Button },
  data () {
    return { getSignIn: [], loading: false, buttonStyle: { width: '120px' } }
  },
  computed: {
    isSignIn () {
      return this.getSignIn.find(signIn => {
        return signIn[0] === this.me[0]
      })
    },
    ...mapState(['me']),
  },
  beforeCreate () {
    this['signInface'] = signInface
    this['loadingImage'] = loadingImage
  },
  created () {
    this.$onmessage(this.handle)
    this.$send({ type: 'getSignIn' })
  },
  beforeDestroy () {
    this.$removemessage(this.handle)
  },
  methods: {
    handle ({ type, data }) {
      if (type === 'getSignIn') {
        this.getSignIn = data
      } else if (type === 'postSignIn') {
        this.getSignIn.push(data.user)
        this.loading = false
      } else if (type === 'msg') {
        this.loading = false
      }
    },
    getLocation () {
      navigator.geolocation.getCurrentPosition(
        position => {
          if (position) {
            console.log(position)
            this.$send({
              type: 'postSignIn',
              data: { position, user: this.me },
            })
          } else {
            console.log({ message: '定位失败' })
            this.loading = false
          }
        },
        () => {
          console.log({ message: '没有权限，定位失败' })
          this.loading = false
        }
      )
    },
    postSignIn () {
      // 用户信息 位置信息
      this.loading = true
      // this.getLocation()
      this.$send({
        type: 'postSignIn',
        data: { user: this.me, isAdmin: true },
      })
    },
  },
}
</script>
<style scoped>
.signIn {
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;
}
.title {
  width: 75%;
  margin: 0 auto;
  padding-top: 20px;
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: 700;
}
.image {
  /* padding: 0 20px; */
  width: 75%;
  margin: 0 auto;
}
.expect {
  margin-top: 24px;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading {
  width: 20px;
  animation: 3s linear infinite rotate;
  vertical-align: middle;
  position: relative;
}
@media screen and (max-height: 600px) {
  .title,
  .image {
    width: 60%;
  }
}
</style>
