import type { PageSchema } from '../../../types';


const pages: Record<string, PageSchema> = {
home: {
slug: 'home',
title: 'Home',
description: 'Demo from GrapesJS',
body: [
{ type: 'Section', children: [
{ type: 'Hero', props: { title: '欢迎使用', subtitle: 'GrapesJS + Nuxt 最小闭环' } },
{ type: 'Grid', children: [
{ type: 'Card', props: { title: '卡片 A', desc: '说明 A' } },
{ type: 'Card', props: { title: '卡片 B', desc: '说明 B' } },
{ type: 'Card', props: { title: '卡片 C', desc: '说明 C' } }
] },
{ type: 'CtaButton', props: { text: '立即开始', href: '#' } }
]}
],
updatedAt: new Date().toISOString()
}
};


export default defineEventHandler((event) => {
const slug = getRouterParam(event, 'slug') || 'home';
return pages[slug] || pages['home'];
});