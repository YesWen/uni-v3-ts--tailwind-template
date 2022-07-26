<script lang="ts" setup>
import { buttonProps } from "./prpos";

const { disabled } = defineProps(buttonProps);
const emits = defineEmits(["click"]);
const click = () => {
    emits("click");
};
</script>

<template>
    <view class="default-btn" @tap="click"><slot /></view>
</template>

<style lang="scss" scoped>
.default-btn {
    color: $uni-text-color-inverse;
    border-width: 4rpx;
    border-color: #eee;
    border-style: solid;
    border-radius: 20rpx;
    background-color: #eee;
    padding: 12rpx 26rpx;
    display: inline-block;
    font-size: $uni-font-size-sm;
    &:hover {
        background-color: #999;
    }
}
</style>
