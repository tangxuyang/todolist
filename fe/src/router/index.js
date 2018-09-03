import Vue from 'vue'
import Router from 'vue-router'
import Todos from '@/components/todos'
import Token from '@/components/token'
import AddUser from '@/components/addUser'
//5b0e8192d0e8ae1e8dcdd14c
import Todo from '@/components/todo'
import Votes from '@/components/votes'
import VoteRecords from '@/components/voteRecords'

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
    },{
      path: '/todo/:id',
      name: 'todo',
      component: Todo
    },{
      path: '/votes',
      name: 'votes',
      component: Votes
    },{
      path: '/voterecords/:id',
      name: 'voterecords',
      component: VoteRecords
    }
  ]
})
