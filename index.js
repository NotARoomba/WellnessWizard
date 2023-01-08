const { app, BrowserWindow, globalShortcut } = require('electron');

const createWindow = () => {
	const window = new BrowserWindow({
	  width: 800,
	  height: 600,
	  titleBarStyle: 'hidden'
	});
  
	window.loadFile('dist/index.html');
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('browser-window-focus', function () {
    globalShortcut.register('CommandOrControl+R', () => {
		// disable refresh
    });
    globalShortcut.register('F5', () => {
		// disable refresh
    });
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});