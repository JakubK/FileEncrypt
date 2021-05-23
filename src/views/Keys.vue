<template>
  <div v-loading="loading">
    <br />
    <div v-if="keys.length > 0">
      <el-button @click="createDialogVisible = true"
        >Add another key pair</el-button
      >
      <br />
      <br />
      <el-radio-group v-model="usedPairIndex">
        <div class="key-pair" v-for="(pair, index) in keys" :key="index">
          <el-radio :label="index">
            {{ pair.name }}
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
      <el-button @click="createDialogVisible = true"
        >Add new key pair</el-button
      >
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

    <el-dialog
      :visible.sync="createDialogVisible"
      title="New Key pair"
      width="80%"
    >
      <span>Adding new Key pair</span>
      <p>Random valid key pair will be generated</p>
      <el-input placeholder="Name for your Pair" v-model="newPair.name" />
      <br />
      <p>
        Optional decrypt password. Make sure you have it stored and that its
        typed correctly. You'll be asked for it.
      </p>
      <el-input
        placeholder="Password"
        show-password
        v-model="newPair.password"
      />
      <br />
      <br />
      <el-button type="success" @click="addPair">Create</el-button>
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
      createDialogVisible: false,
      keyToBeDeleted: -1,
      newPair: {
        name: "",
        password: "",
      },
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
      const name = this.newPair.name;
      const pass =
        this.newPair.password.length > 0
          ? this.newPair.password.length
          : "supersecret";
      const key = {
        ...myGenerateKeys("", pass),
        name,
      };
      this.keys.push(key);
      localStorage.setItem("pairs", JSON.stringify(this.keys));
      this.loading = false;
      this.createDialogVisible = false;
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
