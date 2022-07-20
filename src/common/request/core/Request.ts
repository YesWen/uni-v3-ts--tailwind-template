/**
 * @Class Request
 * @description luch-request http请求插件
 * @version 3.0.7
 * @Author lu-ch
 * @Date 2021-09-04
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-3.0.4 alpha-3.0.4
 * 2022-06-09 改写成ts
 */

import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./InterceptorManager";
import mergeConfig from "./mergeConfig";
import defaults from "./defaults";
import { cloneDeep } from "lodash-es";
import { isPlainObject } from "../utils";
import { HttpRequestConfig, HttpResponse, Interceptors } from "@/types/http";

export default class Request {
    private config: HttpRequestConfig;
    interceptors: Interceptors;

    /**
     * @param {Object} arg - 全局配置
     * @param {String} arg.baseURL - 全局根路径
     * @param {Object} arg.header - 全局header
     * @param {String} arg.method = [GET|POST|PUT|DELETE|CONNECT|HEAD|OPTIONS|TRACE] - 全局默认请求方式
     * @param {String} arg.dataType = [json] - 全局默认的dataType
     * @param {String} arg.responseType = [text|arraybuffer] - 全局默认的responseType。支付宝小程序不支持
     * @param {Object} arg.custom - 全局默认的自定义参数
     * @param {Number} arg.timeout - 全局默认的超时时间，单位 ms。默认60000。H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)、微信小程序（2.10.0）、支付宝小程序
     * @param {Boolean} arg.sslVerify - 全局默认的是否验证 ssl 证书。默认true.仅App安卓端支持（HBuilderX 2.3.3+）
     * @param {Boolean} arg.withCredentials - 全局默认的跨域请求时是否携带凭证（cookies）。默认false。仅H5支持（HBuilderX 2.6.15+）
     * @param {Boolean} arg.firstIpv4 - 全DNS解析时优先使用ipv4。默认false。仅 App-Android 支持 (HBuilderX 2.8.0+)
     * @param {Function(statusCode):Boolean} arg.validateStatus - 全局默认的自定义验证器。默认statusCode >= 200 && statusCode < 300
     */
    constructor(arg?: Partial<HttpRequestConfig>) {
        if (!isPlainObject(arg)) {
            arg = {};
            console.warn("设置全局参数必须接收一个Object");
        }
        this.config = cloneDeep({ ...defaults, ...arg });
        this.interceptors = {
            // @ts-ignore
            request: new InterceptorManager(),
            // @ts-ignore
            response: new InterceptorManager(),
        };
    }

    /**
     * @Function
     * @param {Request~setConfigCallback} f - 设置全局默认配置
     */
    setConfig(f: (_config: HttpRequestConfig) => HttpRequestConfig) {
        this.config = f(this.config);
    }

    middleware<T>(config: HttpRequestConfig) {
        config = mergeConfig(this.config, config);
        const chain = [dispatchRequest, undefined];
        const response: HttpResponse<T> = {
            config: config,
        } as HttpResponse<T>;
        let promise = Promise.resolve(response);

        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor: any) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor: any) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
            promise = promise.then<HttpResponse<T>>(chain.shift(), chain.shift());
        }

        return promise;
    }

    /**
     * @Function
     * @param {Object} config - 请求配置项
     * @prop {String} options.url - 请求路径
     * @prop {Object} options.data - 请求参数
     * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
     * @prop {Object} [options.dataType = config.dataType] - 如果设为 json，会尝试对返回的数据做一次 JSON.parse
     * @prop {Object} [options.header = config.header] - 请求header
     * @prop {Object} [options.method = config.method] - 请求方法
     * @returns {Promise<unknown>}
     */
    request<T>(config: Partial<HttpRequestConfig> = {}) {
        return this.middleware<T>(config);
    }

    get<T>(url: string, options: Partial<HttpRequestConfig> = {}) {
        return this.middleware<T>({
            url,
            method: "GET",
            ...options,
        });
    }

    post<T>(url: string, data: AnyObject, options: Partial<HttpRequestConfig> = {}) {
        return this.middleware<T>({
            url,
            data,
            method: "POST",
            ...options,
        });
    }

    // #ifndef MP-ALIPAY
    put<T>(url: string, data: AnyObject, options: Partial<HttpRequestConfig> = {}) {
        return this.middleware<T>({
            url,
            data,
            method: "PUT",
            ...options,
        });
    }
    // #endif

    // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
    delete<T>(url: string, data: AnyObject, options: Partial<HttpRequestConfig> = {}) {
        return this.middleware<T>({
            url,
            data,
            method: "DELETE",
            ...options,
        });
    }
    // #endif

    // #ifdef H5 || MP-WEIXIN
    connect<T>(url: string, data: AnyObject, options: Partial<HttpRequestConfig> = {}) {
        return this.middleware<T>({
            url,
            data,
            method: "CONNECT",
            ...options,
        });
    }
    // #endif

    // #ifdef  H5 || MP-WEIXIN || MP-BAIDU
    head<T>(url: string, data: AnyObject, options: Partial<HttpRequestConfig> = {}) {
        return this.middleware<T>({
            url,
            data,
            method: "HEAD",
            ...options,
        });
    }
    // #endif

    // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
    options<T>(url: string, data: AnyObject, options: Partial<HttpRequestConfig> = {}) {
        return this.middleware<T>({
            url,
            data,
            method: "OPTIONS",
            ...options,
        });
    }
    // #endif

    // #ifdef H5 || MP-WEIXIN
    trace<T>(url: string, data: AnyObject, options: Partial<HttpRequestConfig> = {}) {
        return this.middleware<T>({
            url,
            data,
            method: "TRACE",
            ...options,
        });
    }
    // #endif

    upload<T>(url: string, config: Partial<HttpRequestConfig> = {}) {
        config.url = url;
        config.method = "UPLOAD";
        return this.middleware<T>(config);
    }

    download<T>(url: string, config: Partial<HttpRequestConfig> = {}) {
        config.url = url;
        config.method = "DOWNLOAD";
        return this.middleware<T>(config);
    }
}

/**
 * setConfig回调
 * @return {Object} - 返回操作后的config
 * @callback Request~setConfigCallback
 * @param {Object} config - 全局默认config
 */
