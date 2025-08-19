import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await i18next.use(Backend).init({
    backend: {
        loadPath: resolve(__dirname, './Locales/{{lng}}.json'),
    },
    fallbackLng: 'az',
    preload: ['en', 'az', 'ru'],
    debug: false,
});

export function t(key, lng = 'az', options = {}) {
    return i18next.getFixedT(lng)(key, options);
}