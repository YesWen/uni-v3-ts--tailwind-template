import { ConfigEnv, UserConfig } from "vite";
import { resolve } from "path";
import { loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
const isH5 = process.env.UNI_PLATFORM === "h5";
import vwt from "weapp-tailwindcss-webpack-plugin/vite";
import postcssWeappTailwindcssRename from "weapp-tailwindcss-webpack-plugin/postcss";
import ImportsConfig from "./build/imports.config";
import AutoImport from "unplugin-auto-import/vite";

const postcssPlugins = [require("autoprefixer")(), require("tailwindcss")()];

if (!isH5) {
    postcssPlugins.push(
        require("postcss-rem-to-responsive-pixel")({
            rootValue: 32,
            propList: ["*"],
            transformUnit: "rpx",
        })
    );
    postcssPlugins.push(postcssWeappTailwindcssRename());
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
            minify: "terser",
            terserOptions: {
                compress: {
                    // 发布时删除 console
                    drop_console: true,
                },
            },
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
        plugins: [AutoImport(ImportsConfig), isTest() || uni({ vueOptions: { reactivityTransform: true } }), , isH5 ? undefined : vwt()],
        esbuild: { keepNames: true },
        optimizeDeps: { exclude: ["lodash-es"] },
        test: { globals: true, environment: "jsdom", deps: { inline: ["@vue"] } },
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
