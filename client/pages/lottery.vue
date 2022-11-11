<template>
  <div class="lottery" ref="poker">
    <div class="title" v-if="title">
      {{ this.title[1] }}
      <div class="small-title" style="">{{ this.title[2] }}</div>
    </div>
    <div id="box" :style="boxStyle"></div>
    <div class="button-group" ref="buttons">
      <Button
        @click="handleShowPrizes"
        :disabled="disabled"
        :buttonStyle="buttonStyle"
        >奖品介绍</Button
      >
      <Button
        @click="handleShowMyPrizes"
        :disabled="disabled"
        :buttonStyle="buttonStyle"
        >我的奖品</Button
      >
      <!-- <Button @click="handleTest">抽奖</Button> -->
    </div>
    <PrizesDialog v-if="visiablePrizes" :visiable.sync="visiablePrizes" />
    <PrizesMeDialog v-if="visiableMe" :visiable.sync="visiableMe" />
    <LotteryResultDialog
      v-if="visiableLottery"
      @close="handleLotteryResultClose"
      :currentLottery="currentLottery"
      :currentPrize="currentPrize"
      :me="me"
    />
    <Footer :footerStyle="footerStyle" />
  </div>
</template>

<script>
import Dialog from '../components/Dialog'
import Button from '../components/Button'
import Footer from '../components/Footer'

import PrizesDialog from '../components/PrizesDialog'
import PrizesMeDialog from '../components/PrizesMeDialog'
import LotteryResultDialog from '../components/LotteryResultDialog'
import { mapState, mapMutations } from 'vuex'

const INNER_WIDTH = window.innerWidth
const INNER_HEIGHT = window.innerHeight

export default {
  name: 'lottery',
  components: {
    Dialog,
    Button,
    PrizesDialog,
    PrizesMeDialog,
    LotteryResultDialog,
    Footer,
  },
  data () {
    return {
      poker: [],
      title: ['', '等待抽奖'],
      visiablePrizes: false,
      visiableMe: false,
      visiableLottery: false,
      disabled: false,
      lotteryList: [],
    }
  },
  computed: {
    ...mapState(['me', 'lottery', 'prizes']),
    buttonStyle () {
      return {
        width: '90px',
        padding: '0 10px',
        fontSize: '14px',
        opacity: this.disabled ? 0.5 : 1,
      }
    },
    // 防止叠牌和按钮位置重叠
    boxStyle () {
      let value = 0.8

      if (INNER_WIDTH <= 375 && INNER_HEIGHT < 736) {
        value = 0.7
      }

      if (INNER_WIDTH >= 414 && INNER_HEIGHT >= 800) {
        value = 1.1
      }

      if (INNER_WIDTH >= 360 && INNER_HEIGHT >= 736) {
        value = 1
      }

      return {
        transform: `scale(${value})`,
      }
    },
  },
  beforeCreate () {
    this['footerStyle'] = {
      position: 'absolute',
      bottom: window.innerHeight < 640 ? '8px' : '20px',
      zIndex: 1,
    }
  },
  created () {
    this.$onmessage(this.handle)
  },
  beforeDestroy () {
    this.$removemessage(this.handle)
  },
  mounted () {
    this.deck = window.Deck()
    // this.deck.mount(this.$refs.poker)
    this.deck.mount(document.getElementById('box'))

    if (process.env.NODE_ENV !== 'development') {
      this.deck.intro()
      this.deck.shuffle(5)
    }

    this.deck.cards.forEach(card => {
      card.$el.classList.add('box-shadow')
      card.$el.querySelector('.wrap').style.transform = 'rotateY(0)'
    })
  },
  methods: {
    ...mapMutations(['setLottery']),
    handle ({ type, data }) {
      if (type === 'postLottery') {
        const { index, lottery } = data
        this.title = this.prizes[index]
        if (lottery.length) {
          this.handleLottery(lottery, index)
        }
      }
    },
    handleTest () {
      const arr = Array((Math.random() * 11) | 0).fill(this.me)
      if (arr.length) {
        this.handleLottery(arr, Math.random() * this.prizes.length | 0)
      }
    },
    handleLottery (lottery, index) {
      this.disabled = true
      this.visiablePrizes = false
      this.visiableMe = false
      this.visiableLottery = false
      const showAni = lottery.length <= 12 && lottery.length > 0

      this.deck.queue((next) => {
        this.deck.cards.forEach((card) => {
          card.$el.classList.add('box-shadow')
          card.$el.querySelector('.wrap').style.transform = 'rotateY(0)'
        })
        setTimeout(() => {
          next()
        }, 300)
      })

      this.deck.shuffle(1)

      this.deck.queue(next => {
        this.currentLottery = lottery
        this.currentPrize = this.prizes[index]
        next()
      })
      if (showAni) {
        this.deck.queue((next) => {
          this.deck.$el.style.transition = '.3s'
          const { length } = lottery
          const top = length > 3 ? 7.5 * 16 * (Math.ceil(length / 4) + 0.5) + 10 + 20 + 32 + 32 : '50%'
          this.deck.$el.style.top = `${top}px`
          setTimeout(next, 400)
        })
      }

      const poker = []
      if (showAni) {
        this.deck.poker(lottery.length, (card, i) => {
          card.$el.classList.remove('box-shadow')
          this.handleCreatePoker(card.$el.querySelector('.back'), lottery[i])
          poker.push(card)
        })
      }
      if (showAni) {
        this.deck.queue((next) => {
          const findIndex = lottery.findIndex(user => {
            return user[0] === this.me[0]
          })
          poker.forEach((card, i) => {
            setTimeout(() => {
              card.$el.querySelector('.wrap').style.transform = 'rotateY(180deg)'
              if (findIndex === i) {
                setTimeout(() => {
                  this.handleLotteryResultClose(true)
                }, 100)
              }
            }, i * 300 + 300)
          })

          setTimeout(() => {
            this.disabled = false
            if (findIndex === -1) {
              this.handleLotteryResultClose(true)
            }
            next()
          }, lottery.length * 300 + 900)
        })
      } else {
        this.deck.queue((next) => {
          // fix:抽完烟光普照奖没办法查看我的奖品
          this.disabled = false
          this.handleLotteryResultClose(true)
          next()
        })
      }

      this.deck.queue(next => {
        const slice = this.lottery.slice()
        slice.splice(index, 1, lottery)
        this.setLottery(slice)
        next()
      })
    },
    handleCreatePoker (el, data) {
      while (el.firstChild) {
        el.removeChild(el.firstChild)
      }
      const div = document.createElement('div')
      div.classList.add('name')
      div.textContent = data[1]
      el.appendChild(div)

      const image = new Image()
      image.src = data[2]
      image.classList.add('avatar')
      el.appendChild(image)
    },
    handleShowPrizes () {
      this.visiablePrizes = true
    },
    handleShowMyPrizes () {
      this.visiableMe = true
    },
    handleLotteryResultClose (status) {
      this.visiableLottery = status
    },
  },
}
</script>

<style scoped>
.lottery {
  text-align: center;
  position: relative;
  z-index: 1;
  height: 100%;
  /* height: 748px; */
}
.button-group {
  position: absolute;
  bottom: 3.6rem;
  text-align: center;
  width: 100%;
  left: 0;
  z-index: 1;
}
.button-group > div {
  margin: 5px;
}

.prize-wrap {
  position: relative;
  width: 335px;
  height: 82px;

  background: #ffffff;
  border: 2px solid #ffffff;
  box-sizing: border-box;
  box-shadow: 4px 4px 0px #73a0ed;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
}
.prize-text {
  padding: 16px 0 12px 16px;
}
.prize-title {
  font-size: 20px;
  margin-bottom: 14px;
}
.prize-name {
  font-size: 12px;
  line-height: 15px;
  color: rgba(0, 0, 0, 0.65);
}
.prize-image {
  flex: 1;
}
.prize-image img {
  right: 0;
  float: right;
  max-height: 72px;
  max-width: 80px;
  vertical-align: middle;
}

.title {
  padding-top: 24px;
  margin-bottom: 28px;
  font-size: 22px;
  font-weight: 700;
}
.small-title {
  font-size: 12px;
  margin-top: 4px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* opacity: 0.65; */
}

#box {
  position: relative;
  top: -82px;
  height: calc(100% - 82px);
  transform-origin: center 0;
}
</style>
