<template>
  <div class="decrypt-file">
    <el-upload
      class="avatar-uploader"
      action=""
      drag
      multiple
      :on-change="handleUploadSuccess"
      :on-remove="handleRemove"
      :show-file-list="false"
      :auto-upload="false"
      :file-list="fileList"
    >
      <i
        style="line-height: 178px"
        class="el-icon-plus avatar-uploader-icon"
      ></i>
    </el-upload>
    <p>Place *.enc files</p>
    <el-upload
      class="avatar-uploader"
      action=""
      drag
      :on-change="uploadKey"
      :auto-upload="false"
      :show-file-list="false"
    >
      <i
        style="line-height: 178px"
        class="el-icon-plus avatar-uploader-icon"
      ></i>
    </el-upload>
    <p>Place key</p>
    <el-button @click="decryptFile">Decrypt</el-button>
  </div>
</template>

<script>
import { myDecrypt } from "./keys";

export default {
  name: "DecryptFile",
  data() {
    return {
      fileToDecryptPath: "",
      fileList: [],
      keyPath: "",
    };
  },
  methods: {
    handleUploadSuccess(file) {
      this.fileList.push(file);
    },
    uploadKey(file) {
      this.keyPath = file.raw.path;
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter((x) => x.uid !== file.uid);
    },
    decryptFile() {
      const fs = require("fs");
      const crypto = require("crypto");

      const obj = JSON.parse(fs.readFileSync(this.keyPath, "utf8"));
      const decryptedKey = myDecrypt(obj.key, obj.privateKey);

      const decipher = crypto.createDecipher("aes-256-cbc", decryptedKey);

      this.fileList.forEach((file) => {
        const path = file.raw.path;
        let decrypted = decipher.update(
          fs.readFileSync(path, "utf8"),
          "hex",
          "utf8"
        );
        decrypted += decipher.final("utf8");
        const plain = JSON.parse(decrypted);
        fs.writeFileSync(plain.fileName, plain.content, "utf-8");
      });
    },
  },
};
</script>
