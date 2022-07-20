<template>
    <view class="content">
        <div class="tw-h-[300rpx] tw-bg-[#000] tw-w-[300rpx]">123</div>
        <tm-sheet>
            <tm-text :font-size="24" _class="font-weight-b" label="基础示例"></tm-text>
            <tm-divider align="left" label="我在左边"></tm-divider>
            <tm-divider align="center" label="我在中间"></tm-divider>
            <tm-divider align="right" label="我在右边"></tm-divider>
            <tm-divider :border="10" label="改变粗细"></tm-divider>
            <tm-divider color="red" font-color="red" :border="10" label="改变颜色"></tm-divider>
            <tm-text :font-size="24" _class="font-weight-b" label="下方不带文本分割线"></tm-text>
            <tm-divider color="green"></tm-divider>
        </tm-sheet>
        <tm-sheet>
            <view class="mb-24">
                <tm-text :font-size="24" _class="font-weight-b" label="竖向分割线，不允许 携带文本标签。"></tm-text>
            </view>
            <view class="flex flex-row flex-center">
                <tm-divider vertical :height="200"></tm-divider>
                <tm-divider color="green" vertical :height="200"></tm-divider>
                <tm-divider color="red" vertical :height="200"></tm-divider>
                <tm-divider color="primary" vertical :height="200"></tm-divider>
            </view>
        </tm-sheet>
        <BasicButton @click="handleGetStarted">Get → </BasicButton>
    </view>
</template>

<script setup lang="ts">
import BasicButton from "@/components/BasicButton/index.vue";
import { getCurrentInstance, ref, ComponentInternalInstance } from "vue";

const title = ref("uni-app vue3 ts --Vite");

const { proxy } = <ComponentInternalInstance>getCurrentInstance();

console.log(proxy);

onLoad(() => {
    getData();
});

let state = reactive<{ list: any }>({
    list: [],
});

const getData = async () => {
    let res = await api.bannerList({ type: "2" });
    state.list = res.data;
    console.log(res)
};

const handleGetStarted = () => {
    router.push("/pages/sss/index", { sss: "auto", name: "我是是是" });
};
</script>

<style lang="scss"></style>
