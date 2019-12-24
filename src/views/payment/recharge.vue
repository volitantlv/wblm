<template>
    <div>
        <van-nav-bar title="充值" left-text=""  @click-left="$back()" left-arrow  class="pay_nav"/>      
        <!-- <div class="loading">加载中...</div> -->
        <iframe id="iframe1" name="recharge" frameborder="0" style="display:none;">
             <form ref="formsubmit" target="recharge"  id="formsubmit" :action="form.payUrl" method="post" >
                <input type="hidden" name="appOrderId" id="appOrderId" :value="form.appOrderId">
                <input type="hidden" name="appReturnPageUrl"  id="appReturnPageUrl" :value="form.appReturnPageUrl">
                <input type="hidden" name="appServerNotifyUrl"  id="appServerNotifyUrl" :value="form.appServerNotifyUrl">
                <input type="hidden" name="appUserId" id="appUserId" :value="form.appUserId">
                <input type="hidden" name="orderAmount" id="orderAmount" :value="form.orderAmount">
                <input type="hidden" name="orderCoinSymbol" id="orderCoinSymbol" :value="form.orderCoinSymbol">
                <input type="hidden" name="orderPayTypeId" id="orderPayTypeId" :value="form.orderPayTypeId">
                <input type="hidden" name="orderRemark" id="orderRemark" :value="form.orderRemark">
                <input type="submit" style="display:none;">                                           
            </form> 
        </iframe>
    </div>
</template>

<script>
// import Bus from '../../lib/bus'
export default {
    name: '',
    props: {

    },
    data() {
        return {
            form:{
                // appOrderId:'',
                // appReturnPageUrl:'',
                // appServerNotifyUrl:'',
                // appUserId:'',
                // orderAmount:'',
                // orderCoinSymbol:'',
                // orderPayTypeId:'',
                // orderRemark:''
            }
        };
    },
    created(){
        this.form = this.$store.state.form;
    },
    computed: {

    },
    mounted() {
        this.$toast.loading({
            // mask: true,
            // message: '加载中...',
            duration: 0,
        });
        let that = this;
        document.querySelector("#formsubmit").submit();
        let iframe = document.getElementById('iframe1')
        if (iframe.attachEvent){  
            iframe.attachEvent("onload", function(){ // IE  
                document.getElementById('iframe1').style.display = "block";
                that.$toast.clear()                
            });  
        } else {  
            iframe.onload = function(){ // 非IE  
                document.getElementById('iframe1').style.display = "block";
                that.$toast.clear()
            };  
        }  

  

        
    },
    methods: {

    },
};
</script>

<style scoped lang="scss">
iframe{
    width: 100vw;
    height: calc(100vh - 50px);
    border: none;
    // margin-top: 50px;
    box-shadow: none;
}
</style>


