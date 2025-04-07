<!--
 * @Author: Robin LEI
 * @Date: 2025-04-03 10:29:35
 * @LastEditTime: 2025-04-03 13:10:25
 * @FilePath: \lg-wms-admind:\uniapp\插件模板\前端页面模板\uniapp-ai-mobile\src\pages\home\components\Content.vue
-->
<template>
    <div
        class="content-box"
        ref="messagesRef"
        @wheel="handleScrollTopFunc"
        @touchmove="handleTouchMoveFunc"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
    >
        <div class="content-empty-box" v-if="currenContentArr.length === 0">
            <div class="empty-title-box">你好~ test AI</div>
            <div class="empty-note-box">
                你身边的工作助手，你可以用我帮你查找知识库以及数据分析~
            </div>
            <div class="empty-prompt-box">你可以这样问</div>
            <div class="empty-info-box" @click="pushContentFunc('今天天气如何')">
                今天天气如何
            </div>
            <div
                class="empty-info-box"
                @click="pushContentFunc('今天几号')"
            >
                今天几号
            </div>
            <div
                class="empty-info-box"
                @click="
                    pushContentFunc(
                        '今天周几'
                    )
                "
            >
                今天周几
            </div>
        </div>
        <div v-else v-for="(item, index) in currenContentArr" :key="index">
            <div
                class="user-box"
                v-if="item.type == 'user'"
                :ref="(el) => (messageRefs[item.refDom] = el)"
            >
                <div class="user-span-box">{{ item.content }}</div>
            </div>
            <div v-else>
                <div v-if="item.dataType == 'streamAsk'">
                    <div class="result-think-box">
                        <span class="result-think-title-box">{{
                            isThink && index === currenContentArr.length - 1
                                ? "思考中"
                                : item.timeNum > 0
                                ? `已深度思考(用时${item.timeNum}秒)`
                                : ""
                        }}</span>
                        <van-loading
                            v-if="isThink && index === currenContentArr.length - 1"
                            color="#0094ff"
                            size="14"
                        />
                    </div>
                    <div class="resutl-box">
                        <pre
                            class="result-span-box"
                            :ref="(el) => (messageRefs[item.thinkContentDom] = el)"
                            >{{ item.content }}</pre
                        >
                    </div>
                    <div
                        class="result-text-box"
                        v-html="markdownIt.render(item.text)"
                        :ref="(el) => (messageRefs[item.resultContentDom] = el)"
                    ></div>
                    <div class="result-icon-box" v-if="!isStreaming">
                        <div class="result-icon-left-box">
                            <div
                                class="result-icon-content-box"
                                @click="resetFunc(index)"
                                v-if="index === currenContentArr.length - 1"
                            >
                                <i class="iconfont icon-shuaxin result-icon-item-box" />
                                <span>重新生成</span>
                            </div>
                            <div
                                class="result-icon-content-box"
                                @click="
                                    (event) =>
                                        copyFunc(
                                            event,
                                            item.thinkContentDom,
                                            item.resultContentDom
                                        )
                                "
                            >
                                <i class="iconfont icon-fuzhi result-icon-item-box" />
                                <span>复制</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="result-think-box">
                        <span class="result-think-title-box">{{
                            isThink && index === currenContentArr.length - 1
                                ? "正在生成结果"
                                : item.timeNum > 0
                                ? `生成结果结束(用时${item.timeNum}秒)`
                                : ""
                        }}</span>
                        <van-loading
                            v-if="isThink && index === currenContentArr.length - 1"
                            color="#0094ff"
                            size="14"
                        />
                    </div>
                    <div class="result-item-step-box" v-if="item.content?.rewrite">
                        <i class="iconfont icon-chenggong"></i>
                        <div>步骤1：问题改写，改写为查看{{ item.content?.rewrite }}</div>
                    </div>
                    <div class="result-item-step-box" v-if="item.content?.selector">
                        <i class="iconfont icon-chenggong"></i>
                        <div>
                            步骤2：数即表选取,选择表为：{{
                                item.content?.selector.join(",")
                            }}
                        </div>
                    </div>
                    <div class="result-item-step-box" v-if="item.content?.evidence">
                        <i class="iconfont icon-chenggong"></i>
                        <div>
                            步骤3：信息推理,本次推理参考业务信息是：{{
                                item.content?.evidence
                            }}
                        </div>
                    </div>
                    <div class="result-item-step-box" v-if="item.content?.sql">
                        <i class="iconfont icon-chenggong"></i>
                        <div>
                            步骤4：正在执行SQL
                            <div>{{ item.content?.sql }}</div>
                        </div>
                    </div>
                    <div class="table-title-box" v-if="item.content?.sqlData">
                        答案已生成
                    </div>
                    <div class="custom-table-wrapper" v-if="item.content?.sqlData">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th
                                        v-for="childItem in item.content?.sqlData?.column"
                                    >
                                        <div class="custom-cell-wrapper">
                                            <strong>{{ childItem }}</strong>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="childItem in item.content?.sqlData?.data">
                                    <td v-for="childItem2 in childItem">
                                        <div class="custom-cell-wrapper">
                                            {{
                                                isNaN(+childItem2)
                                                    ? childItem2
                                                    : initNumFunc(childItem2)
                                            }}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="result-text-box" v-if="item.content?.visualization">
                        {{ item.content?.visualization.text }}
                    </div>
                    <div class="chart-box" v-if="item.content?.visualization">
                        <div class="chart-icon-box">
                            <div
                                @click="changeChartFunc('bar', index)"
                                :class="`chart-icon-item-box ${
                                    selectChart === 'bar'
                                        ? 'select-chart-icon-item-box'
                                        : ''
                                } `"
                            >
                                <i class="iconfont icon-Gc_107_face-BarChart"></i>
                            </div>
                            <div
                                @click="changeChartFunc('line', index)"
                                :class="`chart-icon-item-box ${
                                    selectChart === 'line'
                                        ? 'select-chart-icon-item-box'
                                        : ''
                                } `"
                            >
                                <i class="iconfont icon-a-qushi1"></i>
                            </div>
                            <div
                                @click="changeChartFunc('pie', index)"
                                :class="`chart-icon-item-box ${
                                    selectChart === 'pie'
                                        ? 'select-chart-icon-item-box'
                                        : ''
                                } `"
                            >
                                <i class="iconfont icon-bingzhuangtu"></i>
                            </div>
                        </div>
                        <div class="item-chart-box" :id="'chartRef' + index"></div>
                    </div>
                    <div class="result-icon-box" v-if="!isStreaming">
                        <div class="result-icon-left-box">
                            <div
                                class="result-icon-content-box"
                                @click="resetFunc(index)"
                                v-if="index === currenContentArr.length - 1"
                            >
                                <i class="iconfont icon-shuaxin result-icon-item-box" />
                                <span>重新生成</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="up-box" v-if="isUp">
        <i class="iconfont icon-a-xiazai6" @click="scrollToBottomFunc('click')"></i>
    </div>
</template>
<script lang="ts">
export default {
    name: "Content",
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
    nextTick,
    defineExpose,
    computed,
    onMounted,
    onUnmounted,
} from "vue";
import { useMarkDown } from "@/hooks/useMarkdownIt";
import handleCopy from "@/utils/clipboard";
import { Toast } from "vant";
import echarts from "@/utils/echart";
import { initNumFunc } from "@/utils/index";
const { markdownIt } = useMarkDown();
const emits = defineEmits(["resetFunc", "pushContentFunc"]);
const props = defineProps({
    currenContentArr: {
        default: () => [],
        type: Array,
    },
    isThink: {
        default: false,
        type: Boolean,
    },
    timeNum: {
        default: 0,
        type: Number,
    },
    isStreaming: {
        default: false,
        type: Boolean,
    },
    dataType: {
        default: 1,
        type: Number,
    },
});
const {
    currenContentArr,
    isThink,
    dataType,
}: {
    currenContentArr: any;
    isThink: { value: boolean };
    timeNum: { value: number };
    dataType: { value: number };
} = toRefs(props);
const messagesRef = ref<HTMLElement>(); // 根据结果下滚
const messageRefs = ref<any[]>([]); // 根据用户信息上滚
const lastTouchY = ref(0); // 当前y点
const isScroStop = ref<boolean>(false); //是否停止滚动
const isUp = ref<boolean>(false); // 是否显示下滚
const selectChart = ref("bar");
let arrDom: any = [];
let timer: any = null;
const initScrollToBottomFunc = () => {
    !isUp.value && !isScroStop.value && scrollToBottomFunc();
};
let time = 0;
let storeTime = 0;
const getTimeFunc = () => {
    timer = setInterval(() => {
        storeTime = time;
    }, 1000);
};
getTimeFunc();
watch(
    () => currenContentArr.value,
    () => {
        if (storeTime === time) {
            initScrollToBottomFunc();
        }
        storeTime++;
        if (dataType.value === 2) {
            const index = currenContentArr.value.length - 1;
            nextTick(() => {
                initChartFunc(currenContentArr.value[index].content, "chartRef" + index);
            });
        }
        if (currenContentArr.value.length == 0) {
            arrDom = [];
        }
    },
    {
        deep: true,
    }
);
/**
 * @description: 滚动到最下面
 * @return {*}
 */
const scrollToBottomFunc = (type = "") => {
    if (type === "click") {
        isScroStop.value = false;
    }
    nextTick(() => {
        const messagesContainer = messagesRef.value;
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
};
/**
 * @description: 信息展示在最顶部（暂时无法实现）
 * @param {*} id
 * @return {*}
 */
const scrollTopFunc = async (id) => {
    // await nextTick();
    // const newUserMessage = messageRefs.value[id];
    // if (newUserMessage) {
    //     console.log(newUserMessage, 'newUserMessage', newUserMessage.scrollIntoView)
    //     newUserMessage.scrollIntoView({ behavior: "smooth", block: "start" });
    // }
};

const handleScrollFunc = () => {
    const element = messagesRef.value;
    if (element) {
        // 获取元素的滚动高度
        const scrollHeight = element.scrollHeight;
        // 获取当前滚动条的位置
        const scrollTop = element.scrollTop;
        // 获取元素的可视区域高度
        const clientHeight = element.clientHeight;
        // 判断是否滚动到了底部
        if (scrollTop + clientHeight + 5 >= scrollHeight) {
            isUp.value = false;
            isScroStop.value = false;
            // 在这里可以添加滚动到底部后的逻辑，比如加载更多数据
        } else {
            if (isScroStop.value) {
                isUp.value = true;
            }
        }
    }
};
/**
 * @description: 新输入内容或点击悬浮下键的时候
 * @return {*}
 */
const inputContentFunc = () => {
    isScroStop.value = true;
};
defineExpose({ scrollTopFunc, inputContentFunc });
/**
 * @description: 重新生成
 * @param {*} index
 * @return {*}
 */
const resetFunc = (index: number) => {
    emits("resetFunc", index);
};
/**
 * @description: 复制文本
 * @param {*} event
 * @param {*} thinkContentDom
 * @param {*} resultContentDom
 * @return {*}
 */
const copyFunc = async (event, thinkContentDom, resultContentDom) => {
    let content = "";
    if (messageRefs.value[thinkContentDom]) {
        content = messageRefs.value[thinkContentDom]?.innerText;
    }
    if (messageRefs.value[resultContentDom]) {
        content += "\n" + messageRefs.value[resultContentDom]?.innerText;
    }
    handleCopy(
        content,
        event,
        () => {
            Toast.success("复制成功");
        },
        () => {
            Toast.fail("复制失败");
        }
    );
};
/**
 * @description: 输入消息
 * @param {*} text
 * @return {*}
 */
const pushContentFunc = (text) => {
    isScroStop.value = false;
    emits("pushContentFunc", text);
};

/**
 * @description: 鼠标上滚
 * @return {*}
 */
const handleScrollTopFunc = (event) => {
    if (event.deltaY < 0) {
        isScroStop.value = true;
    }
};
/**
 * @description: 手势上滑
 * @return {*}
 */
const handleTouchMoveFunc = (event) => {
    const messagesContainer = messagesRef.value;
    if (!messagesContainer) return;
    const currentTouchY = event.touches[0].clientY;
    if (currentTouchY > 0 && messagesContainer.scrollTop > 0) {
        isScroStop.value = true;
    }
    lastTouchY.value = event.touches[0].clientY;
};

const startX = ref(0);
const startY = ref(0);
const threshold = 10; // 滑动阈值，可根据需要调整
const handleTouchStart = (event: TouchEvent) => {
    isScroStop.value = true;
    const touch = event.touches[0];
    startX.value = touch.clientX;
    startY.value = touch.clientY;
};

const handleTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - startX.value;
    const deltaY = endY - startY.value;
    const isSliding = Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold;
    if (isSliding) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
        } else {
            isScroStop.value = true;
        }
    } else {
        isScroStop.value = false;
    }
};

const initFunc = () => {
    const element = messagesRef.value;
    if (element) {
        // 添加滚动事件监听器
        element.addEventListener("scroll", handleScrollFunc);
    }
};
const changeChartFunc = (type: string, index: number) => {
    selectChart.value = type;
    initChartFunc(currenContentArr.value[index].content, "chartRef" + index, type);
};
const initChartFunc = (content: any, domName: string, chatType: string = "bar") => {
    let chartDom: any = document.querySelector(`#${domName}`);
    if (chartDom) {
        const chart = echarts.init(chartDom);
        arrDom.push(chart);
        const xAxisKey = content?.visualization?.data?.xAxis[0];
        const yAxisKey = content?.visualization?.data?.yAxis[0];
        let option = {};
        if (chatType === "line" || chatType === "bar") {
            let xAxisData: any = [];
            let yAxisData: any = [];
            content?.sqlData.data.forEach((item) => {
                xAxisData.push(item[xAxisKey]);
                yAxisData.push(initNumFunc(item[yAxisKey]));
            });
            option = {
                title: {
                    text: "",
                },
                tooltip: {
                    trigger: "axis",
                    formatter: "{b0}: {c0}",
                },
                toolbox: {
                    show: false,
                },
                grid: {
                    left: "12%",
                },
                xAxis: {
                    nameTextStyle: {
                        fontSize: 14,
                        color: "#999",
                    },
                    type: "category",
                    data: xAxisData,
                    show: true,
                    name: xAxisKey,
                    nameLocation: "middle",
                    nameGap: 30,
                    axisLabel: {
                        fontSize: 14,
                        color: "#999",
                    },
                },
                yAxis: {
                    show: true,
                    nameTextStyle: {
                        fontSize: 14,
                        color: "#999",
                    },
                    type: "value",
                    name: yAxisKey,
                    axisTick: {
                        inside: true,
                    },
                    scale: true,
                    axisLabel: {
                        fontSize: 14,
                        color: "#999",
                        formatter: function (value, index) {
                            if (value >= 10000 && value < 10000000) {
                                value = value / 10000 + "万";
                            } else if (value >= 10000000) {
                                value = value / 10000000 + "千万";
                            }
                            return value;
                        },
                    },
                },
                series: [
                    {
                        data: yAxisData,
                        type: chatType,
                        itemStyle: {
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: "rgb(158,144,255)", // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: "rgb(136,85,255)", // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                    },
                ],
                dataZoom: {
                    start: 0,
                    end: 100, // 初始显示范围的结束百分比
                    type: "inside",
                    zoomLock: false,
                },
            };
        } else {
            const seriesData = content?.sqlData.data.map((item) => {
                return {
                    name: item[xAxisKey],
                    value: initNumFunc(item[yAxisKey]),
                };
            });
            option = {
                title: {
                    text: "",
                },
                tooltip: {
                    trigger: "item",
                },
                toolbox: {
                    show: true,
                },
                xAxis: {
                    show: false,
                },
                yAxis: {
                    show: false,
                },
                label: {
                    formatter: "{b}\n{c}",
                    lineHeight: 15,
                    fontSize: 14,
                    color: "#999",
                },
                series: [
                    {
                        type: "pie",
                        radius: "50%",
                        data: seriesData,
                    },
                ],
            };
        }
        chart.setOption(option);
    }
};

onMounted(() => {
    window.addEventListener("resize", () => {
        nextTick(() => {
            resizeHandler();
        });
    });
    initFunc();
});
const resizeHandler = () => {
    arrDom.forEach((item) => {
        if (item && item.resize) {
            item.resize();
        }
    });
    // updateFontSize();
};
onUnmounted(() => {
    const element = messagesRef.value;
    if (element) {
        // 移除滚动事件监听器
        element.removeEventListener("scroll", handleScrollFunc);
    }
    window.removeEventListener("resize", resizeHandler);
    clearInterval(timer)
});
// const updateFontSize = () => {
//     if (zgrwczqktance.value) {
//       const windowWidth = window.innerWidth;
//       // 使用平方根计算字体大小，这样在大屏幕下字体可以更大
//       const fontSize = Math.max(12, Math.min(60, Math.sqrt(windowWidth)));
//       const option = {
//         yAxis: {
//           nameTextStyle: {
//             fontSize: fontSize + 'px',
//           },
//           axisLabel: {
//             textStyle: {
//               fontSize: fontSize+'px',
//             },
//           },
//         },
//       };
//       zgrwczqktance.value.setOption(option, true);
//     }
//   };
</script>
<style scoped>
.content-box {
    height: calc(100vh - 80rpx);
    width: 100%;
    padding: 20rpx 20rpx 300rpx 20rpx;
    box-sizing: border-box;
    overflow: auto;
    position: relative;
}
.content-empty-box {
    height: 100%;
    width: 100%;
    padding: 80rpx 20rpx;
    box-sizing: border-box;
}
.empty-title-box {
    font-size: 42rpx;
    font-weight: bold;
    color: #111;
    margin-bottom: 30rpx;
}
.empty-note-box {
    font-size: 30rpx;
    color: rgb(51, 51, 51);
    padding-bottom: 30rpx;
    border-bottom: 1rpx dashed #ddd;
    margin-bottom: 30rpx;
}
.empty-prompt-box {
    font-size: 28rpx;
    color: rgb(91, 91, 91);
    margin-bottom: 30rpx;
}
.empty-info-box {
    font-size: 30rpx;
    color: rgb(71, 71, 71);
    margin-bottom: 30rpx;
    padding: 30rpx;
    border-radius: 20rpx;
    background: rgb(247, 247, 247);
    line-height: 40rpx;
}
.empty-info-box:hover {
    cursor: pointer;
}
.user-box {
    margin-bottom: 20rpx;
    padding: 20rpx;
    font-size: 30rpx;
    color: #888;
    display: flex;
    justify-content: flex-end;
    line-height: 40rpx;
}
.user-span-box {
    background: rgb(247, 247, 247);
    display: inline-block;
    border-radius: 15rpx;
    padding: 20rpx;
}
.result-think-box {
    font-size: 28rpx;
    color: #888;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    line-height: 46rpx;
}
.result-think-title-box {
    margin-right: 10rpx;
}
.resutl-box {
    text-align: left;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    border-left: 1rpx solid #ccc;
    color: #888;
    line-height: 46rpx;
}
.result-span-box {
    padding: 0 20rpx 0;
    border-radius: 15rpx;
    line-height: 40rpx;
}
pre {
    white-space: pre-wrap; /* 保留空白符序列，并正常进行换行 */
    white-space: -moz-pre-wrap; /* 兼容火狐浏览器 */
    white-space: -webkit-pre-wrap; /* 兼容谷歌浏览器 */
    white-space: -o-pre-wrap; /* 兼容opera浏览器 */
    word-wrap: break-word; /* 允许字母、url地址换行 */
}
.result-text-box {
    margin-bottom: 20rpx;
    font-size: 30rpx;
    color: #333;
    line-height: 42rpx;
    padding: 10rpx;
    /* letter-spacing: 2rpx; */
}
.result-icon-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.result-icon-left-box {
    display: flex;
    align-items: center;
}
.result-icon-content-box {
    padding: 10rpx 30rpx;
    border: #eee solid 1rpx;
    border-radius: 50rpx;
    color: #888;
    font-size: 28rpx;
    margin-right: 15rpx;
}
.result-icon-item-box {
    cursor: pointer;
    margin-right: 15rpx;
}
.up-box {
    position: absolute;
    bottom: 250rpx;
    text-align: center;
    width: 100%;
}
.icon-a-xiazai6 {
    font-size: 50rpx;
    cursor: pointer;
    z-index: 2;
}
.icon-a-xiazai6:before {
    content: "\e6f3";
    background: #fff;
    border-radius: 50%;
}
.result-item-step-box {
    margin-bottom: 30rpx;
    background: rgb(249, 250, 255);
    border-radius: 20rpx;
    padding: 20rpx;
    font-size: 30rpx;
    color: #333;
    line-height: 42rpx;
    display: flex;
    align-items: flex-start;
}
.icon-chenggong {
    font-size: 40rpx;
    margin-right: 20rpx;
}
.table-title-box {
    font-size: 30rpx;
    color: #333;
    margin-bottom: 20rpx;
    font-weight: bold;
}
.chart-box {
    width: 100%;
    height: 600rpx;
    margin-bottom: 100rpx;
}
.chart-icon-box {
    display: flex;
    align-items: center;
    color: #333333;
    padding: 15rpx;
}
.chart-icon-item-box {
    cursor: pointer;
}
.chart-icon-item-box {
    border: 1rpx solid #ccc;
    border-right: 0;
    padding: 15rpx 20rpx;
}
.chart-icon-item-box:first-child {
    border-radius: 10rpx 0rpx 0rpx 10rpx;
}
.chart-icon-item-box:last-child {
    border: 1rpx solid #ccc;
    border-radius: 0 10rpx 10rpx 0;
}
.select-chart-icon-item-box {
    color: rgb(102, 94, 255);
    border-color: rgb(102, 94, 255);
}
.item-chart-box {
    height: 100%;
    width: 100%;
}
</style>
