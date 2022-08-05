<template>
    <view class="cu-custom" :style="[{ height: customBar + 'px' }]">
        <view class="cu-bar fixed flex justify-between" :style="[style]" v-if="!custom">
            <view class="action flex" @tap="goBack" v-if="isBack">
                <!-- <u-icon v-if="backIcon" name="arrow-left" color="#333" size="45rpx" style="margin-right: 10rpx;"></u-icon> -->
                <view class="u-back-text truncate" v-if="backText" :style="[backTextStyle]">{{ backText || "" }}</view>
            </view>
            <view class="content" :style="[{ top: statusBarHeight + 'px' }]"><slot name="content"></slot></view>
            <slot name="right"></slot>
        </view>
        <div v-else class="cu-bar fixed" :style="[style]">
            <slot name="container"></slot>
        </div>
    </view>
</template>

<script setup>
import { reactive, toRefs, computed } from "vue";

import initPorps from "./porps";

// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
const props = defineProps(initPorps);

const state = reactive({
    statusBarHeight: systemInfo.statusBarHeight,
});

const goBack = () => {
    uni.navigateBack();
};

const customBar = computed(() => {
    let statusBarHeight = systemInfo.statusBarHeight;
    // #ifndef MP
    return systemInfo.platform == "android" ? statusBarHeight + 50 : statusBarHeight + 45;
    // #endif
    // #ifdef MP-WEIXIN
    return menuButtonInfo.bottom + menuButtonInfo.top - statusBarHeight;
    // #endif
    // #ifdef MP-ALIPAY
    return statusBarHeight + systemInfo.titleBarHeight;
    // #endif
});

const style = computed(() => {
    let statusBarHeight = systemInfo.statusBarHeight;
    let style = {};
    style.height = `${customBar.value}px`;
    style.paddingTop = `${statusBarHeight}px`;
    Object.assign(style, props.background);
    return style;
});

const { statusBarHeight } = toRefs(state);
</script>

<style lang="scss" scoped>
@import url("./nav.less");

.cu-custom,
.container {
    width: 100%;
}

.cu-bar {
    width: 100%;
    align-items: center;
    .content {
        width: 560rpx;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex: 1;
        align-items: center;
        pointer-events: auto;
        justify-content: center;
    }
    image {
        width: 37rpx;
        height: 38rpx;
        margin-right: 30rpx;
    }
}
.u-back-text {
    padding-left: 4rpx;
    font-size: 30rpx;
}
</style>
