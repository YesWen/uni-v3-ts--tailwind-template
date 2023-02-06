export default {
    isBack: {
        type: Boolean,
        default: true,
    },
    backIcon: {
        type: Boolean,
        default: true,
    },
    background: {
        type: Object,
        default() {
            return {
                background: "#ffffff",
            };
        },
    },
    // 返回箭头的颜色
    backIconColor: {
        type: String,
        default: "#606266",
    },
    // 左边返回的图标
    backIconName: {
        type: String,
        default: "arrow-left",
    },
    // 左边返回图标的大小，rpx
    backIconSize: {
        type: [String, Number],
        default: "44",
    },
    // 返回的文字提示
    backText: {
        type: String,
        default: "",
    },
    // 返回的文字的 样式
    backTextStyle: {
        type: Object,
        default() {
            return {
                color: "#606266",
            };
        },
    },
    custom: {
        type: Boolean,
        default: false,
    },
};
