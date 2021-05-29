<template>
  <div class="decrypt-file">
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
      <p>Place *.enc files</p>
      <el-button @click="decryptFile">Decrypt</el-button>
    </div>
    <div v-else>No key selected</div>

    <el-dialog
      :visible.sync="failed"
      title="Secured content"
      width="80%"
    >
      <span>Files are protected by password</span>
      <p>Please pass it below</p>
      <el-input
        placeholder="Password"
        show-password
        v-model="password"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="failed = false">Abort</el-button>
        <el-button type="danger" @click="decryptFile">Retry</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { myDecrypt } from "./keys";
const fs = require("fs");
const crypto = require("crypto");
const firstline = require("firstline");

// const sutil = require('line-stream-util');

export default {
  name: "DecryptFile",
  data() {
    return {
      fileToDecryptPath: "",
      fileList: [],
      failed: false,
      password: 'supersecret'
    };
  },
  computed: {
    usedKey() {
      return (
        JSON.parse(localStorage.getItem("pairs"))[
          JSON.parse(localStorage.getItem("used"))
        ] ?? null
      );
    },
  },
  methods: {
    handleUploadSuccess(file) {
      this.fileList.push(file);
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter((x) => x.uid !== file.uid);
    },
    async decryptFile() {
      this.failed = false;
      for(let i = 0;i < this.fileList.length; i++)
      {
        const file = this.fileList[i];
        try {
          const path = file.raw.path;
          const encryptedKey = await firstline(path);
          const decryptedKey = myDecrypt(encryptedKey, this.usedKey.privateKey, this.password);
          const decipher = crypto.createDecipher("aes-256-cbc", decryptedKey);

          let decrypted = decipher.update(
            fs.readFileSync(path, "utf8").split('\n')[1],
            "base64",
            "utf8"
          );
          decrypted += decipher.final("utf8");
          const [newPath, ...content] = decrypted.split('\n');
          fs.writeFileSync(newPath, content.join('\n'), "utf-8");
        }
        catch(err) {
          this.failed = true
          break;
        }
      }
    },
  },
};
</script>
