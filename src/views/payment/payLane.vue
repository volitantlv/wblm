<template>
    <div class="payLane">
        <van-nav-bar title="支付通道" fixed   @click-left="$back()" left-arrow class="payLane_title"/>
        <div class="payLane_msg">已为您甄选优质商家</div>
        <div class=""></div>
    </div>
</template>

<script>
export default {
};
</script>

<style scoped lang="scss">
.payLane{
    padding-top: 55px;
    box-sizing: border-box;
    .payLane_msg{
        text-align: left;
        line-height:20px;
        font-size:14px;
        padding: 5px 30px;
        color:rgba(86,134,211,1);
    }
}
// 头部样式
.payLane_title{
    box-shadow: 1px 1px 1px rgba(0,0,0,.05)!important;
    background:rgba(58,61,81,1);
    .van-nav-bar__left{
        .van-icon{
        color: #fff;
        font-size: 18px;
        }
    }
    .van-nav-bar__title{
        color: #fff;
        // font-weight: 600;
        font-size:18px;
    }
}
       
</style>
