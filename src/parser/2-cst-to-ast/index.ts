import sourceToCST, {
  ConcreteAttributeNode,
  ConcreteElementOpeningTagNode,
  ConcreteElementSelfClosingTagNode,
  ConcreteLiquidDropNode,
  ConcreteNode,
  ConcreteNodeTypes,
  ConcreteTextNode,
} from '../1-source-to-cst';
import { UnknownConcreteNodeTypeError } from '../errors';
import ASTBuilder from './ast-builder';

export type BasicNode<T> = {
  type: T;
  locStart: number;
  locEnd: number;
  source: string;
};

export enum NodeTypes {
  TextNode = 'TextNode',

  LiquidDropNode = 'LiquidDropNode',

  ElementNode = 'ElementNode',

  AttributeDoubleQuoted = 'AttributeDoubleQuoted',
  AttributeSingleQuoted = 'AttributeSingleQuoted',
  AttributeUnquoted = 'AttributeUnquoted',
  AttributeEmpty = 'AttributeEmpty',
}

export type TextNode = {
  value: string;
} & BasicNode<NodeTypes.TextNode>;

export type LiquidDropNode = {
  value: string;
} & BasicNode<NodeTypes.LiquidDropNode>;

export type LiquidXNode = TextNode | LiquidDropNode | ElementNode | AttributeNode;

export type ElementNode = {
  name: string;
  source: string;
  attributes: AttributeNode[];
  children: LiquidXNode[];
} & BasicNode<NodeTypes.ElementNode>;

export type AttributeNode =
  | AttributeDoubleQuoted
  | AttributeSingleQuoted
  | AttributeUnquoted
  | AttributeEmpty;

export type AttributeNodeBase<T> = {
  name: TextNode;
  value: TextNode | LiquidDropNode;
} & BasicNode<T>;

export type AttributeDoubleQuoted = {} & AttributeNodeBase<NodeTypes.AttributeDoubleQuoted>;
export type AttributeSingleQuoted = {} & AttributeNodeBase<NodeTypes.AttributeSingleQuoted>;
export type AttributeUnquoted = {} & AttributeNodeBase<NodeTypes.AttributeUnquoted>;
export type AttributeEmpty = { name: TextNode } & BasicNode<NodeTypes.AttributeEmpty>;

function toTextNode(node: ConcreteTextNode): TextNode {
  return {
    type: NodeTypes.TextNode,
    locStart: node.locStart,
    locEnd: node.locEnd,
    source: node.source,
    value: node.value,
  };
}

function toLiquidDropNode(node: ConcreteLiquidDropNode): LiquidDropNode {
  return {
    type: NodeTypes.LiquidDropNode,
    locStart: node.locStart,
    locEnd: node.locEnd,
    source: node.source,
    value: node.value,
  };
}

function toElementNode(
  node: ConcreteElementOpeningTagNode | ConcreteElementSelfClosingTagNode,
): ElementNode {
  return {
    type: NodeTypes.ElementNode,
    locStart: node.locStart,
    locEnd: node.locEnd,
    name: node.name,
    source: node.source,
    attributes: toAttributes(node.attributes),
    children: [],
  };
}

function toAttributes(attributes: ConcreteAttributeNode[]) {
  return cstToAST(attributes) as AttributeNode[];
}

function toAttributeValue(value: ConcreteTextNode | ConcreteLiquidDropNode) {
  return cstToAST([value])[0] as TextNode | LiquidDropNode;
}

function isAttributeNode(node: any): boolean {
  return (
    node.type === ConcreteNodeTypes.AttributeDoubleQuoted ||
    node.type === ConcreteNodeTypes.AttributeSingleQuoted ||
    node.type === ConcreteNodeTypes.AttributeUnquoted ||
    node.type === ConcreteNodeTypes.AttributeEmpty
  );
}

function cstToAST(cst: ConcreteNode[] | ConcreteAttributeNode[]) {
  if (cst.length === 0) return [];

  const astBuilder = new ASTBuilder(cst[0].source);

  for (let i = 0; i < cst.length; i += 1) {
    const node = cst[i];
    const prevNode = cst[i - 1];

    // Add whitespaces and linebreaks that went missing after parsing. We don't need to do this
    // if the node is an attribute since whitespaces between attributes is not important to preserve.
    // In fact it would probably break the rendered output due to unexpected text nodes.
    // TODO: This should be handled in the grammar/source-to-cst part instead (if possible).
    if (prevNode?.source && !isAttributeNode(node)) {
      const diff = node.locStart - prevNode.locEnd;

      if (diff > 0) {
        astBuilder.push(
          toTextNode({
            type: ConcreteNodeTypes.TextNode,
            locStart: prevNode.locEnd,
            locEnd: node.locStart,
            source: node.source,
            value: prevNode.source.slice(prevNode.locEnd, node.locStart),
          }),
        );
      }
    }

    switch (node.type) {
      case ConcreteNodeTypes.TextNode: {
        astBuilder.push(toTextNode(node));

        break;
      }

      case ConcreteNodeTypes.LiquidDropNode: {
        astBuilder.push(toLiquidDropNode(node));
        break;
      }

      case ConcreteNodeTypes.ElementOpeningTag: {
        astBuilder.open(toElementNode(node));

        break;
      }

      case ConcreteNodeTypes.ElementClosingTag: {
        astBuilder.close(node, NodeTypes.ElementNode);

        break;
      }

      case ConcreteNodeTypes.ElementSelfClosingTag: {
        astBuilder.open(toElementNode(node));
        astBuilder.close(node, NodeTypes.ElementNode);

        break;
      }

      case ConcreteNodeTypes.AttributeDoubleQuoted:
      case ConcreteNodeTypes.AttributeSingleQuoted:
      case ConcreteNodeTypes.AttributeUnquoted: {
        const attributeNode: AttributeDoubleQuoted | AttributeSingleQuoted | AttributeUnquoted = {
          type: node.type as unknown as
            | NodeTypes.AttributeDoubleQuoted
            | NodeTypes.AttributeSingleQuoted
            | NodeTypes.AttributeUnquoted,
          locStart: node.locStart,
          locEnd: node.locEnd,
          source: node.source,
          name: cstToAST([node.name])[0] as TextNode,
          value: toAttributeValue(node.value),
        };

        astBuilder.push(attributeNode);

        break;
      }

      case ConcreteNodeTypes.AttributeEmpty: {
        const attributeNode: AttributeEmpty = {
          type: NodeTypes.AttributeEmpty,
          locStart: node.locStart,
          locEnd: node.locEnd,
          source: node.source,
          name: cstToAST([node.name])[0] as TextNode,
        };

        astBuilder.push(attributeNode);

        break;
      }

      default: {
        throw new UnknownConcreteNodeTypeError(
          '',
          (node as any)?.source,
          (node as any)?.locStart,
          (node as any)?.locEnd,
        );
      }
    }
  }

  return astBuilder.finish();
}

export default function sourceToAST(source: string): LiquidXNode[] {
  const cst = sourceToCST(source);
  const ast = cstToAST(cst);

  return ast;
}
