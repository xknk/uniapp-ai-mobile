import Clipboard from 'clipboard';
function clipboardSuccess() {
    console.log("复制成功")
    //你可以在这里设置你的提示
}
function clipboardError() {
    console.log("复制失败")
}
export default function handleCopy(text, event, onSuccess, onError) {
    event = event || {};
    const clipboard = new Clipboard(event.target, {
        text: () => text,
    });
    clipboard.on('success', () => {
        onSuccess ? onSuccess() : clipboardSuccess();
        clipboard.off('error');
        clipboard.off('success');
        clipboard.destroy();
    });
    clipboard.on('error', () => {
        onError ? onError() : clipboardError();
        clipboard.off('error');
        clipboard.off('success');
        clipboard.destroy();
    });
    clipboard.onClick(event);
}
