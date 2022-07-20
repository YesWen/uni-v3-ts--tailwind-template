module.exports = {
    mode: "jit",
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,wxml}"],
    prefix: "tw-", //配置前缀 
    // darkMode: false, // or 'media' or 'class'
    separator: "__", // 兼容小程序，将 : 替换成 __
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false,
        space: false,
        divideColor: false,
        divideOpacity: false,
        divideStyle: false,
        divideWidth: false,
    },
};
