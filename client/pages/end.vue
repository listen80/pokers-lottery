<template>
  <div class="end">
    <img :src="flag" alt="" />
    <img :src="green" alt="green" class="fireworks-green" />
    <div class="title title-names">
      获奖名单
      <Button :buttonStyle="buttonStyle" @click="handleClick">我的奖品</Button>
    </div>
    <div class="result" v-if="prizes">
      <div class="row" v-for="(row, index) in lottery" :key="index">
        <div class="row-title" v-if="prizes[index]">{{ prizes[index][1] }}</div>
        <div class="row-content">
          <div v-for="(user, rowIndex) in row" :key="rowIndex">
            {{ user[1] }} {{ user[0] }}
          </div>
        </div>
      </div>
    </div>
    <div class="title title-list">
      奖品清单
      <img :src="yellow" alt="yellow" class="fireworks-yellow" />
      <img :src="blue" alt="blue" class="fireworks-blue" />
    </div>
    <div class="image">
      <img :src="prizesList" alt="" />
    </div>
    <Footer :footerStyle="footerStyle" />
    <PrizesMeDialog v-if="visiableMe" :visiable.sync="visiableMe" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Button from '../components/Button.vue'
import Footer from '../components/Footer'
import PrizesMeDialog from '../components/PrizesMeDialog'
const flag = require('@assets/back/flag.png')
const green = require('@assets/end/fireworks-green.png')
const yellow = require('@assets/end/fireworks-yellow.png')
const blue = require('@assets/end/fireworks-blue.png')
const prizesList = require('@assets/prizes/prizesList.png')

export default {
  name: 'end',
  components: { Button, PrizesMeDialog, Footer },
  data () {
    return { step: 1, getSignIn: [], visiableMe: false }
  },
  computed: {
    isSignIn () {
      return this.getSignIn.find(end => {
        return end[0] === this.me[0]
      })
    },
    ...mapState(['me', 'lottery', 'prizes']),
  },
  beforeCreate () {
    this['buttonStyle'] = {
      position: 'absolute',
      right: '20px',
      padding: '0 20px',
      fontSize: '12px',
    }

    this['footerStyle'] = {
      marginTop: '24px',
      marginBottom: window.innerHeight < 640 ? '8px' : '20px',
    }

    this['flag'] = flag
    this['green'] = green
    this['yellow'] = yellow
    this['blue'] = blue
    this['prizesList'] = prizesList
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
      }
    },

    handleClick () {
      this.visiableMe = true
    },
  },
}
</script>
<style scoped>
.end {
  text-align: center;
  color: white;
  overflow: auto;
  height: 100%;
  position: relative;
  z-index: 1;
}
.title {
  position: relative;
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: 700;
}
.title-list {
  margin-top: 60px;
  margin-bottom: 20px;
}
.image {
  padding: 0 20px;
}
.expect {
  margin-top: 24px;
}
.result {
  max-height: 480px;
  border-radius: 8px;
  background-color: #fff;
  overflow: auto;
  margin: 20px;
  margin-top: 0;
  color: black;
  text-align: left;
  padding: 0 16px;
}
.row-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  margin-top: 24px;
  margin-bottom: 8px;
}
.row-content {
  font-size: 12px;
}
.fireworks-green {
  position: absolute;
  width: 71px;
  top: 40px;
  left: 12px;
}
.fireworks-yellow {
  position: absolute;
  width: 80px;
  max-height: 80px;
  top: -24px;
  left: 24px;
  z-index: -1;
}
.fireworks-blue {
  position: absolute;
  width: 96px;
  max-height: 96px;
  top: -48px;
  right: 0;
  z-index: -1;
}
</style>
