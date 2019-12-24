<template>
    <div class="resetpassword">
        <van-nav-bar title="重置登陆密码" left-arrow @click-left="$back()" class="nav"/>
        <div class="select">
          <span class="van-dropdown-menu" style="font-family:'等线'">+86</span>
        <p class="tel">
          <input type="number" placeholder="请输入手机号"  v-model="form.tel">
        </p>
        </div>
        <p class="vecode">
          <input type="number" placeholder="请输入验证码" v-model="form.code">
          <span v-show="show" @click="getcode">获取验证码</span>
          <span v-show="!show" class="count">{{count}} s</span>
        </p>
        <p class="password"><input type="password" placeholder="设置6-8位登陆密码" v-model="form.password"></p>
        <van-button round type="default" class="button" @click="resetpassword">重置密码</van-button>
    </div>
</template>
<script>
export default {
    props: {
    },
    data() { 
      return {
        show: true,
        count: '',
        timer: null, //60s倒计时
        form:{
          tel:'',
          code:'',
          password:'',
          },
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
         if(this.form.tel==""){
            this.$notify({
              message: '电话为空',
              duration: 3000,
              background: '#1989fa'
            });
            return;
          }
          let tel = this.form.tel;
          this.$axios({
                method:'POST',
                url:this.basesURL+'/user/send-reset-password-code',
                data:{"mobile":tel,"areaCode":"+86"}
           }).then( res => {  
              //60s倒计时  star
              const TIME_COUNT = 60;  
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
           })
    },
    resetpassword(){
          if(this.form.tel==""){
              this.$notify({
                message: '电话为空',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }
          if(this.form.code==""){
              this.$notify({
                message: '验证码为空',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }   
          if(this.form.password==""){
              this.$notify({
                message: '密码为空',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }     
         if(!(/^1[34578]\d{9}$/.test(this.form.tel))){
              this.$notify({
                message: '电话错误',
                duration: 3000,
                background: '#1989fa',
              });
              return;
          }  
        if(!(/^\d{6}$/.test(this.form.code))){
              this.$notify({
                message: '验证码错误',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }   
         if(!(/^\d{6,8}$/.test(this.form.password))){
              this.$notify({
                message: '密码错误',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }      


      let tel = this.form.tel;
      let password = this.form.password;
      let vcode = this.form.code;
      let that = this;
      this.$axios({
          method:'POST',
          url:this.basesURL+'/user/reset-user-password',
          data:{"mobile":tel,"areaCode":"+86","password":password,"vCode":vcode,}
      }).then( res => {  
        if(res.data.code == 0){
          // 充值密码后跳转去登录 
          that.$toast('正在跳转到登录',{
            message:'正在跳转到登录',
            duration:1000
          });
          setTimeout(() => {
            that.$router.push('/land');
          }, 1000);
        }else{
          that.$toast(res.data.message);
        }
      })  
    }
        


    },
    components: {

    }
}
</script>

<style scoped lang="scss">
  .resetpassword{
    width: 100vw;
    height: 100vh;
    background-color: #fff!important;
  }
   .nav{
    height: 40px;
    line-height: 40px;
    margin-top: 5px;
    border-bottom: 1px solid rgba(0,0,0,.06);
    .van-nav-bar__left .van-icon{
      font-size: 18px;
      color: rgb(51,51,51);
    }
    .van-nav-bar__title{
      font-weight:600;
      font-size:18px;
      color:#333;
    }
   }
   .select{
      position: relative;
      .van-dropdown-menu{
        position: absolute;
        left: 10%;
        height: 20px;
        top: 15px;
        width: 45px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
        display: inline-block;
        color: rgb(83,131,214);
        border-right: 1px solid rgb(238,238,238);
      }
      .tel input{
        width: 80%;
        height: 44px;
        padding-left: 5px;
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,.5);
        border:none;
        text-indent: 5em;
        border-bottom: 1px solid rgb(238,238,238);
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
      margin-bottom: 0px;
      input{
        width: 100%;
        height: 44px;
        padding-left: 5px;
        border-radius: 5px;
        border: none;
        border-bottom: 1px solid rgb(238,238,238);
        font-size: 14px;
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
   .password{
     margin:0;
     input{
      width: 80%;
      height: 44px;
      padding-left: 5px;
      border-radius: 5px;
      border: none;
      border-bottom: 1px solid rgb(238,238,238);
      font-size: 14px;
      &::placeholder{
        color:rgba(221,221,221,1);
        font-size: 14px;
      }
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
      margin-top: 60px;
      span{
        font-size: 14px;    
      }
   }

</style>