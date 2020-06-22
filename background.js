chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { pathSuffix: '.mp4' },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});


var firebaseConfig = {
    apiKey: "AIzaSyC1uRrOpHO1RFyD6lg8QVzW8hOY4je1PJU",
    authDomain: "any-video-party.firebaseapp.com",
    databaseURL: "https://any-video-party.firebaseio.com",
    projectId: "any-video-party",
    storageBucket: "any-video-party.appspot.com",
    messagingSenderId: "834224476289",
    appId: "1:834224476289:web:7d0e2b0dc18187dea8fd80"
};
const app = firebase.initializeApp(firebaseConfig);
const appDb = app.database().ref("/rooms");



const applicationState = { roomId: "" };


function updateState(applicationState) {
    // chrome.storage.local.set({ state: JSON.stringify(applicationState) });
}

function newRoom() {
    applicationState.roomId = "vnjogani"; //appDb.push().key;
    updateState(applicationState);
}

function joinRoom(roomId) {
    appDb.child(applicationState.roomId).off()
    applicationState.roomId = roomId;
    updateState(applicationState);

    appDb.child(roomId).on('value', snapshot => {
        chrome.tabs.query({}, function (tabs) {
            for (var tab of tabs) {
                chrome.tabs.sendMessage(tab.id, { type: 'videoPartyStateChangedRecv', opts: snapshot.val() });
            }
        });
    });
}

chrome.runtime.onMessage.addListener((msg, _, __) => {
    if (msg.type != 'videoPartyStateChanged') return;
    if (msg.opts.room) {
        appDb.child(msg.opts.room).set(msg.opts);
        if (applicationState.roomId != msg.opts.room) {
            joinRoom(msg.opts.room)
        }
    }
});
