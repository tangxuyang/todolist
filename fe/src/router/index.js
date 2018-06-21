import Vue from 'vue'
import Router from 'vue-router'
import Todos from '@/components/todos'
import Token from '@/components/token'
import AddUser from '@/components/addUser'

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
    },{
      path: '/addUser',
      name: 'addUser',
      component: AddUser
    }
  ]
})
