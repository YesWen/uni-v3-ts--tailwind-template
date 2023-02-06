<template>
    <view v-if="showPopup" class="o-popup" :class="[popupstyle, isDesktop ? 'fixforpc-z-index' : '']">
        <view @touchstart="touchstart">
            <o-transition
                key="1"
                v-if="maskShow"
                name="mask"
                mode-class="fade"
                :styles="maskClass"
                :duration="duration"
                :show="showTrans"
                @click="onTap"
            />
            <o-transition
                key="2"
                :mode-class="ani"
                name="content"
                :styles="transClass"
                :duration="duration"
                :show="showTrans"
                @click="onTap"
                :once-render="onceRender"
            >
                <view class="o-popup__wrapper" :style="{ backgroundColor: bg }" :class="[popupstyle]" @click="clear">
                    <slot />
                </view>
            </o-transition>
        </view>
    </view>
</template>

<script setup>
import { nextTick } from "vue";
import { porp } from "./props";

let { windowWidth, windowHeight, windowTop, safeArea, screenHeight, safeAreaInsets } = uni.getSystemInfoSync();

const props = defineProps(porp);

const emits = defineEmits(["update:show", "maskClick"]);

const state = reactive({
    duration: 300,
    ani: [],
    showPopup: false,
    showTrans: false,
    popupWidth: 0,
    popupHeight: 0,
    config: {
        top: "top",
        bottom: "bottom",
        center: "center",
        left: "left",
        right: "right",
        message: "top",
        dialog: "center",
        share: "bottom",
    },
    maskClass: {
        position: "fixed",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    transClass: {
        position: "fixed",
        left: 0,
        right: 0,
    },
    maskShow: true,
    mkclick: true,
    popupstyle: "top",
    clearPropagation: false,
    messageChild: null,
});

watch(
    () => props.show,
    (v) => {
        console.log(v, "-----------");
        if (v) {
            open();
        }
    }
);

watch(
    () => props.type,
    (type) => {
        if (!state.config[type]) return;
        state[state.config[type]](true);
    }
);
watch(
    () => props.maskClick,
    (v) => {
        state.mkclick = v;
    }
);
watch(
    () => props.isMaskClick,
    (v) => {
        state.mkclick = v;
    }
);

watch(
    () => state.showPopup,
    (v) => {
        // #ifdef H5
        // fix by mehaotian 处理 h5 滚动穿透的问题
        document.getElementsByTagName("body")[0].style.overflow = show ? "hidden" : "visible";
        // #endif
    }
);

const isDesktop = computed(() => state.popupWidth >= 500 && state.popupHeight >= 500);

const bg = computed(() => {
    if (props.backgroundColor === "" || props.backgroundColor === "none") {
        return "transparent";
    }
    return props.backgroundColor;
});

const fixSize = () => {
    state.popupWidth = windowWidth;
    state.popupHeight = windowHeight + (windowTop || 0);
    // TODO fix by mehaotian 是否适配底部安全区 ,目前微信ios 、和 app ios 计算有差异，需要框架修复
    if (safeArea && safeArea) {
        // #ifdef MP-WEIXIN
        safeAreaInsets = screenHeight - safeArea.bottom;
        // #endif
        // #ifndef MP-WEIXIN
        safeAreaInsets = safeAreaInsets.bottom;
        // #endif
    } else {
        safeAreaInsets = 0;
    }
};

onMounted(() => {
    if (props.isMaskClick === null && props.maskClick === null) {
        state.mkclick = true;
    } else {
        state.mkclick = props.isMaskClick !== null ? props.isMaskClick : props.maskClick;
    }
    if (props.animation) {
        state.duration = 300;
    } else {
        state.duration = 0;
    }
    // TODO 处理 message 组件生命周期异常的问题
    props.messageChild = null;
    // TODO 解决头条冒泡的问题
    // props.clearPropagation = false;
    state.maskClass.backgroundColor = props.maskBackgroundColor;
    fixSize();
});

const closeMask = () => {
    state.maskShow = false;
};

const disableMask = () => {
    state.maskShow = false;
};

const clear = (e) => {
    // #ifndef APP-NVUE
    e.stopPropagation();
    // #endif
    state.clearPropagation = true;
};
const open = (direction) => {
    // fix by mehaotian 处理快速打开关闭的情况
    if (state.showPopup) {
        clearTimeout(state.timer);
        state.showPopup = false;
    }
    let innerType = ["top", "center", "bottom", "left", "right", "message", "dialog", "share"];
    if (!(direction && innerType.indexOf(direction) !== -1)) {
        direction = props.type;
    }

    if (!state.config[direction]) {
        console.error("缺少类型：", direction);
        return;
    }
    let map = {
        left: () => left(),
        top: () => top(),
        bottom: () => bottom(),
        right: () => right(),
        center: () => center(),
    };

    map[state.config[direction]]();

    emits("update:show", true);
};

const close = (type) => {
    state.showTrans = false;
    emits("update:show", false);
    clearTimeout(state.timer);
    // // 自定义关闭事件

    state.timer = setTimeout(() => {
        state.showPopup = false;
    }, 300);
};

const touchstart = () => {
    state.clearPropagation = false;
};

const onTap = () => {
    if (state.clearPropagation) {
        // fix by mehaotian 兼容 nvue
        state.clearPropagation = false;
        return;
    }
    emits("maskClick");
    if (!state.mkclick) return;
    close();
};

const top = (type) => {
    state.popupstyle = isDesktop.value ? "fixforpc-top" : "top";
    state.ani = ["slide-top"];
    state.transClass = {
        position: "fixed",
        left: 0,
        right: 0,
        backgroundColor: bg.value,
    };
    // TODO 兼容 type 属性 ，后续会废弃
    if (type) return;
    state.showPopup = true;
    state.showTrans = true;
    nextTick(() => {
        if (state.messageChild && props.type === "message") {
            state.messageChild.timerClose();
        }
    });
};
const bottom = (type) => {
    state.popupstyle = "bottom";
    state.ani = ["slide-bottom"];
    state.transClass = {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: safeAreaInsets + "px",
        backgroundColor: bg.value,
    };
    // TODO 兼容 type 属性 ，后续会废弃
    if (type) return;
    state.showPopup = true;
    state.showTrans = true;
};

const center = (type) => {
    state.popupstyle = "center";
    state.ani = ["zoom-out", "fade"];
    state.transClass = {
        position: "fixed",
        /* #ifndef APP-NVUE */
        display: "flex",
        flexDirection: "column",
        /* #endif */
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
    };
    // TODO 兼容 type 属性 ，后续会废弃
    if (type) return;
    state.showPopup = true;
    state.showTrans = true;
};
const left = (type) => {
    state.popupstyle = "left";
    state.ani = ["slide-left"];
    state.transClass = {
        position: "fixed",
        left: 0,
        bottom: 0,
        top: 0,
        backgroundColor: bg.value,
        /* #ifndef APP-NVUE */
        display: "flex",
        flexDirection: "column",
        /* #endif */
    };
    // TODO 兼容 type 属性 ，后续会废弃
    if (type) return;
    state.showPopup = true;
    state.showTrans = true;
};
const right = (type) => {
    state.popupstyle = "right";
    state.ani = ["slide-right"];
    state.transClass = {
        position: "fixed",
        bottom: 0,
        right: 0,
        top: 0,
        backgroundColor: bg.value,
        /* #ifndef APP-NVUE */
        display: "flex",
        flexDirection: "column",
        /* #endif */
    };
    // TODO 兼容 type 属性 ，后续会废弃
    if (type) return;
    state.showPopup = true;
    state.showTrans = true;
};

defineExpose({ open });
const { showPopup, onceRender, transClass, showTrans, popupstyle, duration, ani, maskClass, maskShow } = toRefs(state);
</script>

<style lang="scss">
.o-popup {
    position: fixed;
    z-index: 99999;
    &.top,
    &.left,
    &.right {
        /* #ifdef H5 */
        top: var(--window-top);
        /* #endif */
        /* #ifndef H5 */
        top: 0;
        /* #endif */
    }

    .o-popup__wrapper {
        /* #ifndef APP-NVUE */
        display: block;
        /* #endif */
        position: relative;

        /* iphonex 等安全区设置，底部安全区适配 */
        /* #ifndef APP-NVUE */
        // padding-bottom: constant(safe-area-inset-bottom);
        // padding-bottom: env(safe-area-inset-bottom);
        /* #endif */
        &.left,
        &.right {
            /* #ifdef H5 */
            padding-top: var(--window-top);
            /* #endif */
            /* #ifndef H5 */
            padding-top: 0;
            /* #endif */
            flex: 1;
        }
    }
}

.fixforpc-z-index {
    /* #ifndef APP-NVUE */
    z-index: 999;
    /* #endif */
}

.fixforpc-top {
    top: 0;
}
</style>
