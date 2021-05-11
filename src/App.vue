<template>
  <div id="app">
    <el-menu :router="true" :default-active="activeIndex" mode="horizontal">
      <el-menu-item index="/">Encrypt File</el-menu-item>
      <el-menu-item index="/decrypt">Decrypt File</el-menu-item>
      <el-menu-item index="3">Encrypt Recursive</el-menu-item>
      <el-menu-item index="4">Verify Keys</el-menu-item>
      <el-menu-item index="/about">About</el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
export default {
  name: "App",
  data() {
    return {
      isCollapse: true,
      activeIndex: "/",
    };
  },
};
</script>
