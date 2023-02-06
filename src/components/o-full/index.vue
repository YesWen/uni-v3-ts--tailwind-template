<template>
    <view class="">
        <view v-if="isFullSucreen" class="o-h-[40rpx] opacity-100"></view>
    </view>
</template>

<script setup>
let isFullSucreen = $ref(false);

onMounted(() => {
    checkFullSucreen();
});

const checkFullSucreen = () => {
    uni.getSystemInfo({
        success: (res) => {
            // 根据 屏幕高度 进行判断
            if (res.screenHeight - res.windowHeight - res.statusBarHeight - 32 > 72) {
                isFullSucreen = true;
            }
            // 根据手机型号匹配
            if (res.model.indexOf("iPhone X") != -1) {
                isFullSucreen = true;
            }
            if (res.model.indexOf("iPhone1") != -1) {
                isFullSucreen = true;
            }
        },
    });
};
</script>
