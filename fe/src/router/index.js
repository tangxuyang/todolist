import Vue from 'vue'
import Router from 'vue-router'
import Todos from '@/components/Todos'
import Token from '@/components/Token'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'todos',
      component: Todos
    },{
      path: '/token',
      name: 'token',
      component: Token
    }
  ]
})
