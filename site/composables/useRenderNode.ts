import type { SchemaNode } from '../types';


export function useRenderNode(){
const registry: Record<string, any> = {
Section: resolveComponent('BlocksSection'),
Hero: resolveComponent('BlocksHero'),
Grid: resolveComponent('BlocksGrid'),
Card: resolveComponent('BlocksCard'),
CtaButton: resolveComponent('BlocksCtaButton'),
};


function renderNode(node: SchemaNode){
const Comp = registry[node.type];
if(!Comp) return null;
const children = (node.children || []).map(renderNode);
return h(Comp as any, node.props || {}, children as any);
}


return { renderNode };
}