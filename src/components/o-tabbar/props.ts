export const prop = {
    // 显示与否
    show: {
        type: Boolean,
        default: true,
    },
    // 通过v-model绑定current值
    value: {
        type: [String, Number],
        default: 0,
    },
    // 整个tabbar的背景颜色
    bgColor: {
        type: String,
        default: "#ffffff",
    },
    // tabbar的高度，默认50px，单位任意，如果为数值，则为rpx单位
    height: {
        type: [String, Number],
        default: "65px",
    },
    // 非凸起图标的大小，单位任意，数值默认rpx
    iconSize: {
        type: [String, Number],
        default: 40,
    },
    // 凸起的图标的大小，单位任意，数值默认rpx
    midButtonSize: {
        type: [String, Number],
        default: 90,
    },
    // 激活时的演示，包括字体图标，提示文字等的演示
    activeColor: {
        type: String,
        default: "#FE5013",
    },
    // 未激活时的颜色
    inactiveColor: {
        type: String,
        default: "#606266",
    },
    // 是否显示中部的凸起按钮
    midButton: {
        type: Boolean,
        default: false,
    },
    // 配置参数
    list: {
        type: Array,
        default() {
            return [];
        },
    },
    // 切换前的回调
    beforeSwitch: {
        type: Function,
        default: null,
    },
    // 是否显示顶部的横线
    borderTop: {
        type: Boolean,
        default: true,
    },
    // 是否隐藏原生tabbar
    hideTabBar: {
        type: Boolean,
        default: true,
    },
};
