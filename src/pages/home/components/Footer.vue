<template>
    <div class="footer-box" ref="FooterDom">
        <div v-if="isVoice && !isPc">
            <div v-if="!isCancelVoice" class="voice-info-box">松开发送,上滑取消</div>
            <div v-else class="voice-info-box voice-cancel-box">松开取消</div>
            <Spiral class="spiral-box" />
        </div>
        <div v-else-if="isVoice && isPc" @mousedown="gtouchstartPc">
            <div class="voice-info-box">再次点击停止语音输入</div>
            <Spiral class="spiral-box" />
        </div>
        <div v-else>
            <!--
             -->
            <textarea
                v-if="inputType === 1"
                :focus="InputFocus"
                class="uni-input"
                auto-height
                confirmType="send"
                @confirm="confirmFunc"
                placeholder="有问题,尽管问"
                v-model="contentStr"
            />
            <div
                v-else
                class="voice-button-box"
                @touchstart="gtouchstart"
                @touchmove="gtouchmove"
                @touchend="showDeleteButton"
            >
                按住说话
            </div>
            <div class="option-box">
                <div class="option-item-box">
                    <div
                        :class="`option-item-button-box ${
                            dataType === 1 ? 'selected-button-box' : ''
                        }`"
                        @mousedown="dataTypeFunc($event, 1)"
                        @touchstart="(event) => dataTypeFunc(event, 1)"
                    >
                        <i class="iconfont icon-wenda button-icon-box"></i>
                        <span>智能问答</span>
                    </div>
                    <div
                        :class="`option-item-button-box ${
                            dataType === 2 ? 'selected-button-box' : ''
                        }`"
                        @mousedown="dataTypeFunc($event, 2)"
                        @touchstart="(event) => dataTypeFunc(event, 2)"
                    >
                        <i class="iconfont icon-donghuanwenshu button-icon-box"></i>
                        <span>智能问数</span>
                    </div>
                </div>
                <div class="opton-item-box">
                    <i
                        v-if="
                            inputType === 1 && contentStr == '' && !isStreaming && !isPc
                        "
                        class="iconfont icon-yuyin1"
                        @click="inputTypeFunc(2)"
                    ></i>
                    <i
                        v-else-if="
                            inputType === 1 && contentStr == '' && !isStreaming && isPc
                        "
                        class="iconfont icon-yuyin"
                        @click="gtouchstartPc"
                    ></i>
                    <i
                        v-else-if="inputType === 2 && contentStr == '' && !isStreaming"
                        class="iconfont icon-shuru1"
                        @click="inputTypeFunc(1)"
                    ></i>

                    <i
                        v-else-if="contentStr != '' && !isStreaming"
                        class="iconfont icon-fasongguanli1"
                        @click="confirmFunc"
                    ></i>
                    <i
                        v-else-if="isStreaming"
                        class="iconfont icon-stop-circle"
                        @click="stopSSEFunc()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "Footer",
};
</script>
<script setup lang="ts">
import {
    defineComponent,
    reactive,
    ref,
    toRef,
    toRefs,
    defineProps,
    defineEmits,
    nextTick,
    defineExpose,
} from "vue";
import Spiral from "@/components/spiral.vue";
import { service } from "@/utils/axios";
import { useRecorder } from "@/hooks/useRecord";
import { isPCFunc } from "@/utils/index";
import { Toast } from "vant";
const record: any = useRecorder();
const emits = defineEmits(["pushContentFunc", "stopSSEFunc", "dataTypeFunc"]);
const props = defineProps({
    isStreaming: {
        type: Boolean,
        default: false,
    },
});
const { isStreaming } = toRefs(props);
const contentStr = ref<string>("");
const inputType = ref<number>(1); // 输入框类型 1文本 2语音
const dataType = ref<number>(1); // 数据类型 1智能问答 2智能问数
const isVoice = ref<boolean>(false); // 正在录音
const FooterDom = ref<HTMLElement>();
const InputFocus = ref<boolean>(false);
const isCancelVoice = ref<boolean>(false); // 取消录入语音
const isPc = ref<boolean>(isPCFunc());
const isPcRecording = ref<boolean>(true); // 是否正在录音（pc端使用）
// 定义状态变量
// const mediaRecorder = ref<any>(null);
// const audioChunks = ref<any[]>([]);
/**
 * @description: 切换数据类型
 * @param {*} type 1 2
 * @return {*}
 */
const dataTypeFunc = (event, type) => {
    emits("dataTypeFunc", type);
    dataType.value = type;
    event && event.preventDefault();
};
const inputTypeFunc = async (event: number) => {
    inputType.value = event;
    if (event === 1) {
        InputFocusFunc();
    } else {
        record.requestPermission();
    }
};
let timeOutEvent: any = 0; // 判断是否长按
/**
 * @description: 手指长按录音
 * @param {*} event
 * @return {*}
 */
const gtouchstart = (event) => {
    timeOutEvent = setTimeout(() => {
        longPress();
    }, 500); //这里设置定时器，定义长按500毫秒触发长按事件
    return false;
};

/**
 * @description: pc点击开始录音，再点击完成录音
 * @return {*}
 */
const gtouchstartPc = async () => {
    isVoice.value = !isVoice.value;
    // await record.requestPermission();
    if (isPcRecording.value) {
        record.startRecording();
    } else {
        stopRecording();
    }
    isPcRecording.value = !isPcRecording.value;
    return false;
};
//手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
const showDeleteButton = () => {
    clearTimeout(timeOutEvent); //清除定时器
    isVoice.value = false;
    stopRecording();
    return false;
};
//如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
const gtouchmove = (event) => {
    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const FooterDomRect = FooterDom.value.getBoundingClientRect();
    if (
        currentX < FooterDomRect.left ||
        currentX > FooterDomRect.right ||
        currentY < FooterDomRect.top ||
        currentY > FooterDomRect.bottom
    ) {
        isCancelVoice.value = true;
    } else {
        isCancelVoice.value = false;
    }
    clearTimeout(timeOutEvent); //清除定时器
    timeOutEvent = 0;
};

//真正长按后应该执行的内容
const longPress = () => {
    timeOutEvent = 0;
    startRecording();
};
const confirmFunc = () => {
    emits("pushContentFunc", contentStr.value);
    contentStr.value = "";
};
// 开始录音
const startRecording = async () => {
    isCancelVoice.value = false;
    isVoice.value = true;
    record.startRecording();
};

// 停止录音
const stopRecording = () => {
    const recorder = record.stopRecording();
    if (isCancelVoice.value) {
        recorder.stop(
            (blob) => {
                console.log("录音已取消");
            },
            (error) => {
                Toast.clear();
                console.error("录音停止时出错:", error);
            }
        );
        return;
    }
    Toast.loading({
        message: "正在识别",
        forbidClick: true,
        duration: 0,
    });
    try {
        recorder.stop(
            (blob) => {
                const audioBlob = blob;
                const formDataObj = new FormData();
                formDataObj.append("voice", audioBlob);
                service({
                    url: "/ali/ai/recognize",
                    method: "post",
                    data: formDataObj,
                })
                    .then((res) => {
                        if (res.data && !isPc.value) {
                            emits("pushContentFunc", res.data);
                        } else if (res.data) {
                            contentStr.value = res.data;
                            InputFocusFunc();
                        }
                        Toast.clear();
                    })
                    .finally(() => {
                        Toast.clear();
                    });
            },
            (error) => {
                Toast.clear();
                console.error("录音停止时出错:", error);
            }
        );
    } catch (error) {
        Toast.clear();
        console.error("停止录音时出现异常:", error);
    }
};
const stopSSEFunc = () => {
    emits("stopSSEFunc");
};
/**
 * @description: 聚焦输入框
 * @return {*}
 */
const InputFocusFunc = () => {
    if (InputFocus.value) {
        InputFocus.value = false;
    }
    nextTick(() => {
        InputFocus.value = true;
    });
};
defineExpose({ InputFocusFunc, dataTypeFunc });
</script>
<style scoped>
.footer-box {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-radius: 40rpx 40rpx 0 0;
    padding-top: 20rpx;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
    padding: 20rpx;
    box-sizing: border-box;
    min-height: 200rpx;
    z-index: 2;
    background: #fff;
}
.voice-info-box {
    text-align: center;
    font-size: 30rpx;
    color: #666;
    margin-bottom: 20rpx;
}
.spiral-box {
    transform: scale(0.32);
}
.voice-button-box {
    text-align: center;
    padding-bottom: 20rpx;
    border-bottom: rgba(233, 233, 233, 1) 1rpx solid;
    margin-bottom: 25rpx;
    font-size: 30rpx;
}
.option-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10rpx;
}
.option-item-box {
    display: flex;
    color: #333;
}
.option-item-button-box {
    background: #fff;
    border: #cac2c2 1rpx solid;
    border-radius: 30rpx;
    padding: 10rpx 20rpx;
    font-size: 30rpx;
    margin-right: 20rpx;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.button-icon-box {
    margin-right: 10rpx;
}
.selected-button-box {
    color: rgb(100, 90, 255);
    background: rgba(100, 90, 255, 0.1);
    border: rgba(100, 90, 255, 0.1) 1rpx solid;
}
.icon-zengjia,
.icon-yuyin1,
.icon-shuru1,
.icon-stop-circle,
.icon-fasongguanli1 {
    font-size: 50rpx;
    color: #333;
}
.icon-yuyin1,
.icon-shuru1,
.icon-yuyin {
    margin-right: 20rpx;
    margin-left: 20rpx;
}
.icon-yuyin1,
.icon-yuyin {
    font-size: 53rpx;
}
.icon-fasongguanli1 {
    font-size: 60rpx;
}
.voice-cancel-box {
    color: rgb(168, 64, 64);
}
</style>
<style>
.footer-box .uni-input {
    margin: 10rpx 0 30rpx;
    width: 100%;
    padding: 0 10rpx;
}
</style>
