<template>
    <div class="message">
        <van-nav-bar title="消息中心" fixed   @click-left="$back()" left-arrow class="messagecenter"/>
        <div class="notice" v-for="(v,k) in messageList" :key="k">
            <div>【{{v.title}}】</div>
            <div>{{v.time}}</div>
            <div v-html="v.content"></div>
        </div>
        <div v-for="v in notice" :key="v">{{notice}}</div>
    </div>
</template>

<script>
export default {
    name: '',
    props: {

    },
    data() {
        return {
          messageList:[],
          notice:'',
        //   times:[],
        };
    },
    computed: {

    },
    created() {

        this.$axios({
                  method:'GET',
                  url:this.basesURL+'/good/get-otice-list',
                  data:{}
                }).then( res => {
                    if(res.data.code == 0 ){
                        let arr=[]
                        for (let i=0;i<res.data.data.NoticeList.length;i++){
                            let obj={}
                            obj.time = res.data.data.NoticeList[i].StartDate;
                            obj.content = res.data.data.NoticeList[i].Content;
                            obj.title = res.data.data.NoticeList[i].Title;
                            let strs=obj.time.split("T"); //字符分割
                            let time = strs[0].replace(/-/g,"/")+" "+strs[1];
                            obj.time = time;
                            arr.push(obj);
                        }
                        this.messageList = arr;
                    }
                })
            

    },
    mounted() {
    },
    watch: {

    },
    methods: {

    },
    components: {

    },
};
</script>

<style scoped lang="scss">
.message{
    padding-top: 46px;
}
    .messagecenter{
        box-shadow: 1px 1px 1px rgba(0,0,0,.05)!important;
        .van-nav-bar__left{
            .van-icon{
            color: #000;
            font-size: 18px;
            }
        }
        .van-nav-bar__title{
            font-weight: 600;
            font-size:18px;
        }
    }
    .notice{
        margin: 16px 15px 0px 0px;
        padding:0px 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgb(238,238,238);
        text-align: left;
        div{
            margin-left: 15px;
        &:nth-child(1){
            font-size: 16px;
            color:rgba(86,134,211,1);
            margin-bottom: 5px;
            margin-left: 8px;
        }
        &:nth-child(2){
            font-size: 14px;
            color:rgba(153,153,153,1);
            margin-top: 10px;
        }
        &:nth-child(3){
            font-size: 14px;
            color:rgba(102,102,102,1);
            margin-top: 10px;
            line-height: 24px;
        }
        }
    }
       
</style>
