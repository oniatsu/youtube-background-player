const { Menu, clipboard } = require('electron');
const menubar = require('menubar');
const storage = require('electron-json-storage');

const isDebuggable = false;

const menubarOptions = {
    icon: __dirname + '/app.png',
    tootip: 'YouTube Background Player',
    width: 412,
    height: 732,
};
if (isDebuggable) {
    menubarOptions.width = 800;
    menubarOptions.height = 800;
}
const mb = menubar(menubarOptions);

mb.on('after-create-window', () => {
    if (isDebuggable) {
        mb.window.openDevTools();
    }
});

mb.on('ready', () => {
    mb.tray.on('right-click', () => {
        storage.get('default', (error, data) => {
            if (error) throw error;

            const template = [{
                    label: 'Play/Pause',
                    click: () => {
                        mb.window.webContents.send('menu-message', {
                            togglePlay: true,
                        });
                    },
                },
                {
                    label: 'Reload',
                    click: () => {
                        mb.window.webContents.send('menu-message', {
                            reload: true,
                        });
                    },
                },
                { type: 'separator' },
                {
                    label: 'Open on browser',
                    click: () => {
                        mb.window.webContents.send('menu-message', {
                            openOnBrowser: true,
                        });
                    },
                },
                {
                    label: "Go to the clipboard's URL page",
                    click: () => {
                        mb.window.webContents.send('menu-message', {
                            goToClipBoardUrlPage: {
                                url: clipboard.readText(),
                            },
                        });
                    },
                },
                {
                    label: "Go to top page",
                    click: () => {
                        mb.window.webContents.send('menu-message', {
                            goToTopPage: true,
                        });
                    },
                },
                { type: 'separator' },
                {
                    label: 'Settings',
                    submenu: [{
                        label: 'Start on history page',
                        type: 'checkbox',
                        checked: data.defaultHistoryPage,
                        click: (menuItem) => {
                            data.defaultHistoryPage = (data.defaultHistoryPage) ? false : true;
                            storage.set('default', data, (error) => {
                                if (error) throw error;
                            });
                        },
                    }, ]
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    click: () => {
                        mb.app.isQuiting = true;
                        mb.app.quit();
                    },
                }
            ];

            const menu = Menu.buildFromTemplate(template)
            mb.tray.popUpContextMenu(menu);
        });
    });

    const template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); } }
        ]
    }, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    }];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});