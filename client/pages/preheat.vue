<template>
  <div class="preheat">
    <!-- <div class="title">CONTENT SERVICES & VIDEO</div> -->
    <div class="title">VIDEO BJ</div>
    <div class="image">
      <img :src="preheat" alt="" />
    </div>
    <div class="expect">敬请期待</div>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from '../components/Footer'
const preheat = require('@assets/preheat.gif')
export default {
  name: 'preheat',
  components: { Footer },
  beforeCreate () {
    this['preheat'] = preheat
  },
  created () {
    this.$onmessage(this.handle)
  },
  beforeDestroy () {
    this.$removemessage(this.handle)
  },
  methods: {
    handle () {},
  },
}
</script>

<style scoped>
.preheat {
  width: 100%;
  height: 100%;
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;
}
.title {
  padding-top: 20px;
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: 700;
}
.image {
  padding: 0 24px;
}
.expect {
  margin-bottom: 64px;
  font-size: 20px;
  font-weight: 700;
}
@media screen and (min-height: 640px) {
  .preheat {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    padding-top: 42px;
  }
}
@media screen and (max-height: 639px) {
  .expect {
    margin-bottom: 54px;
  }
}
@media screen and (max-height: 553px) {
  .image,
  .title {
    padding: 0 48px;
  }
}
</style>
