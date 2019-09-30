<template>
  <el-input :placeholder="$t('common.plaseInput')" clearable @change="valueChange" v-model="filterValue" style="width: 30%;" :maxlength="GLOBAL.inputMaxLenght" class="input-with-select">
    <el-select v-model="filterKey" @change="valueChange" slot="prepend" :placeholder="$t('common.placeholder')" style="width:120px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </el-input>
</template>
<script>
export default {
  name: "selectInput",
  props: {
    options:{
      type:Array,
    },
  },
  data() {
    return {
      filterKey:'All',
      filterValue:''
    }
  },
  created() {},
  methods: {
    valueChange(){
      var param = [this.filterKey,this.filterValue]
      this.$emit('setQuery', param)
    },
  }
}
</script>

