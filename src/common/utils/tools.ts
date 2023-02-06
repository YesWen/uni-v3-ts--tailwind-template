export const tools = {
    toast: (str: string) => uni.showToast({ title: str, icon: "none", duration: 2500 }),
    addUnit: (value = "auto", unit = "px") => (Number.isFinite(+value) ? `${value}${unit}` : value),
    upx2px: (n: number) => uni.upx2px(n),
};

export default function () {
    Object.assign(app, tools);
}
declare global {
    interface App extends Is<typeof tools> {}
}
