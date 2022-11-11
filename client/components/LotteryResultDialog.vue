<template>
  <Dialog @close="close">
    <div class="p36">
      <div class="ratio">
        <div v-if="isWin">
          <img :src="winface" alt="" />
          <div
            class="name"
            :style="{
              fontSize: nameFontSize
            }"
          >
            {{ me[1] }}
          </div>
          <div class="msg">恭喜您获得{{ currentPrize[1] }}</div>
          <div class="prize">{{ currentPrize[2] }}</div>
        </div>
        <div v-else>
          <img :src="loseface" alt="" />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from './Dialog'
const DEFAULT_FONT_SIZE = 36
const DEFAULT_MAX_LENGTH = 10
const winface = require('@assets/deck/winface.png')
const loseface = require('@assets/deck/loseface.png')

export default {
  name: 'LotteryResultDialog',
  beforeCreate () {
    this['winface'] = winface
    this['loseface'] = loseface
  },
  data () {
    return {
      dialogStyle: {
        top:
          (window.innerHeight - (window.innerWidth - 36 * 2) * 1.45) / 2 + 'px',
      },
    }
  },
  props: {
    me: {
      default () {
        return []
      },
    },
    currentLottery: {
      default () {
        return []
      },
    },
    currentPrize: {
      default () {
        return []
      },
    },
  },
  computed: {
    isWin () {
      return this.currentLottery.find(item => item[0] === this.me[0])
    },
    nameFontSize ({ me }) {
      const { length } = me
      const diff = Math.min(
        length <= 10 ? 0 : (length - DEFAULT_MAX_LENGTH) * 2 + 1,
        24
      )
      return `${DEFAULT_FONT_SIZE - diff}px`
    },
  },
  components: { Dialog },
  methods: {
    close () {
      this.$emit('close', false)
    },
  },
}
</script>

<style scoped>
.name {
  position: absolute;
  top: 96px;
  left: 0;
  width: 100%;
  color: black;
  font-size: 36px;
  font-weight: 700;
  box-sizing: border-box;
  padding: 0 84px;
  word-wrap: break-word;
}
.msg {
  position: absolute;
  top: 204px;
  left: 0;
  width: 100%;
  color: black;
  font-size: 20px;
  font-weight: 500;
}
.prize {
  position: absolute;
  top: 299px;
  left: 0;
  /* width: 100%; */
  color: black;
  font-size: 14px;
  opacity: 0.65;
  /* width: 40px; */
  left: 76px;
  right: 76px;
  /* margin: 40px 0; */
}
.p36 {
  padding: 36px;
  padding-bottom: 20px;
}
.ratio {
  height: 145%;
}
</style>
