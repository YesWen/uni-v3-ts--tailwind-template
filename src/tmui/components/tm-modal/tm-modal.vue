<template>
	<tm-overlay :duration="25" @open="OverLayOpen" v-if="_show" @click="clickClose" :align="align_rp"
		:overlayClick="false" v-model:show="_show">
		<tm-translate @end="animationClose" :reverse="reverse_rp" :width='anwidth' :height="anheight" ref="drawerANI"
			:auto-play="false" :name="aniname" :duration="props.duration">
			<view @click.stop="$event.stopPropagation()" :style="[
				{ width: anwidth, height: anheight, },
				!props.transprent ? tmcomputed.borderCss : '',
				!props.transprent ? tmcomputed.backgroundColorCss : '',
				!props.transprent ? tmcomputed.shadowColor : '',
				customCSSStyle,
			]" :class="[round_rp, 'flex flex-col overflow ', customClass]">
				<view class="flex  flex-row flex-center  px-24 " style="height:44px">
					<tm-text :dark="props.dark" :followTheme="false" _class="text-overflow-1 text-weight-b text-size-m"
						:label="props.title"></tm-text>
				</view>
				<scroll-view scroll-y :style="[props.height ? { height: contentHeight } : '']">
					<view class="px-32">
						<slot name="default">
							<tm-text :font-size="30" :dark="props.dark" :followTheme="false" :label="props.content"
								_style="line-height:46rpx"></tm-text>
						</slot>
					</view>
				</scroll-view>
				<view class="flex flex-row " :class="[props.splitBtn ? 'pa-32' : '']">
					<view v-if="!props.hideCancel" class="flex-1  overflow " style="height:90rpx">
						<tm-sheet :dark="props.dark" :followTheme="true" :isDisabledRoundAndriod="true" @click="cancel"
							:height="90" :linear="props.cancelLinear" :linearDeep="props.cancelLlinearDeep" text
							:color="props.cancelColor" :_class="[
								'flex-center overflow flex',
							]" :paren-class="props.splitBtn ? ('round-' + props.btnRound) : 'round-bl-' + props.round" :margin="[0, 0]"
							:padding="[0, 0]">
							<tm-text _class="text-weight-b" _style="line-height:90rpx" @click.stop="cancel"
								:dark="props.dark" :followTheme="false" :userInteractionEnabled="false"
								:label="props.cancelText"></tm-text>
						</tm-sheet>
					</view>
					<view v-if="props.splitBtn && !props.hideCancel" class="overflow" style="width: 24rpx;"></view>
					<view class="flex-1 flex" :class="[okLoading ? 'opacity-5' : '', 'overflow']" style="height:90rpx">
						<tm-sheet paretClass="flex-1" class="flex-1" :dark="props.dark" :followTheme="true" :isDisabledRoundAndriod="true" @click="ok"
							:height="90" :linear="props.okLinear" :linearDeep="props.okLlinearDeep"
							:color="props.okColor" :margin="[0, 0]" :_class="[
								'flex-center overflow',
							]" :paren-class="props.splitBtn ? ('round-' + props.btnRound) : 'round-br-' + props.round" :padding="[0, 0]">
							<view :userInteractionEnabled="false" class="flex flex-row">
								<view v-if="okLoading" class="pr-10">
									<tm-icon :userInteractionEnabled="false" name="tmicon-loading" spin></tm-icon>
								</view>
								<tm-text _class="text-weight-b" :dark="props.dark" :userInteractionEnabled="false"
									:label="props.okText"></tm-text>
							</view>
						</tm-sheet>
					</view>
				</view>
			</view>
		</tm-translate>
	</tm-overlay>
</template>

<script lang="ts" setup>
/**
 * ?????????
 * @description ?????????
 */
import tmTranslate from "../tm-translate/tm-translate.vue";
import tmText from "../tm-text/tm-text.vue";
import tmIcon from "../tm-icon/tm-icon.vue";
import tmOverlay from "../tm-overlay/tm-overlay.vue";
import tmSheet from "../tm-sheet/tm-sheet.vue";
import { getCurrentInstance, computed, ref, provide, inject, onMounted, onUnmounted, nextTick, watch, ComponentInternalInstance } from 'vue';
import { cssstyle, tmVuetify, colorThemeType } from '../../tool/lib/interface';
import { custom_props, computedTheme, computedClass, computedStyle, computedDark } from '../../tool/lib/minxs';
import { useTmpiniaStore } from '../../tool/lib/tmpinia';
const drawerANI = ref<InstanceType<typeof tmTranslate> | null>(null)
const store = useTmpiniaStore();
const props = defineProps({
	...custom_props,
	//??????????????????
	mask: {
		type: [Boolean],
		default: false
	},

	border: {
		type: Number,
		default: 1
	},
	show: {
		type: [Boolean],
		default: false
	},
	width: {
		type: Number,
		default: 600
	},
	height: {
		type: Number,
		default: 450
	},
	round: {
		type: Number,
		default: 12
	},
	//???????????????????????????ms.
	duration: {
		type: Number,
		default: 250
	},
	//??????????????????????????????
	overlayClick: {
		type: Boolean,
		default: true
	},
	transprent: {
		type: [Boolean],
		default: false
	},
	//?????????????????????????????????????????????????????????????????????
	closable: {
		type: [Boolean],
		default: false
	},
	color: {
		type: String,
		default: 'white'
	},
	title: [String],
	okText: {
		type: [String],
		default: "??????"
	},
	okColor: {
		type: [String],
		default: "primary"
	},
	okLinear: {
		type: [String],
		default: '', //left:???->??????right:???->??????top:???->??????bottom:???->??????
	},
	// ???????????????
	okLlinearDeep: {
		type: [String],
		default: 'accent', //light,dark,??????????????????????????????
	},
	cancelColor: {
		type: [String],
		default: "primary"
	},
	cancelText: {
		type: [String],
		default: "??????"
	},
	cancelLinear: {
		type: [String],
		default: '', //left:???->??????right:???->??????top:???->??????bottom:???->??????
	},
	// ???????????????
	cancelLlinearDeep: {
		type: [String],
		default: 'accent', //light,dark,??????????????????????????????
	},
	//??????????????????????????????????????????
	btnRound: {
		type: Number,
		default: 24
	},
	hideCancel: {
		type: [Boolean],
		default: false
	},
	//??????????????????
	splitBtn: {
		type: Boolean,
		default: false
	},
	//??????????????????????????????????????????false??????????????????????????????app???????????????true,??????app???function,??????????????????
	beforeClose: {
		type: Function,
		default: () => {
			return (() => true)
		}
	},
	content: {
		type: String,
		default: ''
	},
	disabled: {
		type: Boolean,
		default: false
	}
});
const emits = defineEmits(['click', 'open', 'close', 'update:show', 'ok', 'cancel']);
const { proxy } = <ComponentInternalInstance>getCurrentInstance();
// ??????????????????????????????????????????
const tmcfg = computed<tmVuetify>(() => store.tmStore);
//??????????????????
const customCSSStyle = computed(() => computedStyle(props));
//?????????
const customClass = computed(() => computedClass(props));
//?????????????????????
const isDark = computed(() => computedDark(props, tmcfg.value));
//????????????
const tmcomputed = computed<cssstyle>(() => computedTheme(props, isDark.value, tmcfg.value));
const syswidth = ref(0);
const sysheight = ref(0);
const reverse = ref(true);
const aniEnd = ref(false);
const flag = ref(false);
const timeid = ref(0);
const okLoading = ref(false);
let _show = ref(props.show);
let { windowWidth, windowHeight, safeArea, statusBarHeight, titleBarHeight } = uni.getSystemInfoSync();
let timerId = NaN;
let timerIdth = NaN
function debounce(func: Function, wait = 500, immediate = false) {
	// ???????????????
	if (!isNaN(timerId)) clearTimeout(timerId);
	// ??????????????????????????????????????????

	if (immediate) {
		var callNow = !timerId;
		timerId = setTimeout(() => {
			timerId = NaN;
		}, wait);

		if (callNow) typeof func === "function" && func();
	} else {
		// ?????????????????????????????????????????????timeout????????????????????????????????????wait???????????????func????????????
		timerId = setTimeout(() => {
			typeof func === "function" && func();
		}, wait);
	}
}
syswidth.value = windowWidth;
sysheight.value = windowHeight;
// #ifdef APP
sysheight.value = safeArea?.height ?? 0;
// #endif
timeid.value = uni.$tm.u.getUid(4)
if (_show.value) {
	reverse.value = false;
}
watch(() => props.show, (val) => {
	_show.value = props.show
	if (val) {
		opens();
	} else {
		close();
	}
})
onMounted(() => opens())

const round_rp = computed(() => {
	return 'round-' + props.round;
})
const reverse_rp = computed(() => {
	if (aniname.value != 'zoom') return reverse.value;
	return !reverse.value;
})
const aniname = computed(() => {
	return "zoom";
})
const anwidth = computed(() => {
	return props.width + 'rpx'
})
const anheight = computed(() => {
	return (props.height) + 'rpx'
})
const contentHeight = computed(() => {
	let bas = 0;
	if (props.splitBtn) {
		bas = uni.upx2px(64)
	}
	return (uni.upx2px(props.height) - 44 - uni.upx2px(90) - bas) + 'px'
})
const align_rp = computed(() => {
	return 'flex-center'
})

async function ok() {
	if (props.disabled) return;
	uni.$tm.u.debounce(async () => {
		if (typeof props.beforeClose === 'function') {
			okLoading.value = true;
			let p = await props.beforeClose();
			if (typeof p === 'function') {
				p = await p();
			}
			okLoading.value = false;
			if (!p) return;
		}
		emits("ok")
		close()
	}, 250, true)
}
function cancel() {
	if (props.disabled) return;
	if (okLoading.value) return;
	emits("cancel")
	close()
}

function OverLayOpen() {
	debounce(() => {
		nextTick(function () {
			if (!proxy.$refs.drawerANI?.play) return;
			flag.value = true;
			proxy.$refs.drawerANI?.play();
			timeid.value = setTimeout(function () {
				emits("open")
				flag.value = false;
			}, props.duration)
		})
	}, 500, true)
}

function open() {
	_show.value = true;
	if (props.disabled) return;
	if (okLoading.value) return;
	if (flag.value) return;
	aniEnd.value = false;
	reverse.value = reverse.value === false ? true : false;
}
function opens() {
	if (props.disabled) return;
	if (okLoading.value) return;
	if (flag.value) return;
	aniEnd.value = false;
	reverse.value = reverse.value === false ? true : false;
}
function animationClose() {
	aniEnd.value = true;
}
//??????????????????????????????
function close() {
	if (props.disabled) return;
	if (flag.value) return;
	closeFun();
}
//???????????????????????????????????????.???????????????????????????
function clickClose(e: Event) {
	if (props.disabled) return;
	if (okLoading.value) return;
	emits('click', e);
	if (flag.value) return;
	if (!props.overlayClick) return;
	closeFun();
}
function closeFun() {
	if (props.disabled) return;

	if (flag.value) return;
	nextTick(function () {
		reverse.value = false;
		if (!proxy.$refs.drawerANI?.play) return;
		flag.value = true;
		nextTick(function () {
			proxy.$refs.drawerANI?.play();
			timeid.value = setTimeout(function () {
				if (aniEnd.value) {
					emits("close")
					emits("update:show", false)
					flag.value = false;
					_show.value = false;
				}
			}, props.duration)
		})

	})
}
//????????????????????????
defineExpose({ close: close, open: opens })
</script>

<style scoped>
.flex-left-custom {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
}

.flex-right-custom {
	display: flex;
	justify-content: flex-start;
	align-items: flex-end;
}

.flex-top-custom {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
}

.flex-end-custom {
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
}

.flex-center-custom {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
}
</style>
