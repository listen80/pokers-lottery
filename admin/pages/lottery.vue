<template>
  <div>
    <el-row>
      <el-col>
        <el-button
          type="danger"
          size="small"
          style="float: right"
          v-if="step === 2"
          @click="handleClear"
          >清空抽奖结果，回到签到</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="prizes" stripe>
          <el-table-column prop="1" label="奖项"></el-table-column>
          <el-table-column prop="2" label="奖品名称"></el-table-column>
          <el-table-column prop="6" label="数量"></el-table-column>
          <el-table-column prop="5" label="操作">
            <template v-if="lottery" slot-scope="scope">
              <el-button
                v-if="lottery[scope.$index]"
                @click="handleRowSee(scope.$index)"
                type="success"
                size="small"
                >查看</el-button
              >
              <el-button
                v-if="!lottery[scope.$index] && step === 2"
                :disabled="!disableLast && scope.$index === lottery.length - 1"
                @click="handleRowLottery(scope.$index)"
                type="danger"
                size="small"
                >抽奖</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      v-if="dialogVisible"
      :title="`中奖名单(${prizes[level][2]})`"
      :visible.sync="dialogVisible"
    >
      <el-tag
        v-for="(item, key) in lottery[level]"
        :key="key"
        :type="'info'"
        effect="plain"
      >
        {{ item[1] }}
      </el-tag>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
let messageExa = null

export default {
  data () {
    return {
      level: '',
      dialogVisible: false,
    }
  },
  created () {
    messageExa = new this.$Message()
    messageExa.onmessage(this.handle)
  },
  beforeDestroy () {
    messageExa.removemessage()
  },
  computed: {
    ...mapState(['whites', 'signIn', 'step', 'prizes', 'lottery']),
    // 阳光普照奖必须等其他所有奖项抽完才能开
    disableLast () {
      const lastIndex = this.lottery.length - 1
      return this.lottery
        .slice(0, lastIndex)
        .every(item => item && item.length)
    },
  },
  watch: {
    lottery: {
      handler: function (oldVal, newVal) {
        console.log('watch', oldVal, newVal)
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations(['setLottery']),
    handle ({ type, data }) {
      if (type === 'postLottery') {
        const { index, lottery } = data
        console.log('handle', index, this.lottery)
        const slice = JSON.parse(JSON.stringify(this.lottery))
        slice[index] = lottery
        this.setLottery(slice)
        this.handleRowSee(index)
      }
    },
    handleRowLottery (data) {
      const prize = this.prizes[data]
      this.$confirm(`抽取${prize[1]} ${prize[2]} ${prize[6]}个`).then(() => {
        this.$send({ type: 'postLottery', data })
      })
    },
    handleRowSee (level) {
      this.level = level
      this.dialogVisible = true
    },
    handleClear () {
      this.$confirm('此操作将清除所有抽奖数据', '提示', { type: 'error' }).then(
        () => {
          this.$send({ type: 'deleteLottery' })
          this.$send({ type: 'putStep', data: 1 })
        }
      )
    },
  },
}
</script>
