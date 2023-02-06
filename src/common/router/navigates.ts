import { LOGIN_PAGE, NAVIGATE_TYPE } from "@/enums/routerEnum";
import { warn } from "vue";
import { deepMerge } from "@/utils";
import { isIncludesAuthRouter } from "@/common/router/interceptor";
import { cloneDeep } from "lodash-es";
import queryParams from "./queryParams";

export type NavigateOptions = Partial<Omit<UniApp.NavigateToOptions, "url">> & { delta?: number };

export class Navigates {
    private type: string;
    private readonly options: NavigateOptions;
    constructor(type?: string, options?: NavigateOptions) {
        this.type = type || NAVIGATE_TYPE.NAVIGATE_TO;
        this.options = options || {};
    }
    mixinParam(url: string, params: object) {
        let query = "";
        if (/.*\/.*\?.*=.*/.test(url)) {
            query = queryParams(params, false);
            return (url += "&" + query);
        } else {
            query = queryParams(params);
            return (url += query);
        }
    }
    navigate(url: string, params: any, options?: NavigateOptions) {
        const navigateOptions = deepMerge(cloneDeep(this.options), options);
        const _options = deepMerge({ url: this.mixinParam(url, params) }, navigateOptions);

        switch (this.type) {
            case NAVIGATE_TYPE.NAVIGATE_TO:
                uni.navigateTo(_options);
                break;
            case NAVIGATE_TYPE.REDIRECT_TO:
                uni.redirectTo(_options);
                break;
            case NAVIGATE_TYPE.RE_LAUNCH:
                uni.reLaunch(_options);
                break;
            case NAVIGATE_TYPE.SWITCH_TAB:
                uni.switchTab(_options);
                break;
            case NAVIGATE_TYPE.NAVIGATE_BACK:
                uni.navigateBack({ ...navigateOptions, delta: params });
                break;
            default:
                warn("navigate Error");
                break;
        }
    }
    push(url: string, params?: any, options?: NavigateOptions) {
        this.type = NAVIGATE_TYPE.NAVIGATE_TO;
        this.navigate(url, params, options);
    }
    replace(url: string, params?: any, options?: NavigateOptions) {
        this.type = NAVIGATE_TYPE.REDIRECT_TO;
        this.navigate(url, params, options);
    }
    replaceAll(url: string, params?: any, options?: NavigateOptions) {
        this.type = NAVIGATE_TYPE.REDIRECT_TO;
        this.navigate(url, params, options);
    }
    pushTab(url: string, params?: any, options?: NavigateOptions) {
        // 微信小程序端uni.switchTab拦截无效处理
        /* #ifdef MP-WEIXIN */
        if (isIncludesAuthRouter(url)) {
            const authStore = app.User;
            if (!authStore.isLogin) {
                const _path = url.startsWith("/") ? url : `/${url}`;
                let pathQuery = encodeURIComponent(_path);
                this.push(LOGIN_PAGE, { redirect: pathQuery });
            }
            return;
        }
        /* #endif */
        this.type = NAVIGATE_TYPE.SWITCH_TAB;
        this.navigate(url, options);
    }
    back(delta: number, options?: NavigateOptions) {
        this.type = NAVIGATE_TYPE.NAVIGATE_BACK;
        this.navigate("", delta, options);
    }
}
