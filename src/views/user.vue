<template>
    <div class="User">
        <div class="User_top">
            <div class="fl user_img">
                <img src="../assets/caishen.png" alt="">
            </div>
            <div class="fl user_mes">
                <div class="user_mes_name">{{this.$store.state.nickName}}</div>
                <div class="user_mes_tel">
                   {{this.loginId}}
                </div>
            </div>
        </div>
        <div class="User_message">
            <div class="user_message_content clearfix">
                <div class="user_message_content_left fl">
                    <div class="title">资产净值(USDT)</div>
                    <div style="font-family:'等线'">{{Math.round(this.assetValue * 100) / 100 }}</div>
                </div>
                <div class="user_message_content_right fr">
                    <div> <router-link to="/Voucher">我的代金劵：<span style="font-family:'等线'">{{voucherlen}}</span></router-link></div>
                    <div>浮动盈亏：<span style="font-family:'等线'" :class="profitNum > 0 ?'zhang':'die'">{{profitNum > 0? '+' + profitNum: + profitNum}}</span></div>
                    <div>可用余额：<span style="font-family:'等线'">{{this.$store.state.balance}}</span></div>
                </div>
            </div>
            <div class="user_message_img">
                <div class="img">
                    <router-link to="/Trade/pay">
                        <img src="../assets/firstcharge.png" alt="">
                    </router-link >
                </div>
            </div>
        </div>
        <div class="User_operation">
            <van-cell title="身份认证" :value="userMessage" is-link to="/Attestation" />
            <van-cell title="消息中心" is-link to="/messagecenter"/>
            <van-cell title="新手学堂" is-link to="/Newbie"/>
            <van-cell title="版本检测" value="V1.0.0" is-link />
            <van-cell title="关于我们" is-link to="/Aboutus"/>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userState:'',
            userMessage:'',
            text:"",
            color:"",
            loginId:'',
            profitNum:'', 
            assetValue:'',
            voucherlen :0,
            positionTimer:null
        }
    },
    created() {
        let that = this;
        this.$store.commit('alerthref',3);
        this.positionTimer = setInterval(this.getpositionList,3000); 
        this.$axios({
            method:'post',
            url:this.basesURL+'/account-auth/get-auth-real-name-status',
            data:{}
        }).then(res => {
            if(res.data.code == 0) {
                let code = res.data.data.AuthInfo.State;
                if(code == 0 ){
                    that.userMessage = "审核中";
                }else if (code == 1){
                    that.userMessage = "已通过"
                }else if (code == 9 ){
                    that.userMessage = "认证失败"
                }else{
                    that.userMessage = "前往认证"
                }
            }
        })
    },
    watch:{
        aaa:function (n,y){
            return this.positionTimer
        }
    },
    mounted(){
        let that = this;
        let nickName = localStorage.getItem('userName');
        this.$store.commit('alterNickName',nickName);
        let loginId = localStorage.getItem('loginId');
        this.loginId = loginId;
        let ticket = localStorage.getItem('ticket');
        this.$store.commit('alterticket',ticket);
        this.$axios.post(this.basesURL+'/account-auth/get-account',{}).then(res => {
            if(res.data.code == 0){
                that.$store.commit('alterbalance',res.data.data.Balance);
            }
        })
        this.getpositionList();
        this.getvoucherlen();
    },
    methods:{
        getpositionList(){
            let that = this;
            that.$axios.post(that.basesURL+"/trades-auth/get-position-list",{}).then(res => {
                if(res.data.code == 0) {
                    if(!res.data.data.PositionList || res.data.data.PositionList.length == 0){
                        that.profitNum = 0;
                        that.assetValue =Number(that.$store.state.balance);
                        if(that.positionTimer){
                            clearInterval(that.positionTimer);
                        }                
                        return false;
                    }
                    let profit = res.data.data.PositionList;
                    if(profit){
                        let num = 0,money = 0;
                        for(var i= 0;i<profit.length;i++){
                            num +=  Number(profit[i].GrossProfit) ;
                            money +=  profit[i].OpenCost;
                        }
                        that.profitNum = num.toFixed(3);
                        that.assetValue =Number(that.$store.state.balance)  + Number(money)
                    }
                }
            })
        },
        getvoucherlen(){
            this.$axios.post( this.basesURL + '/voucher-auth/get-my-voucher-list',{
                skip:0,
                pageSize:1000
            }).then(res => {
                if(res.data.code == 0) {
                    let len = res.data.data.CustomerVoucherList.length;
                    this.voucherlen = len
                }                
            })
        }
    },
    beforeDestroy(){
        // clearInterval(that.syncUserPosition)
    }
}
</script>

<style scoped lang="scss">
    .User{
        width: 100%;
        height: 100vh;
        background-color: #fff!important;
        padding-bottom:50px;
        .User_top{
            height: 108px;
            background-color: rgba(58,61,81,1);
            .user_img{
                width: 66px;
                height: 66px;
                box-sizing: border-box;
                margin: 19px 25px;
                // background-color: #ccc;;
                border-radius: 50%;
                border: 4px solid #757785;
                img{
                    width: 46px;
                    height: 46px;
                    margin: 6px;
                    border-radius: 50%;
                }
            }
            .user_mes{
                line-height: 33px;
                color: #fff;
                margin-top: 19px;
                text-align: left;
                .user_mes_name{
                    font-size: 16px;
                    color: #fff;
                    font-weight: 600;
                }
                .user_mes_tel{
                    font-size: 12px;
                    color: #fff;
                }
            }
        }
        .User_message{
            height: 174px;
            margin-top: 20px;
            background-color: #fff;
            border-bottom: 10px solid #F8F8F8;
            .user_message_content{
                width: 100%;
                color: #333;
                box-sizing: border-box;
                margin-bottom: 6px;
                padding:0 25px;
                .user_message_content_left {
                    text-align: left;
                    font-size: 40px;
                    line-height: 56px;
                    .title{
                        font-weight: 400;
                        font-size: 16px;
                        line-height: 30px;
                    }
                }
                .user_message_content_right{
                    font-size: 14px;
                    text-align: left;
                    line-height:30px;
                    color:#999;
                    div{
                        a{
                            color: #999;
                           i{
                                position: relative;
                                top: 3px;
                                left: 1px;
                                font-size: 16px;
                                color: #333;
                           }
                        }
                        color: #999;
                        &:nth-child(2){
                            span{
                                color: #FF6C47;
                            }
                        }
                    }
                    span{
                        color: #333;
                        font-weight: 550;
                    }
                }
            }
            .user_message_img{
                padding: 0 15px;
                box-sizing: border-box;
                height:60px;
                width: 100%;
                .img{
                    overflow: hidden;
                    border-radius: 5px;
                    height: 100%;
                    img{
                        width: 100%;
                    }
                }
            }
        }
        .User_operation{
            padding: 0 15px;
            box-sizing: border-box;
            .van-cell{
                 border-bottom: 1px solid #eee;
                 &:not(:last-child)::after{
                     display: none;
                 }
                .van-cell__title{
                    text-align: left;
                    span{
                        color: #666;
                    }
                }
                .van-cell__right-icon{
                    color: #ddd;
                }
                .van-cell__value{
                    .adopted{
                        color:rgba(153,153,153,1);
                        font-size: 14px;
                    }
                    .fail{
                        color:rgba(255,108,71,1);
                        font-size: 14px;
                    }
                    .inreview{
                        color:rgba(86,134,211,1);
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>
