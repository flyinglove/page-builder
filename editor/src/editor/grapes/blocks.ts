export function registerBlocks(editor: any){
const blocks = editor.BlockManager;


// Section 容器
blocks.add('section', {
label: 'Section',
category: 'Layout',
content: `<section class="pb-4 pt-4" data-node="Section"></section>`,
});


// Hero（标题 + 文本）
blocks.add('hero', {
label: 'Hero',
category: 'Content',
content: `<div data-node="Hero" style="padding:48px 16px;text-align:center">
<h1 data-prop="title">你的标题</h1>
<p data-prop="subtitle">你的副标题</p>
</div>`
});


// Grid 容器
blocks.add('grid', {
label: 'Grid',
category: 'Layout',
content: `<div data-node="Grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px"></div>`
});


// Card
blocks.add('card', {
label: 'Card',
category: 'Content',
content: `<div data-node="Card" style="border:1px solid #eee;border-radius:8px;padding:16px">
<h3 data-prop="title">卡片标题</h3>
<p data-prop="desc">卡片描述</p>
</div>`
});


// CTA 按钮
blocks.add('cta', {
label: 'CTA Button',
category: 'Content',
content: `<a data-node="CtaButton" data-prop="text" href="#" style="display:inline-block;padding:10px 16px;border-radius:6px;border:1px solid #222">立即行动</a>`
});
}