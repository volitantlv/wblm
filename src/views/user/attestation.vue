<template>
  <div class="app">
    <van-nav-bar title="完善信息" fixed @click-left="$router.push('/user')" left-arrow class="PerfectInformation" />
    <!-- 没有认证的 -->
    <div class="attestation" v-if="shop == 'attestation'" >
      <van-cell-group class="at_form">
        <van-field type="text" v-model="form.name" clearable label="真实姓名" placeholder="请输入您的身份证姓名" />
        <van-field type="number" v-model="form.attestationtel" label="身份证号" placeholder="请输入中国居民身份证号" />
      </van-cell-group>
      <div class="at_message">
        <div>认证须知：</div>
        <div>1.一个手机号仅能绑定1个身份证</div>
        <div>2.暂仅支持中国大陆居民身份证号</div>
        <div>3.请使用您手机绑定的身份信息进行实名认证</div>
        <div>4.手机号为新申请办理号码，可能会认证失败</div>
        <div>5.未在运营商(移动、电信、联通)备过案可能会认证失败</div>
      </div>
      <van-button round type="info" size="large" class="at_btn" @click="submit">提交认证</van-button>
    </div>
    <!-- 审核中 -->
    <div v-if="shop == 'audit'" class="audit">
      <div>
        <img src="../../assets/auditprogress.png" alt />
      </div>
      <div>审核中</div>
      <div>工作人员将会尽快审核您的申请</div>
      <div>敬请留意通知！</div>
    </div>
    <!-- 审核成功 -->
    <div v-if="shop == 'success'" class="success">
      <div>
        <img src="../../assets/accreditationsuccess.png" alt />
      </div>
      <div>实名认证成功</div>
      <div>您的实名认证已通过审核</div>
    </div>
    <!-- 审核失败 -->
    <div :class="pop">
      <div class="popcontent">
        <div>
          <img src="../../assets/authenticationfailure.png" alt />
        </div>
        <div >认证失败</div>
        <div>请核实您的身份信息</div>
        <van-button round class="tryagain" @click="tryagain">再试一次</van-button>
      </div>
      <div class="background"></div>
    </div>
  </div>
</template>


<script>
export default {
  name: "",
  props: {},
  data() {
    return {
      form: {
        name: "",
        attestationtel: ""
      },
      shop: "",
      pop: "hide"
    };
  },
  computed: {
    totalpricez() {
      return this.rose.value + 1;
    }
  },
  created() {
    this.$axios({
      method:'post',
      url:this.basesURL+'/account-auth/get-auth-real-name-status',
      data:{
        // loginId:'+86.18352207709'
      }
    }).then(res => {
      if(res.data.code == 0) {
        let code;
        if(res.data.data.AuthInfo == null) {
          this.pop = 'hide',
          this.shop = "attestation"
          return;
        }else{
          code = res.data.data.AuthInfo.State;
        }
        if(code == 0 ){
        //正在审核
          this.shop = "audit";
          this.pop = "display"
        }else if(code == 1){
          this.shop = "success";
          this.pop = "hide"
          // 审核成功
        }else if(code == 9) {
          this.shop = "attestation"
          this.form.name = res.data.data.AuthInfo.Name;
          this.form.attestationtel = res.data.data.AuthInfo.IdentityNo
          // 审核失败
          // this.pop = "display"
        }else{
          this.pop = 'hide',
          this.shop = "attestation"
        }
      }
      
    })
  },
  mounted() {},
  watch: {},
  methods: {
    //提交认证
    submit() {
      let that = this;
      // 校验姓名是否为空
      if (this.form.name == "") {
        this.$notify({
          message: "姓名不可为空",
          duration: 2000,
          background: "#1989fa"
        });
        return;
      }
      //身份证号码不可为空
      if (this.form.attestationtel == "") {
        this.$notify({
          message: "身份证号码不可为空",
          duration: 2000,
          background: "#1989fa"
        });
        return;
      }
      // 校验姓名格式
      if (!/^(?:[\u4e00-\u9fa5]+)(?:·[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/.test(this.form.name)) {
        this.$notify({
          message: "姓名格式错误",
          duration: 2000,
          background: "#1989fa"
        });
        return false;
      }
      // 身份证号码格式的校验
      if (!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(this.form.attestationtel)) {
        this.$notify({
          message: "身份证号码格式错误",
          duration: 2000,
          background: "#1989fa"
        });
        return false;
      }
      // 向后台发送请求
      this.$axios({
        method: "POST",
        url: this.basesURL+"/account-auth/auth-real-name",
        data: {
          name: that.form.name,
          identityNo: that.form.attestationtel,
          // loginId:this.$store.state.loginId
        }
      }).then(res => {
        if(res.data.code == 0 ){
           this.$toast("提交成功");
           this.shop = 'audit'
          //  this.$router.push('/user')
        }
      });
    },
    tryagain() {
      this.pop = "hide";
      this.form.name = "";
      this.form.attestationtel = "";
    },
  },
  components: {}
};
</script>

<style scoped lang="scss">
.app{
  width: 100vw;
  height: 100vh;
  background-color: #fff!important;
}
.PerfectInformation {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05) !important;
  .van-nav-bar__left {
    .van-icon {
      color: #000;
      font-size: 18px;
    }
  }
  .van-nav-bar__title {
    font-weight: 600;
    font-size:18px;
  }
}
// 认证
.attestation {
  padding: 0 30px;
  padding-top: 46px;
  .at_form {
    border: none;
    background-color: #fff;
    &::after{
      display: none;
    }
    .van-cell {
      padding-left: 0;
      padding-right: 0;
      border: none;
      border-bottom: 1px solid #eee;
      height: 44px;
      &:not(:last-child)::after{
        display: none;
      }
      &:nth-child(1) {
        margin-top: 37px;
      }
      &:nth-child(2) {
        margin-top: 30px;
      }
    }
  }
  .at_message {
    margin-top: 100px;
    div {
      color: #999999;
    }
    text-align: left;
    line-height: 20px;
    font-size: 12px;
  }
  .at_btn {
    margin-top: 67px;
    border: none;
    background: rgba(86, 134, 211, 1);
  }
}
// 认证审核中
.audit {
  padding: 0 30px;
  padding-top: 46px;
  div {
    &:nth-child(1) {
      margin-top: 67px;
      img {
        width: 84px;
        height: auto;
      }
    }
    &:nth-child(2) {
      color: rgba(86, 134, 211, 1);
      font-size: 24px;
      margin-top: 40px;
    }
    &:nth-child(3) {
      color: rgba(153, 153, 153, 1);
      font-size: 16px;
      margin-top: 10px;
    }
    &:nth-child(4) {
      color: rgba(153, 153, 153, 1);
      font-size: 16px;
      margin-top: 5px;
    }
  }
}

// 认证成功
.success {
  padding: 0 30px;
  padding-top: 46px;
  div {
    &:nth-child(1) {
      margin-top: 67px;
      img {
        width: 69px;
        height: auto;
      }
    }
    &:nth-child(2) {
      color: rgba(20, 197, 145, 1);
      font-size: 24px;
      margin-top: 41px;
    }
    &:nth-child(3) {
      color: rgba(153, 153, 153, 1);
      font-size: 16px;
      margin-top: 10px;
    }
  }
}
// 认证失败
.hide {
  display: none;
}
.display {
  display: block;
  .background {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
  }
  .popcontent {
    z-index: 102;
    position: fixed;
    top: 50%;
    left: 50%;
    background-color: #fff;
    width: 244px;
    height: 312px;
    margin-top: -156px;
    margin-left: -122px;
    padding: 45px 40px 30px 40px;
    border-radius: 10px;
    div {
      &:nth-child(1) {
        img {
          width: 69px;
          height: auto;
        }
      }
      &:nth-child(2) {
        font-size: 24px;
        color: rgba(255, 108, 71, 1);
        font-weight: 600;
        margin-top: 35px;
      }
      &:nth-child(3) {
        font-size: 16px;
        color: rgba(153, 153, 153, 1);
        margin-top: 6px;
      }
    }
  }
}
</style>
