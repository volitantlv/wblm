<template>
    <div class="app">
       <van-nav-bar title="平仓" style="background-color:#3A3D51;color:#fff;"  fixed @click-left="$back()" left-arrow=""  class="transaction"/>
       <div class="Unwind_content">
           <div class="Unwind_title clearfix">
                <div class="fr" :class="Position.GrossProfit >= 0 ?'zhang':'die'">
                    {{Position.GrossProfit >= 0 ? '+' + Position.GrossProfit : Position.GrossProfit }}USDT 
                </div>
                <div class="title">
                    <span :class="Position.BuySell == 1 ?'zhang':'die'"></span>
                    <span :class="Position.BuySell == 1 ?'zhang':'die'">{{Position.BuySell == 1 ?'买涨':'买跌'}}</span>
                    <span :class="Position.BuySell == 1 ?'zhang':'die'">{{Position.Amount}}手</span>
                    <span>{{Position.Name}}</span>
                </div>

           </div>
           <div class="Unwind_item clearfix">
               <div class="item">
                   <span> 建仓价：</span>{{Position.OpenPrice}}
               </div>
               <div class="item">
                   <span> 建仓时间：</span>{{$getTime(Position.PositionTime)}}
               </div>
               <div class="item">
                   <span> 平仓价：</span>{{Position.ClosePrice}}
               </div>
               <div class="item">
                   <span> 平仓时间：</span>{{$getTime(Position.CloseTime)}}
               </div>
           </div>
           <div class="Unwind_item clearfix">
               <div class="item">
                   <span>手续费：</span>{{Position.OpenCharge}}USDT
               </div>
               <div class="item">
                   <span>建仓成本：</span>{{Position.OpenCost}}USDT
               </div>
               <div class="item">
                   <span>购买方式：</span>{{Position.IsVoucher == 0 ?  "余额购买" :'代金券购买'}}
               </div>
               <div class="item">
                   <span>止盈 </span>{{(Position.Limit * 100).toFixed(0) + "%"}} /
                   <span>止损 </span>{{(Position.Stop * 100).toFixed(0) + "%"}}
               </div>
               <div class="item">
                   <span>平仓类型：</span>{{Position.CloseType == 0 ? '自动平仓' : '手动平仓'}}
               </div>
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
            positionID:'',
            Position:''
        };
    },
    created(){
        this.positionID = this.$store.state.positionID;
    },
    mounted(){
        this.$axios.post(this.basesURL + '/trades-auth/get-hisposition-info',{
            positionId:this.positionID,
        }).then(res => {
            if(res.data.code ==  0 ) {
                this.Position = res.data.data.Position;
            }
        })
    }

};
</script>

<style scoped lang="scss">
// .app{
//     width: 100vw;
//     height: 100vh;
//     background-color: #f8f8f8;
// }
.van-nav-bar__title{
    color: #fff;
}
.van-nav-bar .van-icon{
    color: #fff;
}
.Unwind_content {
    width: 340px;
    margin: 10px 17.5px;
    border-radius: 10px;
    height: 240px;
    margin-top: 65px;
    box-shadow: 0px 0px 10px #ccc;
}
.Unwind_title,.Unwind_item{
    margin: 0 17.5px;
}
.Unwind_title{
    line-height: 45px;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #eee;
    .fr{
       padding-right: 15px;
    }
    .title{
        text-align: left;
        span:nth-child(1){
            width: 8px;
            padding: 0;
            height: 20px;
            display: inline-block;
            background-color: #FF6C47;
            position: relative;
            top:4px;
            &.zhang{
                background-color: #FF6C47;
            }
            &.die{
                background-color: #14C591;
            }
        }
        &:nth-child(2){
            padding: 0;
        }
        span{
            padding-left: 15px;
        } 
    }
} 
.Unwind_item{
    font-size: 12px;
    border-bottom: 1px solid  #eee;
    padding: 4px 0;
    &:last-child{
        border: none;
    }
    .item{
        width: 50%;
        float: left;
        text-align: left;
        line-height: 35px;
        span{
            color: #999999;
        }
    }
}

</style>
