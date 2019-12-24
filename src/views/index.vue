<template>
    <div class="app">
      <keep-alive>
        <router-view />
      </keep-alive>
        <nav >
            <div @click="tablist('1')" :class="link ==1 ? 'active':''">
              <div><img :src="home" alt="" ></div>
              <div>首页</div>
            </div>
            <div  v-if="$store.state.ischeck"  @click="tablist('2')" :class="link ==2 ? 'active':''">
              <div><img class="trade_title_img" :src="trade" alt="" ></div>
              <div>交易</div>
            </div>
            <div @click="tablist('3')" :class="link ==3 ? 'active':''">
              <div><img :src="user" alt="" ></div>
              <div>我的</div>
            </div>
        </nav>
        <img class="hongbao"  src="../assets/hongbao.png"  v-show="!show && !$store.state.ticket " @click="show = true;">
        <div class="hongbao_big" v-show="show">
          <div class="box">
            <span class="fr" @click="show = false;">×</span>
           <router-link to="land" class="clearfix">
            <img class=""  src="../assets/bighongbao.png" alt="">
           </router-link>
          </div>
        </div>
        <van-overlay :show="show" @click="show = false"/>
    </div>
</template>

<script>
import home from '../assets/bottom_icon/home.png'
import homeactive from '../assets/bottom_icon/homeactive.png'
import trade from '../assets/bottom_icon/trade.png'
import tradeactive from '../assets/bottom_icon/tradeactive.png'
import user from '../assets/bottom_icon/user.png'
import useractive from '../assets/bottom_icon/useractive.png'
export default {
    name: 'index',
    data() {
        return {
          show:false,
          home:homeactive,
          trade:trade,
          user:user,
          link:1,
        };
    },
    computed: {

    },
    created() {
      // this.getExamine();
      let userchange = this.$store.state.userchange;
      let tradechange = this.$store.state.tradechange;
      let homechange = this.$store.state.homechange;
      if(userchange ==3){
         this.user = useractive;
         this.home = home;
         this.trade = trade;
         this.link = 3;
       }else if(tradechange ==2){
         this.user = user;
         this.home = home;
         this.trade = tradeactive;
         this.link = 2;
       }else if(homechange ==1){
         this.user = user;
         this.home = homeactive;
         this.trade = trade;
         this.link = 1;
       }
    },
    mounted() {
      this.getTab();
    },
    watch: {
      },
    methods: {
      tablist(n){
       this.getTab();
       if(n == 1){
         this.home = homeactive;
         this.trade = trade;
         this.user = user;
         this.link = 1;
         this.$router.push('/home');
       }else if(n == 2){
         this.trade = tradeactive;
         this.user = user;
         this.home = home;
         this.link = 2;
         this.$router.push('/trade');
       }else if(n ==3){
         this.user = useractive;
         this.home = home;
         this.trade = trade;
         this.link = 3;
         this.$router.push('/user');
       }
      },
      getTab(){
        var url = window.location.href.split('#/');
        if(url[1] == "home"){
         this.home = homeactive;
         this.trade = trade;
         this.user = user;
         this.link = 1;
        } else if(url[1] == "trade"){
         this.trade = tradeactive;
         this.user = user;
         this.home = home;
         this.link = 2;
        } else{
         this.user = useractive;
         this.home = home;
         this.trade = trade;
         this.link = 3;
        }      
      },
      getExamine(){
        this.$axios.get(this.basesURL + '/app/get-examine').then(res => {
          if(res.data.code == 0 ) {
            this.$store.state.ischeck = !res.data.data;
          }
        })
      }
    },
    components: {
    },
};
</script>

<style scoped lang="scss">
.trade_title_img{
  width: 24px;
  height: 22px!important; 
}
.app{
  padding-bottom: 50px;
}
.van-overlay{
  z-index: 100 !important;
  background-color: rgba(0,0,0,0.4);
}
nav {
  position: fixed;
  z-index: 9;
  width: 100vw;
  height: 50px;
  bottom: 0;
  background-color: #fff;
  box-shadow: 1px 1px 5px rgba(204,204,204,.5);
  box-sizing: border-box;
}
nav>div{
  font-weight: normal;
  color: #2c3e50;
  font-size: 14px;
  width: 33.33vw;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  margin-top: 8px;
  &>div:nth-child(2){
    &:nth-child(1){
      img{
        width:22px; 
        height: 22px;
      }
    }
  }
  &>div{
    &:nth-child(1){
      height: 22px;
      padding: 0;
      margin: 0; 
      img{
        width: 22px;
        height: 22px;
      }
    }
    &:nth-child(2){
      padding: 0;
      margin: 0;
      line-height:18px;
      font-size: 12px;
      color: #666;
    }
  }
}
nav .active div:nth-child(2){
  color: #5686D3;
}
.hongbao{
  width: 58px;
  height: 72px;
  position: fixed;
  right: 15px;
  bottom: 70px;
  z-index: 100;
}
.hongbao_big{
  .box{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 999;
    img{
        width: 264px;
        position: relative;
        left: -13px;
    }
    span{
      display: inline-block;
      color:#fff;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      border: 1px solid #fff;
      border-radius: 50%;
    }
  }
}
</style>
