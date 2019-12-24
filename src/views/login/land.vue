<template>
    <div class="land">
        <div class="banner">
        <img src="../../assets/landbgi.png" alt="">
        <p class='land-title' style="font-family: Arial Black;">玩币联盟<span @click="tohome()">跳过</span></p>
        <p class="Subtitle" style="font-family: Arial Black;">新用户免费领取<span>体验券</span></p>
        </div>
        <div class="register">
        <router-link to="/register">注册</router-link>
        <router-link to="/land">登录<span><img src="../../assets/landline.png" alt=""></span></router-link>  
        </div>
        <div class="select">
        <!-- <van-dropdown-menu>
            <van-dropdown-item v-model="value2" :options="option2" />
        </van-dropdown-menu> -->
            <p class="tel">
                <img src="../../assets/landname.png" alt="">
                <input type="number" placeholder="请输入手机号" v-model="form.tel" >
            </p>
        </div>
        <p class="password">
            <img src="../../assets/landpassword.png" alt="">
            <input type="password" maxlength="8" placeholder="密码" v-model="form.password">
        </p>
        <van-button round type="default" class="button" @click="land">登录</van-button>
        <p class="details"><span @click="register">忘记密码?</span></p>
    </div>
</template>
<script>
export default {
    name: '',
    props: {

    },
    data() {
        return {
            form:{
                tel:'',
                password:'',
            },
            value2: 1,
            option2: [
                    { text: '+86', value: 0 },
                    { text: '+12', value: 1 },
                    { text: '+89', value: 2 }
            ],
        }
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
        land(){
             let code = "+86";
             let tel = this.form.tel;
             let loginId = code+"."+tel;
             let password = this.form.password;
             if(tel==""){
              this.$notify({
                message: '电话为空',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }
             if(password==""){
              this.$notify({
                message: '密码为空',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }
             if(!(/^1\d{10}$/.test(tel))){
              this.$notify({
                message: '电话错误',
                duration: 3000,
                background: '#1989fa'
              });
              return;
             }
                let that =this;
                this.$axios({
                  method:'POST',
                  url:this.basesURL+'/user/login',
                  data:{"loginId":loginId,"password":password,}
                }).then( res => {
                  if(res.data.code == 0){
                    var data = res.data.data;
                    this.$setItem('userName',data.nickName);
                    this.$setItem('ticket',data.ticket);
                    this.$setItem('loginId',data.Customer.LoginId);
                    this.$store.commit('alterticket',data.ticket);
                    this.$router.push('/home');
                  }else{
                    this.$notify({
                    message: res.data.message,
                    duration: 3000,
                    background: '#1989fa'
                  });
                  }
                })
        },
        register(){
          this.$router.push({ path:'/resetpassword'})
        },
        tohome(){
          this.$router.push('/home')
        }
    },
    components: {
    },
};
</script>

<style scoped lang="scss">
.land{
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
        left: 20px;
        font-weight: 600;
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
      a:nth-child(2){
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
      a:nth-child(1){
        color: rgba(0,0,0,.5);
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
      margin-bottom: 0;
      span{
        font-size: 18px;    
      }
   }
   .tel{
       position: relative;
       img{
         position: absolute;
         top: 0;
         display: inline-block;
         width: 30px;
         height: auto;
         left: 12%;
       }
       input{
         width: 80%;
         height: 30px;
         padding-left: 5px;
         border-radius: 5px;
         border: none;
         text-indent: 4em;
         border-bottom: 1px solid #eee;
         padding-bottom: 10px;
         font-size: 14px;
         &::placeholder{
           color: rgb(221,221,221);
         }
       }

   }
   .password{
      margin-top: 25px;
      margin-bottom: 25px; 
      position: relative;  
      img{
        position: absolute;
        top: 0;
        display: inline-block;
        width: 30px;
        height: auto;
        left: 12%;
      }
      input{
        width: 80%;
        height: 30px;
        padding-left: 5px;
        border-radius: 5px;
        border: none;
        text-indent: 4em;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        font-size: 14px;
        &::placeholder{
          color: rgb(221,221,221);
        }
      }
   }

   .details{
      font-size:12px;
      span{
      color:rgb(83,131,214);
      padding:0 5px;
      float: right;
      margin-right: 9%;
      font-size: 14px;
      }
   }

   .select{
      position: relative;
      .van-dropdown-menu{
        position: absolute;
        left: 10%;
        height: 32px;
        top: 1px;
        border-right: 1px solid;
        width: 45px;
        .van-dropdown-item--down{
          width: 45px;
          margin-left: 10%;
          height: 144px;
          border: 1px solid;
        }
      }
   }
</style>
