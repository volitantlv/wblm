(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1ba035c4"],{"15dd":function(t,e,s){t.exports=s.p+"img/firstcharge.d4445452.png"},"539d":function(t,e,s){var a=s("b2f5"),i=s("f01a"),r=s("b6f1"),n=s("c9ea4"),o="["+n+"]",c="​",l=RegExp("^"+o+o+"*"),u=RegExp(o+o+"*$"),f=function(t,e,s){var i={},o=r(function(){return!!n[t]()||c[t]()!=c}),l=i[t]=o?e(d):n[t];s&&(i[s]=l),a(a.P+a.F*o,"String",i)},d=f.trim=function(t,e){return t=String(i(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(u,"")),t};t.exports=f},"5dd3":function(t,e,s){},a547:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"User"},[a("div",{staticClass:"User_top"},[t._m(0),a("div",{staticClass:"fl user_mes"},[a("div",{staticClass:"user_mes_name"},[t._v(t._s(this.$store.state.nickName))]),a("div",{staticClass:"user_mes_tel"},[t._v("\n               "+t._s(this.loginId)+"\n            ")])])]),a("div",{staticClass:"User_message"},[a("div",{staticClass:"user_message_content clearfix"},[a("div",{staticClass:"user_message_content_left fl"},[a("div",{staticClass:"title"},[t._v("资产净值(USDT)")]),a("div",{staticStyle:{"font-family":"'等线'"}},[t._v(t._s(Math.round(100*this.assetValue)/100))])]),a("div",{staticClass:"user_message_content_right fr"},[a("div",[a("router-link",{attrs:{to:"/Voucher"}},[t._v("我的代金劵："),a("span",{staticStyle:{"font-family":"'等线'"}},[t._v(t._s(t.voucherlen))])])],1),a("div",[t._v("浮动盈亏："),a("span",{class:t.profitNum>0?"zhang":"die",staticStyle:{"font-family":"'等线'"}},[t._v(t._s(t.profitNum>0?"+"+t.profitNum:+t.profitNum))])]),a("div",[t._v("可用余额："),a("span",{staticStyle:{"font-family":"'等线'"}},[t._v(t._s(this.$store.state.balance))])])])]),a("div",{staticClass:"user_message_img"},[a("div",{staticClass:"img"},[a("router-link",{attrs:{to:"/Trade/pay"}},[a("img",{attrs:{src:s("15dd"),alt:""}})])],1)])]),a("div",{staticClass:"User_operation"},[a("van-cell",{attrs:{title:"身份认证",value:t.userMessage,"is-link":"",to:"/Attestation"}}),a("van-cell",{attrs:{title:"消息中心","is-link":"",to:"/messagecenter"}}),a("van-cell",{attrs:{title:"新手学堂","is-link":"",to:"/Newbie"}}),a("van-cell",{attrs:{title:"版本检测",value:"V1.0.0","is-link":""}}),a("van-cell",{attrs:{title:"关于我们","is-link":"",to:"/Aboutus"}})],1)])},i=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"fl user_img"},[a("img",{attrs:{src:s("b442"),alt:""}})])}],r=(s("d4d5"),{data:function(){return{userState:"",userMessage:"",text:"",color:"",loginId:"",profitNum:"",assetValue:"",voucherlen:0,positionTimer:null}},created:function(){var t=this;this.$store.commit("alerthref",3),this.positionTimer=setInterval(this.getpositionList,3e3),this.$axios({method:"post",url:this.basesURL+"/account-auth/get-auth-real-name-status",data:{}}).then(function(e){if(0==e.data.code){var s=e.data.data.AuthInfo.State;t.userMessage=0==s?"审核中":1==s?"已通过":9==s?"认证失败":"前往认证"}})},watch:{aaa:function(t,e){return this.positionTimer}},mounted:function(){var t=this,e=localStorage.getItem("userName");this.$store.commit("alterNickName",e);var s=localStorage.getItem("loginId");this.loginId=s;var a=localStorage.getItem("ticket");this.$store.commit("alterticket",a),this.$axios.post(this.basesURL+"/account-auth/get-account",{}).then(function(e){0==e.data.code&&t.$store.commit("alterbalance",e.data.data.Balance)}),this.getpositionList(),this.getvoucherlen()},methods:{getpositionList:function(){var t=this;t.$axios.post(t.basesURL+"/trades-auth/get-position-list",{}).then(function(e){if(0==e.data.code){if(!e.data.data.PositionList||0==e.data.data.PositionList.length)return t.profitNum=0,t.assetValue=Number(t.$store.state.balance),t.positionTimer&&clearInterval(t.positionTimer),!1;var s=e.data.data.PositionList;if(s){for(var a=0,i=0,r=0;r<s.length;r++)a+=Number(s[r].GrossProfit),i+=s[r].OpenCost;t.profitNum=a.toFixed(3),t.assetValue=Number(t.$store.state.balance)+Number(i)}}})},getvoucherlen:function(){var t=this;this.$axios.post(this.basesURL+"/voucher-auth/get-my-voucher-list",{skip:0,pageSize:1e3}).then(function(e){if(0==e.data.code){var s=e.data.data.CustomerVoucherList.length;t.voucherlen=s}})}},beforeDestroy:function(){}}),n=r,o=(s("d6d9"),s("17cc")),c=Object(o["a"])(n,a,i,!1,null,"4676b72c",null);e["default"]=c.exports},b442:function(t,e,s){t.exports=s.p+"img/caishen.41065df2.png"},c9ea4:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},d4d5:function(t,e,s){"use strict";var a=s("3754"),i=s("03b3"),r=s("94ac"),n=s("44de"),o=s("5325"),c=s("b6f1"),l=s("a891").f,u=s("acb9").f,f=s("ddf7").f,d=s("539d").trim,h="Number",v=a[h],m=v,p=v.prototype,g=r(s("a7b8")(p))==h,_="trim"in String.prototype,N=function(t){var e=o(t,!1);if("string"==typeof e&&e.length>2){e=_?e.trim():d(e,3);var s,a,i,r=e.charCodeAt(0);if(43===r||45===r){if(s=e.charCodeAt(2),88===s||120===s)return NaN}else if(48===r){switch(e.charCodeAt(1)){case 66:case 98:a=2,i=49;break;case 79:case 111:a=8,i=55;break;default:return+e}for(var n,c=e.slice(2),l=0,u=c.length;l<u;l++)if(n=c.charCodeAt(l),n<48||n>i)return NaN;return parseInt(c,a)}}return+e};if(!v(" 0o1")||!v("0b1")||v("+0x1")){v=function(t){var e=arguments.length<1?0:t,s=this;return s instanceof v&&(g?c(function(){p.valueOf.call(s)}):r(s)!=h)?n(new m(N(e)),s,v):N(e)};for(var b,I=s("dad2")?l(m):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),C=0;I.length>C;C++)i(m,b=I[C])&&!i(v,b)&&f(v,b,u(m,b));v.prototype=p,p.constructor=v,s("e5ef")(a,h,v)}},d6d9:function(t,e,s){"use strict";var a=s("5dd3"),i=s.n(a);i.a}}]);