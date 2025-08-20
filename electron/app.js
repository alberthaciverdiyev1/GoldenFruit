    // app.js
    import { app, BrowserWindow, protocol } from "electron";
    import path, { dirname, join } from "path";
    import { fileURLToPath } from "url";

    const __dirname = dirname(fileURLToPath(import.meta.url));

    const renderedDir = join(__dirname, "rendered/Pages");
    const indexFile = join(renderedDir, "Auth/Login.html");

    const isDev = process.env.NODE_ENV === "development";

    function createWindow() {
        const win = new BrowserWindow({
            width: 1920,
            height: 1080,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        win.loadFile(indexFile);

        if (isDev) {
            win.webContents.openDevTools();
        }
    }

    app.whenReady().then(() => {
        protocol.registerFileProtocol("app", (request, callback) => {
            const url = request.url.replace("app://", "");
            const filePath = join(__dirname, "public", url);

            if (isDev) {
                console.log("Serving asset:", filePath);
            }

            callback({ path: filePath });
        });

        createWindow();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
