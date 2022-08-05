<template>
    <view class="page">
        <o-navbar :custom="true">
            <template #container>
                <div class="o-w-screen o-flex o-justify-between o-items-center o-px-[30rpx] navbar">
                    <div class="o-w-[60rpx] o-h-[60rpx] o-flex o-justify-center o-items-center o-bg-[#e8f7f2] o-rounded-50" @tap="showPopup = true">
                        <image class="o-w-[40rpx] o-h-[40rpx] image" src="../../static/image/avatar.png" />
                    </div>
                    <div>哈哈</div>
                    <div>2</div>
                </div>
            </template>
        </o-navbar>
        <!-- <map id="map" :show-location="true" :longitude="113.8561642795139" :latitude="22.58888400607639" :markers="m.markers" @markertap="markerTap" scale="12">
            <div class="oneself o-fixed o-bottom-[200rpx] o-right-[30rpx] o-bg-[#fff] o-w-[60rpx] o-h-[60rpx] o-rounded-50">
                <cover-image class="center o-w-[40rpx] o-h-[40rpx]" src="/static/image/cabinet/mapLocation.png"></cover-image>
            </div>
            <view class="scan-wrap o-w-screen o-h-[130rpx] o-bg-[#fff] o-fixed o-bottom-0 o-left-0">
                <cover-view class="center scan o-text-center">
                    <cover-view class="text">哈哈哈</cover-view>
                </cover-view>
            </view>
        </map> -->
        <o-popup @update:show="showPopup = $event" :show="showPopup">
            <div class="o-w-[500rpx] o-h-screen o-bg-[#fff] o-pt-[130rpx] popup">
                <User></User>
            </div>
        </o-popup>
        <o-tabbar :list="tabBar" :midButton="true"></o-tabbar>
    </view>
</template>

<script setup lang="ts">
// import oPopup from "../../components/o-popup/index.vue";
import User from "./components/user.vue";

// const modal = ref<InstanceType<typeof oPopup> | null>(null);

// const openModal = () => {
//     modal.value?.open();
//     console.log(modal.value);
// };

const tabBar = $ref([
    {
        pagePath: "/pages/index/index",
        iconPath: "/static/image/cabinet/mapAll.png",
        selectedIconPath: "/static/image/cabinet/mapAll.png",
        text: "首页",
    },
    {
        pagePath: "/pages/notFound/index",
        iconPath: "/static/image/cabinet/mapLocation.png",
        selectedIconPath: "/static/image/cabinet/mapLocation.png",
        // text: "扫码",
    },
    {
        pagePath: "/pages/sss/index",
        iconPath: "/static/image/cabinet/mapCabinet.png",
        selectedIconPath: "/static/image/cabinet/mapCabinet.png",
        text: "哈哈",
    },
]);

let showPopup = $ref(false);

const location = reactive<{ longitude: string | number; latitude: string | number }>({
    longitude: 0,
    latitude: 0,
});

const m = reactive<{ markers: Array<any> }>({ markers: [] });

onLoad(() => {
    getLocation();
});

const getLocation = async () => {
    // let { longitude, latitude } = await (<UniApp.GetLocationSuccess>uni.getLocation<UniApp.GetLocationOptions>({ type: "gcj02" }));
    // console.log(longitude, latitude);
    // location.longitude = longitude;
    // location.latitude = latitude;
};

const markerTap = () => {
    console.log("点击啦");
};

// console.log(proxy);

// let state = reactive<{ list: any }>({
//     list: [],
// });

// // let user = new User();

// const getData = async () => {
//     let res = await api.bannerList({ type: "2" });
//     state.list = res.data;
//     console.log(res);
// };

// app.toast("草");
// console.log(app, "---------我是app");

// console.log(app.User.token, "---------我是app的token");

const handleGetStarted = () => {
    router.push("/pages/sss/index", { id: "auto", name: "我是是是" });
};
const { longitude, latitude } = toRefs(location);
</script>

<style lang="scss">
.page {
    width: 100%;
    min-height: 100vh;
    .navbar {
        .image {
            width: 60rpx;
            height: 60rpx;
        }
    }
    #map {
        position: relative;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 90vh;
        .center {
            position: absolute;
            left: 50%;
            top: 45%;
            transform: translate(-50%, -45%);
            border-radius: 30rpx;
        }
    }
}
</style>
