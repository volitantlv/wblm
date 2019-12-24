<template>
  <div class="app">
    <van-nav-bar :title="this.$store.state.Kcode" fixed left-arrow @click-left="$back()" />
    <div class="information" v-for="v in $store.state.commodity" v-show="v.TypeCode == Kcode">
      <div class="information_tp clearfix">
        <div class="information_left fl clearfix">
          <div class="price" :class="v.DailyChange > 0 ?'zhang':'die'">{{v.CurPrice}}</div>
          <div class="clearfix">
            <div
              class="fl"
              :class="v.DailyChange > 0 ?'zhang':'die'"
            >{{v.DailyChange > 0 ? '+' + v.DailyChange.toFixed(1) :v.DailyChange.toFixed(1) }}</div>
            <div
              class="fr"
              :class="v.DailyChangePercent > 0 ? 'zhang':'die'"
            >{{ v.DailyChangePercent > 0 ? ' +' + Math.round(v.DailyChangePercent * 10000 ) / 100 : ' ' + Math.round(v.DailyChangePercent * 10000 ) / 100 }}%</div>
          </div>
        </div>
        <div class="information_right fr">
          <div class="clearfix">
            <div class="fl">
              今开:
              <span>{{v.Open}}</span>
            </div>
            <div class="fr">
              昨收:
              <span>{{v.Close.toFixed(1)}}</span>
            </div>
          </div>
          <div class="clearfix">
            <div class="fl">
              最高:
              <span>{{v.High}}</span>
            </div>
            <div class="fr">
              最低:
              <span>{{v.Low.toFixed(1)}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="information_bt">{{v.PriceTime.replace("T", " ")}}</div>
    </div>
    <div class="kline">
      <div class="kline_tp" ref="Kline_tp">
        <span class="active" @click="tabecharts(0)">分时</span>
        <span @click="tabecharts(1)">5分</span>
        <span @click="tabecharts(2)">15分</span>
        <span @click="tabecharts(3)">30分</span>
        <span @click="tabecharts(4)">60分</span>
        <span @click="tabecharts(5)">日k</span>
      </div>
      <div class="kline_ct" style="background-color:#3a3d51">
        <div class="echarts myChart" id="myChart"></div>
        <div class="echarts myChartk1" id="myChartk1" style="display:none;"></div>
        <div class="echarts myChartk2" id="myChartk2" style="display:none;"></div>
        <div class="echarts myChartk3" id="myChartk3" style="display:none;"></div>
        <div class="echarts myChartk4" id="myChartk4" style="display:none;"></div>
        <div class="echarts myChartk5" id="myChartk5" style="display:none;"></div>
        <div class="echarts myChartk5" id="myChartk6" style="display:none;"></div>
      </div>
    </div>
    <div class="K_bottom">
      <van-button plain type="primary" @click="buyup">买涨</van-button>
      <van-button plain type="primary" @click="buydown">买跌</van-button>
      <van-button plain type="primary" @click="totrand">持仓({{positionlen}})</van-button>
    </div>
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '79%'}"
      class="pop_down"
      style="min-height:480px; "
    >
      <p
        class="pop_title"
        v-for="v in $store.state.commodity"
        v-if="v.TypeCode == Kcode"
        :class="v.DailyChange > 0 ?'zhang':'die'"
      >
        <span>{{v.TypeCode}}</span>
        <span>${{v.CurPrice}}</span>
      </p>
      <van-tabs v-model="activelin">
        <!-- 买涨 -->
        <van-tab>
          <div slot="title" @click="onclick" :class="rose.one">买涨</div>
          <div class="btone">
            <div class="specifications">
              规格
              <li
                v-for="(v, i) in goodListMap.get(Kcode)"
                :key="i"
                @click="addClass(i);"
                class="spec_z"
                :class="rose.current == i ? 'orange':''"
              >
                <span>{{ v.DepositFee}}</span>USDT/手
                <span style="display:none;">{{v.Code}}</span>
                <p style="display:none;">{{v.OpenChargeFee}}</p>
              </li>
            </div>
            <div class="handnumber">
              手数
              <input type="number" v-model="rose.value" @input="login" placeholder="请设置1-10之间的数字" />
            </div>
            <div class="jbq">
              <van-stepper v-model="rose.value" :min="0" :max="10" :step="1" @change="login" />
            </div>
            <van-slider
              v-model="rose.value"
              active-color="#FF6C47"
              :min="0"
              :max="10"
              :step="1"
              bar-height="4px"
            >
              <div slot="button" class="custom-button"></div>
            </van-slider>
            <div class="scale">
              <p>
                <span>0</span>
                <span>2</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
                <span>10</span>
              </p>
            </div>
            <div class="earnings">共计合约量{{totalpriced}}USDT</div>
            <div class="dradio">
              <van-radio-group v-model="rose.radio">
                <van-radio name="1" class="fl">
                  余额：
                  <span>{{this.$store.state.balance}}</span>
                  <img slot="icon" slot-scope="props" :src="props.checked ? active : inactive" />
                </van-radio>
                <span class="topup" @click="topay">充值</span>
                <van-radio name="2" class="fr">
                  可用代金券
                  <span class="number">{{voucherlen}}</span>张
                  <img slot="icon" slot-scope="props" :src="props.checked ? active : inactive" />
                </van-radio>
              </van-radio-group>
            </div>
            <van-cell-group>
              <van-switch-cell v-model="rose.checked" disabled title="止盈止损(%)" />
            </van-cell-group>
            <div class="win">
              <span>止盈(10% ~ 80%)</span>
              <van-stepper
                min="10"
                max="80"
                v-model="rose.limit_value"
                step="5"
                style="display:inline-block;"
              />
            </div>
            <div class="loss">
              <span>止损(10% ~ 80%)</span>
              <van-stepper
                min="10"
                max="80"
                v-model="rose.stop_value"
                step="5"
                style="display:inline-block;"
              />
            </div>
            <div class="all">
              <span>总计</span>
              <span>{{totalpricez}}</span> USDT
              <span>(手续费 {{riseCharge}})</span>
              <span class="fr" @click="positionOpen('1')">下单</span>
            </div>
          </div>
        </van-tab>
        <!-- 买跌 -->
        <van-tab>
          <div slot="title" @click="onclicks" :class="fall.two">买跌</div>
          <div class="bttwo">
            <div class="specifications">
              规格
              <li
                v-for="(v, i) in goodListMap.get(Kcode)"
                :key="i"
                @click="addClassg(i,$event);"
                class="spec_d"
                :class="{ green:i==fall.currentg}"
              >
                <span>{{v.DepositFee}}</span>USDT/手
                <span style="display:none;">{{v.Code}}</span>
                <p style="display:none">{{v.OpenChargeFee}}</p>
              </li>
            </div>
            <div class="handnumber">
              手数
              <input
                type="number"
                v-model="fall.valueg"
                @input="loging"
                placeholder="请设置1-10之间的数字"
              />
            </div>
            <div class="jbq">
              <van-stepper v-model="fall.valueg" :min="0" :max="10" :step="1" @change="loging" />
            </div>
            <van-slider
              v-model="fall.valueg"
              active-color="#14C591"
              :min="0"
              :max="10"
              :step="1"
              bar-height="4px"
            >
              <div slot="button" class="custom-button"></div>
            </van-slider>
            <div class="scale">
              <p>
                <span>0</span>
                <span>2</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
                <span>10</span>
              </p>
            </div>
            <div class="earnings">共计合约量{{totalpriced}}USDT</div>
            <div class="dradio">
              <van-radio-group v-model="fall.radiog">
                <van-radio name="1" class="fl">
                  余额：
                  <span>{{this.$store.state.balance}}</span>
                  <img slot="icon" slot-scope="props" :src="props.checked ? active :inactive" />
                </van-radio>
                <span class="topup" @click="topay">充值</span>
                <van-radio name="2" class="fr">
                  可用代金券
                  <span class="number">{{voucherlen}}</span>张
                  <img slot="icon" slot-scope="props" :src="props.checked ? active : inactive" />
                </van-radio>
              </van-radio-group>
            </div>
            <van-cell-group>
              <van-switch-cell v-model="fall.checkedg" disabled title="止盈止损(%)" />
            </van-cell-group>
            <div class="win">
              <span>止盈(10% ~ 80%)</span>
              <van-stepper
                min="10"
                max="80"
                v-model="fall.limit_valueg"
                step="5"
                style="display:inline-block;"
              />
            </div>
            <div class="loss">
              <span>止损(10% ~ 80%)</span>
              <van-stepper
                min="10"
                max="80"
                v-model="fall.stop_valueg"
                step="5"
                style="display:inline-block;"
              />
            </div>
            <div class="all">
              <span>总计</span>
              <span>{{totalpriced}}</span> USDT
              <span>(手续费 {{fallCharge}})</span>
              <span class="fr" @click="positionOpen('2')">下单</span>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script>
import useractive from "../../assets/user-active.png";
import userinactive from "../../assets/user-inactive.png";
export default {
  data() {
    return {
      show: false,
      Kcode: "",
      goods: "",
      code: "0",
      step: 1,
      up: 0,
      activelin: "",
      goodMap: new Map(),
      goodListMap: new Map(),
      loadKlineData: null,
      rose: {
        //买涨弹窗  买涨 tab-content
        value: 1, //买涨 弹窗 手数 步进器 滑块 联动 v-model
        limit_value: 20, //买涨 弹窗 止赢 步进器  v-model
        stop_value: 20, //买涨 弹窗 止损 步进器  v-model
        radio: "1", //买涨 弹窗  余额 代金券 单选按钮  1-默认余额 2-默认代金券
        checked: true, //买涨 弹窗 止赢止损开关按钮
        current: "0", //买涨弹窗 部分 动态切换 规格添加class
        one: "", //买涨弹窗 tab点击动态添加class
        Specifications_number: 7
      },
      fall: {
        valueg: 1, //买跌 弹窗 手数 步进器 滑块 联动 v-model
        limit_valueg: 20, //买跌 弹窗 止赢 步进器  v-model
        stop_valueg: 20, //买跌 弹窗 止损 步进器  v-model
        radiog: "1", //买跌 弹窗  余额 代金券 单选按钮  1-默认余额 2-默认代金券
        checkedg: true, //买跌 弹窗 止赢止损开关按钮
        currentg: "0", //买跌弹窗 部分 动态切换 规格添加class
        two: "", //买跌弹窗 tab点击动态添加class
        Specifications_number: 7
      },
      money: "",
      active: useractive, //选中状态图片
      inactive: userinactive, //未选中状态图片
      voucherlen: "",
      totalpricez: "",
      totalpriced: "",
      riseCharge: "",
      fallCharge: "",
      positionlen: "",
      nextStartTime: null
    };
  },
  created() {
    let that = this;
    this.Kcode = this.$store.state.Kcode;
    this.$axios.get(this.basesURL + "/good/get-list", {}).then(res => {
      if (res.data.code == 0) {
        var goodsList = res.data.data.GoodsList;
        goodsList.forEach(element => {
          var arr = that.goodListMap.get(element.TypeCode);
          if (!arr) {
            arr = [];
          }
          arr.push(element);
          that.goodListMap.set(element.TypeCode, arr);
          that.goodMap.set(element.Name, element);
        });
      }
    });
  },
  mounted() {
    let that = this;
    this.Kcode = this.$store.state.Kcode;
    this.getTimeline();
    this.getbalance();
    setTimeout(() => {
      that.getpositionlen();
    }, 500);
  },
  methods: {
    totrand() {
      this.$router.push("/trade");
    },
    // 获取持仓数量
    getpositionlen() {
      let that = this;
      this.$axios
        .post(this.basesURL + "/trades-auth/get-position-list", {})
        .then(res => {
          if (res.data.code == 0) {
            let positionLIst = res.data.data.PositionList;
            let arr = [];
            positionLIst.forEach(e => {
              if (e.TypeCode == that.Kcode) {
                arr.push(e);
              }
            });
            that.positionlen = arr.length;
          }
        });
    },
    addClass(index) {
      //买涨弹窗 规格 切换  动态添加class  （点击之后其兄弟元素去除该class）
      let that = this;
      this.rose.current = index;
      this.pricecount();
      setTimeout(() => {
        let code = document.querySelector(".spec_z.orange").children[1]
          .innerText;
        that.getvoucherlen(code);
      }, 100);
    },
    addClassg(index) {
      //买跌弹窗 规格 切换  动态添加class  （点击之后其兄弟元素去除该class）
      let that = this;
      this.fall.currentg = index;
      this.pricecount_d();
      setTimeout(() => {
        let code = document.querySelector(".spec_d.green").children[1]
          .innerText;
        that.getvoucherlen(code);
      }, 100);
    },
    buyup(v, k) {
      let that = this;
      this.show = true; //买涨 买跌弹窗显示
      this.rose.one = "one"; //买涨tab添加class
      this.activelin = 2; //切换买涨tab
      this.pricecount();
      setTimeout(() => {
        let code = document.querySelector(".spec_z.orange").children[1]
          .innerText;
        that.getvoucherlen(code);
      }, 100);
    },
    //买跌
    buydown(v, k) {
      let that = this;
      this.up = k;
      this.show = true; //买涨 买跌弹窗显示
      this.fall.two = "two"; //买跌tab添加class
      this.activelin = 1; //切换买跌tab
      this.pricecount_d();
      setTimeout(() => {
        let code = document.querySelector(".spec_d.green").children[1]
          .innerText;
        that.getvoucherlen(code);
      }, 100);
    },
    onclick() {
      let that = this;
      this.rose.one = "one"; //买涨tab添加class
      this.fall.two = ""; //买跌tab去除class
      this.pricecount();
      setTimeout(() => {
        let code = document.querySelector(".spec_z.orange").children[1]
          .innerText;
        that.getvoucherlen(code);
      }, 100);
    },
    onclicks() {
      let that = this;
      this.rose.one = ""; //买涨tab去除classniqocui
      this.fall.two = "two"; //买跌tab添加class
      this.pricecount_d();
      setTimeout(() => {
        let code = document.querySelector(".spec_z.orange").children[1]
          .innerText;
        that.getvoucherlen(code);
      }, 100);
    },
    loging() {
      this.pricecount_d();
      this.fall.valueg = parseInt(this.fall.valueg);
      if (this.fall.valueg > 10) {
        this.fall.valueg = 10;
      }
    },
    login() {
      this.pricecount();
      this.rose.value = parseInt(this.rose.value);
      if (this.rose.value > 10) {
        this.rose.value = 10;
      }
    },
    getbalance() {
      let that = this;
      this.$axios
        .post(this.basesURL + "/account-auth/get-account", {})
        .then(res => {
          if (res.data.code == 0) {
            that.$store.commit("alterbalance", res.data.data.Balance);
          }
        });
    },
    // 建仓
    positionOpen(n) {
      let that = this;
      let amount, limit, stop, code, bs;
      bs = n;
      if (n == 1) {
        code = document.querySelector(".spec_z.orange").children[1].innerText;
        amount = this.rose.value;
        limit = this.rose.limit_value / 100;
        stop = this.rose.stop_value / 100;
        // 代金券下单
        if (this.rose.radio == 2) {
          this.$axios
            .post(this.basesURL + "/trades-auth/hisposition-vouche-open", {
              code: code,
              bs: bs,
              amount: amount,
              limit: limit,
              stop: stop
            })
            .then(res => {
              if (res.data.code == 0) {
                that.show = false;
                that.$toast({
                  message: "建仓成功",
                  duration: 1500
                });
              } else {
                that.$toast({
                  message: res.data.message,
                  duration: 1500
                });
              }
            });
          return;
        }
      } else {
        code = document.querySelector(".spec_d.green").children[1].innerText;
        amount = this.fall.valueg;
        limit = this.fall.limit_valueg / 100;
        stop = this.fall.stop_valueg / 100;
        // 代金券下单
        if (this.fall.radiog == 2) {
          this.$axios
            .post(this.basesURL + "/trades-auth/hisposition-vouche-open", {
              code: code,
              bs: bs,
              amount: amount,
              limit: limit,
              stop: stop
            })
            .then(res => {
              if (res.data.code == 0) {
                that.show = false;
                that.$toast({
                  message: "建仓成功",
                  duration: 1500
                });
              } else {
                that.$toast({
                  message: res.data.message,
                  duration: 1500
                });
              }
            });
          return;
        }
      }
      this.$axios
        .post(this.basesURL + "/trades-auth/position-open", {
          code: code,
          bs: bs,
          amount: amount,
          limit: limit,
          stop: stop
        })
        .then(res => {
          if (res.data.code == 0) {
            that.show = false;
            that.$toast({
              message: "建仓成功",
              duration: 1500
            });
          } else {
            that.$toast({
              message: res.data.message,
              duration: 1500
            });
          }
        });
    },
    // 计算总价 涨
    pricecount() {
      var price, totalprice, amount, charge;
      let that = this;
      setTimeout(() => {
        price = document.querySelector(".spec_z.orange").children[0].innerText;
        amount = that.rose.value;
        charge = document.querySelector(".spec_z.orange").children[2].innerText;
        totalprice = (
          (Number(price) + Number(charge)) *
          Number(amount)
        ).toFixed(2);
        that.totalpricez = totalprice;
        that.riseCharge = (Number(charge) * Number(amount)).toFixed(2);
        this.getpositionlen();
      }, 100);
    },
    topay() {
      this.$router.push("/Trade/pay");
    },
    // 计算总价 跌
    pricecount_d() {
      var price, totalprice, amount, charge;
      let that = this;
      setTimeout(() => {
        price = document.querySelector(".spec_d.green").children[0].innerText;
        amount = that.fall.valueg;
        charge = document.querySelector(".spec_d.green").children[2].innerText;
        totalprice = (
          (Number(price) + Number(charge)) *
          Number(amount)
        ).toFixed(2);
        that.totalpriced = totalprice;
        that.fallCharge = (Number(charge) * Number(amount)).toFixed(2);
        this.getpositionlen();
      }, 100);
    },
    getvoucherlen(type) {
      this.$axios
        .post(this.basesURL + "/voucher-auth/get-my-voucher-list", {
          skip: 0,
          pageSize: 100,
          goodsCode: type
        })
        .then(res => {
          if (res.data.code == 0) {
            let len = res.data.data.CustomerVoucherList.length;
            this.voucherlen = len;
          }
        });
    },
    // 获取k线的数据
    getKline(n) {
      // debugger;
      this.nextStartTime = null;
      let that = this;
      that.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true
      });
      let data0 = [];
      that.$axios
        .post(that.basesURL + "/prices/get-charts", {
          goodType: that.Kcode,
          chartType: n,
          startTime: that.nextStartTime
        })
        .then(res => {
          if (res.data.code == 0) {
            that.nextStartTime = res.data.data.nextStartTime;
            data0 = data0.concat(res.data.data.kCharts);
          }
          that.$axios
            .post(that.basesURL + "/prices/get-charts", {
              goodType: that.Kcode,
              chartType: n,
              startTime: that.nextStartTime
            })
            .then(res => {
              if (res.data.code == 0 && that.nextStartTime) {
                that.nextStartTime = res.data.data.nextStartTime;
                if (!res.data.data.kCharts) {
                  that.$toast.clear();
                  return false;
                }
                data0 = data0.concat(res.data.data.kCharts);
                that.$axios
                  .post(that.basesURL + "/prices/get-charts", {
                    goodType: that.Kcode,
                    chartType: n,
                    startTime: that.nextStartTime
                  })
                  .then(res => {
                    if (res.data.code == 0) {
                      that.nextStartTime = res.data.data.nextStartTime;
                      data0 = data0.concat(res.data.data.kCharts);
                      that.$toast.clear();
                    }
                  });
              }
            });
        });
      let element = "myChartk" + n;
      setTimeout(function() {
        that.initkline(data0, element, n);
      }, 500);
    },
    // 切换线之间的关系
    tabecharts(n) {
      // 切换k线图 ，同时切换数据
      let childs = this.$refs.Kline_tp.childNodes;
      clearInterval(timer);
      childs.forEach(e => {
        e.classList.remove("active");
      });
      childs[n].classList.add("active");
      let timer;
      this.code = n;
      let echartss = document.querySelectorAll(".echarts");
      echartss.forEach(e => {
        e.style.display = "none";
      });
      setTimeout(() => {
        echartss[n].style.display = "block";
      }, 200);
      if (this.code != 0) {
        n = n + 1;
        this.getKline(n, true);
      } else {
        this.getTimeline();
      }
    },
    // 获取分时线
    getTimeline() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true
      });
      this.$axios
        .get(this.basesURL + "/prices/get-time-line", {
          params: {
            goodsType: this.Kcode
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.datak = res.data.data;
            setTimeout(() => {
              this.initecharts(res.data.data);
              this.$toast.clear();
            }, 500);
          }
        });
    },
    // 分时图
    initecharts(data) {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      var data0 = splitData(data);
      var time = data0.categoryData[0];
      //切割数组，把数组中的日期和数据分离，返回数组中的日期和数据
      function splitData(rawData) {
        var categoryData = [];
        var values = [];

        for (var i = 0; i < rawData.length; i++) {
          //categoryData  日期  把返回的日期放到categoryData[]数组中
          categoryData.push(rawData[i].PriceDateTime);
          values.push(rawData[i].Close);
        }
        return {
          categoryData: categoryData, //数组中的日期 x轴对应的日期
          values: values //数组中的数据 y轴对应的数据
        };
      }
      function calculateMA(dayCount) {
        var result = [];
        for (var i = 0, len = data0.values.length; i < len; i++) {
          if (i < dayCount) {
            result.push("-");
            continue; //结束单次循环，即不输出本次结果
          }
          var sum = 0;
          for (var j = 0; j < dayCount; j++) {
            sum += data0.values[i - j][1];
          }
          result.push(sum / dayCount);
        }
        return result;
      }
      // 创建x轴的时间坐标
      function crearx(time) {
        var _current = new Date(
          time.replace("T", " ").replace(new RegExp("-", "g"), "/")
        );
        var base = +new Date(
          _current.getFullYear(),
          _current.getMonth(),
          _current.getDate(),
          0,
          15,
          0
        );
        var oneMinute = 60 * 1000 * 15;
        var date = [];
        for (var i = 1; i < 96; i++) {
          var now = new Date((base += oneMinute));
          date.push(
            [
              now.getHours() < 10 ? "0" + now.getHours() : now.getHours(),
              now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()
            ].join(":")
          );
        }
        return date;
      }
      myChart.setOption({
        backgroundColor: "#3a3d51",
        tooltip: {
          trigger: "axis",
          position: [20, 20],
          axisPointer: {
            animation: false,
            type: "cross",
            axis: "auto",
            snap: true,
            label: {
              // show:false
            },
            lineStyle: {
              color: "#fff",
              type: "dashed",
              width: 1,
              opacity: 0.6
            }
          },
          textStyle: {
            fontSize: 13
          },
          padding: 5,
          // alwaysShowContent:true,
          formatter: function(params) {
            saveAsImage: {
            }
          }
        },
        grid: {
          //直角坐标系
          show: true,
          left: "0", //grid组件离容器左侧的距离
          right: "0",
          top: "20px",
          bottom: "60px",
          borderWidth: 0
        },
        xAxis: {
          type: "category",
          data: crearx(time),
          confine: true,
          // scale: true,  //只在数字轴中有效
          boundaryGap: false, //刻度作为分割线，标签和数据点会在两个刻度上
          // axisLine: { onZero: false },
          splitLine: { show: false },
          // symbol: "none",
          axisLabel: {
            color: "#fff" //刻度线标签颜色
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          }
        },
        yAxis: {
          type: "value",
          scale: true, //坐标刻度不强制包含零刻度
          splitLine: {
            lineStyle: {
              color: "rgba(119,133,164,.1)"
            }
          },
          splitArea: { show: false },
          splitNumber: 2,
          axisLabel: {
            margin: -38,
            textStyle: {
              color: "#fff"
            }
          }
          // zlevel:9
        },
        series: [
          {
            name: "price",
            type: "line", //k线图
            data: data0.values, //y轴对应的数据
            // symbol: 'none',
            itemStyle: {
              normal: {
                color: "#5686D3"
              }
            },
            areaStyle: { type: "default", color: "rgba(119,133,164,.5)" }
          }
        ]
      });
    },
    // 热加载k线图
    loadKline() {
      let flag = true;
      if (!flag) return false;
      this.$axios
        .post(this.basesURL + "/prices/get-charts", {
          goodType: this.Kcode,
          chartType: this.code,
          startTime: this.nextStartTime
        })
        .then(res => {
          if (res.data.code === 0) {
            this.nextStartTime = res.data.data.nextStartTime;
            this.loadKlineData = res.data.data.kCharts;
            flag = !flag;
          }
        });
    },
    // k线图
    initkline(data, dom, n) {
      let that = this;
      let _dom = dom;
      let initialData = data;
      let chart = this.$echarts.init(document.getElementById(dom));
      let MA5,
        MA10,
        MA20,
        MA60 = [];
      var n = n;
      var data0 = splitData(data);

      MA5 = calculateMA(5);
      MA10 = calculateMA(10);
      MA20 = calculateMA(20);
      MA60 = calculateMA(60);
      // 将返回的数据修改为echarts需要的格式
      function splitData(rawData) {
        var categoryData = [];
        var values = [];
        var tooltipDate = [];
        for (let i = 0; i < rawData.length - 1; i++) {
          if (n == 6) {
            categoryData.push(
              rawData[i].PriceDateTime.split("T")[0].slice(5, 10)
            );
            tooltipDate.push(rawData[i].PriceDateTime.split("T")[0]);
          } else {
            categoryData.push(
              rawData[i].PriceDateTime.split("T")[1].slice(0, 5)
            );
            tooltipDate.push(
              rawData[i].PriceDateTime.replace("T", " ").slice(0, 16)
            );
          }
          let arr = [];
          arr.push(rawData[i].Open);
          arr.push(rawData[i].Close);
          arr.push(rawData[i].Hlose);
          arr.push(rawData[i].Low);
          values.push(arr);
        }
        let json =
          "[[10406.33,10406.62,10407.26,10406.05],[10687.29,10406.34,10706.41,10372.64],[9879.55,10687.29,10765.3,9879.38],[9604.93,9879.55,9950.62,9520.72],[9593.59,9605.23,9682.83,9430.51],[9589.93,9593.57,9692.55,9451.89],[9506.8,9590.25,9629.47,9351.53],[10238.75,9506.7,10272.97,9322.49],[10189.9,10238.75,10305.97,10054.4],[10338.43,10189.9,10410.33,10052.01],[10067.32,10336.84,10617.35,9910.24],[9991.99,10067.32,10330.5,9949.16],[10398.2,9991.54,10441.69,9884.2],[10112.86,10397.37,10444.6,10020.04],[9989.92,10112.86,10187.02,9763.01],[10742.69,9986.67,10840.27,9925.56],[10708.13,10742.41,10948.66,10556.35],[10389.2,10708.14,10777.23,10258.9],[10312.32,10389.2,10502.33,9997.77],[10386.46,10312.33,10534.13,10206.47],[10093.88,10386.46,10457.92,9768.97],[10515.32,10093.91,10628.17,9518.91],[10951.08,10515.33,10993.21,10411],[11397.38,10951.08,11469.97,10920.79],[11383.83,11397.08,11599.77,11239.51],[11409.83,11382.58,11483.3,11115.87],[11741.97,11410.14,11982.25,11307.66],[11695,11741.61,12065.23,11524.71],[11665.06,11694.9,12077.5,11494.5],[11698.04,11665.07,12140.41,11227.67],[11749.98,11698.36,12303.71,11574.17],[10941.84,11749.98,11847.49,10784.08],[10734.57,10942.78,10968.81,10553.53],[10613.05,10734.51,10865.32,10355.18],[10013.96,10614.63,10641.29,9991.26],[10046.8,10013.96,10156.5,9879.41],[9684.79,10046.8,10086.9,9507.75],[9539.62,9682.68,9709.28,9401.05],[9520.51,9539.44,9729.5,9174.5],[9427.71,9520.51,9576.19,9346.67],[9793.51,9427.71,10181.49,9336.6],[9988.61,9793.51,10072.27,9637.57],[9911.73,9988.6,10175.9,9531.06],[9933,9913.4,10227.23,9590.84],[10242.5,9932.32,10427.88,9875.97],[10442.54,10240.46,10681.06,10167.2],[10614.09,10443.04,11053.45,10339.83],[10416.96,10614.09,10703.38,10301.12],[10434.74,10412.4,10779.27,10122.52],[9719.61,10436.75,10447.75,9274.55],[10496.08,9719.63,10497.75,9058.28],[10566.84,10495.86,11077.88,10323.52],[10414.77,10565.96,10730.96,9857.97],[11413.51,10414.77,11477.13,10302.97],[11476.5,11413.51,11881.13,11196.11],[11489.41,11475.88,11752.64,11001.43],[12365.18,11489.41,12365.18,11199],[12342.06,12365.58,13140.69,12115.72],[11832.59,12342.06,12786.68,11750.76],[11223.33,11832.81,11918.39,11123.21],[11572.21,11223.33,11664.5,11063.04],[11229.9,11571.22,11619.49,10805.58],[11708.64,11229.79,11855.14,10799.58],[11420.48,11708.35,11998.99,11037.71],[10627.7,11420.65,11498.01,10422.11],[10390.45,10627.7,10701.34,9727.42],[11156.52,10388.18,11528.47,10051.27],[11940.41,11156.49,12240.93,11050.33],[11988.85,11939.91,12478.44,11496.94],[11824.49,11988.75,12200.54,10524.04],[12888.14,11826.06,13968.47,11496.69],[11388.13,12888.14,12998.93,11268.36],[10935.19,11388.13,11499.35,10865.07],[10811.34,10935.19,11412.97,10622.87],[10802.86,10811.34,11007.62,10417],[9790.43,10802.86,11163.26,9790.1],[9375.41,9791.15,9901.8,9285.36],[9089.72,9374.71,9398.6,9065.11],[9085.83,9090,9202.71,8957.08]]";
        let jsondata = JSON.parse(json);

        if (n == 6 && categoryData.length < 20) {
          let i = 0,
            len = 30 - n;
          let date = categoryData[categoryData.length - 1].split("-");
          let arr = jsondata;
          for (let j = 0; j < len; j++) {
            if (date[1] == 1) {
              date[0] = date[0] - 1;
              date[1] = String(30);
            } else {
              date[1] =
                date[1] - 1 > 10 ? date[1] - 1 : "0" + String(date[1] - 1);
            }
            data = date[0] + "-" + date[1];
            categoryData.push(data);
            tooltipDate.push(data);
            values.push(arr[j + 6]);
          }
        }

        return {
          categoryData: categoryData.reverse(),
          values: values.reverse(),
          tooltipDate: tooltipDate.reverse()
        };
      }
      // 返回均线需要的数据
      function calculateMA(dayCount) {
        var result = [];
        for (var i = 0, len = data0.values.length; i < len; i++) {
          if (i < dayCount) {
            result.push("-");
            continue; //结束单次循环，即不输出本次结果
          }
          var sum = 0;
          for (var j = 0; j < dayCount; j++) {
            //收盘价总和
            sum += data0.values[i - j][1];
          }
          result.push(sum / dayCount);
        }
        return result;
      }
      function marry_apply(arr1, arr2) {
        return Array.prototype.concat.apply([], arguments);
      }
      let options = {
        // 设置背景颜色
        backgroundColor: "#3a3d51",
        tooltip: {
          trigger: "axis",
          position: [0, 0],
          axisPointer: {
            animation: false,
            type: "cross",
            label: {
              show: false
            },
            lineStyle: {
              color: "#fff",
              type: "dashed",
              width: 1,
              opacity: 0.6
            }
          },
          textStyle: {
            fontSize: 13,
            align: "left"
          },
          padding: 5,
          alwaysShowContent: true,
          formatter: function(params) {
            let index = params[0].dataIndex;
            return (
              "时间 : " +
              data0.tooltipDate[index] +
              "<br>" +
              "开盘 : " +
              params[0].value[1].toFixed(2) +
              "<br>" +
              "收盘 : " +
              params[0].value[2].toFixed(2) +
              "<br>" +
              "最低 : " +
              params[0].value[3].toFixed(2) +
              "<br>" +
              "最高 : " +
              params[0].value[4].toFixed(2)
            );
          }
        },
        // 容器控制器
        grid: [
          {
            //直角坐标系
            show: true,
            top: "20px",
            left: "10px", //grid组件离容器左侧的距离
            right: "10px",
            bottom: "60px",
            borderWidth: 0
          }
        ],
        // x轴属性
        xAxis: {
          type: "category",
          boundaryGap: false, //刻度作为分割线，标签和数据点会在两个刻度上
          axisLine: { onZero: false },
          splitLine: { show: false },
          splitArea: { show: false },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          },
          // inverse:true,
          symbol: "none",
          // splitNumber:"100",
          axisLabel: {
            textStyle: {
              color: "#fff",
              align: "center"
            }
            // interval:5
          },
          data: data0.categoryData,
          min: "dataMin",
          max: "dataMax"
        },
        // y轴属性
        yAxis: {
          scale: true, //坐标刻度不强制包含零刻度
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          },
          splitNumber: "3",
          splitArea: { show: false },
          axisLabel: {
            margin: -38,
            textStyle: {
              color: "#fff"
            }
          }
          // max:H,
          // min:L
        },
        //图表标注
        markPoint: {
          // label: {
          //   //标注的文本
          //   normal: {
          //     //默认不显示标注
          //     show: true,
          //     formatter: function(param) {
          //       //标签内容控制器
          //       return param != null ? Math.round(param.value) : "";
          //     }
          //   }
          // },
          data: [
            //标注的数据数组
            {
              name: "XX标点",
              coord: ["2013/5/31", 2300], //指定数据的坐标位置
              value: 2300,
              itemStyle: {
                //图形样式
                normal: { color: "rgb(41,60,85)" }
              }
            },
            {
              name: "highest value",
              type: "max", //最大值
              valueDim: "highest" //在highest维度上的最大值 最高价
            },
            {
              name: "lowest value",
              type: "min",
              valueDim: "lowest" //最低价
            },
            {
              name: "average value on close",
              type: "average",
              valueDim: "close" //收盘价
            }
          ]
        },
        series: [
          // k线的数据
          {
            name: "k线图",
            type: "candlestick",
            data: data0.values,
            splitLine: { show: false },
            // barWidth:5,
            itemStyle: {
              normal: {
                show: true,
                color: "#ff6c47",
                color0: "#14c591",
                borderColor: "#ff6c47",
                borderColor0: "#14c591"
              }
            },
            // 标识线
            markLine: {
              data: [],
              lineStyle: {
                normal: {
                  // type: "solid",
                  // color: "red"
                }
              }
            },
            areaStyle: { type: "default", color: "#263353" }
          },
          // MA线的数据
          {
            name: "MA5",
            type: "line",
            data: MA5,
            symbol: "none",
            lineStyle: {
              color: "rgb(83,202,168)",
              width: 1,
              zlevel: 5
            }
          },
          // MA10的数据
          {
            name: "MA10",
            type: "line",
            data: MA10,
            symbol: "none",
            lineStyle: {
              color: "rgb(197,87,134)",
              width: 1,
              zlevel: 5
            }
          },
          // MA20的数据
          {
            name: "MA20",
            type: "line",
            data: MA20,
            symbol: "none",
            lineStyle: {
              width: 1,
              color: "rgb(213,178,78)",
              zlevel: 5
            }
          },
          {
            name: "MA60",
            type: "line",
            data: MA60,
            symbol: "none",
            lineStyle: {
              color: "rgb(93,114,167)",
              width: 1,
              zlevel: 5
            }
          }
        ],
        // 滑动 ， 区域缩放
        dataZoom: [
          //用于区域缩放
          {
            filterMode: "filter", //当前数据窗口外的数据被过滤掉来达到数据窗口缩放的效果  默认值filter
            type: "inside", //内置型数据区域缩放组件
            start: 50, //数据窗口范围的起始百分比
            end: 100 //数据窗口范围的结束百分比
          }
        ]
      };
      chart.setOption(options);
      chart.getZr().on("mousemove", params => {
        return false;
        const pointInPixel = [params.offsetX, params.offsetY];
        if (chart.containPixel("grid", pointInPixel)) {
          let xIndex = chart.convertFromPixel({ seriesIndex: 0 }, [
            params.offsetX,
            params.offsetY
          ])[0];
          if (xIndex < 50) {
            // // 执行更新数据
            // that.loadKline();
            // setTimeout(() => {
            //   var data = marry_apply(initialData, this.loadKlineData);
            //   initialData = data;
            //   data0 = splitData(data);
            //   MA5 = calculateMA(5);
            //   MA10 = calculateMA(10);
            //   MA20 = calculateMA(20);
            //   MA60 = calculateMA(60);
            //   chart.setOption({
            //     xAxis: {
            //       data: data0.categoryData
            //     },
            //     series: [
            //       // k线的数据
            //       {
            //         name: "k线图",
            //         type: "candlestick",
            //         data: data0.values,
            //         splitLine: { show: false },
            //         // barWidth:5,
            //         itemStyle: {
            //           normal: {
            //             show: true,
            //             color: "#ff6c47",
            //             color0: "#14c591",
            //             borderColor: "#ff6c47",
            //             borderColor0: "#14c591"
            //           }
            //         },
            //         // 标识线
            //         markLine: {
            //           data: [],
            //           lineStyle: {
            //             normal: {
            //               // type: "solid",
            //               // color: "red"
            //             }
            //           }
            //         },
            //         areaStyle: { type: "default", color: "#263353" }
            //       },
            //       // MA线的数据
            //       {
            //         name: "MA5",
            //         type: "line",
            //         data: MA5,
            //         symbol: "none",
            //         lineStyle: {
            //           color: "rgb(83,202,168)",
            //           width: 1,
            //           zlevel: 5
            //         }
            //       },
            //       // MA10的数据
            //       {
            //         name: "MA10",
            //         type: "line",
            //         data: MA10,
            //         symbol: "none",
            //         lineStyle: {
            //           color: "rgb(197,87,134)",
            //           width: 1,
            //           zlevel: 5
            //         }
            //       },
            //       // MA20的数据
            //       {
            //         name: "MA20",
            //         type: "line",
            //         data: MA20,
            //         symbol: "none",
            //         lineStyle: {
            //           width: 1,
            //           color: "rgb(213,178,78)",
            //           zlevel: 5
            //         }
            //       },
            //       {
            //         name: "MA60",
            //         type: "line",
            //         data: MA60,
            //         symbol: "none",
            //         lineStyle: {
            //           color: "rgb(93,114,167)",
            //           width: 1,
            //           zlevel: 5
            //         }
            //       }
            //     ],
            //     tooltip: {
            //       formatter: function(params) {
            //         let index = params[0].dataIndex;
            //         return (
            //           "时间 : " +
            //           data0.tooltipDate[index] +
            //           "<br>" +
            //           "开盘 : " +
            //           params[0].value[1].toFixed(2) +
            //           "<br>" +
            //           "收盘 : " +
            //           params[0].value[2].toFixed(2) +
            //           "<br>" +
            //           "最低 : " +
            //           params[0].value[3].toFixed(2) +
            //           "<br>" +
            //           "最高 : " +
            //           params[0].value[4].toFixed(2)
            //         );
            //       }
            //     }
            //   });

            // }, 500);
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.app {
  background-color: rgba(58, 61, 81, 1);
}
.van-nav-bar {
  background-color: rgba(58, 61, 81, 1);
  box-shadow: none !important;
  .van-nav-bar__title {
    color: rgba($color: #fff, $alpha: 0.8);
  }
  &::after {
    border: none !important;
  }
  .van-icon {
    color: #fff;
  }
}
.information {
  height: 140px;
  padding: 0 17.5px;
  box-sizing: border-box;
  padding-top: 52px;
  text-align: left;
  .information_tp {
    .information_left {
      font-size: 16px;
      .price {
        font-size: 30px;
        font-weight: 400;
        color: rgba(20, 197, 145, 1);
        line-height: 42px;
      }
      .clearfix {
        min-width: 120px;
      }
      div {
        font-size: 16px;
        color: rgba(20, 197, 145, 1);
        line-height: 22px;
      }
    }
    .information_right {
      div {
        line-height: 32px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        text-align: left;
        padding-right: 5px;
        span {
          color: #fff;
        }
      }
    }
  }
  .information_bt {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    line-height: 25px;
  }
}
.kline {
  margin-top: 6px;
  background-color: rgba($color: #fff, $alpha: 0.1);
  .kline_tp {
    display: flex;
    justify-content: space-around;
    color: rgba($color: #fff, $alpha: 0.8);
    line-height: 25px;
    box-sizing: border-box;
    font-size: 14px;
    padding-top: 8px;
    cursor: pointer;
    .active {
      border-bottom: 4px solid #5686d3;
    }
  }
  .kline_ct {
    // padding-top: 10px;
    height: calc(100vh - 220px);
    background-color: rgba(58, 61, 81, 1);
  }
}
.echarts {
  width: 100vw;
  height: calc(100vh - 220px);
  background-color: rgba(58, 61, 81, 1);
}
.K_bottom {
  position: fixed;
  height: 54px;
  width: 100vw;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #4e5163;
  justify-content: space-around;
  display: flex;
  button {
    width: 88px;
    margin-top: 10px;
    height: 34px;
    border-radius: 5px;
    line-height: 34px;
    color: #eee;
    border: none;
    &:nth-child(1) {
      background-color: #ff6c47;
    }
    &:nth-child(2) {
      background-color: #14c591;
    }
    &:nth-child(3) {
      border: 1px solid #fff;
      background-color: rgba(255, 255, 255, 0);
      border-color: #eee;
    }
  }
}
//买涨买跌弹窗
.van-popup {
  & > p {
    font-size: 16px;
    color: rgb(51, 51, 51);
    background-color: rgba(86, 143, 211, 0.09);
    margin: 0;
    font-weight: 600;
    height: 48px;
    line-height: 48px;
    span {
      color: rgb(255, 108, 71);
      margin-left: 10px;
      font-weight: 500;
      font-family: 等线;
      &:nth-child(1) {
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .van-tabs {
    .van-tabs__content {
      //买涨弹窗
      .btone {
        background-color: #fff;
        padding-top: 22px;
        padding-bottom: 50px;
        .scale {
          p {
            display: inline-block;
            width: 80%;
            span {
              display: inline-block;
              width: 16%;
              text-align: center;
              color: rgb(153, 153, 153);
              font-size: 16px;
              // &:nth-child(1){
              //  // visibility: hidden;
              // }
            }
          }
        }
        .specifications {
          height: 34px;
          line-height: 34px;
          font-size: 16px;
          color: rgb(102, 102, 102);
          margin: 15px 0px;
          text-align: left;
          padding-left: 30px;
          margin: 0;
          font-weight: 600;
          .orange {
            color: #ff6c47;
            border: 1px solid #ff6c47;
            background-color: rgba(255, 108, 72, 0.09);
          }
          li {
            display: inline-block;
            list-style: none;
            font-size: 12px;
            width: 84px;
            height: 34px;
            box-sizing: border-box;
            border-radius: 5px;
            margin-right: 6px;
            text-align: center;
            color: rgba(153, 153, 153, 1);
            font-weight: 500;
            &:nth-child(1) {
              margin-left: 19px;
            }
            span {
              font-size: 14px;
              border: none;
            }
          }
        }
        .handnumber {
          height: 34px;
          line-height: 34px;
          font-size: 16px;
          color: rgb(102, 102, 102);
          margin: 15px 0px;
          text-align: left;
          padding-left: 30px;
          margin: 0;
          margin-top: 15px;
          margin-bottom: 14px;
          font-weight: 600;
          input {
            margin-left: 18px;
            border: 1px solid #ff6c47;
            background-color: rgba(255, 108, 72, 0.09);
            border-radius: 5px;
            color: #ff6c47;
            padding-left: 11px;
            width: 264px;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            font-weight: 500;
          }
        }
        .earnings {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          padding-left: 15px;
          text-align: left;
          background-color: rgb(238, 238, 238);
          height: 20px;
          line-height: 22px;
        }
        .dradio {
          height: 38px;
          margin: 0 15px;
          border-bottom: 1px solid #eee;
          .topup {
            position: relative;
            font-size: 14px;
            top: 10.5px;
            //  left: 47%;
            color: rgba(86, 134, 211, 1);
          }

          .van-radio-group {
            //  text-align: left;
            //  margin:0px 15px;
            //  padding-left: 15px;
            //  height: 37px;
            //  line-height: 37px;
            //  border-bottom: 1px solid rgb(238,238,238);
            .van-radio {
              display: inline-block;
              position: relative;
              line-height: 38px;
              left: 12px;
              &:nth-child(3) {
                left: -15px;
              }
              .van-radio__label {
                .number {
                  color: #ff6c47;
                  font-weight: 600;
                }
              }
            }
          }
        }
        .van-cell-group {
          .van-cell {
            .van-cell__title {
              text-align: left;
              padding-left: 14px;
              span {
                font-size: 14px;
                color: rgb(51, 51, 51);
                font-weight: 600;
              }
            }
            .van-cell__value {
              padding-right: 14px;
              .van-switch {
                font-size: 20px !important;
                height: 20px;
                width: 38px;
              }
            }
          }
          &::after {
            border: none;
          }
        }
        .win {
          text-align: left;
          height: 50px;
          line-height: 50px;
          padding-left: 30px;
          .van-stepper {
            position: relative;
            top: -4px;
            margin-left: 30px;
            width: 206px;
          }
        }
        .loss {
          text-align: left;
          height: 50px;
          line-height: 50px;
          padding-left: 30px;
          .van-stepper {
            position: relative;
            top: -4px;
            margin-left: 30px;
            width: 206px;
          }
        }
        .all {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100vw;
          font-size: 12px;
          height: 49px;
          line-height: 49px;
          box-shadow: 0px -1px 3px 0px rgba(238, 238, 238, 1);
          text-align: left;
          padding-left: 20px;
          background-color: #fff;
          span {
            &:nth-child(1) {
              font-size: 18px;
              margin-right: 9px;
            }
            &:nth-child(2) {
              font-size: 18px;
              color: rgba(255, 108, 71, 1);
            }
            &:nth-child(3) {
              font-size: 12px;
              color: rgba(153, 153, 153, 1);
              margin-left: 12px;
              position: relative;
              bottom: 2px;
            }
            &:nth-child(4) {
              height: 49px;
              width: 87px;
              text-align: center;
              display: inline-block;
              background: rgba(255, 108, 71, 1);
              color: #fff;
              font-size: 18px;
            }
          }
        }
      }
      //买跌弹窗
      .bttwo {
        background-color: #fff;
        padding-top: 22px;
        padding-bottom: 50px;
        .scale {
          p {
            display: inline-block;
            width: 80%;
            span {
              display: inline-block;
              width: 16%;
              text-align: center;
              color: rgb(153, 153, 153);
              font-size: 16px;
              &:nth-child(1) {
              }
            }
          }
        }
        .specifications {
          height: 34px;
          line-height: 34px;
          font-size: 16px;
          color: rgb(102, 102, 102);
          margin: 15px 0px;
          text-align: left;
          padding-left: 30px;
          margin: 0;
          font-weight: 600;
          .green {
            color: #14c591;
            border: 1px solid #14c591;
            background-color: rgba(20, 197, 145, 0.09);
          }
          li {
            display: inline-block;
            list-style: none;
            font-size: 12px;
            width: 84px;
            height: 34px;
            box-sizing: border-box;
            border-radius: 5px;
            margin-right: 6px;
            text-align: center;
            color: rgba(153, 153, 153, 1);
            font-weight: 500;
            &:nth-child(1) {
              margin-left: 19px;
            }
            span {
              font-size: 14px;
              border: none;
            }
          }
        }
        .handnumber {
          height: 34px;
          line-height: 34px;
          font-size: 16px;
          color: rgb(102, 102, 102);
          margin: 15px 0px;
          text-align: left;
          padding-left: 30px;
          margin: 0;
          margin-top: 15px;
          margin-bottom: 14px;
          font-weight: 600;
          input {
            margin-left: 18px;
            border: 1px solid #14c591;
            background-color: rgba(20, 197, 145, 0.09);
            border-radius: 5px;
            color: #14c591;
            padding-left: 11px;
            width: 264px;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            font-weight: 500;
          }
        }
        .earnings {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          padding-left: 15px;
          text-align: left;
          background-color: rgb(238, 238, 238);
          height: 20px;
          line-height: 22px;
        }
        .dradio {
          height: 38px;
          margin: 0 15px;
          border-bottom: 1px solid #eee;
          .topup {
            position: relative;
            font-size: 14px;
            top: 10.5px;
            //  left: 47%;
            color: rgba(86, 134, 211, 1);
          }

          .van-radio-group {
            //  text-align: left;
            //  margin:0px 15px;
            //  padding-left: 15px;
            //  height: 37px;
            //  line-height: 37px;
            //  border-bottom: 1px solid rgb(238,238,238);
            .van-radio {
              display: inline-block;
              position: relative;
              line-height: 38px;
              left: 12px;
              &:nth-child(3) {
                left: -15px;
              }
              .van-radio__label {
                .number {
                  color: #ff6c47;
                  font-weight: 600;
                }
              }
            }
          }
        }
        .van-cell-group {
          .van-cell {
            .van-cell__title {
              text-align: left;
              padding-left: 14px;
              span {
                font-size: 14px;
                color: rgb(51, 51, 51);
                font-weight: 600;
              }
            }
            .van-cell__value {
              padding-right: 14px;
              .van-switch {
                font-size: 20px !important;
                height: 20px;
                width: 38px;
              }
            }
          }
          &::after {
            border: none;
          }
        }
        .win {
          text-align: left;
          height: 50px;
          line-height: 50px;
          padding-left: 30px;
          .van-stepper {
            position: relative;
            top: -4px;
            margin-left: 30px;
            width: 206px;
          }
        }
        .loss {
          text-align: left;
          height: 50px;
          line-height: 50px;
          padding-left: 30px;
          .van-stepper {
            position: relative;
            top: -4px;
            margin-left: 30px;
            width: 206px;
          }
        }
        .all {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100vw;
          height: 49px;
          font-size: 12px;
          line-height: 49px;
          box-shadow: 0px -1px 3px 0px rgba(238, 238, 238, 1);
          text-align: left;
          padding-left: 20px;
          background-color: #fff;
          span {
            &:nth-child(1) {
              font-size: 18px;
              margin-right: 9px;
            }
            &:nth-child(2) {
              font-size: 18px;
              color: rgba(255, 108, 71, 1);
            }
            &:nth-child(3) {
              font-size: 12px;
              color: rgba(153, 153, 153, 1);
              margin-left: 12px;
              position: relative;
              bottom: 2px;
            }
            &:nth-child(4) {
              height: 49px;
              width: 87px;
              text-align: center;
              display: inline-block;
              background: #14c591;
              color: #fff;
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
