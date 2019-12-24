<template>
    <div class="registerapp">
        <div class="banner">
        <img src="../../assets/landbgi.png" alt="">
        <p class='land-title' style="font-family: Arial Black;">玩币联盟<span @click="tohome()">跳过</span></p>
        <p class="Subtitle" style="font-family: Arial Black;">新用户免费领取<span>体验券</span></p>
        </div>
        <div class="register">
          <router-link to="/register">注册<span><img src="../../assets/landline.png" alt=""></span></router-link>
          <router-link to="/land">登录</router-link>  
        </div>
        <div class="select">
            <span class="van-dropdown-menu" style="font-family:'等线'">+86</span>
        <!-- <van-dropdown-menu>
        <van-dropdown-item v-model="value1" :options="option1" />
        </van-dropdown-menu> -->
        <p class="tel">
            <!-- <span>+86</span> -->
            <input type="number" placeholder="请输入手机号"  v-model="form.tel">
        </p>
        </div>
        <p class="password"><input type="password" maxlength="8" placeholder="设置6-8位登陆密码" v-model="form.password"></p>
        <p class="vecode">
          <input type="number" placeholder="6位数字验证码" v-model="form.code">
          <span v-show="show" @click="getcode">获取验证码</span>
          <span v-show="!show" class="count">{{count}} s</span>
        </p>
        <div class="clause"> <img src="../../assets/Checkmark.png" alt=""> 已阅读并同意
        <span><router-link to="ServiceAgreement">服务协议</router-link></span>
        <span><router-link to="/Privacyclause">隐私条款</router-link></span>
        及<span><router-link to="/StatementResponsibility">免责申明</router-link ></span></div>
        <van-button round type="default" class="button" @click="register">注册</van-button>
    </div>
</template>
<script>
export default {
    name: '',
    props: {
    },
    data() {    
        return {
          show: true,
          count: '',
          timer: null, //60s倒计时
         checked: true,  //复选框
         form:{
             tel:'',
             code:'',
             password:'',
             memberId:"0c45824182ce4ac1bdc9145e4ae71877"
         },
         aaa:null,
         value1: 0,
         option1: [
            { text: '+86', value: 0 },
            { text: '+12', value: 1 },
            { text: '+89', value: 2 },
        ],
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
       getcode(){
           if(!this.form.tel){
              this.$notify({
                message: '电话为空',
                duration: 3000,
                background: '#1989fa'
              });
              return;
            }
           if(!(/^1\d{10}$/.test(this.form.tel))){
              this.$notify({
                message: '电话错误',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }
              this.$axios({
               method:'POST',
               url: this.basesURL+'/user/send-register-code',
               data:{"areaCode":"+86","mobile":this.form.tel}
             }).then( res => {
                this.aaa = res;
                const TIME_COUNT = 60;  //60s倒计时  star
                if (!this.timer) {
                  this.count = TIME_COUNT;
                  this.show = false;
                  this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                      this.count--;
                    } else {
                      this.show = true;
                      clearInterval(this.timer);
                      this.timer = null;
                      }
                    }, 1000)
              }  //60 倒计时 end
              if(res.data.code == 80820 ){
                this.$notify({
                  message: res.data.message,
                  duration: 3000,
                  background: '#1989fa'
                });
              return;
              }
             })
       },
       register(){
             if(!this.form.tel){
              this.$notify({
                message: '电话为空',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }
             if(!this.form.password){
              this.$notify({
                message: '密码为空',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }
             if(!this.form.code){
              this.$notify({
                message: '验证码为空',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }
            this.$axios({
                method:'POST',
                url:this.basesURL+'/user/register',
                // data:{"mobile":this.form.tel, "password":this.form.password,"vCode":this.form.code,"areaCode":"+86"}
                data:{"mobile":this.form.tel,"password":this.form.password,"vCode":this.form.code,"areaCode":"+86",memberId:this.form.memberId}
            }).then( res => {
               if(res.data.code == 0 && res.status == '200'){
                  this.$setItem('ticket',res.data.data.ticket);
                  this.$setItem('userName',res.data.data.Customer.LoginId);
                  this.$router.push('/home');
              }else{
                  this.$notify({
                  message: res.data.data.ErrorMsg,
                  duration: 3000,
                  background: '#1989fa'
                });
              }
           })   
       },
      tohome(){
        this.$router.push('/home')
      }
    },
    components: {

    }
}
</script>

<style scoped lang="scss">
  .registerapp{
    width: 100vw;
    height: 100vh;
    background-color: #fff!important;
  }
   .banner{
      position: relative;
      img{
        width: 100%;
        height: auto;
      }
      .land-title{
        font-size: 22px;
        color: rgb(83,131,214);
        font-weight: 900;
        position: absolute;
        top: 0;
        width: 100vw;
        text-align: left;
        padding-left: 20px;
        box-sizing: border-box;
        span{
          float: right;
              color: #fff;
              font-weight: 500;
              font-size: 14px;
              margin-right: 13px;
              width: 35px;
              height: 35px;
              line-height: 35px;
              border: 1px solid #fff;
              border-radius: 50%;
              text-align: center;
        }
      }
      .Subtitle{
        font-size: 14px;
        position: absolute;
        font-weight: 600;
        left: 20px;
        top: 40px;
        span{
          color: rgb(83,131,214);
        }
      }
   }
   
   .register{
      padding-bottom:15px;
      a{
        display:inline-block;
        width:50%;
        font-size: 18px;
      }
      a:nth-child(1){
        color: #000;
        position: relative;
        span{
          width: 30px;
          height: 5px;
          display: inline-block;
          border-radius: 31%;
          position: absolute;
          bottom: 3px;
          left: 78px;
          img{
            display: inline-block;
            width: 28px;
            height: 4px;
          }
        }
   
      }  
      a:nth-child(2){
        color: rgba(0,0,0,.5);
      } 
   
   } 
   .select{
      position: relative;
      .van-dropdown-menu{
        position: absolute;
        left: 10%;
        height: 20px;
        top: 1px;
        width: 45px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
        display: inline-block;
        color: rgb(83,131,214);
        border-right: 1px solid rgb(238,238,238);
        .van-dropdown-item--down{
          width: 45px;
          margin-left: 10%;
          height: 144px;
          border: 1px solid;
        }
      }
      .tel input{
        width: 80%;
        height: 20px;
        padding-left: 5px;
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,.5);
        border:none;
        text-indent: 5em;
        border-bottom: 1px solid rgb(238,238,238);
        padding-bottom: 10px;
        font-size: 14px;
        &::placeholder{
          color:rgba(221,221,221,1);
          font-size: 14px;
        }
      }
   } 
   
   .vecode{
      width:80%;
      margin-left:9%;
      position:relative;
      margin-bottom: 25px;
      input{
        width: 100%;
        height: 44px;
        padding-left: 5px;
        border-radius: 5px;
        border: none;
        border-bottom: 1px solid rgb(238,238,238);
        font-size: 14px;
        font-family: "等线";
        &::placeholder{
        color:rgba(221,221,221,1);
        font-size: 14px;
        }
        
      }
      span{
        position: absolute;
        right: -7px;
        top: 6px;
        height: 32px;
        line-height: 34px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        color: rgb(83,131,214);
        padding-right: 10px;
      }
   }
   .password input{
      width: 80%;
      height: 44px;
      padding-left: 5px;
      border-radius: 5px;
      border: none;
      border-bottom: 1px solid rgb(238,238,238);
      font-size: 14px;
      font-family: "等线";
      &::placeholder{
        color:rgba(221,221,221,1);
        font-size: 14px;
      }
   }
   .button{
      margin: 25px 0;
      width: 82%;
      height: 44px;
      padding-left: 5px;
      border: none;
      background-color: rgb(83,131,214);
      color: #fff;
      span{
        font-size: 18px;    
      }
   }
   .clause{
      font-size: 12px;
      color: rgb(153,153,153);
      img{
        width: 16px;
        height: 16px;
        position: relative;
        top:3px;
      }
      .van-checkbox{
      display:inline-block;
      overflow: inherit;
      position: relative;
      top: 3px;
      width: 16px;
      height: 16px;
      margin-right: 5px;
      }
      span{
      padding:0 5px;
      font-size: 12px;
      a{
        color:rgb(83,131,214);
      }
      }
   }
   

</style>