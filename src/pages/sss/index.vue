<template>
    <div class="page">
        <div class="o-bg-[#000] o-w-[300prx] o-h-[300rpx]">123</div>
    </div>
</template>

<script setup lang="ts">
console.log(getCurrentInstance(), "--------------");

onLoad((e) => {
    console.log(e, "-----------");
});
</script>

<style lang="scss" scoped></style>
