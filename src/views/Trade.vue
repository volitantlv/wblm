<template>
    <div class="app">
       <van-nav-bar title="交易" left-text="充值" right-text="在线客服" fixed @click-left="topay"  @click-right="toNewbie" class="transaction"/>
       <van-tabs color="rgb(83,134,211)" fixed  line-width="24px" line-height="4px" class="Business" @click="tabs" swipeable>
         <!-- 买卖 -->
        <van-tab  name="deal" title="买卖">
          <div class="tab_box" v-for="(v,k) in $store.state.commodity" :class="v.TypeCode" :key = "k" v-show="v.TypeCode != 'BCH'">
            <div class="tab_deal clearfix" @click="openKline(v.TypeCode)">
              <div class="tab_deal_title fl">
                <div style="font-weight:600;">{{v.TypeCode}}</div>
                <div>00:00 - 24:00</div>
              </div>
              <div class="tab_deal_content">
                  <span>${{v.CurPrice}}</span>
                  <span :class="v.DailyChange> 0 ? 'zhang' : 'die'">{{v.DailyChange}}</span>
                  <span :class="v.DailyChangePercent> 0 ? 'zhang' : 'die'">{{Math.round(v.DailyChangePercent * 10000 ) / 100}}%</span>
              </div>
            </div>
            <div class="tab_dealshow">
              <div v-for="(j,i) in goodListMap.get(v.TypeCode)"  :class="product[k] == i ? 'active':''"  @click="tabdealactive(j,i,k)">
                <div>
                  <div class="li_top">{{j.Name}}</div>
                  <div class="li_middle">{{j.DepositFee}}</div>
                  <div class="li_footer">USDT/手</div>
                </div>
              </div>
            </div>
            <div class="tab_operation">
              <van-button type="primary" @click="buyup(v,k,1)" class="buytop">
                买涨
              </van-button>
              <van-button type="primary" @click="buydown(v,k,2)" class="buydown">
                买跌
              </van-button>
            </div>
          </div>
        </van-tab>
        <!-- 持仓 -->
        <van-tab name="hold" title="持仓">
          <div class="hold" v-for="(v,k) in position" :key="k">
            <div  v-for="(a,b) in $store.state.commodity" :key="b" v-if="v.TypeCode == a.TypeCode">
              <div class="holdtitle"  @click="openKline(a.TypeCode)">
                  <span >{{v.TypeCode}}</span>
                  <p>
                    <span :class="a.DailyChangePercent > 0 ? 'zhang':'die'">${{a.CurPrice}}</span>
                    <span :class="a.DailyChange > 0 ? 'zhang':'die'">{{a.DailyChange}}</span>
                    <span :class="a.DailyChangePercent > 0 ? 'zhang':'die'">{{Math.round(a.DailyChangePercent * 10000) / 100}}%</span>
                  </p>
              </div>
              <div class="content">
                <div class="hold_top clearfix">
                  <div class="fl" :class="v.BuySell == 1 ? 'zhang':''">
                    <span :class="v.BuySell == 1 ? 'zhang':''">{{v.BuySell == 1 ? '买涨': '买跌'}}</span>
                    <span :class="v.BuySell == 1 ? 'zhang':''">{{v.Amount}}手</span>
                    <span>{{v.Name}}</span>
                  </div>
                  <div class="fr" :class="v.GrossProfit > 0 ? 'zhang':'die'">{{v.GrossProfit > 0 ? '+'+v.GrossProfit:v.GrossProfit}}USDT</div>
                </div>
                <div class="hold_middleone clearfix">
                  <div class="fl">
                    <span>建仓价：</span>
                    <span>{{v.OpenPrice}}</span>
                  </div>
                  <div class="fr">
                    <span>手续费：</span>
                    <span>{{v.OpenCharge}}USDT</span>
                  </div>
                </div>
                <div class="hold_middltwo clearfix">
                  <div class="fl">
                    <span>建仓时间：</span>
                    <span>{{v.PositionTime}}</span>
                  </div>
                  <div class="fr">
                    <span>建仓成本：</span>
                    <span>{{v.OpenCost}}USDT</span>
                  </div>
                </div>
                <div class="hold_bottom clearfix">
                  <div class="fl">
                    止盈 <span @click='confirms(v.ID,v.Limit,v.Stop)'>{{!v.Limit?'暂无':v.Limit * 100 + "%"}} </span> / 止损 <span @click='confirms(v.ID,v.Limit,v.Stop)'>{{!v.Stop ?'暂无':v.Stop * 100 + "%"}}</span>
                    <!-- {{Vid_value}} -->
                  </div>
                  <div class="fr">
                    <span @click="positionClose(v.ID)">平仓</span>
                  </div>
                </div>
              </div>
            </div>  <!-- 买跌 end--->
          </div>
          <div class="holdnone" v-if="position.length == 0">
            <img src="../assets/holdnone.png" alt="">
            <div>你当前没有交易产品</div>
            <div>快去交易吧</div>
          </div>
          <Eject  type='confirm' @took='okfall2' @tocancel='cancelfall' :showstate='showc' :title='Vid_value' :limit="Vlimit_value" :stop="Vlstop_value">
            <span slot='tlt'>确认</span>
          </Eject>
          <!--买涨end-->
        </van-tab>
        <!-- 资金 -->
        <van-tab name="user" title="资金">
          <div class="fund">
            <!-- 用户资金类信息 -->
            <div class="fund_user clearfix">
                <div class="fl">
                  <div class="fund_user_title">资产净值&nbsp;(USDT)</div>
                  <div class="fund_user_price">{{Math.round(this.assetValue * 100) / 100 }}</div>
                  </div>
                <div class="fr">
                  <router-link to="/Voucher">
                    <div class="fund_user_title">我的代金券：<span>{{totalbouchlen}}</span><i class="van-icon van-icon-arrow van-cell__right-icon"></i></div>
                  </router-link>
                  <div class="fund_user_content">浮动亏盈：<span :class="profitNum > 0 ?'zhang': profitNum < 0 ?'die':''">{{profitNum > 0 ? '+' + profitNum: profitNum}}</span></div>
                  <div class="fund_user_content">可用余额：<span>{{this.$store.state.balance}}</span></div>
                </div>
            </div>
            <div class="fund_user_operation">
              <van-button type="primary" size="normal" plain @click="topay">充值</van-button>
              <van-button type="primary" size="normal" plain @click="withdraw">提现</van-button>
            </div>
          </div>
          <van-tabs class="secondtab" color="rgb(83,134,211)" line-width="24px" line-height="4px" title-active-color="rgb(51,51,51)" background="rgb(248,248,248)" title-inactive-color="rgb(153,153,153)" >
            <van-tab title="交易">
              <div class="deal" v-if="historyList">
                <div class="deal_item clearfix" v-for="v in historyList" @click="toUnwind(v.ID)">
                  <div class="fl">
                    <div>
                      <span :class="v.BuySell == 1? 'zhang':'die'">{{v.BuySell == 1 ? '买涨':'买跌'}}</span>
                      <span :class="v.BuySell == 1? 'zhang':'die'">{{v.Amount}}手</span>
                      <span>{{v.Name}}</span>
                    </div>
                    <div class="time">
                    {{v.PositionTime.replace("T"," ")}}
                    </div>
                  </div>
                  <div class="fr triangle" :class="v.GrossProfit > 0 ? 'zhang':'die'" style="font-weight:'等线'">
                    {{v.GrossProfit>0 ? '+'+v.GrossProfit :v.GrossProfit}}USDT
                  </div>
                </div>
                <div class="loadmore" v-if="historyList.length > 9" @click="LoadData(1)">加载更多</div>
              </div>
              <div class="elseshow"  v-if="historyList.length == 0">暂无交易记录</div>
            </van-tab>
            <van-tab title="提现" class="lect">
              <div  v-for="(v,k) in withdraws" :key="k" class="reflect" >
                <p class="clearfix"><span class="fl">提现</span><span class="fr">${{v.money}}</span></p>
        	      <p class="clearfix"><span class="fl">{{v.createTime.replace("T"," ")}}</span><span class="fr">
                  {{v.statusName}}
                   </span></p>
              </div>
              <div v-if="withdraws.length > 9" class="loadmore" @click="LoadData(2)">加载更多</div>
             <div class="elseshow"  v-if="withdraws.length<=0">暂无提现记录</div>
            </van-tab>
            <van-tab title="充值" class="arge lect ">
              <div v-for="(v,k) in rechargelist" :key="k" class="reflect" >
                  <p class="clearfix"><span class="fl">充值</span><span class="fr">${{v.money}}</span></p>
        	        <p class="clearfix"><span class="fl">{{v.createTime ? v.createTime.replace("T"," "):''}}</span><span class="fr">
                  {{v.statusName}}
                  </span></p>
              </div>
              <div v-if="rechargelist.length > 9" class="loadmore" @click="LoadData(3)">加载更多</div>
              <div class="elseshow"  v-if="rechargelist.length == 0">暂无充值记录</div>
            </van-tab>
          </van-tabs>
        </van-tab>
      </van-tabs>
      <!-- 交易弹窗 -->
      <van-popup v-model="show" position="bottom" :style="{ height: '79%'}" class="pop_down" style="min-height:480px; ">
        <p><span>{{Typecode}}</span><span>${{$store.state.commodity[up].CurPrice}}</span></p>
        <van-tabs v-model="activelin" >
          <van-tab  >
            <!-- 买涨 -->
            <div  slot="title"  @click="onclick" :class="rose.one">买涨</div>
            <div class="btone">
            <div class="specifications">
              规格
              <li v-for="(v, i) in goodListMap.get(Typecode)" :key="i" @click="addClass(i);" class="spec_z" :class="{ orange:i == rose.current}">
                <span>{{ v.DepositFee}}</span>USDT/手
                <span style="display:none;">{{v.Code}}</span>
                <p style="display:none;">{{v.OpenChargeFee}}</p>
              </li>
            </div>
            <div class="handnumber">手数
              <input type="number" v-model="rose.value" @input="login" placeholder="请设置1-10之间的数字">
            </div>
            <div class="jbq"><van-stepper  v-model="rose.value" :min="0" :max="10" :step="1"  @change="login"/></div>
            <van-slider  v-model="rose.value"  active-color="#FF6C47" :min="0" :max="10" :step="1" bar-height="4px">
              <div slot="button" class="custom-button">
              </div>
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
            <div class="earnings">共计合约量{{shopcode.fall}}</div>
            <div class="dradio">
            <van-radio-group v-model="rose.radio">
              <van-radio name="1" class="fl">余额：<span>{{this.$store.state.balance}}</span><img slot="icon" slot-scope="props" :src="props.checked ? active : inactive" ></van-radio>
              <span class="topup" @click="topay">充值</span>
              <van-radio name="2" class="fr">可用代金券<span class="number">{{voucherlen}}</span>张<img slot="icon" slot-scope="props" :src="props.checked ? active : inactive" ></van-radio>
            </van-radio-group>
            </div>
            <van-cell-group>
              <!-- <div >止盈止损(%)</div> -->
              <van-switch-cell v-model="rose.checked" disabled title="止盈止损(%)"/>
            </van-cell-group>
            <div class="win">
              <span>止盈(10% -80%)</span><van-stepper min="10" max="80" v-model="rose.limit_value" step="5" style="display:inline-block;"/>
            </div>
            <div class="loss">
              <span>止损(10% -80%)</span><van-stepper min="10" max="80" v-model="rose.stop_value" step="5" style="display:inline-block;"/>
            </div>
            <div class="all">
              <span>总计</span>
              <span>{{totalpricez}}</span> USDT
              <span>(手续费 {{riseCharge}})</span>
              <span class="fr" @click="positionOpen('1')">下单</span>
            </div>
            </div>
          </van-tab>
          <van-tab >
            <!-- 买跌 -->
            <div  slot="title" @click="onclicks" :class="fall.two">买跌</div>
            <div class="bttwo">
            <div class="specifications">
              规格
              <li v-for="(v, i) in goodListMap.get(Typecode)" :key="i" @click="addClassg(i,$event);" class="spec_d" :class="{ green:i==fall.currentg}">
                <span>{{v.DepositFee}}</span>USDT/手
                <span style="display:none;">{{v.Code}}</span>
                <p style="display:none">{{v.OpenChargeFee}}</p>
              </li>
            </div>
            <div class="handnumber">手数
              <input type="number" v-model="fall.valueg" @input="loging" placeholder="请设置1-10之间的数字">
            </div>
            <div class="jbq"><van-stepper v-model="fall.valueg" :min="0" :max="10" :step="1" @change="loging" /></div>
            <van-slider  v-model="fall.valueg"  active-color="#14C591" :min="0" :max="10" :step="1" bar-height="4px">
              <div slot="button" class="custom-button">
              </div>
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
            <div class="earnings">共计合约量{{shopcode.rose}}</div>
            <div class="dradio">
            
            <van-radio-group v-model="fall.radiog">
              <van-radio name="1" class="fl">余额：<span>{{this.$store.state.balance}}</span><img slot="icon" slot-scope="props" :src="props.checked ? active :inactive"></van-radio>
              <span class="topup" @click="topay">充值</span>
              <van-radio name="2" class="fr">可用代金券<span class="number">{{voucherlen}}</span>张<img slot="icon" slot-scope="props" :src="props.checked ? active : inactive"></van-radio>
            </van-radio-group>
            </div>
            <van-cell-group> 
              <!-- <div>止盈止损(%)</div> -->
              <van-switch-cell v-model="fall.checkedg" disabled title="止盈止损(%)" />
            </van-cell-group>
            <div class="win">
              <span>止盈(10% -80%)</span><van-stepper min="10" max="80" v-model="fall.limit_valueg" step="5" style="display:inline-block;"/>
            </div>
            <div class="loss">
              <span>止损(10% -80%)</span><van-stepper min="10" max="80" v-model="fall.stop_valueg" step="5" style="display:inline-block;"/>
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
      <router-view></router-view>
    </div>
</template>
<script>
import useractive from '../assets/user-active.png';
import userinactive from '../assets/user-inactive.png';
import Eject from "./payment/pop";
export default {
    name: '',
    props: {
    },
    data() {
      return {
          totalbouchlen:"",
          assetValue:0,
          profitNum:0,
          voucherlen:'',
          Vid_value:'', //止盈  止损 弹窗  动态id
          Vlimit_value:'',
          Vlstop_value:'',
          showc:false,  //止盈  止损 弹窗 
          up:0,
          goods :null,
          goodMap: null,
          goodListMap: new Map(),
          childeTypecode:'',
          typecode:'',
          Typecode:'',
          profit:'',
          rose:{    //买涨弹窗  买涨 tab-content
            value: 1,    //买涨 弹窗 手数 步进器 滑块 联动 v-model 
            limit_value:20, //买涨 弹窗 止赢 步进器  v-model
            stop_value:20,  //买涨 弹窗 止损 步进器  v-model
            radio: '1',    //买涨 弹窗  余额 代金券 单选按钮  1-默认余额 2-默认代金券
            checked: true,    //买涨 弹窗 止赢止损开关按钮
            current:"0",     //买涨弹窗 部分 动态切换 规格添加class
            one:"",         //买涨弹窗 tab点击动态添加class
            Specifications_number:7,
          },
          fall:{
            valueg:1,    //买跌 弹窗 手数 步进器 滑块 联动 v-model 
            limit_valueg:20, //买跌 弹窗 止赢 步进器  v-model
            stop_valueg:20,  //买跌 弹窗 止损 步进器  v-model
            radiog: '1',   //买跌 弹窗  余额 代金券 单选按钮  1-默认余额 2-默认代金券
            checkedg: true,   //买跌 弹窗 止赢止损开关按钮
            currentg:"0",    //买跌弹窗 部分 动态切换 规格添加class
            two:"",        //买跌弹窗 tab点击动态添加class
            Specifications_number:7,
          },
          activelin:"",    //买涨买跌弹窗 v-model控制  1-买涨 2-买跌
          show: false,   // 买涨买跌按钮底部弹窗控制- true-显示  false-隐藏
          // 持仓列表
          position:'',
          // 选择规格
          product:[0,0,0],
          // 历史订单
          historyList:[],
          // 充值订单
          rechargelist:[],
          active: useractive,   //选中状态图片
          inactive: userinactive,   //未选中状态图片
          totalpricez:'',
          totalpriced:'',
          riseCharge:'',
          fallCharge:'',
          withdraws:[],
          skip:{
            history:0,
            recharge:0,
            withdraw:0
          },
          syncPosition:null,
          isTimer:true,
          shopcode:{
            rose:null,
            fall:null
          }
      }
    },
    created() {
      this.$store.commit('alerthref',2);
      this.$axios.post(this.basesURL+'/account-auth/get-account',{}).then(res => {
        if(res.data.code == 0){
            this.$store.commit('alterbalance',res.data.data.Balance);
        }
      })
      this.$axios.post( this.basesURL + '/voucher-auth/get-my-voucher-list',{
        skip:0,
        pageSize:1000,
      }).then(res => {
        if(res.data.code == 0) {
            let len = res.data.data.CustomerVoucherList.length;
            this.totalbouchlen =len;
        }                
      })
     this.syncPosition = setInterval(this.positionAxios,3000)
    },
    mounted() {
      this.$axios.get(this.basesURL+'/good/get-list',{
        params:{
          // goodsType:'BTH'
        }
      }).then(res => {
        if(res.data.code == 0){
          var goodsList = res.data.data.GoodsList
          this.goodMap = new Map();
          // this.goodListMap = new Map();
          goodsList.forEach(element => {
            var arr = this.goodListMap.get(element.TypeCode);
            if(!arr){
              arr = [];
            }
            arr.push(element);
            this.goodListMap =  this.goodListMap.set(element.TypeCode, arr);
            this.goodMap =  this.goodMap.set(element.Name, element);
          });
        }
      });
      // if(this.position){
      // }
      let ticket = localStorage.getItem('ticket');
        this.$store.commit('alterticket',ticket);
        this.$axios.post(this.basesURL+'/account-auth/get-account',{}).then(res => {
            if(res.data.code == 0){
                this.$store.commit('alterbalance',res.data.data.Balance);
            }
        })
    },
    methods: {
      // load数据
      LoadData(n){
        if(n == 1 ){
          this.skip.history++;
          this.historylist()
        }else if(n == 2 ){
          this.skip.withdraw++;
          this.getwithdraws();
        }else {
          this.skip.recharge++;
          this.rechargelistAJAX();
        }
      },
      tabs(name,title){
        let i = 0;
        i++;
        if(name == "deal"){

        }else if (name == "hold") {
          this.positionAxios();
        }else{
            this.historylist(true);
            this.rechargelistAJAX(true);
            this.getwithdraws(true);
        }
      },
      toUnwind(n){
         this.$store.commit('alterPosition',n);
         this.$router.push('Unwind')
      },
      // 打开k线页面
      openKline(code){
        this.$store.commit('alterKline',code)
        this.$router.push('/Kline');
      },
      popup(){
        this.$dialog.alert({
          message: '平仓',
          showConfirmButton:true,
          showCancelButton:true,
          confirmButtonText:'确定',
        });
      },
      topay(){
        this.$router.push('/Trade/pay');
      }, 
      withdraw(){
        this.$router.push('/Trade/withdraw');
      },
      toNewbie(){
        this.$router.push('/Newbie');
      },
      toRecharge(){
        this.$router.push('/Trade/pay');
      },
      // 切换选中
      tabdealactive(j,i,k){
        this.product[k] = i;
        this.childeTypecode = j.Code;
      },
      //买涨
      buyup(v,k) {
        let that =this;
        this.up = k;
        this.Typecode = v.TypeCode;
        this.addClass(this.product[k]);
        this.show = true;    //买涨 买跌弹窗显示
        this.rose.one="one";  //买涨tab添加class
        this.activelin=2;     //切换买涨tab
        this.pricecount();
        setTimeout(() => {
          let code = document.querySelector('.spec_z.orange').children[1].innerText;
          let shopcode = code.substring(0,code.length-3);
          let num = shopcode * this.rose.value;
          this.shopcode.fall = num.toFixed(2) + this.Typecode;
          that.getvoucherlen(code);
        }, 100);
      },
      //买跌
      buydown(v,k) { 
        this.up = k;
        this.addClassg(this.product[k]);
        // this.addtwo(this.fall.todosg[k].number);
        this.Typecode = v.TypeCode
        this.typecode = v.TypeCode
        this.show = true;//买涨 买跌弹窗显示
        this.fall.two="two";//买跌tab添加class
        this.activelin=1;//切换买跌tab
        this.pricecount_d();
        setTimeout(() => {
          let code = document.querySelector('.spec_d.green').childNodes[2].innerText;
          let shopcode = code.substring(0,code.length-3);
          let num = shopcode * this.fall.valueg
          this.shopcode.rose = num.toFixed(2)  + this.Typecode;
          this.getvoucherlen(code);
        }, 100);
      },
      onclick(){          //点击弹窗买涨tab
        this.rose.one="one";    //买涨tab添加class
        this.fall.two="";      //买跌tab去除class
        setTimeout(() => {
          let fathernode = document.querySelector('.spec_z.orange');
          if(!fathernode){
            fathernode =  document.querySelector('.spec_z');
          }
          let code = fathernode.childNodes[2].innerText;
          let shopcode = code.substring(0,code.length-3);
          let num = shopcode * this.rose.value
          this.shopcode.rose = num.toFixed(2)  + this.Typecode;
        }, 200);
        this.pricecount();
      },
      onclicks(){        //点击弹窗买跌tab
        this.fall.two="two";  //买跌tab添加class
        this.rose.one="";     //买涨tab去除class
        setTimeout(() => {
          let fathernode = document.querySelector('.spec_d.green');
          if(!fathernode){
            fathernode =  document.querySelector('.spec_d');
          }
          let code = fathernode.childNodes[2].innerText;
          let shopcode = code.substring(0,code.length-3);
          let num = shopcode * this.fall.valueg
          this.shopcode.rose = num.toFixed(2)  + this.Typecode;
        }, 200);
        this.pricecount_d();
      },
      login() {
        this.pricecount();
        this.rose.value = parseInt(this.rose.value);
        if(this.rose.value > 10 ){
          this.rose.value = 10
        }
        let code = document.querySelector('.spec_z.orange').childNodes[2].innerText;
        let shopcode = code.substring(0,code.length-3);
        let num = shopcode * this.rose.value
        this.shopcode.fall = num.toFixed(2)  + this.Typecode;
      },
      //input的最大值和最小值判断--有了其val值 为空  买跌
      loging(){   
        this.pricecount_d();
        this.fall.valueg = parseInt(this.fall.valueg);
        let code = document.querySelector('.spec_d.green').childNodes[2].innerText;
        let shopcode = code.substring(0,code.length-3);
        let num = shopcode * this.fall.valueg
        this.shopcode.rose = num.toFixed(2)  + this.Typecode;
        if(this.fall.valueg > 10 ){
          this.fall.valueg = 10;
        }
      },
      addClass(index){   //买涨弹窗 规格 切换  动态添加class  （点击之后其兄弟元素去除该class）
        let that = this;
        this.rose.current = index;
        this.pricecount();
        setTimeout(() => {
          let code = document.querySelector('.spec_z.orange').children[1].innerText;
          let shopcode = code.substring(0,code.length-3);
          let num = shopcode * this.rose.value;
          this.shopcode.fall = num.toFixed(2) + this.Typecode;
          that.getvoucherlen(code);
        }, 100);
      },
      addtwo(number){
        this.rose.Specifications_number=number;
      }, 
      addtwog(number){
        this.fall.Specifications_number=number;
      },
      addClassg(inde){   //买跌弹窗 规格 切换  动态添加class  （点击之后其兄弟元素去除该class）
        let that = this;
        this.fall.currentg = inde;
        this.pricecount_d();
        setTimeout(() => {
          let code = document.querySelector('.spec_d.green').children[1].innerText;
          let shopcode = code.substring(0,code.length-3);
          let num = shopcode * this.fall.valueg;
          this.shopcode.rose = num.toFixed(2)  + this.Typecode;
          that.getvoucherlen(code);
        }, 100);
      },
       // 获取持仓列表
      positionAxios(){
        let that = this;
        this.$axios.post(this.basesURL + '/trades-auth/get-position-list',{}).then(res => {
          // 请求成功
          if(res.data.data.ResultCD == "I001"){
            if(!res.data.data.PositionList || res.data.data.PositionList.length == 0){
              that.position =res.data.data.PositionList;
              this.assetValue =Number(this.$store.state.balance);
              this.profitNum =0;
              clearInterval(that.syncPosition);
              this.isTimer = false;
              return false;
            }
            if(!this.isTimer){
              this.syncPosition = setInterval(this.positionAxios,3000);
              this.isTimer = true;
            }
            let num = 0,money = 0;
            let profit = res.data.data.PositionList;
            this.position = profit;
            if(profit){
              for(var i= 0;i<profit.length;i++){
                 num += Number(profit[i].GrossProfit);
                 money += Number(profit[i].OpenCost);
             }
              this.profitNum = num.toFixed(3);
            }
            this.assetValue =Number(this.$store.state.balance) + Number(money); 
          }
        })
      },
      // 平仓
      positionClose(id){
        let that = this;
        this.$dialog.confirm({
            message: '是否确认平仓',
        }).then( () =>{
          this.$axios.post(this.basesURL+'/trades-auth/position-close',{
            positionId:id
          }).then(res => {
            that.$toast({
              message:'提交成功',
              duration: 1500
            })
            that.positionAxios();
          })
        })
      },
      // 建仓
      positionOpen(n){
        debugger
        let that = this;
        let amount,limit,stop,code,bs;
        bs = n;
        if(n == 1){
          code = document.querySelector('.spec_z.orange').children[1].innerText;
          amount = this.rose.value;
          limit = this.rose.limit_value / 100;
          stop = this.rose.stop_value / 100;
          // 代金券下单
          if(this.rose.radio == 2){
            this.$axios.post(this.basesURL+'/trades-auth/hisposition-vouche-open',{
              code:code,
              bs:bs,
              amount:amount,
              limit:limit,
              stop:stop
            }).then(res => {
              if(res.data.code == 0){
                this.$axios.post(this.basesURL+'/account-auth/get-account',{}).then(res => {
                  if(res.data.code == 0){
                    that.$store.commit('alterbalance',res.data.data.Balance);
                  }
                })
                that.show = false;
                that.$toast({
                    message:'建仓成功',
                    duration: 1500
                });
                that.positionAxios();
              }else{
                that.$toast({
                    message:res.data.message,
                    duration: 1500
                });
              }
            })
            return false;
          }
        }else{
          document.querySelector('.spec_d.green')
          code = document.querySelector('.spec_d.green').children[1].innerText
          amount = this.fall.valueg;
          limit = this.fall.limit_valueg / 100;
          stop = this.fall.stop_valueg / 100;
          // 代金券下单
          if(this.fall.radiog == 2){
            this.$axios.post(this.basesURL+'/trades-auth/hisposition-vouche-open',{
              code:code,
              bs:bs,
              amount:amount,
              limit:limit,
              stop:stop
            }).then(res => {
              if(res.data.code == 0){
                 this.$axios.post(this.basesURL+'/account-auth/get-account',{}).then(res => {
                  if(res.data.code == 0){
                    that.$store.commit('alterbalance',res.data.data.Balance);
                  }
                })
                that.show = false;
                that.$toast({
                    message:'建仓成功',
                    duration: 1500
                });
                that.positionAxios();
              }else{
                that.$toast({
                    message:res.data.message,
                    duration: 1500
                });
              }
            })
            return false;
          }
        }
        this.$axios.post(this.basesURL+"/trades-auth/position-open",{
            code:code,
            bs:bs,
            amount:amount,
            limit:limit,
            stop:stop
        }).then(res => {
          if(res.data.code == 0 ) {
             this.$axios.post(this.basesURL+'/account-auth/get-account',{}).then(res => {
                if(res.data.code == 0){
                  that.$store.commit('alterbalance',res.data.data.Balance);
                }
              })
            that.show = false;
            that.$toast({
                message:'建仓成功',
                duration: 1500
            });
            that.positionAxios();
          }else{
            that.$toast({
                message:res.data.message,
                duration: 1500
            });
          }
        })
      },
      // 历史订单列表
      historylist(flag){
        this.$toast.loading({
          duration:0,
          forbidClick: true,
        })
        this.$axios.post(this.basesURL+'/trades-auth/get-hisposition-list',{
          skip:this.skip.history,
          pageSize:10
        }).then(res => {
          if(res.data.data.ResultCD == "I001"){
            if(flag){
              this.historyList = res.data.data.PositionList;
              this.$toast.clear()
              return false;
            }
            if(res.data.data.PositionList.length== 0){
              this.$toast("没有更多数据了")
              return false;
            }

            this.historyList = this.historyList.concat(res.data.data.PositionList);
            this.$toast.clear()
          }
        })
      },
      // 充值订单列表
      rechargelistAJAX(flag){
        let that = this;
        this.$toast.loading({
          duration:0,
          forbidClick: true,
        })
        this.$axios.post(this.basesURL+'/account-auth/get-deposit-list',{
          pageIndex:this.skip.recharge,
          pageSize:10
        }).then( res => {
          if(res.data.code == 0){
             if(flag){
              this.rechargelist = res.data.data;
              this.$toast.clear()
              return false;
            }
            if(res.data.data.length == 0){
              this.$toast("没有更多数据了")
              return false;
            }
            that.rechargelist = that.rechargelist.concat(res.data.data)
            this.$toast.clear()
          }
        } )
      },
      // 提现订单列表
      getwithdraws(flag){
        let that = this;
        this.$toast.loading({
          duration:0,
          forbidClick: true,
        })
        this.$axios.post(this.basesURL+'/account-auth/get-withdraw-list',{
          pageIndex:this.skip.withdraw,
          pageSize:10
        }).then( res => {
          if(res.data.code == 0){
            if(flag){
              this.withdraws = res.data.data;
              this.$toast.clear()
              return false;
            }
            if(res.data.data.length == 0){
              this.$toast.clear()
              this.$toast("没有更多数据了")
              return false;
            }
            that.withdraws = that.withdraws.concat(res.data.data);
            this.$toast.clear()
          }
        })
      },
      // 修改持仓
      confirms(id,limit,stop){
        this.Vid_value = id;
        this.Vlimit_value = limit;
        this.Vlstop_value = stop;
        this.showc=true;
      },
      // 获取代金券数量
      getvoucherlen(type){
        this.$axios.post( this.basesURL + '/voucher-auth/get-my-voucher-list',{
          skip:0,
          pageSize:1000,
          goodsCode:type
        }).then(res => {
          if(res.data.code == 0) {
              let len = res.data.data.CustomerVoucherList.length;
              this.voucherlen = len
          }                
        })
      },
      cancelfall(){
        this.showc=false;
      },
      okfall2(){
        this.showc=false;
      },
      // 计算总计的价格
      pricecount(){
        var price,totalprice,amount,charge;
        let that = this;
        setTimeout(() => {
          price = document.querySelector('.spec_z.orange').children[0].innerText;
          amount = that.rose.value;
          charge = document.querySelector('.spec_z.orange').children[2].innerText;
          totalprice =((Number(price) + Number(charge))* Number(amount)).toFixed(2);        
          that.totalpricez = totalprice;
          that.riseCharge =( Number(charge) * Number(amount)).toFixed(2);
        }, 100);
      },
      pricecount_d(){
        var price,totalprice,amount,charge;
        let that = this;
        setTimeout(() => {
          price = document.querySelector('.spec_d.green').children[0].innerText;
          amount = that.fall.valueg;
          charge = document.querySelector('.spec_d.green').children[2].innerText;
          totalprice =((Number(price) + Number(charge))* Number(amount)).toFixed(2);        
          that.totalpriced = totalprice;
          that.fallCharge = (Number(charge) * Number(amount)).toFixed(2);
        }, 100);
      }
    },
    components: {
       Eject,
    },
    beforeDestroy(){
      clearInterval(this.syncPosition)
    }
};
</script>

<style scoped lang="scss">
.van-switch{
  display: none!important;
}
.van-tab__pane{
  height: 100%;
  overflow: hidden;
}
  .elseshow{
    // line-height: 25px;
    font-size: 14px;
    background-color: #fff;
  }
  .transaction{
      box-shadow: 1px 1px 1px rgba(0,0,0,.05)!important;
      .van-nav-bar__left{
          .van-nav-bar__text{
              color:#000;
              font-size: 12px;
              &:active{
                background-color: #fff;
              }
          }
      }
      .van-nav-bar__right{
          .van-nav-bar__text{
              color:#000;
              font-size: 12px;
          }
      }
      .van-nav-bar__title{
          font-size: 18px;
          font-weight: 600;
      }
  }
  .app{
    padding-top: 50px;
    background-color: #F8F8F8;
  }
  #app{
    width: 100vw;
    background-color: #f8f8f8;
    height: calc(100vh-50px);
  }
  .van-tab{
    border:1px solid red;
  }
  .van-tabs{
    background-color: rgb(248,248,248);
    .van-tabs__wrap{
      .van-tabs__nav{
        .van-tabs__line{
          background-color: red!important;
        }
      }
    }
    .van-tabs__wrap::after{
      display: none;
    }
  }
  // 买卖
  .tab_box{
    background-color: #fff;
    margin: 7px;
    border-radius: 10px;
    box-shadow: 0px 0px 4px #ddd;
  }
  .tab_dealshow,
  .tab_operation{
    padding: 10px 17.5px;
    box-sizing: border-box;
  }
  .tab_deal{
    height: 42px;
    line-height: 20px;
    padding-top:6px;
    margin: 0 10px 16px 10px;
    border-bottom:1px solid #f8f8f8;
    .tab_deal_title{
      padding-bottom: 2px;
      div{
        &:nth-child(1){
          font-size: 14px;
          text-align: left;
          padding-left: 10px;
        }
        &:nth-child(2){
          font-size: 12px;
          color:rgb(153,153,153);
          padding-left: 10px;
          font-family: 等线;
        }
      }
    }
    .tab_deal_content{
      font-size: 14px;
      text-align: right;
      font-family: 等线;
      span{
        font-size: 14px;
        font-weight: 500;
        color:rgba(255,108,71,1);
        margin-right: 10px;
      }
      &:after{
        content: "";
        width: 10px;
        height: 10px;
        border-top:2px solid rgba(221,221,221,.5);
        border-left:2px solid rgba(221,221,221,.5);
        display: inline-block;
        transform: rotate(135deg);
      }
    }
  }
  .tab_dealshow{
    width: 100%;
    height: 120px;
    padding:0;
    box-sizing: border-box;
    &>div{
      display: inline-block;
      padding-top: 10px;
      box-sizing: border-box;
      width:100px;
      height:108px;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 5px 0px rgba(228,228,228,1);
      border-radius:5px;
      div{
        border: none;
        padding: 0;
        &:nth-child(3){
          font-size: 16px;
          line-height: 20px;
        }
        
      }
        .li_top{
          padding-top: 10px;
          font-size: 14px;
          color: rgb(51,51,51);
        }
        .li_middle{
          height: 45px;
          line-height: 45px;
          font-size: 38px;
          color: rgb(51,51,51);
        }
        .li_footer{
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: rgb(51,51,51);
        }
      
    }
    div.active{
      background-color: rgb(86,143,211);
      &>div{
        background-color: rgba(255,255,255,.7);
        height: 100%;
      }
    }
    &>div:nth-child(2){
      margin: 0 20px;
    }
    
  }
  .tab_operation{
    // display: -webkit-flex;
    // display: flex;
    // -webkit-flex: 1;
    // flex: 1;
    // flex-direction: row;
    // -webkit-flex-direction: row;
    // justify-content: space-evenly;
    .buytop{
      width: 120px;
      height: 44px;
      background-color: rgb(255,108,71);
      border: none;
      border-radius: 5px;
      margin-right: 45px;
    }
    .buydown{
      width: 120px;
      height: 44px;
      background-color: rgb(20,197,145);
      border: none;
      border-radius: 5px;
    }
  }
//买涨买跌弹窗
.van-popup{
  &>p{
    font-size: 16px;
    color: rgb(51,51,51);
    background-color: rgba(86,143,211,.09);
    margin: 0;
    font-weight:600;
    height: 48px;
    line-height: 48px;
    span{
      color: rgb(255,108,71);
      margin-left: 10px;
      font-weight: 500;
      font-family: 等线;
      &:nth-child(1){
        color:rgba(51,51,51,1);
      }
    }
  }
   .van-tabs{
     .van-tabs__content{
       //买涨弹窗
       .btone{
         background-color: #fff;
         padding-top: 22px;
         padding-bottom: 50px;
         .scale{
           p{
            display: inline-block;
            width: 80%;
            span{
              display:inline-block;
              width: 16%;
              text-align: center;
              color: rgb(153,153,153);
              font-size: 16px;
              // &:nth-child(1){
              //  // visibility: hidden;
              // }
            }
          }
         }
         .specifications{
          height: 34px;
          line-height: 34px;
          font-size: 16px;
          color: rgb(102,102,102);
          margin: 15px 0px;
          text-align: left;
          padding-left: 30px;
          margin:0;
          font-weight: 600;
           .orange{
             color: #FF6C47;
             border: 1px solid #FF6C47;
             background-color: rgba(255,108,72,0.09);
             }
           li{
             display: inline-block;
             list-style: none;
             font-size: 12px;
             width: 84px;
             height: 34px;
             box-sizing: border-box;
             border-radius: 5px;
             margin-right: 6px;
             text-align: center;
             color:rgba(153,153,153,1);
             font-weight: 500;
             &:nth-child(1){
               margin-left: 19px;
             }
             span{
               font-size: 14px;
               border:none;
             }
           }
         }
         .handnumber{
          height: 34px;
          line-height: 34px;
          font-size: 16px;
          color: rgb(102,102,102);
          margin: 15px 0px;
          text-align: left;
          padding-left: 30px;
          margin: 0;
          margin-top: 15px;
          margin-bottom: 14px;
          font-weight: 600;
          input{
            margin-left: 18px;
            border: 1px solid #FF6C47;
            background-color: rgba(255,108,72,0.09);
            border-radius: 5px;
            color: #FF6C47;
            padding-left: 11px;
            width: 264px;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            font-weight: 500;
          }
         }
         .earnings{
           font-size: 12px;
           color:rgba(153,153,153,1);
           padding-left: 15px;
           text-align: left;
           background-color: rgb(238,238,238);
           height: 20px;
           line-height: 22px;
         }
         .dradio{
            height: 38px;
            margin: 0 15px;
            border-bottom: 1px solid #eee;
          .topup{
            position: relative;
            font-size: 14px;
            top:10.5px;
            //  left: 47%;
            color: rgba(86,134,211,1);
            }
          
          .van-radio-group{
            //  text-align: left;
            //  margin:0px 15px;
            //  padding-left: 15px;
            //  height: 37px;
            //  line-height: 37px;
            //  border-bottom: 1px solid rgb(238,238,238);
            .van-radio{
              display: inline-block;
              position: relative;
              line-height: 38px;
              left: 12px;
              &:nth-child(3){
              left: -15px;     
              }
              .van-radio__label{
                
                .number{
                  color: #FF6C47;
                  font-weight: 600;
                }
              }
            }
          }
         }
         .van-cell-group{
           &>div{
              font-size: 14px;
              color: rgb(51,51,51);
              font-weight: 600;
              text-align: left;
           }
          //  .van-cell{
          //    .van-cell__title{
          //      text-align: left;
          //      padding-left: 14px;
          //      span{
          //        font-size: 14px;
          //        color: rgb(51,51,51);
          //        font-weight: 600;
          //      }
          //    }
          //    .van-cell__value{
          //      padding-right: 14px;

          //    }
             
          //  }
          //  &::after{
          //      border:none;
          //    }
         }
         .win{
           text-align: left;
           height: 50px;
           line-height: 50px;
           padding-left: 30px;
           .van-stepper{
            position: relative;
            top: -4px;
            margin-left: 40px;
            width: 206px;
           }
         }
         .loss{
           text-align: left;
           height: 50px;
           line-height: 50px;
           padding-left: 30px;
           .van-stepper{
            position: relative;
            top: -4px;
            margin-left: 40px;
            width: 206px;
 
           }
         }
         .all{
           position: fixed;
           bottom: 0;
           left: 0;
           width: 100vw;
           height: 49px;
           font-size: 12px;
           line-height: 49px;
           box-shadow:0px -1px 3px 0px rgba(238,238,238,1);
           text-align: left;
           padding-left: 20px;
           background-color: #fff;
           span{
             &:nth-child(1){
               font-size: 18px;
               margin-right: 9px;
             }
             &:nth-child(2){
               font-size: 18px;
               color: rgba(255,108,71,1);
             }
             &:nth-child(3){
               font-size: 12px;
               color: rgba(153,153,153,1);
               margin-left: 12px;
               position: relative;
               bottom: 2px;
             }
             &:nth-child(4){
               height: 49px;
               width: 87px;
               text-align: center;
               display: inline-block;
               background: rgba(255,108,71,1);
               color: #fff;
               font-size: 18px;
             }
           }
         }
       } 
      //买跌弹窗
       .bttwo{
         background-color: #fff;
         padding-top: 22px;
         padding-bottom: 50px;
         .scale{
           p{
            display: inline-block;
            width: 80%;
            span{
              display:inline-block;
              width: 16%;
              text-align: center;
              color: rgb(153,153,153);
              font-size: 16px;
              &:nth-child(1){
                
              }
            }
          }
         }
         .specifications{
          height: 34px;
          line-height: 34px;
          font-size: 16px;
          color: rgb(102,102,102);
          margin: 15px 0px;
          text-align: left;
          padding-left: 30px;
          margin:0;
          font-weight: 600;
           .green{
             color: #14C591;
             border: 1px solid #14C591;
             background-color: rgba(20,197,145,0.09);
             }
           li{
             display: inline-block;
             list-style: none;
             font-size: 12px;
             width: 84px;
             height: 34px;
             box-sizing: border-box;
             border-radius: 5px;
             margin-right: 6px;
             text-align: center;
             color:rgba(153,153,153,1);
             font-weight: 500;
             &:nth-child(1){
               margin-left: 19px;
             }
             span{
               font-size: 14px;
               border:none;
             }
           }
         }
         .handnumber{
          height: 34px;
          line-height: 34px;
          font-size: 16px;
          color: rgb(102,102,102);
          margin: 15px 0px;
          text-align: left;
          padding-left: 30px;
          margin: 0;
          margin-top: 15px;
          margin-bottom: 14px;
          font-weight: 600;
          input{
            margin-left: 18px;
            border: 1px solid #14C591;
            background-color: rgba(20,197,145,0.09);
            border-radius: 5px;
            color: #14C591;
            padding-left: 11px;
            width: 264px;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            font-weight: 500;
          }
         }
         .earnings{
           font-size: 12px;
           color:rgba(153,153,153,1);
           padding-left: 15px;
           text-align: left;
           background-color: rgb(238,238,238);
           height: 20px;
           line-height: 22px;
         }
         .dradio{
          height: 38px;
          margin: 0 15px;
          border-bottom: 1px solid #eee;
         .topup{
          position: relative;
           font-size: 14px;
          top:10.5px;
          //  left: 47%;
           color: rgba(86,134,211,1);
          }
         
         .van-radio-group{
          //  text-align: left;
          //  margin:0px 15px;
          //  padding-left: 15px;
          //  height: 37px;
          //  line-height: 37px;
          //  border-bottom: 1px solid rgb(238,238,238);
           .van-radio{
             display: inline-block;
             position: relative;
             line-height: 38px;
             left:12px;
             &:nth-child(3){  
             left:-15px;
             }  
             .van-radio__label{
               
               .number{
                 color: #FF6C47;
                 font-weight: 600;
               }
             }
           }
         }
         }
         .van-cell-group{
          //  div{
          //    padding-left: 14px;
          //    font-weight:600;
          //    text-align:left;
          //    line-height:20px
          //  }
           .van-cell{
             .van-cell__title{
               text-align: left;
               
               span{
                 font-size: 14px;
                 color: rgb(51,51,51);
                 font-weight: 600;
               }
             }
             .van-cell__value{
               padding-right: 14px;
               .van-switch{
                 font-size: 20px!important;
                 height: 20px;
                 width: 38px;
               }
             }
             
           }
           &::after{
               border:none;
             }
         }
         .win{
           text-align: left;
           height: 50px;
           line-height: 50px;
           padding-left: 30px;
           .van-stepper{
            position: relative;
            top: -4px;
            margin-left: 40px;
            width: 206px;
 
           }
         }
         .loss{
           text-align: left;
           height: 50px;
           line-height: 50px;
           padding-left: 30px;
           .van-stepper{
            position: relative;
            top: -4px;
            margin-left: 40px;
            width: 206px;
 
           }
         }
         .all{
           position: fixed;
           bottom: 0;
           left: 0;
           width: 100vw;
           font-size:12px;
           height: 49px;
           line-height: 49px;
           box-shadow:0px -1px 3px 0px rgba(238,238,238,1);
           text-align: left;
           padding-left: 20px;
           background-color: #fff;
           span{
             &:nth-child(1){
               font-size: 18px;
               margin-right: 9px;
             }
             &:nth-child(2){
               font-size: 18px;
               color: rgba(255,108,71,1);
             }
             &:nth-child(3){
               font-size: 12px;
               color: rgba(153,153,153,1);
               margin-left: 12px;
               position: relative;
               bottom: 2px;
             }
             &:nth-child(4){
               height: 49px;
               width: 87px;
               text-align: center;
               display: inline-block;
               background: #14C591;
               color: #fff;
               font-size: 18px;
             }
           }
         }
       } 
     } 
   } 

}

  // 持仓
  .hold{   //买跌
    width: 100vw;
    padding: 0px 7px;
    box-sizing: border-box;
    .holdtitle{
      &>span{
        float: left;
        font-size: 14px;
        color:rgba(51,51,51,1);
        font-weight: 600;
      }
      p{
        text-align: right;
        span:nth-child(1){
         margin-right: 29px;
         font-size: 14px;
         color:rgba(20,197,145,1);
        }
        span:nth-child(2){
        margin-right: 7px;
        font-size: 14px;
        color:rgba(20,197,145,1);
        }
        span:nth-child(3){
        margin-right: 15px;
        font-size: 14px;
        color:rgba(20,197,145,1);
        &:after{
          content: "";
          width: 10px;
          height: 10px;
          border-top: 2px solid rgba(221,221,221,.5);
          border-left: 2px solid rgba(221,221,221,.5);
          display: inline-block;
          transform: rotate(135deg);
          margin-left: 16px;
        }
        }
      }
    }
    .content{
      background-color: #fff;
      box-shadow: 0px 0px 4px 0px rgb(214, 211, 211);
      border-radius: 10px;
      border-bottom: 1px solid rgb(214, 211, 211);
      .hold_top{
        line-height: 40px;
        font-size: 14px;
        border-bottom: 1px solid rgb(238,238,238);
        margin: 9px 8px;
        margin-bottom: 12px;
        .fl{
          &.zhang{
            ::before{
               background:#ff6c47 !important;
            }
           
          }
          span:nth-child(1){
            color: rgb(20,197,145);
            font-size: 14px;
          &:before{
            content: "";
            width:8px;
            height:18px;
            background:rgba(20,197,145,1);
            display: inline-block;
            position: relative;
            top: 4px;
            margin-right: 4px;
            }
          }
          span:nth-child(2){
            color: rgb(20,197,145);
            font-size: 14px;
          }
          span:nth-child(3){
            font-size: 14px;
            color: #333;
          }

        } 
        .fr{
           color: rgb(20,197,145);
           font-size: 14px;
           padding-right: 15px;
        }
        span{
          margin-right: 15px;
        }
      }
      .hold_middleone{
        padding-left: 16px;
        padding-bottom: 15px;
        padding-left: 25px;
        padding-right: 20px;
        .fl{
           span:nth-child(1){
             font-size: 12px;
             color: rgb(153,153,153);
           }
           span:nth-child(2){
             color: rgb(51,51,51);
             font-size: 12px;
           }
        }
        .fr{
          padding-right: 15px;
           span:nth-child(1){
             font-size: 12px;
             color: rgb(153,153,153);
           }
           span:nth-child(2){
             color: rgb(51,51,51);
             font-size: 12px;
           }
        }
      }
      .hold_middltwo{
        padding-left: 16px;
        padding-bottom: 15px;
        padding-left: 25px;
        padding-right: 20px;
        .fl{
           span:nth-child(1){
             font-size: 12px;
             color: rgb(153,153,153);
           }
           span:nth-child(2){
             color: rgb(51,51,51);
             font-size: 12px;
           }
        }
        .fr{
          padding-right: 15px;
           span:nth-child(1){
             font-size: 12px;
             color: rgb(153,153,153);
           }
           span:nth-child(2){
             color: rgb(51,51,51);
             font-size: 12px;
           }
        }
      }
      .hold_bottom{
        line-height: 44px;
        font-size: 13px;
        padding-left: 23px;
        padding-right: 23px;
        height: 44px;
        background: rgba(248,248,248,1);
        border-radius: 0px 0px 10px 10px;
        .fl{
          font-size: 12px;
          color: rgb(153,153,153);
          span{
            color: rgb(86,134,211);
            &:nth-child(1){
              color:#14C591;
            }
            &:nth-child(2){
              color:#FF6C47;
            }
          }
        }
        .fr{
          margin-right: 29px;
          span{
            width: 68px;
            height: 26px;
            background: rgba(86,134,211,1);
            border-radius: 5px;
            display: inline-block;
            line-height: 28px;
            color: #fff;
          }
        }
      }
    }
  }
  .holdnone{
    overflow: hidden;
    height:calc(100vh - 150px);
    padding-top: 20vh;
    img{
      width: 65px;
      height: 84px;
    }
    div{
      font-size: 16px;
      line-height: 25px;
      color:#999;
    }
  }
.van-tab__pane{
  .buyfall{   //买涨
    .holdtitle{
      p{
        span{
          color: #FF6C47;
        }
      }
    }
    .content{
      .hold_top{
        .fl{
          span{
            &:nth-child(1){
              color: #FF6C47;
              &:before{
                background-color: #FF6C47;
              }
            }
            &:nth-child(2){
              color: #FF6C47;
            }
          }
        }
        .fr{
          color: #FF6C47;
        }
      }
    }

  }
}  

  // 资金
  .fund{
    width: 100vw;
    padding: 10px 0px;
    box-sizing: border-box;
    background-color: #fff;
    .fund_user{
      padding: 10px 25px;
      font-size: 14px;
      text-align: left;
      color: #000;
      .fl{
        .fund_user_title{
          line-height: 25px;
          font-size: 16px;
        }
        .fund_user_price{
          line-height: 50px;
          font-size: 40px;
          font-weight: 500;
        }
      }
      .fr{
        .fund_user_title{
          line-height: 25px;
          font-size: 14px;
          color: #999;
          i{
            position: relative;
            top: 3.1px;
            color:#333;
          }
          span{
            color: #333;
          }
        }
        .fund_user_content{
        line-height: 25px;
        font-size: 14px;
          &:nth-child(2){
            color: #999;
             span{
               color: #333;
               font-family: 等线;
             }
          }
          &:nth-child(3){
            color: #999;
             span{
               color: #333;
             }
          }
        }
      } 
    }
    .fund_user_operation{
      //display: flex;
      justify-content: space-evenly;
      margin-bottom: 15px;
      button{
        width: 150px;
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        &:nth-child(1){
          background-color: rgb(86,143,211);
          color: #fff;
          border: none;
          margin-right: 30px;
        }
        &:nth-child(2){
          background-color: rgb(98,100,115);
          color: #fff;
          border: none;
        }
      }
    }
  }
  //交易
  .deal{
    width: 100vw;
    padding: 0px 17.5px;
    box-sizing: border-box;
    background-color: #fff;
  
  .deal_item{
    width: 100%;
    font-size: 13px;
    color: #333;
    border-bottom: 1px solid #eee;
    margin: 5px 0px;
    .fl{
      line-height: 25px;
      height: 25px;
      text-align: left;
      span{
        margin-right: 15px;
        &:nth-child(1){
          font-size: 14px;
          color: rgb(20,197,145);
          &.zhang{
            &:before{
              background: #ff6c47;
            }
          }
          &:before{
            content: "";
            width: 6px;
            height: 18px;
            background: #14c591;
            display: inline-block;
            position: relative;
            top: 4px;
            margin-right: 4px;
          }
        }
        &:nth-child(2){
          font-size: 14px;
          color: rgb(20,197,145);
        }
        &:nth-child(3){
          font-size: 14px;
          color: rgb(51,51,51);
        }
      }
      .time{
        font-size: 12px;
        color: rgb(153,153,153);
      }
    }
    .triangle{
      &::after{
        content: "";
    width: 0.26667rem;
    height: 0.26667rem;
    border-top: 0.05333rem solid rgba(221, 221, 221, 0.5);
    border-left: 0.05333rem solid rgba(221, 221, 221, 0.5);
    display: inline-block;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
      }
    }
    .fr{
      line-height: 26px;
      font-size: 15px;
      color: rgb(20,197,145);
      height: 50px;
      
      // &:after{
      //   content: "";
      //   width: 12px;
      //   height: 12px;
      //   border-top: 2px solid #ddd;
      //   border-left: 2px solid #ddd;
      //   display: inline-block;
      //   -webkit-transform: rotate(135deg);
      //   transform: rotate(135deg);
      //   margin-left:0px;
      //   position: relative;
      //   top: 2px;
      // }

    }
    }
  }
  .lect{ //提现
    background-color: #fff;
    margin-top: -12px;
    padding-top: 12px;
    .reflect{
      margin: 0 30px;
      border-top: 1px solid rgb(238,238,238);
      &:nth-child(1){
        border-top:none;
      }
      p{
        height: 15px;
        line-height: 15px;
        &:nth-child(1){
          .fl{
            font-size: 14px;
            color: rgb(51,51,51);
          }
          .fr{
            font-size: 14px;
            color:rgba(255,108,71,1);
          }
        }
        &:nth-child(2){
          .fl{
            font-size: 12px;
            color:rgba(153,153,153,1);
          }
          .fr{
            font-size: 12px;
            color:rgba(153,153,153,1);
          }
        }
        &:nth-child(2){
          height: 5px;
          line-height: 10px;
        }
      }
    }
  }
  .arge{ //充值
    background-color: #fff;
    margin-top: -12px;
    padding-top: 12px;
    .recharge{
      margin: 0 30px;
      border-top: 1px solid rgb(238,238,238);
      &:nth-child(1){
        border-top:none;
      }
      p{
        height: 15px;
        line-height: 15px;
        &:nth-child(1){
          .fl{
            font-size: 14px;
            color: rgb(51,51,51);
          }
          .fr{
            font-size: 14px;
            color:rgba(255,108,71,1);
          }
        }
        &:nth-child(2){
          .fl{
            font-size: 12px;
            color:rgba(153,153,153,1);
          }
          .fr{
            font-size: 12px;
            color:rgba(153,153,153,1);
          }
        }
        &:nth-child(2){
          height: 5px;
          line-height: 10px;
        }
      }
    }
  }
  .deal .loadmore,
  .lect .loadmore,
  .arge .loadmore{
    line-height: 25px;
    font-size: 14px;
    padding-top:5px;
    color: #666;
  }
</style>
