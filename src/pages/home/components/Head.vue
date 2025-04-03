<template>
    <div class="head-box">
        <i class="iconfont icon-gengduo more-box" @click="toggleFunc('left')"></i>
        <div>TEST AI</div>
        <i class="iconfont icon-duihuakuang more-box" @click="newDialogueFunc"></i>
    </div>
    <view>
        <uni-popup ref="histroyDom" background-color="#fff">
            <div class="histroy-box">
                <div class="histroy-title-box">
                    <div>TEST AI</div>
                    <div>
                        <i
                            class="iconfont icon-sousuo"
                            @click="openSearchFunc('right')"
                        ></i>
                    </div>
                </div>
                <div class="history-new-dialogue-box" @click="newDialogueFunc">
                    <i
                        class="iconfont icon-duihuakuang history-new-dialogue-icon-box"
                    ></i>
                    <span>新建对话</span>
                </div>
                <div class="history-item-box">
                    <div class="history-title-box" v-if="TopupHistroyArr.length > 0">
                        置顶
                    </div>
                    <div
                        :class="`history-content-box ${
                            sessionId === item.sessionId
                                ? 'select-history-content-box'
                                : ''
                        }`"
                        v-for="(item, index) in TopupHistroyArr"
                        :key="index"
                        @click="selectHistoryFunc(item.sessionId, item.sessionType)"
                    >
                        <span>{{ item.title }}</span>
                        <van-popover v-model:show="item.showPopover" :showArrow="false">
                            <div class="option-box">
                                <div
                                    v-for="(childItem, index) in actionsArr"
                                    :class="`option-item-box ${item.class}`"
                                    :key="index"
                                    @click.stop="clickOptionFunc(item, childItem)"
                                >
                                    <i
                                        :class="`iconfont ${
                                            childItem.cancelIcon || childItem.icon
                                        } option-icon-box`"
                                    ></i>
                                    <span>{{
                                        childItem.canceText || childItem.text
                                    }}</span>
                                </div>
                            </div>

                            <template #reference>
                                <div class="history-content-icon-box">
                                    <i
                                        class="iconfont icon-gengduo1"
                                        @click.stop="openOptionFunc(item)"
                                    ></i>
                                </div>
                            </template>
                        </van-popover>
                    </div>
                </div>
                <div class="history-item-box">
                    <div class="history-title-box" v-if="CurrentHistroyArr.length > 0">
                        今天
                    </div>
                    <div
                        :class="`history-content-box ${
                            sessionId === item.sessionId
                                ? 'select-history-content-box'
                                : ''
                        }`"
                        v-for="(item, index) in CurrentHistroyArr"
                        :key="index"
                        @click="selectHistoryFunc(item.sessionId, item.sessionType)"
                    >
                        <span>{{ item.title }}</span>
                        <van-popover v-model:show="item.showPopover" :showArrow="false">
                            <div class="option-box">
                                <div
                                    v-for="(childItem, index) in actionsArr"
                                    :class="`option-item-box ${item.class}`"
                                    :key="index"
                                    @click.stop="clickOptionFunc(item, childItem)"
                                >
                                    <i
                                        :class="`iconfont ${childItem.icon} option-icon-box`"
                                    ></i>
                                    <span>{{ childItem.text }}</span>
                                </div>
                            </div>

                            <template #reference>
                                <div class="history-content-icon-box">
                                    <i
                                        class="iconfont icon-gengduo1"
                                        @click.stop="openOptionFunc(item)"
                                    ></i>
                                </div>
                            </template>
                        </van-popover>
                    </div>
                </div>
                <div class="history-item-box">
                    <div
                        class="history-title-box"
                        v-if="CurrentMonthHistroyArr.length > 0"
                    >
                        本月
                    </div>
                    <div
                        :class="`history-content-box ${
                            sessionId === item.sessionId
                                ? 'select-history-content-box'
                                : ''
                        }`"
                        v-for="(item, index) in CurrentMonthHistroyArr"
                        :key="index"
                        @click="selectHistoryFunc(item.sessionId, item.sessionType)"
                    >
                        <span>{{ item.title }}</span>
                        <van-popover v-model:show="item.showPopover" :showArrow="false">
                            <div class="option-box">
                                <div
                                    v-for="(childItem, index) in actionsArr"
                                    :class="`option-item-box ${item.class}`"
                                    :key="index"
                                    @click.stop="clickOptionFunc(item, childItem)"
                                >
                                    <i
                                        :class="`iconfont ${childItem.icon} option-icon-box`"
                                    ></i>
                                    <span>{{ childItem.text }}</span>
                                </div>
                            </div>

                            <template #reference>
                                <div class="history-content-icon-box">
                                    <i
                                        class="iconfont icon-gengduo1"
                                        @click.stop="openOptionFunc(item)"
                                    ></i>
                                </div>
                            </template>
                        </van-popover>
                    </div>
                </div>
            </div>
        </uni-popup>
    </view>
    <view>
        <uni-popup ref="searchDom" background-color="#fff" :mask-click="false">
            <div class="search-box">
                <van-search
                    v-model="searchValue"
                    show-action
                    placeholder="请输入搜索关键词(点击回车搜索)"
                    @search="searchFunc"
                    @cancel="onCancelFunc"
                    :clearable="false"
                >
                </van-search>
                <div class="search-list-box">
                    <div
                        v-for="item in SearchHistoryAllArr"
                        :key="item.sessionId"
                        class="search-item-box"
                        @click="selectHistoryFunc(item.sessionId, item.sessionType)"
                    >
                        <div class="search-item-title-box">{{ item.title }}</div>
                        <div>
                            <span v-if="item.sessionType === 1">智能问答 </span>
                            <span v-else>智能问数</span>
                            <span class="search-item-time-box">{{
                                item.updateTime
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </uni-popup>
    </view>
    <view>
        <uni-popup ref="inputDialog" type="dialog">
            <uni-popup-dialog
                ref="inputClose"
                mode="input"
                title="输入内容"
                :value="titleValue"
                placeholder="请输入内容"
                @confirm="inputConfirmFunc"
            ></uni-popup-dialog>
        </uni-popup>
    </view>
    <div class="head-delect-box">
        <uni-popup ref="alertDialog" type="dialog">
            <uni-popup-dialog
                :type="'error'"
                cancelText="取消"
                confirmText="删除"
                title="确认删除"
                content="该对话内容将被删除无法恢复"
                @confirm="deleteFunc"
            ></uni-popup-dialog>
            <!-- @close="dialogClose" -->
        </uni-popup>
    </div>
</template>
<script lang="ts">
export default {
    name: "Head",
};
</script>
<script setup lang="ts">
import { ref, toRefs, defineProps, defineEmits, watch } from "vue";
import { service } from "@/utils/axios";
import { Toast } from "vant";
const props = defineProps({
    contentStoreObj: {
        type: Object,
        defalut: () => {},
    },
    sessionId: {
        type: String,
        defalut: "",
    },
});
const inputDialog = ref<any>();
const alertDialog = ref<any>();
const { sessionId }: any = toRefs(props);
const CurrentHistroyArr = ref<any[]>([]); // 今天的历史记录
const TopupHistroyArr = ref<any[]>([]); // 置顶的历史记录
const CurrentMonthHistroyArr = ref<any[]>([]); // 当月的历史记录
const SearchHistoryAllArr = ref<any[]>([]); // 所有的历史记录
const searchValue = ref(""); // 搜索的值
const actionsArr = ref([
    { text: "重命名", icon: "iconfont icon-zhongmingming", type: "rename" },
    {
        text: "置顶",
        canceText: "取消置顶",
        icon: "icon-zhiding",
        cancelIcon: "icon-quxiaozhiding1",
        type: "top",
    },
    {
        text: "删除",
        icon: "icon-shanchu icon-shanchu",
        class: "option-delete-box",
        type: "delete",
    },
]);
const emits = defineEmits(["newDialogueFunc", "selectHistoryFunc"]);
const titleValue = ref(""); // 重命名的title
/**
 * @description: 初始化历史记录
 * @param {*} eventObj
 * @return {*}
 */
const initHistroyFunc = async () => {
    const dataArr = await getPageFunc();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    // 置顶数据
    TopupHistroyArr.value = dataArr.filter((item) => {
        if (item.isTop) {
            return {
                title: item.title,
                sessionId: item.sessionId,
                sort: new Date(item.createTime),
                showPopover: false,
                ...item,
            };
        }
    });
    // 当天数据
    CurrentHistroyArr.value = dataArr.filter((item) => {
        const [datePart] = item.updateTime.split(" ");
        const [year, month, day] = datePart.split("-").map(Number);
        if (
            !item.isTop &&
            year === currentYear &&
            month === currentMonth &&
            day === currentDay
        ) {
            return {
                title: item.title,
                sessionId: item.sessionId,
                sort: new Date(item.createTime),
                showPopover: false,
                ...item,
            };
        }
    });
    // 筛选当月（不包含当天）数据
    CurrentMonthHistroyArr.value = dataArr.filter((item) => {
        const [datePart] = item.updateTime.split(" ");
        const [year, month, day] = datePart.split("-").map(Number);
        if (
            !item.isTop &&
            year === currentYear &&
            month === currentMonth &&
            day !== currentDay
        ) {
            return {
                title: item.title,
                sessionId: item.sessionId,
                sort: new Date(item.createTime),
                showPopover: false,
                ...item,
            };
        }
    });
};
const histroyDom = ref<any>(null);
const searchDom = ref<any>(null);
/**
 * @description: 新建对话
 * @return {*}
 */
const newDialogueFunc = () => {
    emits("newDialogueFunc");
    onCancelFunc();
};
/**
 * @description: 打开历史记录
 * @param {*} type
 * @return {*}
 */
const toggleFunc = (type: string) => {
    initHistroyFunc();
    histroyDom.value.open(type);
};
/**
 * @description: 获取历史列表
 * @return {*}
 */
const getPageFunc = (searchText: string | undefined = undefined) => {
    return service({
        url: "/session/page",
        method: "post",
        data: {
            pageSize: 100,
            pageNum: 1,
            searchText,
        },
    })
        .then((res) => {
            return res?.data?.records || [];
        })
        .finally(() => {});
};
const openSearchFunc = (type) => {
    SearchHistoryAllArr.value = [];
    searchValue.value = "";
    searchDom.value.open(type);
};
const searchFunc = async (value) => {
    const dataArr = await getPageFunc(value);
    SearchHistoryAllArr.value = dataArr.map((item) => {
        return {
            title: item.title,
            sessionId: item.sessionId,
            sort: new Date(item.createTime),
            showPopover: false,
            ...item,
        };
    });
};
const onCancelFunc = () => {
    searchDom.value.close();
    histroyDom.value.close();
};
/**
 * @description: 选择对话
 * @param {*} key
 * @return {*}
 */
const selectHistoryFunc = async (sessionId, sessionType) => {
    let dataArr: any = [];
    if (sessionType === 1) {
        dataArr = await initStreamAskFunc(sessionId);
    } else {
        dataArr = await initChartBiFunc(sessionId);
    }
    emits("selectHistoryFunc", {
        dataArr,
        key: sessionId,
        sessionType: sessionType,
    });
    onCancelFunc();
};
const initStreamAskFunc = (sessionId: string) => {
    return service({
        url: "/session/record/queryRagResult",
        method: "post",
        data: {
            sessionId,
        },
    })
        .then((res) => {
            let dataArr: any = [];
            res.data.forEach((item, index) => {
                dataArr.push({
                    type: "user",
                    refDom: "refDom" + index,
                    content: item.question,
                });
                dataArr.push({
                    type: "resutl",
                    content: item.thought,
                    text: item.result,
                    finishReason: "stop",
                    userContent: item.question,
                    resultContentDom: "resultContent" + (index + 1),
                    thinkContentDom: "thinkContent" + (index + 1),
                    timeNum: 0,
                    dataType: "streamAsk",
                    ...item
                });
            });
            return dataArr;
        })
        .finally(() => {});
};
const initChartBiFunc = (sessionId: string) => {
    return service({
        url: "/session/record/queryGbiResult",
        method: "post",
        data: {
            sessionId,
        },
    })
        .then((res) => {
            let dataArr: any = [];
            res.data.forEach((item, index) => {
                dataArr.push({
                    type: "user",
                    refDom: "refDom" + index,
                    content: item.question,
                });
                dataArr.push({
                    type: "resutl",
                    content: item.gbiResponse.data,
                    finishReason: "stop",
                    userContent: item.question,
                    resultContentDom: "resultContent" + length,
                    thinkContentDom: "thinkContent" + length,
                    timeNum: 0,
                    dataType: "chartBi",
                    ...item
                });
            });
            return dataArr;
        })
        .finally(() => {});
};
/**
 * @description: 打开操作
 * @param {*} event
 * @param {*} index
 * @return {*}
 */
const openOptionFunc = (event) => {
    event.showPopover = !event.showPopover;
};
let delId: string | number = ""; // 删除的id
let delSessionId: string = ""; //
/**
 * @description: 选择操作
 * @param {*} event
 * @param {*} childEvent
 * @return {*}
 */
const clickOptionFunc = (event, childEvent) => {
    event.showPopover = false;
    delId = event.id;
    delSessionId = event.sessionId;
    if (childEvent.type === "rename") {
        titleValue.value = event.title;
        inputDialog.value.open();
    } else if (childEvent.type === "top") {
        upTopFunc(event);
    } else if (childEvent.type === "delete") {
        // 若您之前主动分享过该对话，分享链接也将一并被删除。
        alertDialog.value.open();
    }
};
/**
 * @description: 删除对话
 * @return {*}
 */
const deleteFunc = async () => {
    service({
        url: "/session/deleteHistory",
        method: "post",
        data: {
            id: delId,
        },
    }).then((res) => {
        Toast.success("删除成功");
        alertDialog.value.close();
        initHistroyFunc();
        if (delSessionId === sessionId.value) {
            emits("newDialogueFunc");
        }
    });
};
/**
 * @description: 重命名对话输入框确定
 * @param {*} val
 * @return {*}
 */
const inputConfirmFunc = (val) => {
    service({
        url: "/session/modifyHistoryName",
        method: "post",
        data: {
            id: delId,
            title: val,
        },
    }).then((res) => {
        Toast.success("修改成功");
        initHistroyFunc();
    });
};
/**
 * @description: 置顶
 * @return {*}
 */
const upTopFunc = ({ isTop }) => {
    service({
        url: "/session/setTop",
        method: "post",
        data: {
            id: delId,
            isTop: isTop ? 0 : 1,
        },
    }).then((res) => {
        initHistroyFunc();
    });
};
</script>
<style scoped>
.head-box {
    height: 80rpx;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    color: #333333;
    font-size: 36rpx;
    padding: 20rpx;
    box-sizing: border-box;
}
.histroy-title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30rpx;
    color: #888;
    margin-bottom: 30rpx;
}
.icon-sousuo {
    font-size: 35rpx;
    cursor: pointer;
}
.more-box {
    font-size: 50rpx;
    cursor: pointer;
}
.option-box {
    /* padding: 30rpx 0; */
    font-size: 28rpx;
}

.option-item-box {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 30rpx 20rpx;
    border-bottom: 1px solid #eee;
    min-width: 180rpx;
}
.option-icon-box {
    margin-right: 20rpx;
}
.option-delete-box {
    color: rgb(224, 95, 95);
}
.histroy-box {
    width: 80vw;
    max-width: 300px;
    padding: 30rpx 20rpx;
    box-sizing: border-box;
    height: calc(100vh - 80rpx);
    overflow: auto;
}
.history-new-dialogue-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15rpx;
    box-sizing: border-box;
    border: 1rpx solid rgb(247, 247, 247);
    border-radius: 20rpx;
    background: rgb(247, 247, 247);
    font-size: 30rpx;
    color: #333;
}
.history-new-dialogue-icon-box {
    font-size: 40rpx;
    color: #888;
    margin-right: 20rpx;
}
.history-content-icon-box {
    transform: rotate(90deg);
}
.icon-gengduo1 {
    font-size: 40rpx;
    color: #888;
}
.history-item-box {
    padding-top: 30rpx;
    font-size: 30rpx;
    color: #666;
}
.history-item-box:hover {
    cursor: pointer;
}
.history-title-box {
    margin-bottom: 20rpx;
}
.history-content-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    box-sizing: border-box;
    /* background: rgb(247, 247, 247); */
    border-radius: 20rpx;
    margin-bottom: 20rpx;
}
.select-history-content-box {
    background: rgb(247, 247, 247);
}
.search-action-box {
    display: flex;
    align-items: center;
}
.search-action-text-box {
    margin-left: 20rpx;
    font-size: 30rpx;
    color: #888;
}
.search-box {
    width: 100vw;
    max-width: 1300rpx;
    padding: 20rpx 20rpx;
    box-sizing: border-box;
}
.search-list-box {
    height: calc(100vh - 158rpx);
    overflow: auto;
}
.search-item-box {
    padding: 10px 20px;
    /* background: #eee; */
    margin-bottom: 10px;
    border-radius: 10px;
    font-size: 30rpx;
    color: #888;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}
.search-item-title-box {
    margin-bottom: 20rpx;
}
.search-item-time-box {
    margin-left: 10rpx;
}
</style>
