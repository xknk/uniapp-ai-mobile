
import axios from 'axios';
import { Toast } from "vant";
// 创建一个 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_AI_BASE_URL, // 替换为你的 API 基础 URL
    timeout: 600000 // 请求超时时间
});

// 存储所有请求的 AbortController 实例
const controllerMap = new Map();

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 创建 AbortController 实例
        const controller = new AbortController();
        // 将 controller 实例与请求的 URL 关联并存储
        controllerMap.set(config.url, controller);
        // 将 signal 关联到请求配置中
        config.signal = controller.signal;

        // 在发送请求之前做些什么，例如添加 token
        const token = uni.getStorageSync('token');
        if (token) {
            config.headers['Authorization'] = uni.getStorageSync('token');
        }
        return config;
    },
    (error) => {
        Toast.fail(error);
        // 处理请求错误
        console.error('请求出错:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 请求成功后，从存储中移除对应的 AbortController 实例
        controllerMap.delete(response.config.url);
        // 对响应数据做点什么
        const res = response.data;
        if (res.code !== 0) {
            Toast.fail(res.msg || res.message);
            console.error('请求失败:', res.msg);
            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            return res;
        }
    },
    (error) => {
        // 请求出错后，从存储中移除对应的 AbortController 实例
        if (error.config) {
            controllerMap.delete(error.config.url);
        }
        // 处理响应错误
        console.error('响应出错:', error);
        return Promise.reject(error);
    }
);

// 新增终止请求的函数
const cancelRequest = (url) => {
    const controller = controllerMap.get(url);
    if (controller) {
        // 调用 abort 方法终止请求
        controller.abort();
        // 从存储中移除该请求的 AbortController 实例
        controllerMap.delete(url);
    }
};

// 导出 Axios 实例和终止请求的函数
export { service, cancelRequest };    