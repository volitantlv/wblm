import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'lib-flexible'
import eCharts from 'echarts'
import axios from 'axios'
import QS from 'qs'
import com from './lib/com'        
import 'echarts/lib/chart/bar'
import { Toast } from 'vant';

// let basesURL = "http://122.144.213.29:37373"; //测试环境的地址
let basesURL = "http://47.102.128.188:8083" //正式环境的地址
Vue.prototype.basesURL = basesURL + "/web";
Vue.prototype.imgURL = basesURL +"/management-web/file/get-image?filename=";
Vue.use(Vant);
Vue.use(com);
Vue.use(eCharts)
// 全局的echarts组件

Vue.prototype.$echarts = eCharts;
Vue.prototype.$axios = axios;
Vue.prototype.qs = QS;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// axios 请求拦截器
axios.interceptors.request.use(function (config) {  
  if(config.url == "/user/register" || config.url == "/user/send-register-code" ||config.url =="/user/login"){
    
  }else{
    com.getOverTime();
    let ticket = localStorage.getItem('ticket');
    axios.defaults.headers.post['ticket'] = ticket;
    config.headers = {
      'ticket': ticket
    }
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
let i = 0;
axios.interceptors.response.use(res => {
  // 对响应数据做些什么
  if(res.data.code == 80823) {
    i++;
    if(i<=1){
      // Toast({
      //   duration: 1500,// 持续展示 toast
      //   forbidClick: true, // 禁用背景点击
      //   message: '登录状态失效,请重新登录'
      // });
      return
    }
    setTimeout(function(){
      localStorage.clear();
      let name = router.history.current.name;
      if (name == "land" || name == "register" || name == "home" || name == "resetpassword" || name == 'ServiceAgreement' || name == "Privacyclause" || name == "StatementResponsibility"){
        return false;
      }else{
        router.push('land');
      }
    },500)
  }else{
    i = 0;
    return res;
  }
  return res;
}, err => {
  return Promise.reject(err)
})

// 登录守卫
router.beforeEach((to,from,next)=>{
  // 路由守卫
  if (to.fullPath !== "/home" && to.fullPath !== "/land" && to.fullPath !== "/game"  && to.fullPath !== "/register" && to.fullPath !== "/resetpassword" && to.fullPath !== "/ServiceAgreement" && to.fullPath !== "/Privacyclause" && to.fullPath !== "/StatementResponsibility"){
    if(!store.state.ticket){
      next('/land');
    }else{
      if (!store.state.ischeck){
        if(to.fullPath !== "/user"){
          return false;
        }
      }
      next();
    }
  }else{
    next();
  }
})