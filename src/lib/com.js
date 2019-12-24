import { log } from "util";

export default {
    install(Vue){
        // 处理时间对象
       Vue.prototype.$formatDateTime = function(){  
           let date = new Date();
           var y = date.getFullYear();  
           var m = date.getMonth() + 1;  
           m = m < 10 ? ('0' + m) : m;
           var d = date.getDate();  
           d = d < 10 ? ('0' + d ) : d;  
           var h = date.getHours();  
           h=h < 10 ? ('0' + h) : h;  
           var minute = date.getMinutes();
           minute = minute < 10 ? ('0' + minute) : minute;  
           var second=date.getSeconds();  
           second=second < 10 ? ('0' + second) : second; 
           return y + '-' + m + '-' + d+'T'+h+':'+minute+':'+second; 
       }
       //去除返回时间格式的T    
       Vue.prototype.$getTime = function(date){
            var date = date ;
            date = date.substring(5,16);
            date = date.split('T');
            let code =  date[0] + ' ' + date[1];
            return code;
       } 
       //页面的返回方法 
       Vue.prototype.$back = function(){
            history.back();
            // location.reload();
       }
       //数字截取
       Vue.prototype.$split = function(n){
           return n.substring(0,8)
       }
    //    Vue.prototype.$pastTime = function(Time){
    //        var date = new Date;
    //        var h = date.getHours();
    //        var m = date.getMinutes();
    //    }
       // 获取缓存
       Vue.prototype.$getItem = function(key){
           return localStorage.getItem(key);
       }
       //设置缓存
       Vue.prototype.$setItem = function(key,value){
            if(typeof value != "string"){
                value = JSON.stringify(value);
            }
            if(typeof key != "string"){
                key = JSON.stringify(key);
            }
            localStorage.setItem(key, value);
       }
       Vue.prototype.$timeBefore = function(time){
            var dTime = new Date(time.replace("T", " ").replace(new RegExp("-", "g"), "/"));
            var now = new Date();
            var timeDifference = now - dTime.getTime();
            if(timeDifference > 86400000){
                return time.substr(5,5);
            }
            if(timeDifference < 3600000){
                var min = parseInt(timeDifference / 1000 / 60);
                return min + "分钟前";
            }
            var min = parseInt(timeDifference / 1000 / 60 / 60);
            return min + "小时前";
       }
    },
    //设置session的过期时间
    getOverTime(){
        /* eslint-disable */ 
        let nowdate;
        if(localStorage.getItem('Time')){
            nowdate = localStorage.getItem('Time');
            if( new Date().getTime() - nowdate > 86400000){
                //清除缓存
                localStorage.setItem("Time", nowdate);
                localStorage.clear();
                this.$router.push('/land');
            }else{
                localStorage.setItem('Time',new Date().getTime());
            }
        }else{
            localStorage.setItem('Time',new Date().getTime());
        }
    }
}