<template>
    <div class="switch">
        <van-nav-bar title="代金券" fixed right-text="" :class="vouchernav" @click-left="$back()" left-arrow>
        <van-icon slot="right"><img :src="navimg" alt=""></van-icon>
        </van-nav-bar>
        <div class="voucher" v-if="voucherList.length == 0">       
            <div class="voucher_none">
                <img src="../../assets/daijinquan.png" alt="">
                <div>您还没有代金劵哦～</div>
            </div>
        </div>
        <div class="voucherhave" v-if="voucher == 'voucherhave'">   
          <div class="vouchercontent clearfix" v-for="v in voucherList">
            <div class="fl leftcont" v-for="a in goods" v-if="a.Code == v.GoodsCode">
                <div style="font-weight:600">{{a.DepositFee}}</div>
                <div>USDT</div>
            </div>
            <div class="fr rightcont">
                <div class="fl">
                    <div style="font-weight:600">{{v.GoodsCode}}</div>
                    <div>有效期至{{$getTime(v.ValidEndDt)}}</div>
                </div>
                <div class="fr">
                    <van-button round @click="$router.push('/trade')">立即使用</van-button>
                </div>
            </div>
          </div>  
        </div>
    </div>
</template>

<script>
import navimg from '../../assets/navright.png'
import navpicture from '../../assets/navpucture.png'
export default {
    name: '',
    props: {

    },
    data() {
        return {
          voucher:'',
          vouchernav:'',
          navimg:'',
          voucherList:'',
          goods:''
        };
    },
    computed: {

    },
    created() {
       this.voucher ='voucherhave'  
    //   if(this.voucher == 'voucherhave'){
    //     this.vouchernav = 'vouchernav';
    //     this.navimg = navpicture;
    //   }
    //   if(this.voucher == 'voucher'){
    //     this.vouchernav=''
    //     this.navimg=navimg;
    //   }
    },
    mounted() {
        this.$axios.post(this.basesURL+'/voucher-auth/get-my-voucher-list',{
            skip:0,
            pageSize:100
        }).then(res => {
            // 成功回调
            if(res.data.code == 0) {
                this.voucherList = res.data.data.CustomerVoucherList;
            }
        })
        this.$axios.get(this.basesURL+'/good/get-list',{}).then(res => {
            if(res.data.code == 0 ) {
                this.goods = res.data.data.GoodsList
            }
        })
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
.switch{
    .vouchernav{
        background:rgba(58,61,81,1);
        .van-nav-bar__left{
          .van-icon{
            font-size: 18px;
            color: #fff;
          }
        }
        .van-nav-bar__title{
        color:#fff;
        font-weight: 600;
        font-size:18px;
        }
        .van-nav-bar__right{
          .van-icon{
            img{
                width: 20px;
                height: auto;
            }
          }
        }
    }
    
}
.van-nav-bar{
    box-shadow: 1px 1px 1px rgba(0,0,0,.05)!important;
    .van-nav-bar__left{
        .van-icon{
            font-size: 18px;
            color: #000;
        }
    }
    .van-nav-bar__title{
        font-size: 18px;
    }
    .van-nav-bar__right{
        .van-icon{
            img{
                width: 20px;
                height: auto;
            }
        }
    }
}
.voucher{
    .voucher_none{
        margin-top: 165px;
        img{
            width: 160px;
            height: 166px;
        }
        div{
            font-size:18px;
            margin-top: 30px;
            font-weight:400;
            color:rgba(153,153,153,1);
            line-height:25px;
            margin-top: 66px;
        }
    }
}
.voucherhave{
    padding-top: 62px;
    background:rgba(248,248,248,1);
    min-height: 100vh;
    .vouchercontent{
        margin: 16px 15px 0px 15px;
        height: 78px;
        background-image: url(../../assets/bjtvoucher.png);
        background-size: 100% 100%;
        &:nth-child(1){
            margin-top: 0;
        }
        .leftcont{
            width: 26%;
            height: 100%;
            padding-top: 14px;
            div{
               &:nth-child(1){
               font-size: 30px;
               color: #fff;
               }
               &:nth-child(2){
               font-size: 12px;
               color:#fff;
               }
            }
          
        }
        .rightcont{
            display: inline-block;
            height: 100%;
            padding-top: 16px;
            width: 74%;
            .fl{
                text-align: left;
                margin-left: 26px;
                div{
                    &:nth-child(1){
                        font-size: 14px;
                        color: rgba(86,134,211,1);
                    }
                    &:nth-child(2){
                        font-size: 12px;
                        color:rgba(153,153,153,.7);
                        margin-top: 6px;
                    }
                }
            }
            .fr{
                .van-button{
                  height: 26px;
                  width: 68px;
                  font-size: 14px;
                  line-height: 26px;
                  padding: 0;
                  border:1px solid rgba(86,134,211,1);
                  position: relative;
                  top: 10px;
                  right:10px;
                  .van-button__text{
                      font-size: 14px;
                      color:rgba(86,134,211,1); 
                  }
                }
            }
        }
    }
}
</style>
