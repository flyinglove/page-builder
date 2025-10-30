export type NodeType = 'Section'|'Hero'|'Grid'|'Card'|'CtaButton';
export interface SchemaNode { type: NodeType; props?: Record<string, any>; children?: SchemaNode[] }
export interface PageSchema { slug: string; title?: string; description?: string; body: SchemaNode[]; updatedAt?: string }