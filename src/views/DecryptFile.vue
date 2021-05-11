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
      :on-change="uploadPK"
      :auto-upload="false"
      :show-file-list="false"
    >
      <i
        style="line-height: 178px"
        class="el-icon-plus avatar-uploader-icon"
      ></i>
    </el-upload>
    <p>Place private.pem</p>
    <el-button @click="decryptFile">Decrypt</el-button>
  </div>
</template>

<script>
import { decrypt } from "./keys";

export default {
  name: "DecryptFile",
  data() {
    return {
      privateKeyPath: "",
      fileToDecryptPath: "",
      fileList: [],
    };
  },
  methods: {
    handleUploadSuccess(file) {
      this.fileList.push(file);
    },
    uploadPK(file) {
      this.privateKeyPath = file.raw.path;
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter((x) => x.uid !== file.uid);
    },
    decryptFile() {
      const fs = require("fs");
      this.fileList.forEach((file) => {
        const path = file.raw.path;
        const deciph = JSON.parse(
          decrypt(
            fs.readFileSync(path, "utf8"),
            require("path").dirname(path) + "/private.pem"
          )
        );

        fs.writeFileSync(deciph.fileName, deciph.content, "utf-8");
      });
    },
  },
};
</script>
