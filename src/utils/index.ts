export const isPCFunc = () => {
    const userAgentInfo = navigator.userAgent;
    const mobileAgents = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return !mobileAgents.test(userAgentInfo);
};

export const initNumFunc = (num = 0) => {
    return parseInt((num || 0) * 10000) / 10000
}