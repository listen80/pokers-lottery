<template>
  <div class="modal" @click="closeClick">
    <div class="dialog" :style="dialogStyle">
      <slot @click.stop="stop"></slot>
      <img
        :src="close"
        alt="close"
        v-if="!noClose"
        class="close"
        @click="closeClick"
      />
    </div>
  </div>
</template>

<script>
const close = require('@assets/close.png')
export default {
  name: 'Dialog',
  props: ['noClose', 'dialogStyle'],
  beforeCreate () {
    this['close'] = close
  },
  methods: {
    closeClick () {
      this.$emit('close', false)
    },
    stop () {},
  },
}
</script>

<style scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
}
.dialog {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.close {
  display: block;
  position: relative;
  left: 50%;
  /* top: 20px; */
  color: white;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  transform: translate(-50%);
}
</style>
