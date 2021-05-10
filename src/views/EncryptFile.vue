<template>
  <div class="encrypt-file">
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
    <el-input v-model="symKey" placeholder="Please type symmetric key" />
    <el-input
      disabled
      type="textarea"
      :rows="2"
      v-model="fileToEncryptPath"
      placeholder="Private key will appear here"
    />
    <el-input
      disabled
      type="textarea"
      :rows="2"
      placeholder="Public key will appear here"
    />
  </div>
</template>

<script>
export default {
  name: "EncryptFile",
  data() {
    return {
      fileToEncryptPath: "",
      symKey: "",
    };
  },
  methods: {
    handleUploadSuccess(file) {
      this.fileToEncryptPath = file.raw.path;
    },
    encryptFile() {
      console.log("xd");
      const fs = require("fs");
      const crypto = require("crypto");

      const key = crypto.randomBytes(256);
      const cipher = crypto.createCipher("aes-256-cbc", key);
      const input = fs.createReadStream(this.fileToEncryptPath);
      const output = fs.createWriteStream(this.fileToEncryptPath + ".enc");

      input.pipe(cipher).pipe(output);
      output.on("finish", () => {
        console.log("encrypted");

      });
    },
  },
};
</script>
