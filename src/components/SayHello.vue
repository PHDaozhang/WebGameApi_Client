<template>
    <div>
        <p> 我就是一个测试的东西{{message}}我的radio值{{radio}}</p>
        <el-button @click="onClick">点我呀</el-button>
        <el-radio-group v-model="radio" >
            <el-radio  label="1">备选1</el-radio>
            <el-radio  label="2">备选2</el-radio>
            <el-radio  label="9">备选3</el-radio>
        </el-radio-group>

    </div>
</template>

<script>
export default {
    name:"SayHello",
    data:function()
    {
        return {
            message:0,
            radio:1
        }
    },
    methods:{
        onClick:function()
        {
            this.message += 1;
        }
    }
}
</script>