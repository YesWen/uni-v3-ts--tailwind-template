import { ConfigEnv, UserConfig } from "vite";
import { resolve } from "path";
import { loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import vwt from "weapp-tailwindcss-webpack-plugin/vite";
import postcssWeappTailwindcssRename from "weapp-tailwindcss-webpack-plugin/postcss";
import ImportsConfig from "./build/imports.config";
import AutoImport from "unplugin-auto-import/vite";

const isH5 = process.env.UNI_PLATFORM === "h5";
const isApp = process.env.UNI_PLATFORM === "app";
const WeappTailwindcssDisabled = isH5 || isApp;

const postcssPlugins = [
    require("autoprefixer")(),
    require("tailwindcss")({
        config: resolve("./tailwind.config.js"),
    }),
];

const vitePlugins = [uni({ vueOptions: { reactivityTransform: true } })];

if (!WeappTailwindcssDisabled) {
    vitePlugins.push(vwt());
    postcssPlugins.push(postcssWeappTailwindcssRename({}));
}

export default ({ mode }: ConfigEnv): UserConfig => {
    const root = process.cwd();
    return {
        base: "./",
        resolve: {
            alias: {
                "@": resolve("./src"),
            },
        },
        build: {
            // minify: "terser",
            // terserOptions: {
            //     compress: {
            //         // 发布时删除 console
            //         drop_console: true,
            //     },
            // },
        },
        server: {
            host: true,
            watch: { ignored: ["**/dist/**"] },
            // https: true,
            proxy: {
                "^/api": {
                    target: loadEnv(mode, process.cwd()).VITE_PROXY_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
        plugins: [AutoImport(ImportsConfig), vitePlugins],
        esbuild: { keepNames: true },
        optimizeDeps: { exclude: ["lodash-es"] },
        // test: { globals: true, environment: "jsdom", deps: { inline: ["@vue"] } },
        css: {
            postcss: {
                plugins: postcssPlugins,
            },
        },
    };
};

function isTest() {
    return process.env.NODE_ENV === "test";
}
