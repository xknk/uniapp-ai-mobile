/*
 * @Author: Robin LEI
 * @Date: 2025-04-03 10:32:08
 * @LastEditTime: 2025-04-03 10:53:52
 * @FilePath: \uniapp\插件模板\前端页面模板\uniapp-ai-mobile\src\hooks\useRecord.ts
 */
import { ref, onUnmounted } from 'vue';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/wav';

// 处理旧浏览器兼容性
navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

export function useRecorder() {
    const recorder = ref(null);
    const isRecording = ref(false);
    const audioBlob = ref(null);

    const requestPermission = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                recorder.value = Recorder({
                    type: 'wav',
                    sampleRate: 16000,
                    bitRate: 16,
                    stream
                });
            } else if (navigator.getUserMedia) {
                // 旧浏览器支持
                return new Promise((resolve, reject) => {
                    navigator.getUserMedia({ audio: true }, (stream) => {
                        recorder.value = Recorder({
                            type: 'wav',
                            sampleRate: 16000,
                            bitRate: 16,
                            stream
                        });
                        resolve(true);
                    }, (error) => {
                        console.error('权限请求失败:', error);
                        reject(false);
                    });
                });
            } else {
                console.error('浏览器不支持音频录制');
                return false;
            }
            // 等待 open 方法完成
            await new Promise((resolve, reject) => {
                recorder.value.open(() => {
                    resolve();
                }, (error) => {
                    console.error('打开录音器失败:', error);
                    reject(error);
                });
            });
            return true;
        } catch (error) {
            console.error('权限请求失败:', error);
            return false;
        }
    };

    const startRecording = async () => {
        if (isRecording.value) return;
        const hasPermission = await requestPermission();
        if (hasPermission) {
            try {
                recorder.value.start();
                isRecording.value = true;
            } catch (error) {
                console.error('开始录音失败:', error);
            }
        }
    };

    const stopRecording = () => {
        if (!isRecording.value) return;
        isRecording.value = false;
        return recorder.value
    };

    onUnmounted(() => {
        if (recorder.value) {
            recorder.value.destroy();
            recorder.value = null;
        }
    });

    return {
        isRecording,
        audioBlob,
        requestPermission,
        startRecording,
        stopRecording,
    };
}
    