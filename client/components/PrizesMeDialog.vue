<template>
  <Dialog v-if="visiable" @close="close">
    <div v-if="!isStart" class="p36">
      <img :src="unstart" alt="">
    </div>
    <div v-else-if="myPrizeInfo" class="p36">
      <img :src="require(`@assets/prizes/${myPrizeInfo[0]}.png`)" alt="">
    </div>
    <div v-else class="p36">
      <img :src="unprize" alt="">
    </div>
  </Dialog>
</template>

<script>
import Dialog from './Dialog'
import { mapState } from 'vuex'
const unstart = require('@assets/prizes/unstart.png')
const unprize = require('@assets/prizes/unprize.png')

export default {
  name: 'PrizesDialog',
  data () {
    return {
      dialogStyle: {
        top: (window.innerHeight - (window.innerWidth - 36 * 2) * 1.45) / 2 + 'px',
      },
    }
  },
  props: {
    visiable: false,
  },
  components: { Dialog },
  beforeCreate () {
    this['unstart'] = unstart
    this['unprize'] = unprize
  },
  computed: {
    ...mapState(['me', 'lottery', 'prizes']),
    myPrizeInfo () {
      const index = this.lottery.findIndex((row) => {
        return row && row.find(user => user[0] === this.me[0])
      })
      if (index === -1) {
        return null
      } else {
        return this.prizes[index]
      }
    },
    isStart () {
      return this.lottery.filter(row => row).length
    },
  },
  methods: {
    close () {
      this.$emit('update:visiable', false)
    },
  },
  mounted () {
    console.log(this.myPrizeInfo)
  },
}
</script>

<style scoped>
.p36 {
  padding: 0 36px;
  padding-bottom: 0;
  margin-bottom: 20px;
}
</style>
