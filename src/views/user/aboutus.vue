<template>
    <div class="aboutus">
        <van-nav-bar title="关于我们" fixed   @click-left="$back()" left-arrow class="about_us"/>
        <div><img src="../../assets/btmex_logo.png"></div>
        <p class="describe" align="justify">玩币联盟是一款提供新颖的数字货币交易模式的平台，是由在英国注册的、提供数字资产服务的WINCENT国际资讯有限公司(以下简称“我公司”或“公司”)运营</p>
        <p class="describe" align="justify">我公司拥有2006年英国公司法案经营牌照、迪拜多种商品交易中心的经营牌照。</p>
        <p class="describe" align="justify">公司主要经营范围:提供批发或通用财务顾问服务;经纪服务(包括保管服务);财务顾问或合格财务实体的雇主。</p>
    </div>
</template>

<script>
export default {
};
</script>

<style scoped lang="scss">
.aboutus{
    padding-top: 46px;
    div{
        img{
            width: 67px;
            height: auto;
            margin: 30px 0 25px 0;
        }
    }
    .describe{
        padding: 0 22px;
        color:rgba(102,102,102,1);
        line-height:36px;
        font-size: 14px;
        // text-align: left;
        text-indent: 2em;
    }
}
    .about_us{
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
            font-weight: 600;
            font-size:18px;
        }
    }
       
</style>
