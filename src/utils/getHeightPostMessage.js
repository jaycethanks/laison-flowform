export default function () {
  // 给宿主页面发送消息，重新获取iframe 高度
  const parentWindow = window.parent;
  parentWindow && parentWindow.postMessage({ type: 'reGetHeight' }, '*');
}
