<template>
  <div>
    <el-row>
      <el-col>
        <el-button
          type="danger"
          size="small"
          style="float: right"
          v-if="step === 1"
          @click="handleClear"
          >一键清空签到名单</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div>总人数 {{ whites.length }} 已签到人数 {{ signIn.length }}</div>
        </div>
        <el-tag
          v-for="(item, key) in whites"
          :key="key"
          :type="signIn.find(sign => sign[0] === item[0]) ? 'success' : 'info'"
          effect="plain"
          @click="postSignIn(item, signIn.find(sign => sign[0] === item[0]))"
        >
          {{ item[0] }}
        </el-tag>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'signin',
  created () {
    this.$onmessage(this.handle)
  },
  beforeDestroy () {
    this.$removemessage(this.handle)
  },
  computed: {
    ...mapState(['whites', 'signIn', 'step']),
  },
  methods: {
    ...mapMutations(['setLottery', 'setPrizes', 'setWhites', 'setSignIn']),
    handle ({ type, data }) {
      if (type === 'postSignIn') {
        this.signIn.push(data.user)
      }
    },
    postSignIn (user, status) {
      if (!status) {
        this.$confirm(`给 ${user[1]}(${user[0]}) 签到`, '测试用').then(() => {
          this.$send({ type: 'postSignIn', data: { user: user, isAdmin: true } })
        })
      }
    },
    handleClear () {
      this.$confirm('此操作将清除所有签到人员', '提示', { type: 'error' }).then(
        () => {
          this.$send({ type: 'deleteSignIn' })
          this.$send({ type: 'putStep', data: 0 })
        }
      )
    },
  },
}
</script>
