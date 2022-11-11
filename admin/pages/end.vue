<template>
  <div>
    <el-row>
      <el-col>
        <el-button
          type="danger"
          size="small"
          style="float: right"
          v-if="step === 3"
          @click="handleClear"
          >清空所有数据，重新抽奖</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col v-for="(row, index) in lottery" :key="index">
        <div v-if="prizes[index]">
          <h2>{{prizes[index][0]}} {{prizes[index][1]}} {{prizes[index][2]}}</h2>
          <div v-if="row">
            <el-tag v-for="(u, i) in row" :key="i">{{u[0]}}</el-tag>
          </div>
          <div v-else>没有人</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  created () {
    this.$onmessage(this.handle)
  },
  beforeDestroy () {
    this.$removemessage(this.handle)
  },
  computed: {
    ...mapState(['lottery', 'prizes', 'step']),
  },
  methods: {
    ...mapMutations([]),
    handle () {},
    handleClear () {
      this.$confirm('此操作将清除所有签到，抽奖数据，回到预热阶段', '提示', { type: 'error' }).then(
        () => {
          this.$send({ type: 'putStep', data: 0 })
          this.$send({ type: 'deleteLottery' })
          this.$send({ type: 'deleteSignIn' })
        }
      )
    },
  },
}
</script>
