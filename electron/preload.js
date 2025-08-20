import fs from "fs";
import path, { dirname, join } from "path";
import hbs from "hbs";
import { fileURLToPath } from "url";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { globSync } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viewsDir = join(__dirname, "views");
const renderedDir = join(__dirname, "rendered");

// i18next initialize
await i18next.use(Backend).init({
    backend: { loadPath: path.join(__dirname, "Locales/{{lng}}.json") },
    fallbackLng: "az",
    preload: ["az", "en", "ru"],
    debug: false
});

// HBS helper for i18n
hbs.registerHelper("t", function (key, options) {
    const lang = options?.data?.root?.lang || "az";
    try {
        const t = i18next.getFixedT(lang);
        return t(key);
    } catch (e) {
        console.warn("Translation error:", e);
        return key;
    }
});

// Rendered output dir cleanup
if (fs.existsSync(renderedDir)) {
    fs.rmSync(renderedDir, { recursive: true, force: true });
}
fs.mkdirSync(renderedDir, { recursive: true });

// 🔹 Glob ile tüm Views içindeki partial’ları bul ve register et
const partials = {};
const globPattern = join("**", "*.hbs").replace(/\\/g, "/");
const files = globSync(globPattern, { cwd: viewsDir, posix: true });

files.forEach(file => {
    const parts = file.split("/");
    // Pages ve normal template klasörlerini skip et, sadece partial gibi klasörler register edilecek
    if (["Pages"].includes(parts[0])) return;

    const name = file.replace(/\.hbs$/, "").replace(/\//g, ".");
    const fullPath = join(viewsDir, file);
    const content = fs.readFileSync(fullPath, "utf8");
    hbs.registerPartial(name, content);
    partials[name] = fullPath;
    console.log(`Registered partial: ${name} -> ${fullPath}`);
});

// HTML minify
function minifyHTML(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\n/g, "")
        .replace(/\s\s+/g, " ")
        .replace(/>\s+</g, "><")
        .trim();
}

// Compile all .hbs templates (except partials/components)
// compileAllHBS
function compileAllHBS(srcDir, destDir) {
    fs.readdirSync(srcDir, { withFileTypes: true }).forEach(entry => {
        const srcPath = join(srcDir, entry.name);
        const destPath = join(destDir, entry.name.replace(".hbs", ".html"));

        if (entry.isDirectory()) {
            // Layout altındaki partials dosyalarını atla
            if (entry.name === "Layout") return;

            const newDestDir = join(destDir, entry.name);
            if (!fs.existsSync(newDestDir)) fs.mkdirSync(newDestDir, { recursive: true });
            compileAllHBS(srcPath, newDestDir);
        } else if (entry.isFile() && entry.name.endsWith(".hbs")) {
            const template = fs.readFileSync(srcPath, "utf8");
            const compiled = hbs.compile(template);

            // body HTML
            let htmlBody = compiled({ lang: "az" });

            // Main layout varsa içine gömme
            const layoutPath = join(viewsDir, "Main.hbs");
            if (fs.existsSync(layoutPath)) {
                const layoutTemplate = fs.readFileSync(layoutPath, "utf8");
                const layoutCompiled = hbs.compile(layoutTemplate);
                htmlBody = layoutCompiled({ body: htmlBody, lang: "az", title: entry.name });
            }

            htmlBody = minifyHTML(htmlBody);
            fs.writeFileSync(destPath, htmlBody);
            console.log(`Compiled ${srcPath} -> ${destPath}`);
        }
    });
}


// Run
compileAllHBS(viewsDir, renderedDir);
