<template>
    <div class="home-box">
        <HeadDiv
            @newDialogueFunc="newDialogueFunc"
            :sessionId="sessionId"
            @selectHistoryFunc="selectHistoryFunc"
        />
        <ContentDiv
            :currenContentArr="currenContentArr"
            :isThink="isThink"
            :timeNum="timeNum"
            :isStreaming="isStreaming"
            ref="contentDom"
            @resetFunc="resetFunc"
            @pushContentFunc="pushContentFunc"
            :dataType="dataType"
        />
        <FooterDiv
            @pushContentFunc="pushContentFunc"
            @dataTypeFunc="dataTypeFunc"
            :isStreaming="isStreaming"
            @stopSSEFunc="stopSSEFunc"
            ref="footerDom"
        />
    </div>
</template>
<script lang="ts">
export default {
    name: "Home",
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
    watch,
    onUnmounted,
    nextTick,
} from "vue";
import HeadDiv from "./components/Head.vue";
import ContentDiv from "./components/Content.vue";
import FooterDiv from "./components/Footer.vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { service, cancelRequest } from "@/utils/axios";
import { useUserStore } from "@/store/modules/app";
const { getToken } = useUserStore();
const currenContentStr = ref(""); // 当前发送信息
const currenContentArr = ref<any[]>([]); // 当前聊天记录
const isThink = ref<boolean>(false); // 监测是否正在思考
const timeNum = ref(0); // 监测思考时间
const contentDom = ref<any>(); // 内容区域dom
const footerDom = ref<any>(); // 底部区域dom
let timerObj: any = null; // 思考时间定时器
let sessionId = ref<string>(""); // 当前会话id
let index = 0; // 用于生成唯一标识dom
const dataType = ref(1); // 用户发送信息的类型 1:问答 2：问数
const storeDataType = ref(1); // 用户发送信息的类型 1:问答 2：问数(用于判断是否创建新的话题)
const dataTypeFunc = (type: number) => {
    dataType.value = type;
};
const pushContentFunc = (content: string) => {
    if (dataType.value !== storeDataType.value) {
        newDialogueFunc();
        storeDataType.value = dataType.value;
    }
    currenContentStr.value = content;
    currenContentArr.value.push({
        type: "user",
        content,
        refDom: "refDom" + index,
    });
    // contentDom.value.scrollTopFunc('refDom' + index)
    index++;
    const length = currenContentArr.value.length;
    isThink.value = true;
    timeNum.value = 0;
    if (dataType.value === 1) {
        fetchAskDataFunc(length);
    } else {
        fetchChartBiFunc(length);
    }
    timeFunc();
};
// 控制是否正在流式传输的响应式变量
const isStreaming = ref(false);
let abortController;
const fetchAskDataFunc = (length: number, currenStr: string = currenContentStr.value) => {
    abortController = new AbortController();
    const signal = abortController.signal;
    isStreaming.value = true;
    fetchEventSource(`${import.meta.env.VITE_APP_AI_BASE_URL}/ali/ai/streamAsk`, {
        signal,
        method: "POST",
        // retryInterval: 2000,
        headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
            Authorization: getToken,
        },
        body: JSON.stringify({
            question: currenStr,
            sessionId: sessionId.value,
            accountUid: getToken,
        }),
        openWhenHidden: true,
        onmessage: (event) => {
            const data = JSON.parse(event.data);
            sessionId.value = data.sessionId;
            currenContentArr.value[length] = {
                type: "resutl",
                content: data.thoughts[1].response,
                text: data.text,
                finishReason: data.finishReason,
                userContent: currenStr,
                resultContentDom: "resultContent" + length,
                thinkContentDom: "thinkContent" + length,
                timeNum: timeNum.value,
                dataType: "streamAsk",
                ...data,
            };
            if (data.text) {
                isThink.value = false;
                timerObj && clearInterval(timerObj);
            }
        },
        onerror: (error) => {
            timerObj && clearInterval(timerObj);
            isThink.value = false;
            console.error("Fetch event source error:", error);
        },
        onclose() {
            timerObj && clearInterval(timerObj);
            isThink.value = false;
            isStreaming.value = false;
            // 在这里可以添加请求完成后的逻辑
        },
    });
};
const fetchChartBiFunc = (length: number, currenStr: string = currenContentStr.value) => {
    currenContentArr.value[length] = {};
    isStreaming.value = true;
    service({
        url: "/ali/ai/chatBi",
        method: "POST",
        data: {
            question: currenStr,
            sessionId: sessionId.value,
        },
    })
        .then((res) => {
            const { data } = res.data;
            sessionId.value = data.sessionId;
            currenContentArr.value[length] = {
                type: "resutl",
                content: data,
                finishReason: "stop",
                userContent: currenContentStr.value,
                resultContentDom: "resultContent" + length,
                thinkContentDom: "thinkContent" + length,
                timeNum: timeNum.value,
                dataType: "chartBi",
                ...data,
            };
            isThink.value = false;
            isStreaming.value = false;
            timerObj && clearInterval(timerObj);
        })
        .finally(() => {
            isThink.value = false;
            isStreaming.value = false;
            timerObj && clearInterval(timerObj);
        });
};
/**
 * @description: 终止问话
 * @return {*}
 */
const stopSSEFunc = () => {
    if (storeDataType.value === 1 && abortController) {
        // 调用 abort 方法取消请求
        abortController.abort();
    } else {
        cancelRequest("/ali/ai/chatBi");
    }
    isThink.value = false;
    timerObj && clearInterval(timerObj);
    isStreaming.value = false;
};
/**
 * @description: 计时器，思考时间
 * @return {*}
 */
const timeFunc = () => {
    timerObj && clearInterval(timerObj);
    timerObj = setInterval(() => {
        timeNum.value++;
    }, 1000);
};
/**
 * @description: 重新生成
 * @return {*}
 */
const resetFunc = (index: number) => {
    timeFunc();
    isThink.value = true;
    const userContent = currenContentArr.value[index].userContent;
    if (storeDataType.value === 1) {
        currenContentArr.value[index] = {
            type: "resutl",
            content: "",
            text: "",
            finishReason: null,
            userContent: "",
        };
        fetchAskDataFunc(index, userContent);
    } else {
        fetchChartBiFunc(index, userContent);
    }
};
/**
 * @description: 新建对话
 * @return {*}
 */
const newDialogueFunc = () => {
    stopSSEFunc();
    sessionId.value = "";
    currenContentArr.value = [];
    footerDom.value.InputFocusFunc();
    contentDom.value.inputContentFunc();
};
/**
 * @description: 选择历史对话
 * @return {*}
 */
const selectHistoryFunc = ({ dataArr, key, sessionType }) => {
    sessionId.value = key;
    currenContentArr.value = dataArr;
    storeDataType.value = sessionType;
    footerDom.value.dataTypeFunc(undefined, sessionType);
    isThink.value = false;
};
onUnmounted(() => {
    timerObj && clearInterval(timerObj);
});
</script>
<style scoped>
.home-box {
    /* padding: 10rpx; */
    position: relative;
    overflow: auto;
    width: 100%;
    max-width: 800px;
    margin: auto;
}
</style>
