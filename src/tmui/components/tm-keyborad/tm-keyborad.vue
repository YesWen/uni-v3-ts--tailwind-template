<template>
    <tm-drawer ref="drawer" @open="drawerOpen" 
	@close="drawerClose" @update:show = "showPop=$event" :show="showPop" :dark="isDark" 
	:follow-dark="props.followDark" :follow-theme="false" :height="dHeight"
        :hide-header="true" color="grey-3" :mask="false">
        <keyborad-number :followTheme="props.followTheme" :random="props.random" :color="props.color" v-if="_typemodel=='number'" @change="change" @confirm="confirm" :model-value="_value" @update:modelValue="_value = $event" :dark="isDark" class="flex-1"></keyborad-number>
        <keyborad-pass :followTheme="props.followTheme" :random="props.random" :color="props.color" v-if="_typemodel=='password'" @change="change" @confirm="confirm" :model-value="_value" @update:modelValue="_value = $event" :dark="isDark" class="flex-1"></keyborad-pass>
        <keyborad-car :followTheme="props.followTheme" :random="props.random" :color="props.color" v-if="_typemodel=='car'" @change="change" @confirm="confirm" :model-value="_value" @update:modelValue="_value = $event" :dark="isDark" class="flex-1"></keyborad-car>
        <keyborad-card :followTheme="props.followTheme" :random="props.random" :color="props.color" v-if="_typemodel=='card'" @change="change" @confirm="confirm" :model-value="_value" @update:modelValue="_value = $event" :dark="isDark" class="flex-1"></keyborad-card>
    </tm-drawer>
</template>
<script lang="ts" setup>
import { ref,computed, watch, toRaw,getCurrentInstance } from "vue"
import { custom_props, computedDark } from '../../tool/lib/minxs';
import tmDrawer from '../tm-drawer/tm-drawer.vue';
import keyboradNumber from "./keyborad-number.vue";
import keyboradCard from "./keyborad-card.vue";
import keyboradPass from "./keyborad-pass.vue"
import keyboradCar from "./keyborad-car.vue"
import { useTmpiniaStore } from '../../tool/lib/tmpinia';
const store = useTmpiniaStore();
const emits=defineEmits(["change","confirm","update:show","update:modelValue"])
const {proxy} = getCurrentInstance();
const props = defineProps({
    ...custom_props,
	followTheme: {
		type: [Boolean,String],
		default: true
	},
	/**
	 * password | card | car | number
	 * ??????     | ?????????|  ?????? | ????????????
	 */
	type:{
		type:String,
		default:'number'
	},
	//?????????????????????v-model:show
	show:{
		type:Boolean,
		default:false
	},
	//?????????v-model
	modelValue:{
		type:String,
		default:""
	},
	//??????????????????
	defaultValue:{
		type:String,
		default:""
	},
	color:{
		type:String,
		default:"primary"
	},
	/** ?????????????????? */
    random:{
        type:Boolean,
        default:false 
    },
})
// ??????????????????????????????????????????
const tmcfg = computed(() => store.tmStore);
//?????????????????????
const isDark = computed(() => computedDark(props, tmcfg.value));
const showPop = ref(props?.show??false);
const _value = ref(props?.defaultValue??"");
const _typemodel = computed(()=>props.type)
watch(()=>props.show,()=>{
	showPop.value = props.show;
})
function drawerClose(){
	emits('update:show',false)
}
function drawerOpen(){
	emits('update:show',true)
}

watch(()=>props.modelValue,()=>{
	_value.value = props.modelValue;
})
function change(){
	emits("update:modelValue",toRaw(_value.value))
	// #ifdef MP
	uni.vibrateShort()
	// #endif
}
function confirm(){
	emits("confirm",toRaw(_value.value))
	proxy.$refs.drawer.close()
}

const win_bottom = uni.getSystemInfoSync().safeAreaInsets.bottom
const dHeight = computed(() => {
    
    return 520+win_bottom
})
</script>
