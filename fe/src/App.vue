<template>
  <div id="app">       
    <router-view></router-view>
    <Login ref="login"/>
  </div>
</template>

<script>
import Login from '@/components/userLogin';

export default {
  name: 'app',
  components:{
    Login:Login
  },
  methods:{
    login(cb){
      this.$refs.login.visible = true;
      this.$refs.login.successCb = cb;
    }
  },
  created(){
    window.appRoot = this;
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
