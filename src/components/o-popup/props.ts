export const porp = {
    show: {
        type: Boolean,
        default: false,
    },
    // 开启动画
    animation: {
        type: Boolean,
        default: true,
    },
    // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
    // message: 消息提示 ; dialog : 对话框
    type: {
        type: String,
        default: "left",
    },
    // maskClick
    isMaskClick: {
        type: Boolean,
        default: null,
    },
    // TODO 2 个版本后废弃属性 ，使用 isMaskClick
    maskClick: {
        type: Boolean,
        default: null,
    },
    backgroundColor: {
        type: String,
        default: "none",
    },
    safeArea: {
        type: Boolean,
        default: true,
    },
    maskBackgroundColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.4)",
    },
    // 指定使用v-show指令，不重新渲染Pop组件
    onceRender: {
        type: Boolean,
        default: false,
    },
};
