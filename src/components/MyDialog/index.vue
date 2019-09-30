<template>
  <el-dialog :title="title" :visible.sync="dialogVisible">
  
  </el-dialog>
</template>

<script>
export default {
  name: "MyDialog",
  components: { },
  props: {
    title: {
      type: String
    },
    dialogVisible: {
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      dataTime: [],
    };
  },
  methods: {
  }
}
</script>
