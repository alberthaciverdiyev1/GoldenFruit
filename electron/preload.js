import fs from "fs";
import path from "path";
import hbs from "hbs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viewsDir = join(__dirname, "views");
const renderedDir = join(__dirname, "rendered");

// i18next initialize
await i18next.use(Backend).init({
    backend: { loadPath: path.join(__dirname, "Locales/{{lng}}.json") },
    fallbackLng: "az",
    preload: ["az","en","ru"],
    debug: false
});

// HBS helper
hbs.registerHelper('t', function (key, options) {
    const lang = options?.data?.root?.lang || 'az';
    try {
        const t = i18next.getFixedT(lang);
        return t(key);
    } catch (e) {
        console.warn('Translation error:', e);
        return key;
    }
});

if (fs.existsSync(renderedDir)) {
    fs.rmSync(renderedDir, { recursive: true, force: true });
}
fs.mkdirSync(renderedDir, { recursive: true });

function registerPartials(baseDir, prefix = "") {
    if (!fs.existsSync(baseDir)) return;

    fs.readdirSync(baseDir, { withFileTypes: true }).forEach(entry => {
        const fullPath = join(baseDir, entry.name);
        if (entry.isDirectory()) {
            const newPrefix = prefix ? `${prefix}.${entry.name}` : entry.name;
            registerPartials(fullPath, newPrefix);
        } else if (entry.isFile() && entry.name.endsWith(".hbs")) {
            const name = prefix ? `${prefix}.${path.parse(entry.name).name}` : path.parse(entry.name).name;
            const content = fs.readFileSync(fullPath, "utf8");
            hbs.registerPartial(name, content);
            console.log(`Registered partial: ${name} -> ${fullPath}`);
        }
    });
}

["partials","components"].forEach(subDir => {
    registerPartials(join(viewsDir, subDir));
});

function minifyHTML(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\n/g, '')
        .replace(/\s\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
}

// recursive HBS compile
function compileAllHBS(srcDir, destDir) {
    fs.readdirSync(srcDir, { withFileTypes: true }).forEach(entry => {
        const srcPath = join(srcDir, entry.name);
        const destPath = join(destDir, entry.name.replace(".hbs",".html"));

        if (entry.isDirectory()) {
            const newDestDir = join(destDir, entry.name);
            if (!fs.existsSync(newDestDir)) fs.mkdirSync(newDestDir, { recursive: true });
            compileAllHBS(srcPath, newDestDir);
        } else if (entry.isFile() && entry.name.endsWith(".hbs")) {
            const template = fs.readFileSync(srcPath,"utf8");
            const compiled = hbs.handlebars.compile(template);
            let html = compiled({ title:"Electron + HBS", heading:entry.name, lang:"az" });
            html = minifyHTML(html);
            fs.writeFileSync(destPath, html);
            console.log(`Compiled ${srcPath} -> ${destPath}`);
        }
    });
}

compileAllHBS(viewsDir, renderedDir);
