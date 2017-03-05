const { ipcRenderer } = require('electron');

onload = () => {
    const target = document.body;
    if (target === null) return;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((addedNode) => {
                if (addedNode.nodeName === "VIDEO") {
                    addedNode.loop = true;
                }
            });
        })
    }).observe(target, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
    });
};

ipcRenderer.on('menu-message', (event, args) => {
    const video = document.querySelector("video");

    if (args.togglePlay) {
        if (video == null) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    } else if (args.openOnBrowser) {
        // TODO: ブラウザで開く
        document.url;
    }
});