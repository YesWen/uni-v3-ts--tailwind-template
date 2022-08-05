import { App as VueApp } from 'vue'

import { R } from './request'

import { map } from '@/api'

export const api = new Proxy(map, {
  get: function (target, name: string) {
    return request(target[name])
  },
})

function request(ins) {
  if (!ins) throw new Error('错误调用: ' + name)
  let { url, type } = ins

  return async (data, options = {}) => {
    url = url.replace(/\/{(.*?)}/g, (_, name) => {
      let val = data[name]
      delete data[name]
      return '/' + val
    })
    app.debug('发起请求', type, url, data)

    return  R.request<API>({url,method:type,data:data});

  }

}

export default function (vueApp: VueApp) {
  Object.assign(vueApp.config.globalProperties, { api })
  Object.assign(app, { api })
}

declare global {
  interface App {
    api: typeof api
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    api: typeof api
  }
}

type Types = 'update' | 'create' | 'delete' | 'get'
type WithMethod<T> = T extends { Get: infer P } ? T & P : T extends { Post: infer P } ? T & P : T
type FReq<Req, Res> = (req?: Partial<Req>) => Promise<Partial<Res>>

type APIs<K = keyof typeof map> = K extends infer Name
  ? Name extends `${infer U}Req`
    ? U extends `${Types}${infer Key}`
      ? U extends `${infer Type}${Key}`
        ? //@ts-expect-error `${U}Req`无法被约束为IResult的索引类型
          { [k in Key]: WithMethod<{ [m in Type]: FReq<IResult[`${U}Req`], IResult[`${U}Res`]> }> }
        : never
      : //@ts-expect-error `${U}Req`无法被约束为IResult的索引类型
        { [k in U]: WithMethod<{ Post: FReq<IResult[`${U}Req`], IResult[`${U}Res`]> }> }
    : never
  : never

