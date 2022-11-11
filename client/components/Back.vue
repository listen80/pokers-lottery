<template>
  <div class="back">
    <template v-if="needFirewords">
      <img :src="left" class="left" />
      <img :src="right" class="right" />
    </template>
  </div>
</template>

<script>
const left = require('@assets/back/fireworks-left.png')
const right = require('@assets/back/fireworks-right.png')
export default {
  props: {
    needFirewords: {
      type: Boolean,
      default: false,
    },
  },
  beforeCreate () {
    this['left'] = left
    this['right'] = right
  },
}
</script>

<style scoped>
.back {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 0;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}
.back > img {
  position: absolute;
}

.back > img.left {
  top: 30px;
  width: 72px;
}

.back > img.right {
  right: 0;
  top: -32px;
  width: 99px;
}

.back > .logo {
  bottom: 24px;
  left: 50%;
  transform: translate(-50%);
}
</style>
