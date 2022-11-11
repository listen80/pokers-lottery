<template>
  <footer :style="footerStyle">
    <slot></slot>
    <img :src="logo" alt="logo" />
  </footer>
</template>

<script>
const logo = require('@assets/logo.png')
export default {
  props: {
    footerStyle: {
      type: Object,
      default: () => ({
        position: 'absolute',
        bottom: window.innerHeight < 640 ? '8px' : '20px',
      }),
    },
  },
  beforeCreate () {
    this['logo'] = logo
  },
}
</script>

<style scoped>
footer {
  width: 100%;
  text-align: center;
}

footer img {
  width: 63px;
}
</style>
