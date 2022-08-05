import { Store, Pinia, Persist } from "../utils";

@Store
export class User extends Pinia {
    // 下方为示例变量 - 开发时请删除

    // 使用Persist修饰器持久化数据
    @Persist
    token = "666";
    isLogin: false;

    // 允许直接编写getter
    get getToken() {
        return this.token;
    }

    // 或action
    async handleClick() {
        uni.showToast({ title: this.token });
    }
}
