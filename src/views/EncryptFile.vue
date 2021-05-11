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
    <el-button @click="encryptFile">Encrypt</el-button>
  </div>
</template>

<script>
import { encrypt, generateKeys } from "./keys";

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

      generateKeys();

      this.fileList.forEach((file) => {
        const path = file.raw.path;
        const ciph = encrypt(
          fs.readFileSync(path, "utf8"),
          require("path").dirname(path) + "/public.pem"
        );
        fs.writeFileSync(path + ".enc", ciph, "utf-8");
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
