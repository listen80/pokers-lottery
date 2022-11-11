<template>
  <div id="app">
    <el-row>
      <el-col>
        <span style="margin: 0 80px 20px 0; display: inline-block">环节控制, 当前 : {{config[step]}}</span>
        <el-radio-group v-model="step" @change="onStepChange">
          <el-radio :label="index" :disabled="step + 1 !== index && step !== index" v-for="(x, index) in config" :key="index">{{x}}</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <router-link v-for="(route, index) in $router.options.routes" :to="route.path" :key="index">
          <el-button :type="route.path === $route.path ? 'primary': 'info'" style="margin: 4px" size="mini">{{route.name}}</el-button>
        </router-link>
      </el-col>
    </el-row>
    <router-view v-if="lottery && prizes && !isNaN(step) "/>
  </div>
</template>

<script>

// eslint-disable-next-line no-unused-vars
import { mapState, mapMutations } from 'vuex'

const config = [
  '预热', '签到', '抽奖', '结束',
]
export default {
  name: 'App',
  data () {
    return { config }
  },
  created () {
    this.$onmessage(this.handle)
    this.$send({type: 'getStep'})
    this.$send({ type: 'getWhites' })
    this.$send({ type: 'getSignIn' })
    this.$send({ type: 'getLottery' })
    this.$send({ type: 'getPrizes' })
  },
  beforeDestroy () {
    this.$removemessage(this.handle)
  },
  computed: {
    step: {
      get () {
        return this.$store.state.step
      },
      set (data) {
        this.$store.commit('setStep', data)
      },
    },
    ...mapState(['lottery', 'prizes']),
  },
  watch: {
    step (data) {
      const next = this.$router.options.routes[data].path
      const { path } = this.$route
      if (next !== path) {
        this.$router.replace(next)
      }
    },
  },
  methods: {
    ...mapMutations(['setLottery', 'setPrizes', 'setWhites', 'setSignIn', 'setStep']),
    handle ({ type, data, msg, error }) {
      if (type === 'msg') {
        if (error) {
          this.$notify.error({
            title: '消息',
            message: msg,
          })
        } else {
          this.$notify({
            title: '消息',
            message: msg,
            type: 'success',
          })
        }
      } else if (type === 'getStep') {
        this.setStep(data)
        this.step = data
      } else if (type === 'getLottery') {
        this.setLottery(data)
      } else if (type === 'getPrizes') {
        this.setPrizes(data)
      } else if (type === 'getWhites') {
        this.setWhites(data)
      } else if (type === 'getSignIn') {
        this.setSignIn(data)
      }
    },
    onStepChange (label) {
      this.$send({type: 'putStep', data: label})
    },
  },

}
</script>
<style>
body {
  margin: 0;
}
#app {
  padding: 20px 20px 0 20px;
}
.el-row {
  margin-bottom: 20px;
}
.el-card {
  overflow: auto;
}
.el-tag {
  margin: 5px;
}
.el-message-box {
  max-width: 80%;
}
.el-dialog {
  min-width: 320px;
}
</style>
