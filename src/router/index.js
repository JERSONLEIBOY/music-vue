import { createRouter, createWebHashHistory } from "vue-router";
import Rank from '../components/rank/rank.vue';
import Recommend from '../components/recommend/recommend.vue';
import Search from '../components/search/search.vue';
import Singer from '../components/singer/singer.vue';
import SingerDetail from '../components/singer-detail/singer-detail.vue';
import Disc from '../components/disc/disc.vue';
import TopList from '../components/top-list/top-list.vue';
import UserCenter from '../components/user-center/user-center.vue';
import HelloWord from '../components/HelloWorld.vue';
import Login from '../views/Login.vue';
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [{
      path: ':id',
      component: Disc
    }]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    children: [{
      path: ':id',
      component: TopList
    }]

  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  },
  {
    path: '/HelloWord',
    name: 'HelloWord',
    component: HelloWord,
  },
  {
    path: '/user',
    component: UserCenter
  },
  {
    path: '/login',
    component: Login
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token');
//   if (to.path === '/login') {
//     if (token) {
//       next({
//         path: from.path
//       })
//     } else {
//       next()
//     }
//   } else {
//     if (token === null || token === '') {
//       next('/login')
//     } else {
//       next()
//     }
//   }
// })



export default router