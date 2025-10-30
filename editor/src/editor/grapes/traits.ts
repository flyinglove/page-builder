export function registerTraits(editor: any){
editor.on('component:selected', (cmp: any) => {
const type = cmp.getAttributes()['data-node'];
if(!type) return;


const traits: any[] = [];
// 通用可见性（断点示例：移动端隐藏）
traits.push({ type: 'checkbox', name: 'hideOnMobile', label: '移动端隐藏' });


// 按节点类型暴露可配属性
if(type === 'Hero'){
traits.push({ type: 'text', name: 'title', label: '标题', changeProp: 1 });
traits.push({ type: 'text', name: 'subtitle', label: '副标题', changeProp: 1 });
}
if(type === 'Card'){
traits.push({ type: 'text', name: 'title', label: '标题', changeProp: 1 });
traits.push({ type: 'text', name: 'desc', label: '描述', changeProp: 1 });
}
if(type === 'CtaButton'){
traits.push({ type: 'text', name: 'text', label: '按钮文案', changeProp: 1 });
traits.push({ type: 'text', name: 'href', label: '链接', changeProp: 1 });
}


cmp.set({ traits });
});
}