<template>
  <div class='kz-cont' v-show='showstate'>
    <div class='kz-wrapper' >
      <div class='kz-text'>
            <div class="win">
              <span>止盈(%)</span><van-stepper min="10" max="80" v-model="win_value" step="10" style="display:inline-block;"/>
            </div>
            <div class="loss">
              <span>止损(%)</span><van-stepper min="10" max="80" v-model="loss_value" step="10" style="display:inline-block;"/>
            </div>
            <!-- {{title}} -->
      </div>
      <div class='footer'>
        <div @click='tocancel' class='kz-btn'>取消</div>
        <div class='kz-btn' @click='took'>确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'pop',
    props: ['showstate','title',"limit","stop"],
    data() {
        return {
           win_value:20,
           loss_value:20, 
        };
    },
    computed: {

    },
    created() {
    },
    mounted() {
      this.win_value = this.limit * 100
      this.loss_value = this.stop * 100
      if(!this.win_value){
         this.win_value = 20
      }
      if(!this.loss_value){
         this.loss_value = 20;
      }
    },
    watch: {

    },
    methods: {
      tocancel:function(){
        this.$emit('tocancel');
      },
      took:function(){
        this.$emit('took');
         this.$axios({
             method:'POST',
             url:this.basesURL+'/trades-auth/position-modify',
             data:{
                positionId:this.title,
                limit:this.win_value / 100,
                stop :this.loss_value / 100
            },
          }).then( res => {
            if(res)
              this.$toast({
                message:'修改成功',
                duration:1500
              });
          })

      }
    
    },
    components: {

    },
};
</script>

<style scoped lang="scss">
  .kz-cont{position:fixed;left:0;right: 0;top:0;bottom: 0;z-index: 500;background:rgba(0,0,0,0.3);text-align:center;overflow: hidden;white-space:nowrap;}
  .kz-cont:after{content:"";display:inline-block;width:0;height:100%;visibility: hidden;vertical-align:middle;}
  .kz-wrapper{display:inline-block;vertical-align:middle;background:#fff;color:#333333;border-radius: 5px;max-width:100%;}
  .kz-text{
    text-align:center;
    padding:15px;
    width: 80vw;
      .win{
        margin-bottom: 20px;
        &>span{
        float:left;
        font-size: 12px;
        position: relative;
        top: 6px;
        }
        .van-stepper{
          width: 240px;
          text-align: left;
          padding-left: 30px;
        }
      }
      .loss{
        &>span{
        float:left;
        font-size: 12px;
        position: relative;
        top: 6px;
        }
        .van-stepper{
          width: 240px;
          text-align: left;
          padding-left: 30px;
        }
      }
    }
  .footer{display:flex;border-top:1px solid #E5E5E5;color:#488BF1;}
  .kz-btn{flex:1;padding: 12px;}
  .kz-btn +.kz-btn{border-left:1px solid #E5E5E5;}
  
</style>
