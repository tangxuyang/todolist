<template>
  <div id="app">   
    <h1>任务列表</h1> 
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
    login(){
      this.$refs.login.visible = true;
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
