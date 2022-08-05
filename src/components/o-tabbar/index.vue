<template>
    <view v-if="show" class="u-tabbar" @touchmove.stop.prevent="() => {}">
        <view
            class="u-tabbar__content safe-area-inset-bottom"
            :style="{ height: '90rpx', backgroundColor: bgColor }"
            :class="{ 'u-border-top': borderTop }"
        >
            <view
                class="u-tabbar__content__item"
                v-for="(item, index) in list"
                :key="index"
                :class="{ 'u-tabbar__content__circle': midButton && item.midButton }"
                @tap.stop="clickHandler(index)"
                :style="{ backgroundColor: bgColor }"
            >
                <view :class="[midButton && item.midButton ? 'u-tabbar__content__circle__button' : 'u-tabbar__content__item__button']">
                    <tm-icon
                        :font-size="midButton && item.midButton ? midButtonSize : iconSize"
                        :name="elIconPath(index)"
                        img-mode="scaleToFill"
                        :color="elColor(index)"
                        :custom-prefix="item.customIcon ? 'custom-icon' : 'uicon'"
                    ></tm-icon>
                    <tm-badge
                        :count="item.count"
                        :dot="item.isDot"
                        v-if="item.count"
                        :offset="[-2, getOffsetRight(item.count, item.isDot)]"
                    ></tm-badge>
                </view>
                <view class="u-tabbar__content__item__text" :style="{ color: elColor(index) }">
                    <text class="u-line-1">{{ item.text }}</text>
                </view>
            </view>
            <view
                v-if="midButton"
                class="u-tabbar__content__circle__border"
                :class="{ 'u-border': borderTop }"
                :style="{ backgroundColor: bgColor, left: midButtonLeft }"
            >
                <image class="midButton-image" :src="elIconPath(1)" mode="" />
            </view>
        </view>
        <!-- 这里加上一个48rpx的高度,是为了增高有凸起按钮时的防塌陷高度(也即按钮凸出来部分的高度) -->
        <view
            class="u-fixed-placeholder safe-area-inset-bottom"
            :style="{
                height: `calc(${addUnit(height)} + ${midButton ? 48 : 0}rpx)`,
            }"
        ></view>
    </view>
</template>

<script setup>
import { prop } from "./props";
const props = defineProps(prop);
const emits = defineEmits(["change", "input"]);

const state = reactive({
    midButtonLeft: "50%",
    pageUrl: "", // 当前页面URL
    isIos: uni.getSystemInfoSync().platform == "ios",
});

const elIconPath = computed(() => {
    return (index) => {
        // 历遍u-tabbar的每一项item时，判断是否传入了pagePath参数，如果传入了
        // 和data中的pageUrl参数对比，如果相等，即可判断当前的item对应当前的tabbar页面，设置高亮图标
        // 采用这个方法，可以无需使用v-model绑定的value值
        let pagePath = props.list[index].pagePath;
        // 如果定义了pagePath属性，意味着使用系统自带tabbar方案，否则使用一个页面用几个组件模拟tabbar页面的方案
        // 这两个方案对处理tabbar item的激活与否方式不一样
        if (pagePath) {
            if (pagePath == state.pageUrl || pagePath == "/" + state.pageUrl) {
                return props.list[index].selectedIconPath;
            } else {
                return props.list[index].iconPath;
            }
        } else {
            // 普通方案中，索引等于v-model值时，即为激活项
            return index == props.value ? props.list[index].selectedIconPath : props.list[index].iconPath;
        }
    };
});

const elColor = computed(() => {
    return (index) => {
        // 判断方法同理于elIconPath
        let pagePath = props.list[index].pagePath;
        if (pagePath) {
            if (pagePath == props.pageUrl || pagePath == "/" + props.pageUrl) return props.activeColor;
            else return props.inactiveColor;
        } else {
            return index == props.value ? props.activeColor : props.inactiveColor;
        }
    };
});

onMounted(() => {
    props.midButton && getMidButtonLeft();
    init();
});

const init = () => {
    // 是否隐藏原生tabbar
    if (props.hideTabBar) uni.hideTabBar();
    // 获取引入了u-tabbar页面的路由地址，该地址没有路径前面的"/"
    let pages = getCurrentPages();
    // 页面栈中的最后一个即为项为当前页面，route属性为页面路径
    state.pageUrl = pages[pages.length - 1].route;
};

const clickHandler = async (index) => {
    if (props.beforeSwitch && typeof props.beforeSwitch === "function") {
        // 执行回调，同时传入索引当作参数
        // 在微信，支付宝等环境(H5正常)，会导致父组件定义的customBack()函数体中的this变成子组件的this
        // 通过bind()方法，绑定父组件的this，让this.customBack()的this为父组件的上下文
        let beforeSwitch = props.beforeSwitch.bind(this.$u.$parent.call(this))(index);
        // 判断是否返回了promise
        if (!!beforeSwitch && typeof beforeSwitch.then === "function") {
            await beforeSwitch
                .then((res) => {
                    // promise返回成功，
                    switchTab(index);
                })
                .catch((err) => {});
        } else if (beforeSwitch === true) {
            // 如果返回true
            switchTab(index);
        }
    } else {
        switchTab(index);
    }
};
const switchTab = (index) => {
    // 发出事件和修改v-model绑定的值
    emits("change", index);
    // 如果有配置pagePath属性，使用uni.switchTab进行跳转
    if (props.list[index].pagePath) {
        uni.switchTab({
            url: props.list[index].pagePath,
        });
    } else {
        // 如果配置了papgePath属性，将不会双向绑定v-model传入的value值
        // 因为这个模式下，不再需要v-model绑定的value值了，而是通过getCurrentPages()适配
        emits("input", index);
    }
};
const addUnit = (value = "auto", unit = "rpx") => {
    value = String(value);
    // 用uView内置验证规则中的number判断是否为数值
    return number(value) ? `${value}${unit}` : value;
};

const number = (value) => {
    return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
};

const getMidButtonLeft = () => {
    let windowWidth = uni.getSystemInfoSync().windowWidth;
    // 由于安卓中css计算left: 50%的结果不准确，故用js计算
    state.midButtonLeft = windowWidth / 2 + "px";
};
</script>

<style lang="scss" scoped>
.u-fixed-placeholder {
    /* #ifndef APP-NVUE */
    box-sizing: content-box;
    /* #endif */
}
.u-tabbar {
    &__content {
        display: flex;
        align-items: center;
        position: relative;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 998;
        /* #ifndef APP-NVUE */
        box-sizing: content-box;
        /* #endif */

        &__circle__border {
            border-radius: 100%;
            width: 150rpx;
            height: 110rpx;
            top: -40rpx;
            position: absolute;
            z-index: 4;
            background-color: #fff;
            // background-color: #000 !important;
            // 由于安卓的无能，导致只有3个tabbar item时，此css计算方式有误差
            // 故使用js计算的形式来定位，此处不注释，是因为js计算有延后，避免出现位置闪动
            left: 50%;
            transform: translateX(-50%);
            .midButton-image {
                width: 85rpx;
                height: 85rpx;
                position: absolute;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -40%);
                z-index: 888;
            }
            &:after {
                border-radius: 100px;
            }
        }
        &__circle__border::after {
            content: "";
            display: block;
            width: 50rpx;
            height: 50rpx;
            border-radius: 100% 0% 41% 59% / 70% 70% 30% 30%;
            position: absolute;
            background: #fff;
            // background-color: #000 !important;

            top: 21rpx;
            left: -2rpx;
        }
        &__circle__border::before {
            content: "";
            display: block;
            width: 50rpx;
            height: 50rpx;
            border-radius: 0% 100% 41% 59% / 40% 70% 30% 60%;
            position: absolute;
            background: #fff;
            // background-color: #000 !important;
            top: 21rpx;
            right: -2rpx;
        }

        &__item {
            flex: 1;
            justify-content: center;
            height: 100%;
            padding: 12rpx 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;

            &__button {
                position: absolute;
                top: 14rpx;
                left: 50%;
                transform: translateX(-50%);
            }

            &__text {
                color: #333;
                font-size: 25rpx;
                line-height: 13rpx;
                position: absolute;
                bottom: 14rpx;
                left: 50%;
                transform: translateX(-50%);
                width: 100%;
                text-align: center;
            }
        }

        &__circle {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            z-index: 10;
            /* #ifndef APP-NVUE */
            height: calc(100% - 1px);
            /* #endif */

            &__button {
                width: 90rpx;
                height: 90rpx;
                border-radius: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                background-color: #ffffff;
                top: -40rpx;
                left: 50%;
                z-index: 6;
                transform: translateX(-50%);
            }
        }
    }
}
.safe-area-inset-bottom {
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
