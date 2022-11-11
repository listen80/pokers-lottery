<template>
  <div>
    <pre>
    预热阶段
    1 确保 奖品excel正确
    2 确保 白名单excel正确
    以后可以加上上传两个 excel操作
    location 经纬度需要配置，要么无法签到
    可以内嵌百度取点页面

    签到页面
    查看所有白名单/已签到名单
    只有签到态能签到

    抽奖
    产看奖品
    只有抽奖态能抽奖

    结束
    查看所有中奖名单
    回到最初/首尾相连
    </pre>
    <!-- <el-button type="danger" @click="handleClear">清空所有信息</el-button> -->
    北京经纬度
    116.521102,39.907775
    116.527929,39.903804
    深圳经纬度
    113.94204799847836,22.535489358243797
    <el-button><a href="https://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">取点</a></el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      level: '',
      getPrizes: [],
      getLottery: null,
      dialogVisible: false,
    }
  },
  created () {
    this.$onmessage(this.handle)
  },
  beforeDestroy () {
    this.$removemessage(this.handle)
  },
  methods: {
    handle ({ type, data }) {
    },
    handleRowLottery (data) {
      const prize = this.getPrizes[data]
      this.$confirm(`抽取${prize[1]} ${prize[2]} ${prize[6]}个`).then(() => {
        this.$send({ type: 'postLottery', data })
      })
    },
    handleRowSee (level) {
      this.level = level
      this.dialogVisible = true
    },
    handleClear () {
      this.$confirm('此操作将清除所有签到，抽奖数据', '提示', { type: 'error' }).then(
        () => {
          this.$send({ type: 'deleteLottery' })
          this.$send({ type: 'deleteSignIn' })
          this.$send({ type: 'postStep', data: 0 })
        }
      )
    },
  },
}
</script>
