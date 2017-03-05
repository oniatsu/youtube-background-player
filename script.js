const storage = require('electron-json-storage');
const { ipcRenderer } = require('electron');
const { shell } = require('electron')

const webview = document.getElementById('video');
webview.addEventListener('console-message', function(e) {
    console.log(e.message);
});

const initializePage = () => {
    storage.get('default', (error, data) => {
        if (error) throw error;

        let src;
        if (data.defaultHistoryPage) {
            src = 'https://www.youtube.com/feed/history';
        } else {
            src = 'https://www.youtube.com/';
        }
        webview.src = src;
    });
};

const domReady = () => {
    webview.removeEventListener('dom-ready', domReady);
    initializePage();
};
webview.addEventListener('dom-ready', domReady)

ipcRenderer.on('menu-message', (event, args) => {
    if (args.reload) {
        webview.reload();
    } else if (args.openOnBrowser) {
        shell.openExternal(webview.src);
    } else if (args.goToClipBoardUrlPage) {
        webview.src = args.goToClipBoardUrlPage.url;
    } else if (args.goToTopPage) {
        initializePage();
    } else {
        webview.send('menu-message', args);
    }
});