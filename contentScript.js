function roomId() {
    const parts = window.location.href.split("#");
    if (parts.length > 1) return parts[parts.length - 1];
    else return undefined;
}

function buildState(video, state) {
    return {
        time: new Date().valueOf(),
        state: state,
        current: video.currentTime,
        playing: !video.paused,
        room: roomId()
    }
}

const video = document.getElementsByTagName("video")[0];
video.pause();
video.currentTime = 0;

let lastChange = 0;
const fireEvent = (state) => {
    const opts = buildState(video, state);
    lastChange = opts.time;
    chrome.runtime.sendMessage({ type: 'videoPartyStateChanged', opts });
}
video.onseeked = () => fireEvent("seeked");
video.onpause = () => fireEvent("paused");
video.onplay = () => fireEvent("playing");

chrome.runtime.onMessage.addListener((msg, _, __) => {
    if (msg.type != 'videoPartyStateChangedRecv' || msg.opts.time <= lastChange) return;

    if (msg.opts.state == "playing") video.play();
    if (msg.opts.state == "seeked") video.currentTime = msg.opts.current;
    if (msg.opts.state == "paused") video.pause();
})