<template>
  <div v-loading="loading">
    <br />
    <div v-if="keys.length > 0">
      <el-button @click="addPair">Add another key pair</el-button>
      <br />
      <br />
      <el-radio-group v-model="usedPairIndex">
        <div class="key-pair" v-for="(pair, index) in keys" :key="index">
          <el-radio :label="index">
            {{ index }}
          </el-radio>
          <el-button
            @click="showDeleteDialog(index)"
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </div>
      </el-radio-group>
    </div>
    <div v-else>
      No pair to use. Create new pair<br />
      <el-button @click="addPair">Add new key pair</el-button>
    </div>
    <el-dialog
      :visible.sync="deleteDialogVisible"
      title="Deleting Keys"
      width="80%"
    >
      <span>You are going to delete Key pair</span>
      <p>This action cannot be undone</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="deletePair">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { myGenerateKeys } from "./keys";

export default {
  name: "Keys",
  data() {
    return {
      usedPairIndex: -1,
      keys: [],
      loading: false,
      deleteDialogVisible: false,
      keyToBeDeleted: -1,
    };
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    usedPairIndex(actual, _) {
      localStorage.setItem("used", JSON.stringify(actual));
    },
    // eslint-disable-next-line no-unused-vars
    keys(actual, _) {
      localStorage.setItem("pairs", JSON.stringify(actual));
    },
  },
  mounted() {
    this.keys = JSON.parse(localStorage.getItem("pairs")) ?? [];
    this.usedPairIndex = JSON.parse(localStorage.getItem("used")) ?? -1;
  },
  methods: {
    addPair() {
      this.loading = true;
      this.keys.push(myGenerateKeys());
      localStorage.setItem("pairs", JSON.stringify(this.keys));
      this.loading = false;
    },
    showDeleteDialog(index) {
      this.keyToBeDeleted = index;
      this.deleteDialogVisible = true;
    },
    deletePair() {
      if (this.keyToBeDeleted === this.usedPairIndex) this.usedPairIndex = -1;
      this.keys.splice(this.keyToBeDeleted, 1);
      this.keyToBeDeleted = -1;
      this.deleteDialogVisible = false;
    },
  },
};
</script>

<style>
.key-pair {
  margin: 10px;
}
</style>
