import electron from "electron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { app, BrowserWindow } = electron;
const __dirname = dirname(fileURLToPath(import.meta.url));

const renderedDir = join(__dirname, "rendered/pages");
const indexFile = join(renderedDir, "Auth/Login.html");

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile(indexFile);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
