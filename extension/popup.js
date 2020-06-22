let newCodeBtn = document.getElementById('new-room');
let inviteCode = document.getElementById('invite-code');
let joinRoomBtn = document.getElementById('join-room');


newCodeBtn.onclick = () => {
    const code = btoa((Math.random() * 1e6).toString() + (new Date().valueOf()).toString());
    const url = window.location.href.split("#")[0] + "#" + code;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(tabs[0].id, { code: 'window.location.href = window.location.href.split("#")[0] + "#" + "' + code + '";' });
    });
    inviteCode.value = code;
    navigator.clipboard.writeText(url)
};

joinRoomBtn.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(tabs[0].id, { code: 'window.location.href = window.location.href.split("#")[0] + "#" + "' + inviteCode.value + '";' });
    });
};