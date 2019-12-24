<template>
    <div class="app">
         <van-nav-bar title="新手学堂"  fixed  @click-left="$back()"  left-arrow="" />
         <div class="nav">
             <div class="nav_item">
                 <img src="../../assets/jichu.png" alt="">
                 <div>基础知识</div>
             </div>
             <div class="line"></div>
             <div class="nav_item">
                 <img src="../../assets/caozuo.png" alt="">
                 <div>操作指南</div>
             </div>
             <div class="line"></div>
             <div class="nav_item">
                 <img src="../../assets/zhinan.png" alt="">
                 <div>投资入门</div>
             </div>
         </div>
         <div class="top">
             <div class="top_title">
                 <span class="fl f1"></span>
                 <span>基础知识</span>
             </div>
             <div class="top_content">
                 <van-cell title="交易时间"  @click="newbieanswer('Transactiontime')"/>
                 <van-cell title="充值提现时间"  @click="newbieanswer('pricetime')" />
                 <van-cell title="什么是买涨买跌"  @click="newbieanswer('risefall')" />
                 <van-cell title="什么是建仓、持仓、平仓、爆仓" @click="newbieanswer('warehouse')" />
             </div>
         </div>
         <div class="top">
             <div class="top_title">
                 <span class="fl f2"></span>
                 <span>操作指南</span>
             </div>
             <div class="top_content">
                 <van-cell title="什么是代金劵"  @click="newbieanswer('Cashcoupon')" />
                 <!-- <van-cell title="如何充值提现"  @click="newbieanswer('Rechargewithdrawal')" /> -->
                 <van-cell title="如何设置止盈止损"  @click="newbieanswer('windamage')" />
                 <van-cell title="如何查看盈亏及资金信息"  @click="newbieanswer('seeykzj')" />
             </div>
         </div>
         <div class="top">
             <div class="top_title">
                 <span class="fl f3"></span>
                 <span>投资入门</span>
             </div>
             <div class="top_content">
                 <van-cell title="一分钟了解K线"  @click="newbieanswer('kline')" />
                 <van-cell title="什么是数字货币"  @click="newbieanswer('numbercurrency')" />
                 <van-cell title="手续费如何收取"  @click="newbieanswer('ServiceCharge')" />
                 <van-cell title="平台注意事项"  @click="newbieanswer('Becareful')" />
             </div>
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

        };
    },
    computed: {

    },
    created() {
    },
    mounted() {

    },
    watch: {

    },
    methods: {
        newbieanswer(n){
            this.$store.commit('alternew',n);
            this.$router.push('/NewbieAnswer');
        }

    },
    components: {

    },
};
</script>

<style scoped lang="scss">
.app{
    padding-top: 50px;
    .van-nav-bar{
        box-shadow: 1px 1px 1px rgba(0,0,0,.05)!important;
        .van-nav-bar__left{
            .van-icon{
                color:#000;
                font-size: 18px;
            }
        }
        .van-nav-bar__title{
            font-weight: 600;
            font-size:18px;
        }
    }
}
.nav{
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    height: 84px;
    .line{
        width: 1px;
        height: 50px;
        background-color: #eee;
        margin-top: 17px;
    }
    .nav_item{
        margin: 14px 0px;
        width: 125px;
        img{
            width: 39px;
            height: auto;
        }
        div{
            line-height: 25px;
            height: 20px;
            font-size: 14px;
            font-weight: 400;
        }
    }
}
.top{
    background-color: #fff;
    .f1{
        background:rgba(255,121,101,1);
    }
    .f2{
        background:rgba(251,196,62,1);
    }
    .f3{
        background:rgba(163,133,241,1);
    }
    .top_title{
        line-height: 40px;
        text-align: left;
        height: 40px;
        padding: 0 15px;
        box-sizing: border-box;
        background-color: #ddd5;
        span:nth-child(1){
            display: inline-block;
            margin: 11px 0;
            width:8px;
            height:18px;
        }
        span:nth-child(2){
            display: inline-block;
            padding-left: 10px;
            line-height: 40px;
            font-size: 14px;
            color: #333;
            font-weight: 600;
        }
    }
    .top_content{
        padding: 0 15px;
        box-sizing: border-box;
        .van-cell:not(:last-child)::after{
          display: none;
        }
    }
}
.van-cell{
    text-align: left;
    // padding:  15px 20px;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    .van-cell__title{
        span{
            // padding-left: 15px;
            color: #666;
            font-size: 14px;
        }
    }
}
</style>
