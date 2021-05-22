<template>
  <div class="encrypt-file">
    <el-upload
      class="avatar-uploader"
      action=""
      drag
      multiple
      :on-change="handleUploadSuccess"
      :on-remove="handleRemove"
      :auto-upload="false"
      :file-list="fileList"
      :show-file-list="true"
    >
      <i
        style="line-height: 178px"
        class="el-icon-plus avatar-uploader-icon"
      ></i>
    </el-upload>
    <p>Place files to be encrypted</p>
    <el-button @click="encryptFile">Encrypt</el-button>
  </div>
</template>

<script>
import { myGenerateKeys, myEncrypt } from "./keys";

export default {
  name: "EncryptFile",
  data() {
    return {
      publicKey: "",
      privateKey: "",
      fileList: [],
    };
  },
  methods: {
    handleUploadSuccess(file) {
      this.fileList.push(file);
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter((x) => x.uid !== file.uid);
    },
    encryptFile() {
      const fs = require("fs");
      const keys = myGenerateKeys();
      const crypto = require("crypto");

      const key = crypto.randomBytes(32).toString();
      const cipher = crypto.createCipher("aes-256-cbc", key);
      this.fileList.forEach((file) => {
        const path = file.raw.path;
        const plain = JSON.stringify({
          fileName: file.raw.path,
          content: fs.readFileSync(path, "utf8"),
        });

        let encrypted = cipher.update(plain, "utf8", "hex");
        encrypted += cipher.final("hex");
        fs.writeFileSync(path + ".enc", encrypted, "utf-8");
      });
      const encryptedKey = myEncrypt(key, keys.publicKey);

      //merge private key with symmetric
      const k = JSON.stringify({
        privateKey: keys.privateKey,
        key: encryptedKey,
      });

      fs.writeFileSync(
        require("path").dirname(this.fileList[0].raw.path) + "/key",
        k,
        "utf-8"
      );
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
