<template>
  <div class="home">
    <!-- 头部 -->
    <van-nav-bar title="玩币联盟" fixed right-text="在线客服" @click-right="toNewbie()" />
    <!-- 轮播图 -->
    <div class="swiper">
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="v in imgs">
          <img :src="imgURL + v.name" alt />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- nav -->
    <div class="xinshou">
      <router-link to="/Newbie">
        <span class="btn btn_xin">
          <img src="../assets/xinshou.png" alt />
          新手学堂
        </span>
      </router-link>
      <router-link to="/ProfitRanking">
        <span class="btn">
          <img src="../assets/paihang.png" alt />
          盈利排行
        </span>
      </router-link>
    </div>
    <div class="btc">
      <div
        class="btc_item"
        v-for="(v,k) in $store.state.commodity"
        :key="k"
        @click="openKline(v.TypeCode)"
        v-show="v.TypeCode != 'BCH'"
      >
        <div class="btc_title">{{v.TypeCode}}</div>
        <div
          class="btc_price"
          :class="v.DailyChange < 0 ? 'die':''"
          style="font-family: '等线;"
        >{{v.CurPrice}}</div>
        <div class="btc_trend">
          <span
            :class="v.DailyChange < 0 ? 'die':''"
          >{{v.DailyChange > 0 ? '+' + v.DailyChange : v.DailyChange}}</span>
          <span
            :class="v.DailyChange < 0 ? 'die':''"
          >{{v.DailyChangePercent > 0 ? '+' + Math.round(v.DailyChangePercent * 100000 ) / 1000 : Math.round(v.DailyChangePercent * 100000 ) / 1000 }}%</span>
        </div>
        <div class="line"></div>
      </div>
    </div>
    <!-- tab的切换 -->
    <van-tabs class="ProfitExpress" v-model="activeName">
      <van-tab class="deal" name="deal" title="交易机会">
        <div class="newfierce">交易解读和建议来自互联网</div>
        <div class="deal_item" v-for="v in CMRN">
          <div class="deal_item_tp clearfix">
            <div class="fl">
              <span>{{v.typeCode}}</span>
              <span :class="v.direction == 1 ? 'zhang':'die'">{{v.direction ==1 ?'看涨':'看跌'}}</span>
              <!-- <span>11000.31</span> -->
            </div>
            <div class="fr">{{v.createTime.replace('T'," ")}}</div>
          </div>
          <div class="deal_item_ct">
            <span>分析解读</span>
            <span>{{v.suggestName}}</span>
          </div>
          <div class="deal_item_bt">
            <p>建议：{{v.suggestContent}}</p>
          </div>
        </div>
      </van-tab>
      <van-tab class="payoff" name="payoff" title="盈利快报">
        <div class="newfierce">最新最牛的盈利订单</div>
        <div class="payoff_item" v-for="v in payoffList">
          <div class="payoff_item_tp">
            <img class="fl" src="../assets/caishen.png" alt />
            <span style="font-family:'等线';">{{$split(v.customerName)}}</span>
            <span
              style="font-family:'等线';"
            >盈利{{v.grossProfit}}USDT ({{Math.ceil(v.percentageOfProfit * 100) + "%"}})</span>
            <span style="font-family:'等线';">{{$timeBefore(v.closeTime)}}</span>
          </div>
          <div class="payoff_item_bt">
            <span
              :class="v.buySell==1 ? 'zhang':'die'"
            >{{v.buySell == 1 ?'买涨' +v.amount:'买跌' + v.amount}}手</span>
            <span>{{v.name}} {{"("+ v.openCost + "USDT/手)"}}</span>
            <span>{{v.openPrice}}-{{v.closePrice}}</span>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <div class="greenhand" ref="greenhand">
      <img src="../assets/new_page/page1.png" @click="greenheand_tab(0)" />
      <img src="../assets/new_page/page2.png" @click="greenheand_tab(1)" />
      <img src="../assets/new_page/page3.png" @click="greenheand_tab(2)" />
      <img src="../assets/new_page/page4.png" @click="greenheand_tab(3)" />
      <img src="../assets/new_page/page5.png" @click="greenheand_tab(4)" />
      <div class="btn" @click="tohome()"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  data() {
    return {
      activeName: "deal",
      CMRN: null,
      imgs: null,
      BTC: "",
      payoffList: "",
      time: 5000,
      socket: null,
      imgs_parent : null,
      imgs_green:null
    };
  },
  computed: {},
  created() {
    this.$axios.get(this.basesURL + "/good/list-profit-order", {}).then(res => {
      if (res.data.code == 0) {
        this.payoffList = res.data.data;
      }
    });
    this.getbanner();
    this.initsocket();
    this.$store.commit("alerthref", 1);
    this.getCMRN();
  },
  mounted() {
    this.imgs_parent = document.querySelector('.greenhand');
    this.imgs_green = document.querySelectorAll('.greenhand img');
    this.showgreenhand()
    let ticket = localStorage.getItem("ticket");
    this.$store.commit("alterticket", ticket);
  },
  watch: {},
  methods: {
    showgreenhand(){
      var isShow = localStorage.getItem('isshowGreenheand');
      if(!isShow){
        localStorage.setItem('isshowGreenheand',true);
        this.imgs_parent.style.display = "block";
        this.imgs_green[0].style.display = "block";
      }else{
        return false;
      }
    },
    toNewbie() {
      this.$router.push("/Newbie");
    },
    // 切换引导图
    greenheand_tab(n) {
      debugger
      if (n === 4) {
        this.imgs_parent.style.display = "none";
        this.$router.push("/home");
      } else {
        this.imgs_green[n + 1].style.display = "block";
      }
      this.imgs_green[n].style.display = "none";
    },
    initsocket() {
      let that = this;
      if (this.$store.state.isSocket) return false;
      /* eslint-disable */

      if (typeof WebSocket == "undefined") {
        // console.log("您的浏览器不支持WebSocket");
      } else {
        // console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        let name = localStorage.getItem("userName");
        //等同于socket = new WebSocket("ws://localhost:8082/web/checkcenter/websocket/" +name );
        let user = localStorage.getItem("userName");
        // 测试环境
        // socket = new WebSocket("ws://122.144.213.29:37373/web-socket/ws/goods/" + user);
        //正式环境
        that.socket = new WebSocket(
          "ws://47.102.128.188:8083/web-socket/ws/goods/" + user
        );
        //打开事件
        that.socket.onopen = function() {
          // console.log("Socket 已打开");
          //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        that.socket.onmessage = function(msg) {
          let arr = [];
          let data = JSON.parse(msg.data);
          for (let i = 0; i < data.length; i++) {
            if (data[i].TypeCode != "BTC") {
              arr.unshift(data[i]);
            } else {
              arr.push(data[i]);
            }
          }
          that.BTC = arr;
          that.$store.commit("alterIssocket", true);
          that.$store.commit("altercommodity", arr);
          // return  msg.data
          //发现消息进入    开始处理前端触发逻辑
        };
        //关闭事件
        that.socket.onclose = function() {
          // console.log("Socket已关闭");
        };
        //发生了错误事件
        that.socket.onerror = function() {
          // setTimeout(() => {
          //   that.initsocket()
          //   this.time = this.time +5000
          // }, this.time);
          //此时可以尝试刷新页面
        };
        //离开页面时，关闭socket
        //jquery1.8中已经被废弃，3.0中已经移除
        // $(window).unload(function(){
        //     socket.close();
        //});
      }
    },
    openKline(code) {
      this.$store.commit("alterKline", code);
      this.$router.push("/Kline");
    },
    getbanner() {
      this.$axios.get(this.basesURL + "/image/get-banners").then(res => {
        if (res.data.code == 0) {
          this.imgs = res.data.data;
        }
      });
    },
    // 获取投资建议
    getCMRN() {
      this.$axios
        .post(this.basesURL + "/good/get-exchange-opportunity", {
          pageIndex: 1,
          pageSize: 20
        })
        .then(res => {
          res = res.data;
          if (res.code == 0) {
            this.CMRN = res.data.data;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.greenhand {
  position: absolute;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: none;
  img {
    width: 100%;
    height: 100%;
    display: none;
  }
  .btn {
    width: 60px;
    height: 30px;
    position: absolute;
    right: 15px;
    top: 27px;
  }
}
// 样式修改
.van-nav-bar__right {
  .van-nav-bar__text {
    color: #333;
    font-size: 12px;
    font-weight: 800;
  }
}
.swiper {
  width: 100%;
  padding: 8px 17.5px;
  box-sizing: border-box;
  margin-top: 58px;
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;
  .van-swipe {
    overflow: hidden;
    height: 126px;
    border-radius: 3px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }
}
// 样式修改
.home {
  background-color: #f8f8f8;
  .van-nav-bar {
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05) !important;
    .van-nav-bar__title {
      font-weight: 600;
      font-size: 18px;
    }
  }
}
.xinshou {
  background-color: #fff;
  width: 100vw;
  height: 56px;
  line-height: 56px;
  a {
    .btn {
      text-align: center;
      display: inline-block;
      color: #333;
      margin: 5px 0;
      font-size: 14px;
      width: 49%;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      vertical-align: middle;
      img {
        display: inline-block;
        width: auto;
        height: 28px;
        vertical-align: middle;
        margin-top: -5px;
        padding-right: 10px;
      }
    }
    .btn_xin {
      border-right: 1px solid #eee;
    }
  }
}
.btc {
  margin-top: 10px;
  overflow-x: scroll;
  height: 110px;
  background-color: #fff;
  padding: 10px 0px;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  .btc_item {
    width: 50%;
    height: 100%;
    .btc_title {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      font-weight: 400;
      color: #333;
    }
    .btc_price {
      height: 30px;
      line-height: 30px;
      font-size: 22px;
      color: #ff6c47;
      font-weight: 600;
      font-family: "等线";
    }
    .btc_trend {
      height: 30px;
      line-height: 30px;
      max-width: 120px;
      position: relative;
      left: 50%;
      font-size: 13px;
      transform: translateX(-50%);
      color: #ff6c47;
      font-weight: 600;
      font-family: "等线";
      span {
        &:nth-child(1) {
          margin-right: 7px;
        }
      }
    }
    &:nth-child(1) {
      position: relative;
      .line {
        width: 1px;
        height: 50px;
        background: rgba(238, 238, 238, 1);
        left: 100%;
        position: absolute;
        top: 20px;
      }
    }
  }
}
.payoff {
  width: 100%;
  .newfierce {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
  }
  .payoff_item {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 10px;
    .payoff_item_tp {
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      border-bottom: 1px solid #eeeeee;
      img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin: 13px 14px 11px 15px;
      }
      span:nth-child(2) {
        color: #333333;
        margin-right: 14px;
      }
      span:nth-child(3) {
        color: #ff6c47;
        margin-right: 12px;
      }
      span:nth-child(4) {
        color: rgba(102, 102, 102, 0.5);
      }
    }
    .payoff_item_bt {
      display: flex;
      justify-content: space-between;
      height: 40px;
      line-height: 40px;
      display: flex;
      font-size: 12px;
      margin-left: 15px;
      font-family: "等线";
      span:nth-child(1) {
        color: #ff6c47;
        margin-right: 14px;
      }
      span:nth-child(2) {
        color: #333;
        margin-right: 18px;
      }
      span:nth-child(3) {
        font-family: "等线";
      }
    }
  }
}
.deal {
  .newfierce {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
  }
  .deal_item {
    height: 110px;
    width: 100%;
    width: 100%;
    padding: 0 17.5px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 10px;
    text-align: left;
    .deal_item_tp {
      height: 30px;
      line-height: 30px;
      font-size: 15px;
      .fl {
        width: 25%;
        display: flex;
        font-weight: 600;
        color: #333;
        justify-content: space-between;
        span:nth-child(3) {
          color: #ff6c47;
        }
      }
      .fr {
        color: rgba(102, 102, 102, 0.5);
        font-size: 12px;
      }
    }
    .deal_item_ct {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      span {
        display: inline-block;
      }
      span:nth-child(1) {
        border-radius: 10px;
        height: 20px;
        line-height: 20px;
        color: #999;
        margin: 0;
        padding: 0 5px;
        background-color: rgba(153, 153, 153, 0.15);
        margin-right: 15px;
      }
      span:nth-child(2) {
        color: #333;
        font-weight: 600;
        font-size: 14px;
      }
    }
    .deal_item_bt {
      height: 40px;
      margin-top: 5px;
      line-height: 17px;
      color: #666;
      p {
        margin: 0;
        font-size: 12px;
      }
    }
  }
}
</style>
