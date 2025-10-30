export default defineNuxtConfig({
ssr: true,
app: { head: { titleTemplate: '%s · Demo Site' } },
nitro: { preset: 'node' },
});