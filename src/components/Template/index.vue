<template>
    <view>{{ name }}</view>
    <view> 组件模板,新建components,将此页面内容复制粘贴到新建.vue文件 </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "Template",
    props: {
        name: {
            type: String,
            default: "Template",
        },
    },
    setup(props) {
        const test = "Test";
        const name = props.name;
        return { test, name };
    },
});
</script>

<style lang="scss" scoped></style>
