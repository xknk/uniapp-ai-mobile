<template>
    <div class="mainBox">
        <div class="spiral1" ref="spiralBox1">
            <div class="spiral_section" v-for="(item, i) in 20" :key="i">
                <div
                    class="node top"
                    :style="{
                        animationDelay: `${-(i * 300)}ms`,
                    }"
                ></div>
                <div
                    class="node bottom"
                    :style="{
                        animationDelay: `${-(i * 300)}ms`,
                    }"
                ></div>
            </div>
        </div>
        <div class="spiral2" ref="spiralBox2"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const spiralBox1 = ref(null);
const spiralBox2 = ref(null);
const len = ref(200);
onMounted(() => {});
</script>

<style scoped>
.mainBox {
    position: relative;
    width: 100%;
    height: 100%;
}
/* 横向 */
.spiral1 {
    position: fixed;
    width: 100%;
    height: 250rpx;
    text-align: center;
    overflow: hidden;
}

.spiral_section {
    position: relative;
    margin: 0 5rpx;
    width: 50rpx;
    height: 250rpx;
    display: inline-block;
}

.spiral_section .node {
    position: absolute;
    top: 0;
    left: 0;
    width: 50rpx;
    height: 50rpx;
    border-radius: 100%;
    background: #ee0ab5;
    -webkit-animation: 4s topNode ease-in-out infinite;
    animation: 4s topNode ease-in-out infinite;
}

@-webkit-keyframes topNode {
    0% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        top: 0;
        z-index: 10;
        opacity: 0.75;
    }

    25% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }

    50% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        top: 200px;
        z-index: 0;
        opacity: 0.75;
    }

    75% {
        -webkit-transform: scale(0.25);
        transform: scale(0.25);
        opacity: 0.5;
    }

    100% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        top: 0;
        opacity: 0.75;
    }
}

@keyframes topNode {
    0% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        top: 0;
        z-index: 10;
        opacity: 0.75;
    }

    25% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }

    50% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        top: 200rpx;
        z-index: 0;
        opacity: 0.75;
    }

    75% {
        -webkit-transform: scale(0.25);
        transform: scale(0.25);
        opacity: 0.5;
    }

    100% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        top: 0;
        opacity: 0.75;
    }
}

.spiral_section .node.bottom {
    top: auto;
    bottom: 0;
    background: #5a8ff1;
    -webkit-animation: 4s bottomNode ease-in-out infinite;
    animation: 4s bottomNode ease-in-out infinite;
}

@-webkit-keyframes bottomNode {
    0% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        bottom: 0;
        opacity: 0.75;
    }

    25% {
        -webkit-transform: scale(0.25);
        transform: scale(0.25);
        opacity: 0.5;
    }

    50% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        bottom: 200rpx;
        opacity: 0.75;
    }

    75% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }

    100% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        bottom: 0;
        opacity: 0.75;
    }
}

@keyframes bottomNode {
    0% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        bottom: 0;
        opacity: 0.75;
    }

    25% {
        -webkit-transform: scale(0.25);
        transform: scale(0.25);
        opacity: 0.5;
    }

    50% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        bottom: 200rpx;
        opacity: 0.75;
    }

    75% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }

    100% {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        bottom: 0;
        opacity: 0.75;
    }
}
</style>
