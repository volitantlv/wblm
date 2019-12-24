<template>
    <div class="app">
      <van-nav-bar :title="title" fixed  left-arrow @click-left="$back()" class="newbieanswer"/>
      <!-- 交易时间 -->
      <div v-if="show == 'Transactiontime'" class="Basicsfour">
           <img src="../../assets/newbie/dealtime.png" alt="" > 
      </div>
      <!-- 充值提现时间 -->
      <div v-if="show == 'pricetime'" class="Basicsfour">
           <img src="../../assets/newbie/investcashtime.png" alt="" > 
      </div>
      <!-- 买涨买跌 -->
      <div v-if="show == 'risefall'" class="Basicsfour">
           <img src="../../assets/newbie/Basics3.png" alt="" >
      </div>
      <!-- 建仓 持仓 平仓 爆仓 -->
      <div v-if="show == 'warehouse'" class="Basicsfour">
            <img src="../../assets/newbie/Basics4.png" alt="" >  
      </div>
      <!-- 代金券 -->
      <div  v-if="show == 'Cashcoupon'" class="Basicsfour">
         <img src="../../assets/newbie/operation1.png" alt="" >
      </div>
      <!-- 充值提现 -->
      <div  v-if="show == 'Rechargewithdrawal'" class="Basicsfour">
           充值提现
      </div>
      <!-- 止赢止损 -->
      <div  v-if="show == 'windamage'" class="Basicsfour">
         <img src="../../assets/newbie/operation3.png" alt="" >
      </div>
      <!-- 查看盈亏及资金信息 -->
      <div  v-if="show == 'seeykzj'" class="Basicsfour">
         <img src="../../assets/newbie/operation4.png" alt="" >
      </div>
      <!-- 一分钟了解K线图 -->
      <div  v-if="show == 'kline'" class="Basicsfour">
         <img src="../../assets/newbie/Investment1.png" alt="" >
      </div>
      <!-- 数字货币 -->
      <div  v-if="show == 'numbercurrency'" class="Basicsfour">
        <img src="../../assets/newbie/Investment2.png" alt="" >
      </div>
      <!-- 手续费 -->
      <div  v-if="show == 'ServiceCharge'" class="Basicsfour">
        <img src="../../assets/newbie/Investment3.png" alt="" >
      </div>
      <!-- 平台注意事项 -->
      <div  v-if="show == 'Becareful'" class="Basicsfour">
        <img src="../../assets/newbie/Investment4.png" alt="" >
      </div>
    </div>
</template>

<script>
export default {
    name: '',
    props: {
    
    },
    data() {
        return {
            show:null,
            title:''
        };
    },
    computed: {
    },
    created() {
        let tabs = this.$store.state.link;        
        let tab = this.$store.state.new
        this.show = tab;
        if(tab == 'Transactiontime'){
            this.title = "交易时间"
        }else if(tab == 'pricetime'){
            this.title = "充值提现时间"
        }else if(tab == 'risefall'){
            this.title = "买涨买跌"
        }else if(tab == 'warehouse'){
            this.title = "建仓、持仓、平仓、爆仓"
        }else if (tab == 'Cashcoupon'){
            this.title = '代金券'
        }else if (tab == 'Rechargewithdrawal'){
            this.title = '充值提现'
        }else if (tab == 'windamage'){
            this.title = "止赢止损"
        }else if (tab == "seeykzj"){
            this.title = "盈亏及资金信息"
        }else if(tab == "kline"){
            this.title = "K线图"
        }else if (tab == 'numbercurrency'){
            this.title = "数字货币"
        }else if(tab == 'ServiceCharge'){
            this.title = "手续费"
        }else if (tab =='Becareful'){
            this.title = "平台注意事项"
        }
    },
    mounted() {
    },
    watch: {

    },
    methods: {
    },
    components: {

    },
};
</script>

<style scoped lang="scss">
.app{
  .newbieanswer{
    box-shadow: 1px 1px 1px rgba(0,0,0,.05)!important;
    .van-nav-bar__left{
      .van-icon{
        color: #000;
        font-size: 18px;
      }
    }
    .van-nav-bar__title{
        font-weight: 600;
        font-size:18px;
    }       
  }
  .Basicsfour{
    margin-top: 40px;
    img{
    width: 100%;
    height: auto;
    }
  }
}

</style>
