<template>
  <div class="payapp">
    <van-nav-bar title="充值" left-text @click-left="$back()" left-arrow class="pay_nav" />
    <div class="commercial">
      <div class="commercial_title">支付方式</div>
      <van-dropdown-menu :overlay="false">
        <van-dropdown-item v-model="pay_value" overlay=false :options="pay_option" />
      </van-dropdown-menu>
    </div>
    <div class="purchase">
      <div class="purchase_title">购买数量(USDT)</div>
      <div class="purchase_button">
        <span :class="usd_number == 15 ? 'usd_number':''" @click="usd_numbers(15)">15</span>
        <span :class="usd_number == 50 ? 'usd_number':''" @click="usd_numbers(50)">50</span>
        <span :class="usd_number == 100 ? 'usd_number':''" @click="usd_numbers(100)">100</span>
        <span :class="usd_number == 200 ? 'usd_number':''" @click="usd_numbers(200)">200</span>
        <span :class="usd_number == 500 ? 'usd_number':''" @click="usd_numbers(500)">500</span>
        <span :class="usd_number == 1000 ? 'usd_number':''" @click="usd_numbers(1000)">1000</span>
      </div>
    </div>
    <div class="alert">
      <div class="alert_title">C2C充币注意事项:</div>
      <p>1、您的汇款将直接进入卖方的账户，交易过程中卖方出售的数字资产由平台托管保护,</p>
      <p>2、请在10分钟内完成付数，并务必点击“我已付款”卖方确认收款后，系统会将数字资产划转到您的账户/p></p>
      <p>3、当日取消订单达到10次，将会限制账户当日的买入功能请勿频繁取消</p>
      <p>4、您购买的资产(例 BTUSDT)，系统将统一兑换成USDT充值到账户余额</p>
    </div>
    <div class="cnyrefer clearfix">
      <span class="fl">≈ {{number_cny}}CNY</span>
      <span class="fr" @click="submit">提交</span>
    </div>
    <iframe src name="payment" frameborder="0">
      <form target="payment" id="formsubmit" :action="form.payUrl" method="post">
        <input type="hidden" name="appOrderId" id="appOrderId" :value="form.appOrderId" />
        <input
          type="hidden"
          name="appReturnPageUrl"
          id="appReturnPageUrl"
          :value="form.appReturnPageUrl"
        />
        <input
          type="hidden"
          name="appServerNotifyUrl"
          id="appServerNotifyUrl"
          :value="form.appServerNotifyUrl"
        />
        <input type="hidden" name="appUserId" id="appUserId" :value="form.appUserId" />
        <input type="hidden" name="orderAmount" id="orderAmount" :value="form.orderAmount" />
        <input
          type="hidden"
          name="orderCoinSymbol"
          id="orderCoinSymbol"
          :value="form.orderCoinSymbol"
        />
        <input type="hidden" name="orderPayTypeId" id="orderPayTypeId" :value="form.orderPayTypeId" />
        <input type="hidden" name="orderRemark" id="orderRemark" :value="form.orderRemark" />
        <input type="submit" style="display:none;" />
      </form>
    </iframe>
  </div>
</template>

<script>
import Bus from "../../lib/bus";
export default {
  name: "",
  props: {},
  data() {
    return {
      pay_value: 1,
      pay_option: [],
      usd_number: 15,
      form: {
        payUrl: "",
        appOrderId: "",
        appReturnPageUrl: "",
        appServerNotifyUrl: "",
        appUserId: "",
        orderAmount: "",
        orderCoinSymbol: "",
        orderPayTypeId: "",
        orderRemark: ""
      }
    };
  },
  computed: {
    number_cny() {
      let number_cny = this.usd_number;
      return number_cny * 7;
    }
  },
  created() {
    this.getAndroidTicket();
    this.$toast.loading({
      mask: true,
      duration:0
    })
    this.$axios
      .get(this.basesURL + "/account-auth/get-banks", {
        headers: {
          ticket: localStorage.getItem('ticket')
        }
      })
      .then(res => {
        if (res.data.code == 0) {
          let arr = [];
          for (let i = 0; i < res.data.data.BankList.length; i++) {
            let obj = {};
            obj.text = res.data.data.BankList[i].bankName;
            obj.value = res.data.data.BankList[i].orderPayTypeId;
            obj.value = Number(obj.value);
            arr.push(obj);
          }
          this.pay_option = arr;
          this.$toast.clear()
        }
      });
  },
  mounted() {},
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
    usd_numbers(n) {
      if (n == 15) {
        this.usd_number = 15;
      } else if (n == 50) {
        this.usd_number = 50;
      } else if (n == 100) {
        this.usd_number = 100;
      } else if (n == 200) {
        this.usd_number = 200;
      } else if (n == 500) {
        this.usd_number = 500;
      } else if (n == 1000) {
        this.usd_number = 1000;
      }
    },
    submit() {
      let that = this;
      // this.$toast({
      //     mask: true,
      //     message: '加载中...',
      //     duration:0
      // });
      this.$axios({
        method: "POST",
        url: this.basesURL + "/account-auth/add-money",
        data: {
          money: this.number_cny,
          orderPayTypeId: this.pay_value,
          frontUrl: "http://172.16.2.152:8088/#/Recharge"
        }
      }).then(res => {
        if (res.data.code == "0") {
          //   document.querySelector("van-loading").display= "block";
          res = res.data.data;
          that.form.payUrl = res.PayUrl;
          that.form.appOrderId = res.appOrderId;
          that.form.appOrderId = res.appOrderId;
          that.form.appReturnPageUrl = res.appReturnPageUrl;
          that.form.appServerNotifyUrl = res.appServerNotifyUrl;
          that.form.appUserId = res.appUserId;
          that.form.orderAmount = res.orderAmount;
          that.form.orderCoinSymbol = res.orderCoinSymbol;
          that.form.orderPayTypeId = res.orderPayTypeId;
          that.form.orderRemark = res.orderRemark;
          that.$store.commit("alterform", that.form);
          this.$router.push("/Recharge");
        }
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.payapp{
    background-color: #fff!important;
}
.van-dropdown-item.van-dropdown-item--down{
  height: 175px!important;
}
.pay_nav {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05) !important;
  .van-nav-bar__title {
    font-weight: 600;
    font-size: 18px;
  }
  .van-nav-bar__left {
    .van-icon {
      color: #000;
      font-size: 18px;
    }
  }
}
.commercial {
  padding: 10px 7px;
  width: 100vw;
  box-sizing: border-box;
  padding-top: 0;
  .commercial_title {
    text-align: left;
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    padding: 16px 0;
    padding-left: 14px;
  }
  .van-dropdown-menu {
    box-shadow: 0px 1px 4px 0px rgba(221, 221, 221, 1);
    border-radius: 5px;
    height: 44px;
  }
}
.purchase {
  padding: 10px 17.5px;
  width: 100vw;
  box-sizing: border-box;
  .purchase_title {
    margin-top: 10px;
    text-align: left;
    font-size: 16px;
  }
  .purchase_button {
    span {
      display: inline-block;
      width: 100px;
      margin-top: 17px;
      background: rgba(86, 134, 211, 0.14);
      border-radius: 5px;
      height: 44px;
      line-height: 44px;
      color: rgba(102, 102, 102, 1);
      font-size: 18px;
      font-family: "等线";
      font-weight: 600;
      box-sizing: border-box;
      border: 2px solid transparent;
      &:nth-child(2) {
        margin: 0 17px;
      }
      &:nth-child(5) {
        margin: 0 17px;
      }
    }
    .usd_number {
      background-color: #fff;
      font-family: "等线";
      font-weight: 600;
      border: 2px solid rgba(86, 134, 211, 1);
      color: rgba(86, 134, 211, 1);
    }
  }
}
.alert {
  padding: 10px 30px;
  width: 100vw;
  box-sizing: border-box;
  margin-top: 8px;
  .alert_title {
    text-align: left;
    font-size: 14px;
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
  }
  p {
    text-align: left;
    line-height: 18px;
    color: rgba(153, 153, 153, 1);
    margin: 0;
  }
}
.cnyrefer {
  padding: 30px 15px 0 30px;
  span {
    &:nth-child(1) {
      color: rgba(86, 134, 211, 1);
      font-size: 30px;
      height: 44px;
      line-height: 44px;
      display: inline-block;
      font-weight: 600;
    }
    &:nth-child(2) {
      width: 117px;
      height: 44px;
      line-height: 44px;
      background: rgba(86, 134, 211, 1);
      border-radius: 5px;
      display: inline-block;
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>
