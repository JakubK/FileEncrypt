<template>
  <div id="app">
    <el-upload
      class="avatar-uploader"
      action=""
      :on-change="handleUploadSuccess"
      :auto-upload="false"
      :show-file-list="false"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    {{ fileToEncryptPath }}
    <el-button @click="encryptFile">Encrypt</el-button>
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
      fileToEncryptPath: "",
    };
  },
  methods: {
    handleUploadSuccess(file) {
      this.fileToEncryptPath = file.raw.path;
    },
    encryptFile() {
      console.log("xd");
    },
  },
};
</script>
