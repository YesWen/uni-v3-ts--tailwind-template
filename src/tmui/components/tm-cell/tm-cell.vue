<template>
  <view class="relative overflow">
    <tm-sheet @click="cellClick" :color="props.color" :followTheme="props.followTheme" :dark="props.dark"
      :followDark="props.followDark" :round="props.round" :shadow="props.shadow" :outlined="props.outlined"
      :border="props.border" :borderStyle="props.borderStyle" :borderDirection="props.borderDirection"
      :text="props.text" :transprent="props.transprent" :linear="props.linear" :linearDeep="props.linearDeep"
      :width="props.width" :height="props.height" :margin="props.margin" :padding="props.padding"
	  :_class="props._class"
	  :_style="props._style"
      hover-class="opacity-6">
      <view :userInteractionEnabled="true" class="flex flex-row flex-row-center-center"
        :class="[_computedValue.url ? 'url' : '']">
        <view v-if="_computedValue.showAvatar" :style="{
          width: `${_computedValue.avatarSize}rpx`,
          height: `${_computedValue.avatarSize}rpx`,
        }" class="flex flex-row flex-row-center-center">
          <slot name="avatar">
            <tm-image :round="_computedValue.avatarRound" :width="_computedValue.avatarSize"
              :height="_computedValue.avatarSize" :src="_computedValue.avatar"></tm-image>

          </slot>
        </view>


        <view class="flex-3" style="width: 0px">
          <view class="flex flex-5 flex-col" :class="[_computedValue.showAvatar ? 'pl-24' : '']">
            <slot name="title">
              <tm-text :fontSize="_computedValue.titleFontSize" :label="_computedValue.title"></tm-text>
            </slot>
            <slot name="label">
              <view v-if="_computedValue.label" class="mt-6">
                <tm-text :color="_computedValue.labelColor" :fontSize="22" :label="_computedValue.label"></tm-text>
              </view>
            </slot>
          </view>
        </view>
        <view class="flex-1 flex-row flex-row-center-end" style="width: 0px">
          <view class="flex flex-1 flex-row flex-row-center-end pr-12">
            <slot name="rightText">
              <tm-text :color="_computedValue.rightColor" v-if="_computedValue.rightText" :fontSize="_computedValue.rightTextSize"
                :label="_computedValue.rightText"></tm-text>
            </slot>
          </view>
          <slot name="right">
            <tm-icon v-if="_computedValue.rightIcon" _class="opacity-3" :name="_computedValue.rightIcon" :fontSize="22">
            </tm-icon>
          </slot>
        </view>
      </view>
    </tm-sheet>
    <tm-divider v-if="_computedValue.bottomBorder" :margin="[0, 0]" :style="{
      left: `${_computedValue.avatar !== ''
          ? _computedValue.avatarSize + _computedValue.margin[0]
          : 0
        }rpx`,
    }"></tm-divider>
  </view>
</template>

<script lang="ts" setup>
/**
   * ?????????
   * @description ???????????????
   * @example ??????
   * <tm-sheet :round="8" :padding="[0,0]">
      <tm-cell :bottomBorder="false" title="????????????"></tm-cell>
      <tm-cell :bottomBorder="false"  title="????????????"></tm-cell>
      <tm-cell  :bottomBorder="false" title="????????????"></tm-cell>
      <tm-cell :bottomBorder="false"  title="??????" rightText="???????????????">
        <template v-slot:right>
          <tm-checkbox ></tm-checkbox>
        </template>
      </tm-cell>
    </tm-sheet>
   */
import tmSheet from "../tm-sheet/tm-sheet.vue";
import tmText from "../tm-text/tm-text.vue";
import tmIcon from "../tm-icon/tm-icon.vue";
import tmImage from "../tm-image/tm-image.vue";
import tmDivider from "../tm-divider/tm-divider.vue";
import {
  getCurrentInstance,
  computed,
	PropType
} from "vue";
import {
  cssDirection,
} from "../../tool/lib/interface";
import {
  custom_props
} from "../../tool/lib/minxs";
const emits = defineEmits(["click"]);
const props = defineProps({
  ...custom_props,
  shadow: {
    type: [Number],
    default: 0,
  },
  round: {
    type: [Number],
    default: 0,
  },
  margin: {
    type: Array as PropType<Array<number>>,
    default: () => [32, 0],
  },
  padding: {
    type: Array as PropType<Array<number>>,
    default: () => [24, 24],
  },
  height: {
    type: [Number],
    default: 0,
  },
  width: {
    type: [Number],
    default: 0,
  },
  transprent: {
    type: [Boolean],
    default: false,
  },
  color: {
    type: String,
    default: "white",
  },
  //??????
  title: {
    type: String,
    default: "",
  },
  titleFontSize: {
    type: [Number],
    default: 28,
  },
  //?????????????????????
  label: {
    type: String,
    default: "",
  },
  labelColor: {
    type: String,
    default: "grey",
  },
  //????????????
  rightText: {
    type: String,
    default: "",
  },
  rightIcon: {
    type: String,
    default: "tmicon-angle-right",
  },
  //????????????
  rightColor: {
    type: String,
    default: "grey",
  },
  //?????????????????????
  rightTextSize:{
	type: Number,
	default: 24,
  },
  showAvatar: {
    type: Boolean,
    default: false,
  },
  //?????????
  //https://picsum.photos/200
  avatar: {
    type: String,
    default: "",
  },
  avatarSize: {
    type: Number,
    default: 60,
  },
  avatarRound: {
    type: Number,
    default: 10,
  },
  border: {
    type: [Number],
    default: 0,
  },
  borderDirection: {
    type: [String],
    default: cssDirection.bottom,
  },
  //???????????????
  bottomBorder: {
    type: [Boolean],
    default: false,
  },
  //???????????????????????????????????????
  url: {
    type: String,
    default: "",
  },
});
function cellClick(e:any) {
  emits("click", e);
  if (props.url !== '') {
    try {
      uni.navigateTo({
        url: props.url,
        fail(error) {
          console.error("?????????????????????", error);
        },
      });
    } catch (e) {
      //TODO handle the exception
    }
  }
}

const _computedValue = computed(() => props);
</script>

<style scoped>
.url {
  /* #ifndef APP-NVUE */
  cursor: pointer;
  /* #endif */
}
</style>
