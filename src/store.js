import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ischeck:false,
    MediacyNo:null,
    loginId :null,
    sessionId:null,
    new :null,   //新手学堂界面 title传值到 分类 界面
    ticket:null,
    balance:'',
    userchange:'',    //底部 user界面 传值到首页
    tradechange:'',    //底部trade界面传值到首页
    homechange:'',     //底部home界面传值到首页
    nickName:'',
    Kcode:'',
    positionID:'',
    form:'',
    commodity:null,
    isSocket:false
  },
  mutations: {
    alterIscheckout (state,payload) {
      state.ischeck = payload
    },
    // 公用数据
    altercommodity(state, payload){
      state.commodity = payload
    }, 
    alterIssocket (state,payload) {
      state.isSocket = payload
    },
    // 下单返回
    alterform(state,payload){
      state.form = payload;
    },
    // positionID
    alterPosition(state, payload){
      state.positionID = payload
    },
    // k线的数据
    alterKline(state,payload){
      state.Kcode = payload;
    },
    // 登录信息
    altermessage(state,payload){
      state.sessionId = payload.sessionId;
      state.loginId = payload.LoginId;
      state.MediacyNo = payload.MediacyNo;
    },
    //余额信息
    alterbalance(state,payload){
      payload = payload.toFixed(2);
      state.balance = payload;
    },
    alterticket(state,payload){
      state.ticket = payload;
    },
    // alternew(state,payload){
    //   state.new = payload
    // },
    alternew(state,n){
      state.new = n
    },
    alerthref(state,k){
      state.userchange = k;
      state.tradechange = k;
      state.homechange = k;
    },
    alterNickName (state,payload){
      state.nickName = payload;
    }
  },
  actions: {
    
  }
})
