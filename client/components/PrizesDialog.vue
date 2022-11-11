<template>
  <Dialog
    v-if="visiable"
    @close="close"
    :no-close="true"
    dialog-style="
      height: 75%;
      overflow: auto;
      bottom: 0;
      width: 100%;
      position: absolute;
      background-color: white;
      top: auto;
      transform: none;
      border-radius: 16px 16px 0px 0px;
    "
  >
    <div class="wrap">
      <img :src="prizesIntru" alt="" />
    </div>
  </Dialog>
</template>

<script>
import Dialog from './Dialog'
const prizesIntru = require('@assets/prizes/prizesIntru.png')

export default {
  name: 'PrizesDialog',
  props: {
    visiable: false,
  },
  components: { Dialog },
  methods: {
    close () {
      this.$emit('update:visiable', false)
    },
  },
  beforeCreate () {
    this['prizesIntru'] = prizesIntru
  },
}
</script>

<style scoped>
.wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 20px;
}
</style>
