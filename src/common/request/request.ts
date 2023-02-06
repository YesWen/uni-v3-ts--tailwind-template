import Request from "./core/Request";
import { getCache } from "@/utils/catch";
import { TOKEN_KEY } from "@/enums/cacheEnum";
import { assign } from "lodash-es";
import { HttpSuccess } from "@/types/http";
import { Toast } from "@/utils/uniApi";
import { getEnvValue } from "@/utils/env";

const BASE_URL = getEnvValue<string>("VITE_BASE_URL");

console.log(getEnvValue<string>("VITE_BASE_URL"))

const HEADER = {
    "Content-Type": "application/json;charset=UTF-8;",
    Accept: "application/json, text/plain, */*",
};

const TOKEN = () => getCache<string>(TOKEN_KEY) || undefined;

function createRequest() {
    return new Request({ baseURL: BASE_URL, header: HEADER, custom: { auth: true } });
}

const R = createRequest();
/**
 * 请求拦截器
 */
R.interceptors.request.use(
    (options) => {
        const { config } = options;

        const token = TOKEN();

        if (config.custom?.auth) {
            // const authStore = useAuthStore();
            // if (!authStore.isLogin) {
            //     Toast("请先登录");
            //     // token不存在跳转到登录页
            //     return Promise.reject(options);
            // }
            config.header = assign(config.header, {
                authorization: `Bearer ${token}`,
            });
        }
        return options;
    },
    (options) => {
        return Promise.reject(options);
    }
);

/**
 * 响应拦截器
 */
R.interceptors.response.use(
    async (response: HttpSuccess<API<any>>) => {
        const { data: resData } = response;
        const { code, msg, data } = resData;
        if (code === 1) {
            return resData as any;
        }
        Toast(msg);
        return Promise.resolve(resData);
    },
    (response) => {
        // 请求错误做点什么。可以使用async await 做异步操作
        // error('Request Error!');
        return Promise.reject(response);
    }
);

export { R };
