<template>
  <div :class="['button', disabled ? 'disabled' : '']" @click="click" :style="buttonStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Button',
  props: {
    disabled: {
      default: false,
    },
    buttonStyle: {
      default: null,
    },
  },
  methods: {
    click () {
      if (!this.disabled) {
        this.$emit('click')
      }
    },
  },
}
</script>

<style scoped>
.button {
  padding: 0 42px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border-radius: 2px;
  border: 1px solid white;
  color: white;
  display: inline-block;
  box-sizing: border-box;
}
.disabled {
  opacity: 0.5;
}
</style>
