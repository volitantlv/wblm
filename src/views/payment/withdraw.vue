<template>
  <div class="withdrawapp">
    <van-nav-bar title="提现" fixed right-text @click-left="$back()" left-arrow>
      <van-icon slot="right" />
    </van-nav-bar>
    <div class="drawcontent">
      <div class="drawmoney">
        提现金额（可提现
        <span style="font-family:'等线'">{{this.$store.state.balance}}</span> USDT）
      </div>
      <div class="input_usd">
        <van-cell-group class="moneynumber">
          <van-field v-model="value" type="number" placeholder="单笔最少15USDT" />
        </van-cell-group>
        <span>USDT</span>
      </div>
    </div>
    <div class="gray"></div>
    <div class="drawcontent choosebank">
      <div class="drawmoney">选择收款银行</div>
    </div>
    <div class="withdraw">
      <van-dropdown-menu :overlay="false">
        <van-dropdown-item v-model="withdraw_value" :options="withdraw_option" />
      </van-dropdown-menu>
    </div>
    <div class="drawcontent drawinfo">
      <van-cell-group class="detailsinfo">
        <van-field v-model="username" label="户名 :" disabled type="text" placeholder class="userinput" />
        <van-field v-model="cardnumber" label="卡号 :" type="number" placeholder class="cardinput" />
        <van-field v-model="bankinfo" label="开户行信息 :" type="text" placeholder class="bankinput" />
      </van-cell-group>
      <div class="tips">温馨提示</div>
      <div class="tips">1、提现账户，必须和绑定实名制的姓名一致</div>
      <div class="tips">2、提币时间：周一至周五上午9:30至晚上20:00</div>
      <div class="tips">3、提币限制：单次最少15USDT</div>
      <div class="tips">4、提现由第三方商户自动兑换为人民币，第三方商户收取的手续费大约为2.3%</div>
      <van-button round type="info" size="large" class="Submission" @click="submit">提交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  data() {
    return {
      value: "",
      username: "",
      cardnumber: "",
      bankinfo: "",
      withdraw_value: "4",
      withdraw_option: [],
      bankMap: new Map(),
      price:''
    };
  },
  computed: {},
  created() {
    let that = this;
    this.getAndroidTicket();
    this.$axios
      .get(this.basesURL + "/account-auth/get-banks", {
        //  headers:{
        //     ticket: this.$store.state.ticket
        //  }
      })
      .then(res => {
        if (res.data.code == 0) {
          var banklist  = res.data.data.BankList;
           banklist = banklist.filter(function (bank) {
              bank.text = bank.bankName;
              bank.value = bank.orderPayTypeId;
              that.bankMap.set(bank.orderPayTypeId, bank);
              return (bank.orderPayTypeId != 1 && bank.orderPayTypeId != 2 && bank.orderPayTypeId != 3);
          });
          this.withdraw_option = banklist;
        }
      });
  },
  mounted() {
    // 获取金额 
    let that = this;
    this.$axios.post(this.basesURL+'/account-auth/get-account',{}).then(res => {
        if(res.data.code == 0){
            that.$store.commit('alterbalance',res.data.data.Balance);
        }
    })
    this.$axios
      .post(this.basesURL + "/account-auth/get-auth-real-name-status", {})
      .then(res => {
        if (res.data.code == 0) {
          let code;
          if(res.data.data.AuthInfo){
            code = res.data.data.AuthInfo.State;
            if(code != 1 ) {
              that.$dialog
              .confirm({
                message: "请前往认证"
              })
              .then(() => {
                that.$router.push("/Attestation");
              })
              .catch(() => {
                this.$back();
              });
            }else{
              this.username = res.data.data.AuthInfo.Name;
            }
          }else{
            that.$dialog
              .confirm({
                message: "请前往认证"
              })
              .then(() => {
                that.$router.push("/Attestation");
              })
              .catch(() => {
                this.$back();
              });
          }
            
          }
      });
  },
  watch: {},
  methods: {
    getAndroidTicket() {
      let obj = {};
      var name, value;
      var str = location.href; //取得整个地址栏
      var num = str.indexOf("?");
      str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

      var arr = str.split("&"); //各个参数放到数组里
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          obj[name] = value;
        }
      }
      if(obj.ticket){
          localStorage.setItem("ticket",obj.ticket);
      }
    },
    submit() {
      let that = this;
      let orderPayTypeId = this.withdraw_value;
      var bankName = this.bankMap.get(orderPayTypeId).bankName;
      this.$axios({
        method: "POST",
        url: this.basesURL + "/account-auth/cash-withdraws",
        data: {
          typeId: this.withdraw_value,
          money: this.value,
          payAccountId: this.cardnumber,
          payAccountUser: this.username,
          payAccountInfo: this.bankinfo,
          bankName: bankName
        }
      }).then(res => {
        if (res.data.code == 0) {
          that.$toast('提交成功');
        }else{
          that.$toast(res.data.message);
        }
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.withdrawapp{
  background-color: #fff!important;
}
.withdraw {
  padding: 0 7px;
}
.drawinfo {
  margin-top: 0px !important;
}
.choosebank {
  margin-top: 0px !important;
}
.van-nav-bar {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.08) !important;
  background: rgba(58, 61, 81, 1);
  .van-nav-bar__left {
    .van-icon {
      font-size: 18px;
      color: #fff;
    }
  }
  .van-nav-bar__title {
    color: #fff;
    font-weight: 600;
    font-size: 18px;
  }
  .van-nav-bar__right {
    .van-icon {
      font-size: 18px;
      color: #fff;
    }
  }
}
.gray {
  height: 15px;
  background-color: rgba(238, 238, 238, 0.5);
}
.drawcontent {
  margin-top: 46px;
  padding: 0 30px;
  &::after {
    display: none;
  }
  .drawmoney {
    text-align: left;
    height: 49px;
    line-height: 49px;
    font-weight: 600;
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    span {
      color: #ff6c47;
      font-family: 等线;
    }
  }
  .input_usd {
    text-align: left;
    .moneynumber {
      display: inline-block;
      .van-cell {
        padding-left: 0;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        padding-bottom: 5px;
        padding-top: 0px;
        width: 200px;
        border-bottom: 1px solid #eee;
        margin-bottom: 16px;
      }
    }
    & > span {
      color: rgba(51, 51, 51, 1);
      font-size: 16px;
      margin-left: 15px;
    }
  }
  .detailsinfo {
    margin-bottom: 15px;
    .van-cell {
      padding-left: 0;
      border-bottom: 1px solid rgba(238, 238, 238, 0.5);
      padding-top: 14px;
      padding-bottom: 5px;
    }
  }
  .tips {
    font-size: 12px;
    color: #999;
    text-align: left;
    line-height: 17px;
    font-family: "等线";
  }
  .Submission {
    margin-top: 35px;
    height: 44px;
    line-height: 44px;
    background: rgba(86, 134, 211, 1);
    font-size: 18px;
    color: #fff;
  }
}
</style>
