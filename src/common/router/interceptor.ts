import { HOME_PAGE, LOGIN_PAGE, NAVIGATE_TYPE_LIST, NOT_FOUND_PAGE } from "@/enums/routerEnum";
import { AUTH_PAGE, router } from "@/common/router/index";

/**
 * 判断当前路径是否在需要验证登录的路径中
 * @param path
 * @return boolean
 */
export function isIncludesAuthRouter(path: string): boolean {
    if (!path) return false;
    if (!AUTH_PAGE.length) return false;
    return AUTH_PAGE.includes(path) || AUTH_PAGE.some((item) => path.includes(item));
}

/**
 * 跳转登录
 * @param path
 */
export function jumpLogin(path: string) {
    const _path = path.startsWith("/") ? path : `/${path}`;
    let pathQuery = encodeURIComponent(_path);
    router.push(LOGIN_PAGE, { redirect: pathQuery });
}

/**
 * 添加拦截器
 * 微信小程序端uni.switchTab拦截无效, 已在api中拦截
 * 微信小程序原生tabbar请使用onShow
 * 微信小程序端 <navigator>拦截无效,请使用api
 * @param routerName
 * @export void
 */
function addInterceptor(routerName: string) {
    uni.addInterceptor(routerName, {
        // 跳转前拦截
        invoke: (args) => {
            if (isIncludesAuthRouter(args.url) && args.url !== LOGIN_PAGE) {
                jumpLogin(args.url);
                return false;
            }
            return args;
        },
        // 成功回调拦截
        success: (res: any) => {},
        // 失败回调拦截
        fail: (err: any) => {
            let reg: RegExp;
            /* #ifdef MP-WEIXIN */
            reg = /(.*)?(fail page ")(.*)(" is not found$)/;
            /* #endif */
            /* #ifndef MP-WEIXIN */
            reg = /(.*)?(fail page `)(.*)(` is not found$)/;
            /* #endif */
            if (reg.test(err.errMsg)) {
                const go = err.errMsg.replace(reg, "$3") || "";
                uni.navigateTo({
                    url: `${NOT_FOUND_PAGE}?redirect=${HOME_PAGE}&go=${go}`,
                });
            }
            return false;
        },
        // 完成回调拦截
        complete: (res: any) => {},
    });
}

export function routerInterceptor() {
    NAVIGATE_TYPE_LIST.forEach((item) => {
        addInterceptor(item);
    });
}
