import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      redirect:'/home',
      meta: { keepAlive: true },
      component: () => import( './views/index.vue'),
      children:[
        {
          path: '/home',
          name: 'home', 
          component: () => import('./views/Home.vue'),
          meta: { keepAlive: true },
        },
        {
          path: '/Trade',
          name: 'Trade',
          component: () => import( './views/Trade.vue'),
          meta: { keepAlive: true },
        },
        {
          path:'/user',
          name:'user',
          component: () => import('./views/user.vue'),
          meta: { keepAlive: true },
        },
      ]
    },
    {
      path: '/Trade/pay',
      name: 'pay',
      component: () => import( './views/payment/pay.vue')
    },   
    {
      path: '/Trade/withdraw',
      name: 'withdraw',
      component: () => import( './views/payment/withdraw.vue')
    },
    {
      path:'/land',
      name:'land',
      component: () => import(/* webpackChunkName: "about" */ './views/login/land.vue')
    },
    {
      path:'/register',
      name:'register',
      component: () => import(/* webpackChunkName: "about" */ './views/login/register.vue')
    },
    {
      path:'/resetpassword',
      name:'resetpassword',
      component: () => import(/* webpackChunkName: "about" */ './views/login/resetpassword.vue')
    },
    { 
      path:'/ServiceAgreement',
      name:'ServiceAgreement',
      component: () => import(/* webpackChunkName: "about" */ './views/login/ServiceAgreement.vue')
    },
    {
      path:'/Privacyclause',
      name:'Privacyclause',
      component: () => import(/* webpackChunkName: "about" */ './views/login/Privacyclause.vue')
    },
    {
      path:'/StatementResponsibility',
      name:'StatementResponsibility',
      component: () => import(/* webpackChunkName: "about" */ './views/login/StatementResponsibility.vue')
    },
    {
      path:'/ProfitRanking',
      name:'ProfitRanking',
      component: () => import(/* webpackChunkName: "about" */ './views/ProfitRanking/index.vue')
    },
    {
      path:'/Newbie',
      name:'Newbie',
      component: () => import(/* webpackChunkName: "about" */ './views/ProfitRanking/Newbie.vue'),
    },
    {
      path:'/NewbieAnswer',
      name:'NewbieAnswer',
      component: () => import(/* webpackChunkName: "about" */ './views/ProfitRanking/NewbieAnswer.vue')
    },
    {
      path:'/Voucher',
      name:'Voucher',
      component: () => import(/* webpackChunkName: "about" */ './views/user/voucher.vue')
    },
    {
      path:'/Attestation',
      name:'Attestation',
      component: () => import(/* webpackChunkName: "about" */ './views/user/attestation.vue')
    },
    {
      path:'/Messagecenter',
      name:'Messagecenter',
      component: () => import(/* webpackChunkName: "about" */ './views/user/messagecenter.vue')
    },
    {
      path:'/Aboutus',
      name:'Aboutus',
      component: () => import(/* webpackChunkName: "about" */ './views/user/aboutus.vue')
    },    
    {
      path:'/Kline',
      name:'Kline',
      component: () => import(/* webpackChunkName: "about" */ './views/payment/kline.vue')
    },
    {
      path:'/Unwind',
      name:'Unwind',
      component: () => import(/* webpackChunkName: "about" */ './views/payment/UnwindHistory.vue')
    },
    {
      path:'/Recharge',
      name:'Recharge',
      component: () => import(/* webpackChunkName: "about" */ './views/payment/recharge.vue')
    },
    {
      path:'/PayLane',
      name:'PayLane',
      component: () => import(/* webpackChunkName: "about" */ './views/payment/payLane.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import(/* webpackChunkName: "about" */ './views/games/games.vue')
    }
  ]
})