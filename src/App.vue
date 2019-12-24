<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "",
  props: {},

  created() {
    this.getExamine();
  },
  methods: {
    getExamine() {
      this.$axios.get(this.basesURL + "/app/get-examine").then(res => {
        if (res.data.code == 0) {
          // this.$store.state.ischeck = !res.data.data;
          this.$store.commit("alterIscheckout", !res.data.data);
          if (!res.data.data) {
            this.$router.push("home");
          }
        }
      });
    }
  }
};
</script>

<style>
@import "./common/reset.scss";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
}
</style>
