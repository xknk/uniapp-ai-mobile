<!--
 * @Author: Robin LEI
 * @Date: 2025-03-17 08:47:50
 * @LastEditTime: 2025-04-03 10:34:55
 * @FilePath: \uniapp\插件模板\前端页面模板\uniapp-ai-mobile\src\App.vue
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
function listenKeyboard() {
    if (
        document.activeElement!.tagName == "INPUT" ||
        document.activeElement!.tagName == "TEXTAREA"
    ) {
        window.setTimeout(function () {
            // @ts-ignore
            (document.activeElement as HTMLElement)?.scrollIntoViewIfNeeded();
        }, 400);
    }
}
onLaunch(() => {});
onShow(async () => {
    if (/android/i.test(navigator.userAgent)) {
        window.addEventListener("resize", listenKeyboard);
    }
});
onHide(() => {
    window.removeEventListener("resize", listenKeyboard);
});
</script>

<style>
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

page {
    background-color: $page-bg;
    -webkit-touch-callout: none !important;
    -webkit-user-select: none;
}

.van-popup.van-popup--round.van-popup--bottom {
    overflow: hidden !important;
}
.van-overlay {
    z-index: 888 !important;
}
.van-dialog {
    z-index: 888 !important;
}
ol {
    list-style-type: decimal !important;
    margin: 10rpx 60rpx !important;
}
ol li p {
    margin: 10rpx 0rpx !important;
}
.uni-popup__wrapper.left,
.uni-popup__wrapper.right {
    padding-top: 0 !important ;
}
uni-textarea {
    font-size: 30rpx !important;
}
uni-input {
    height: 40rpx !important;
}
.head-delect-box .uni-border-left {
    background: rgb(255, 58, 40) !important;
}
.head-delect-box .uni-border-left .uni-dialog-button-text {
    color: #fff !important;
}
.custom-table-wrapper {
    width: 100%;
    overflow: auto;
    border-radius: 20rpx 20rpx 0 0;
    margin: 30rpx 0;
}
.custom-table {
    border-spacing: 0;
    width: 100%;
}
.custom-cell-wrapper {
    min-width: 200rpx;
    text-align: left;
    font-size: 30rpx !important;
}
.custom-cell-wrapper {
    min-width: 200rpx;
    text-align: left;
    padding: 10rpx;
    box-sizing: border-box;
}
.custom-table-wrapper thead {
    background: rgb(137, 133, 193);
    color: #fff;
}
.custom-table-wrapper td {
    border: 1px solid #eee;
    border-bottom: 0;
    border-right: 0;
}
.custom-table {
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
}
</style>
