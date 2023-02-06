import buildURL from "../helpers/buildURL";
import buildFullPath from "../core/buildFullPath";
import settle from "../core/settle";
import { isUndefined } from "../utils";
import { HttpRequestConfig, HttpResponse } from "@/types/http";
import { cloneDeep } from "lodash-es";

/**
 * 返回可选值存在的配置
 * @param {Array} keys - 可选值数组
 * @param {Object} config2 - 配置
 * @return {{}} - 存在的配置项
 */
const mergeKeys = (keys: string[], config2: Record<string, any>) => {
    const config: Record<string, any> = {};
    keys.forEach((prop) => {
        if (!isUndefined(config2[prop])) {
            config[prop] = config2[prop];
        }
    });
    return config;
};

export default <T>(config: HttpRequestConfig) => {
    return new Promise<T>((resolve, reject) => {
        const fullPath = buildURL(buildFullPath(config.baseURL, config.url || ""), config.params);
        const _config: UniApp.RequestOptions = {
            url: fullPath,
            header: config.header,
            success: (res) => {
                try {
                    // 对可能字符串不是json 的情况容错
                    if (typeof res.data === "string") {
                        res.data = JSON.parse(res.data);
                    }
                } catch (e) {}
                const cloneConfig = cloneDeep(config);
                cloneConfig.fullPath = fullPath;
                const response = {
                    ...res,
                    config: cloneConfig,
                } as HttpResponse;
                settle(resolve, reject, response);
            },
            fail: (err) => {
                const cloneConfig = cloneDeep(config);
                cloneConfig.fullPath = fullPath;
                const response = {
                    ...err,
                    config: cloneConfig,
                } as HttpResponse;
                settle(resolve, reject, response);
            },
            // complete: (response) => {
            //   config.fullPath = fullPath;
            //   response.config = config;
            //   try {
            //     // 对可能字符串不是json 的情况容错
            //     if (typeof response.data === 'string') {
            //       response.data = JSON.parse(response.data);
            //     }
            //     // eslint-disable-next-line no-empty
            //   } catch (e) {}
            //   settle(resolve, reject, response);
            // },
        };
        let requestTask;
        if (config.method === "UPLOAD") {
            delete _config.header["content-type"];
            delete _config.header["Content-Type"];
            const otherConfig = {
                // #ifdef MP-ALIPAY
                fileType: config.fileType,
                // #endif
                filePath: config.filePath,
                name: config.name,
            };
            const optionalKeys = [
                // #ifdef APP-PLUS || H5
                "files",
                // #endif
                // #ifdef H5
                "file",
                // #endif
                // #ifdef H5 || APP-PLUS
                "timeout",
                // #endif
                "formData",
            ];
            const uploadFileOption = {
                ..._config,
                ...otherConfig,
                ...mergeKeys(optionalKeys, config),
            } as UniApp.UploadFileOption;
            requestTask = uni.uploadFile(uploadFileOption);
        } else if (config.method === "DOWNLOAD") {
            // #ifdef H5 || APP-PLUS
            if (!isUndefined(config["timeout"])) {
                _config["timeout"] = config["timeout"];
            }
            // #endif
            const downloadFileOption = _config as UniApp.DownloadFileOption;
            requestTask = uni.downloadFile(downloadFileOption);
        } else {
            const optionalKeys = [
                "data",
                "method",
                // #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
                "timeout",
                // #endif
                "dataType",
                // #ifndef MP-ALIPAY
                "responseType",
                // #endif
                // #ifdef APP-PLUS
                "sslVerify",
                // #endif
                // #ifdef H5
                "withCredentials",
                // #endif
                // #ifdef APP-PLUS
                "firstIpv4",
                // #endif
            ];
            requestTask = uni.request({ ..._config, ...mergeKeys(optionalKeys, config) });
        }
        if (config.getTask) {
            config.getTask(requestTask, config);
        }
    });
};
