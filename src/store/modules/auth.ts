import { defineStore } from "pinia";
import { getCache, removeCache, setCache } from "@/utils/catch";
import { TOKEN_KEY } from "@/enums/cacheEnum";

interface AuthState {
    token?: string;
}

export const useAuthStore = defineStore({
    id: "auth",
    state: (): AuthState => ({
        token: '--------123',
    }),
    getters: {
        getToken: (state) => {
            return state.token;
        },
        isLogin: (state): boolean => {
            return !!state.token;
        },
    },
    actions: {
        initToken() {
            this.token = getCache<string>(TOKEN_KEY) || undefined;
        },
        setToken(token: string | undefined) {
            setCache(TOKEN_KEY, token);
            this.token = token;
        },
    },
});
