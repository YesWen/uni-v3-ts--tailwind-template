/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

type Is<T> = T;

declare module "*.vue" {
    import { DefineComponent } from "vue";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface ImportMetaEnv {
    readonly VITE_ENV: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_BASE_URL: string;
    readonly VITE_PROXY_BASE_URL: string;
    readonly VITE_UPLOAD_URL: string;
    readonly VITE_PROD: boolean;
    readonly VITE_DEV: boolean;
    readonly VITE_APP_CACHE_PREFIX: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare namespace UniApp {
    interface Uni {}
}

type Get<T extends {}, K> = K extends keyof T ? T[K] : never;
type MaybeArray<T> = [T] extends [unknown[]] ? T : T | T[];
type Promisify<T> = Promise<T extends Promise<infer S> ? S : T>;
type Awaitable<T> = [T] extends [Promise<unknown>] ? T : T | Promise<T>;
type Intersect<U> = (U extends any ? (arg: U) => void : never) extends (arg: infer I) => void ? I : never;

type func<P extends any[] = any[], R = any> = (...args: P) => R;

type AObjectHasAnyKeys = { [key in any]: any };
