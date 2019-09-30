<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
import store from './store'

export default {
  name: 'App',

  data:function() {
    return {
      lastRefreashTimestamp: new Date().getTime(),
      minGap:4*60*1000, // 十分钟刷新一次
    }
  },
  methods:{
    funMouseMove() {
      var lastMoveTimestamp = new Date().getTime();
      if (lastMoveTimestamp > this.lastRefreashTimestamp) {
          this.lastRefreashTimestamp = lastMoveTimestamp + this.minGap;
          setTimeout(function(){
            store.dispatch('GetUserInfo').then(res => {})
          },this.minGap);
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
