<template>
  <div class="encrypt-file">
    <br />
    <div v-if="usedKey">
      <el-upload
        class="avatar-uploader"
        action=""
        drag
        multiple
        :on-change="handleUploadSuccess"
        :on-remove="handleRemove"
        :auto-upload="false"
        :file-list="fileList"
      >
        <i
          style="line-height: 178px"
          class="el-icon-plus avatar-uploader-icon"
        ></i>
      </el-upload>
      <p>Place files to be encrypted</p>
      <el-button @click="encryptFile">Encrypt</el-button>
    </div>
    <div v-else>No key selected.</div>
  </div>
</template>

<script>
import { myEncrypt } from "./keys";

const fs = require("fs");
const crypto = require("crypto");
const prepend = require("prepend-file");

export default {
  name: "EncryptFile",
  data() {
    return {
      publicKey: "",
      privateKey: "",
      fileList: [],
    };
  },
  computed: {
    usedKey() {
      const pairs = JSON.parse(localStorage.getItem("pairs"));
      if(pairs) {
        const used = JSON.parse(localStorage.getItem("used"));
        return pairs[used] ?? null;
      }
      return null;
    },
  },
  methods: {
    handleUploadSuccess(file) {
      this.fileList.push(file);
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter((x) => x.uid !== file.uid);
    },
    encryptFile() {
      this.fileList.forEach((file) => {
        const key = crypto.randomBytes(32).toString();
        const cipher = crypto.createCipher("aes-256-cbc", key);
        cipher.setEncoding('base64');
        const path = file.raw.path;
        const encryptedKey = myEncrypt(key, this.usedKey.publicKey);

        if(fs.existsSync(path + '.enc'))
          fs.unlinkSync(path + '.enc');
        const input = fs.createReadStream(path);
        const output = fs.createWriteStream(path + '.enc', {
          flags: 'a'
        });
        input.push(file.raw.path + '\n');
        input.pipe(cipher) //content
          .pipe(output);

        output.on('finish', () => {
          prepend(path + ".enc",encryptedKey + "\n"); //key
        })
      });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
