<template>
  <div class="hello">
    <el-button></el-button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    const fs = require("fs");
    const NodeRSA = require("node-rsa");

    const text = fs.readFileSync("D:/sample.js", "utf-8");

    const key = new NodeRSA().generateKeyPair([512]);

    console.log(key);

    const encrypted = key.encrypt(text, "base64");
    console.log(encrypted);

    const decrypted = key.decrypt(encrypted, "utf-8");
    console.log(decrypted);

    const publicKey = key.exportKey("pkcs8-public-pem");
    const privateKey = key.exportKey("pkcs1-pem");
    console.log(publicKey);
    console.log(privateKey);
    const crypto = require("crypto");
    console.log(crypto);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
