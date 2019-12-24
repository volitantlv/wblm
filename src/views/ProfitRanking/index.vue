<template>
    <div class="app">
        <van-nav-bar title="盈利排行" fixed right-text=""  @click-left="$back()" left-arrow>
            <!-- <van-icon slot="right"><img src="../../assets/navright.png" alt=""></van-icon> -->
        </van-nav-bar>
        <van-tabs  class="profitranking" title-inactive-color="#999" title-active-color="#333">
            <!-- <van-tab title="盈利率榜%">
                <div class="tab_list">
                    <span :class="list_rate == 1 ? 'active': ''"  @click="tablist_rate('1')">日榜</span>
                    <span :class="list_rate == 2 ? 'active': ''"  @click="tablist_rate('2')">周榜</span>
                </div>
                <div class="tp clearfix">
                    <div class="tp_item" v-if="EarningsList.length >= 2">
                        <img src="../../assets/caishen.png" alt="">
                        <img class="tp_item_bt" src="../../assets/bangtwol.png" alt="">
                        <div class="tp_item_name">{{EarningsList[1].Customer}}</div>
                        <div class="tp_item_rate">{{ (EarningsList[1].ReturnRate.toFixed(2) * 100).toFixed(0) + "%"}}</div>
                    </div>
                    <div class="tp_item"  v-if="EarningsList.length >= 1">
                        <img src="../../assets/caishen.png" alt="">
                        <img class="tp_item_bt" src="../../assets/bangonel.png" alt="">
                        <div class="tp_item_name">{{EarningsList[0].Customer}}</div>
                        <div class="tp_item_rate">{{(EarningsList[0].ReturnRate.toFixed(2) * 100 ).toFixed(0)+ "%"}}</div>
                    </div>
                    <div class="tp_item"  v-if="EarningsList.length >= 3">
                        <img src="../../assets/caishen.png" alt="">
                        <img class="tp_item_bt" src="../../assets/bangthreel.png" alt="">
                        <div class="tp_item_name">{{EarningsList[2].Customer}}</div>
                        <div class="tp_item_rate">{{(EarningsList[2].ReturnRate.toFixed(2) * 100).toFixed(0) + "%"}}</div>
                    </div>
                </div>
                <div class="bt">
                    <div class="bt_item" v-for="(v,k) in EarningsList" :key="k" v-if="k > 2">
                        <span class="num fl">{{k + 1}}</span>
                        <img class="fl" src="../../assets/caishen.png" alt="">
                        <span class="user fl">{{v.Customer}}</span>
                        <span class="fr">{{v.ReturnRate.toFixed(2) * 100 + "%"}}</span>
                    </div>
                </div>  
                <div class="nowtime">{{$formatDateTime().substring(0,10)}}</div>
            </van-tab> -->
            <van-tab title="">
                <div class="tab_list">
                    <span :class="list_quota == 1 ? 'active': ''"  @click="tablist_quota('1')">日榜</span>
                    <span :class="list_quota == 2 ? 'active': ''"  @click="tablist_quota('2')">周榜</span>
                </div>
                <div class="tp clearfix">
                     <div class="tp_item" v-if="quotaList.length >= 2">
                        <img src="../../assets/caishen.png" alt="">
                        <img class="tp_item_bt" src="../../assets/bangtwol.png" alt="">
                        <div class="tp_item_name">{{quotaList[1].Customer}}</div>
                        <div class="tp_item_rate">${{quotaList[1].profitAmount}}</div>
                    </div>
                    <div class="tp_item"  v-if="quotaList.length >= 1">
                        <img src="../../assets/caishen.png" alt="">
                        <img class="tp_item_bt" src="../../assets/bangonel.png" alt="">
                        <div class="tp_item_name">{{quotaList[0].Customer}}</div>
                        <div class="tp_item_rate">${{quotaList[0].profitAmount}}</div>
                    </div>
                    <div class="tp_item"  v-if="quotaList.length >= 3">
                        <img src="../../assets/caishen.png" alt="">
                        <img class="tp_item_bt" src="../../assets/bangthreel.png" alt="">
                        <div class="tp_item_name">{{quotaList[2].Customer}}</div>
                        <div class="tp_item_rate">${{quotaList[2].profitAmount}}</div>
                    </div>
                </div>
                <div class="bt">
                   <div class="bt_item" v-for="(v,k) in quotaList" :key="k" v-if="k > 2">
                        <span class="num fl">{{v.ranking}}</span>
                        <img class="fl" src="../../assets/caishen.png" alt="">
                        <span class="user fl">{{v.customerName}}</span>
                        <span class="fr">${{v.profitAmount}}</span>
                    </div>
                </div>
                 <div class="nowtime">{{$formatDateTime().substring(0,10)}}</div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
export default {
    name: '',
    props: {

    },
    data() {
        return {
            list_rate: 1,
            list_quota:1,
            EarningsList:'',
            nowdate:'',
            quotaList:null
        };
    },
    computed: {
        
    },
    created() {
        this.tablist_rate(1);
        this.tablist_quota(1)
    },
    mounted() {

    },
    watch: {

    },
    methods: {
        tablist_rate(n){
            this.list_rate = n;
            let that = this;
            let time = this.$formatDateTime();
            this.$axios.get(this.basesURL+"/good/get-rank-list",{
                params:{
                    rankType: n,
                    rankDay:time
                }
            }).then( res => {
                /* eslint-disable */
                if(res.data.code == 0 ){
                    that.EarningsList = res.data.data;                    
                }
            })
        },
        tablist_quota(n){
            this.list_quota = n;
            let that = this;
            this.$axios.get(this.basesURL+'/good/get-new-rank-list',{
                params:{
                    rankType:n
                }
            }).then(res => {
                if(res.data.code == 0 ){
                    that.quotaList = res.data.data;
                }
            })
        }
    },
    components: {

    },
};
</script>

<style scoped lang="scss">
.app{
    width:100%;
    height:100vh;
    padding-top: 50px;
    background-color: #fff;
    .profitranking{
        margin-top: -50px;
        .van-tabs__wrap{
            .van-tabs__nav{
                .van-tab{
                  .van-ellipsis{
                      font-size: 16px;
                      font-weight: 600;
                  }
                }
            }
        }
    }
}
.van-nav-bar{
     box-shadow: 1px 1px 1px rgba(0,0,0,.05)!important;
     .van-nav-bar__title{
         font-weight: 600;
         font-size:18px;
     }
     .van-nav-bar__left{
       .van-icon{
         font-size: 18px;
         color: #333;
       }
     }
    .van-nav-bar__right{
       .van-icon{
           img{
             height: 20px;
             width: auto;
           }
       }
     }
}
.tab_list{
    width: 116px;
    height: 28px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 20px;
    background-color: #ccc;
    margin-top: 15px;
    overflow: hidden;
    span{
        display: inline-block;
        cursor: pointer;
        color: #fff;
        width: 50%;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        background-color: #ddd;
        &.active{
           background:rgba(255,108,71,0.8);
        }
    }
}
.tp{
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    margin-top: 18px;
    height: 150px;
    .tp_item{
        width: 68px;
        height: 74px;
        background: url('../../assets/bangtwo.png');
        background-size: contain;
        position: relative;
        &:nth-child(1),
        &:nth-child(3){
            margin-top: 40px;
        }
        &:nth-child(2){
        background: url('../../assets/bangone.png');
        background-size: contain;
        margin: 0 15px;
        }
        &:nth-child(3){
            background: url('../../assets/bangthree.png');
           background-size: contain;
        }
        img:nth-child(1){
            width: 58px;
            height: 56px;
            margin: 6.7px;
            margin-top:13px;
            border-radius: 50%;
        }
        .tp_item_bt{
            width: 70px;
            position: absolute;
            bottom: -10px;
            left: 0;
        }
        .tp_item_name{
            color: #333;
            margin-top: 5px;
            line-height: 15px;
            font-weight: 500;
            position: relative;
            left: -.3rem;
        }
        .tp_item_rate{
            color: #FF6C47;
            font-size: 12px;
        }
    }
}
.bt{
    padding: 0 18px;
    box-sizing: border-box;
    margin-top: 19px;
    min-height: 345px;
    .bt_item{
        line-height: 46px;
        height: 46px;
        border-bottom:1px solid #eee;
        padding: 0 18px;
        &:last-child{
            border:none;
        }
        img{
            width: 34px;
            height: 34px;
            margin: 6px;
            border-radius: 50%;
            margin-left:16px;
        }
        .num{
            color: #666;
            font-size: 14px;
            width: 15px;
            font-family: "等线";
        }
        span{
            display: inline-block;
        }
        .user{
            padding-left: 22px;
            // font-family: "等线";
        }
        .fr{
            color: #FF6C47;
            font-size: 15px;
            font-family: "等线";
        }
    }
}
    .nowtime{
        font-family:'等线';
        color:#ddd;
        line-height:33px;
        height:33px;
        font-size:14px;
    }
</style>
