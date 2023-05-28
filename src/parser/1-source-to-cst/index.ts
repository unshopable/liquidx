import { Node } from 'ohm-js';
import { toAST } from 'ohm-js/extras';
import { CSTParsingError } from '../errors';
import grammar from '../grammar';

export enum ConcreteNodeTypes {
  TextNode = 'TextNode',

  LiquidDropNode = 'LiquidDropNode',

  ElementOpeningTag = 'ElementOpeningTag',
  ElementClosingTag = 'ElementClosingTag',
  ElementSelfClosingTag = 'ElementSelfClosingTag',

  AttributeDoubleQuoted = 'AttributeDoubleQuoted',
  AttributeSingleQuoted = 'AttributeSingleQuoted',
  AttributeUnquoted = 'AttributeUnquoted',
  AttributeEmpty = 'AttributeEmpty',
}

export type ConcreteNode =
  | ConcreteTextNode
  | ConcreteLiquidDropNode
  | ConcreteElementOpeningTagNode
  | ConcreteElementClosingTagNode
  | ConcreteElementSelfClosingTagNode;

export type ConcreteBasicNode<T> = {
  type: T;
  locStart: number;
  locEnd: number;
  source: string;
};

export type ConcreteTextNode = {
  value: string;
} & ConcreteBasicNode<ConcreteNodeTypes.TextNode>;

export type ConcreteLiquidDropNode = {
  value: string;
} & ConcreteBasicNode<ConcreteNodeTypes.LiquidDropNode>;

export type ConcreteElementOpeningTagNode = {
  name: string;
  attributes: ConcreteAttributeNode[];
} & ConcreteBasicNode<ConcreteNodeTypes.ElementOpeningTag>;

export type ConcreteElementClosingTagNode = {
  name: string;
} & ConcreteBasicNode<ConcreteNodeTypes.ElementClosingTag>;

export type ConcreteElementSelfClosingTagNode = {
  name: string;
  attributes: ConcreteAttributeNode[];
} & ConcreteBasicNode<ConcreteNodeTypes.ElementSelfClosingTag>;

export type ConcreteAttributeNodeBase<T> = {
  name: ConcreteTextNode;
  value: ConcreteTextNode;
} & ConcreteBasicNode<T>;

export type ConcreteAttributeNode =
  | ConcreteAttributeDoubleQuoted
  | ConcreteAttributeSingleQuoted
  | ConcreteAttributeUnquoted
  | ConcreteAttributeEmpty;

export type ConcreteAttributeDoubleQuoted =
  {} & ConcreteAttributeNodeBase<ConcreteNodeTypes.AttributeDoubleQuoted>;

export type ConcreteAttributeSingleQuoted =
  {} & ConcreteAttributeNodeBase<ConcreteNodeTypes.AttributeSingleQuoted>;

export type ConcreteAttributeUnquoted =
  {} & ConcreteAttributeNodeBase<ConcreteNodeTypes.AttributeUnquoted>;

export type ConcreteAttributeEmpty = {
  name: ConcreteTextNode;
} & ConcreteBasicNode<ConcreteNodeTypes.AttributeEmpty>;

export type CST = ConcreteNode[];

export type TemplateMapping = {
  type: ConcreteNodeTypes;
  locStart: (node: Node[]) => number;
  locEnd: (node: Node[]) => number;
  source: string;
  [k: string]: string | number | boolean | object | null;
};

export type TopLevelFunctionMapping = (...nodes: Node[]) => any;

export type Mapping = {
  [k: string]: number | TemplateMapping | TopLevelFunctionMapping;
};

function locStart(nodes: Node[]) {
  return nodes[0].source.startIdx;
}

function locEnd(nodes: Node[]) {
  return nodes[nodes.length - 1].source.endIdx;
}

export default function sourceToCST(source: string): ConcreteNode[] {
  const matchResult = grammar.match(source);

  if (matchResult.failed()) {
    throw new CSTParsingError(matchResult);
  }

  const textNode = {
    type: ConcreteNodeTypes.TextNode,
    locStart,
    locEnd,
    value: function (this: Node) {
      return this.sourceString;
    },
    source,
  };

  const mapping: Mapping = {
    Node: 0,

    TextNode: textNode,

    liquidDropNode: {
      type: ConcreteNodeTypes.LiquidDropNode,
      locStart,
      locEnd,
      source,
      value: 2,
    },
    liquidDropValue: (node: Node) => node.sourceString.trimEnd(),

    ElementNode: 0,

    ElementOpeningTag: {
      type: ConcreteNodeTypes.ElementOpeningTag,
      locStart,
      locEnd,
      name: 1,
      attributes: 2,
      source,
    },
    ElementClosingTag: {
      type: ConcreteNodeTypes.ElementClosingTag,
      locStart,
      locEnd,
      name: 1,
      source,
    },
    ElementSelfClosingTag: {
      type: ConcreteNodeTypes.ElementSelfClosingTag,
      locStart,
      locEnd,
      name: 1,
      attributes: 2,
      source,
    },

    AttributeDoubleQuoted: {
      type: ConcreteNodeTypes.AttributeDoubleQuoted,
      locStart,
      locEnd,
      source,
      name: 0,
      value: 3,
    },
    AttributeSingleQuoted: {
      type: ConcreteNodeTypes.AttributeSingleQuoted,
      locStart,
      locEnd,
      source,
      name: 0,
      value: 3,
    },
    AttributeUnquoted: {
      type: ConcreteNodeTypes.AttributeUnquoted,
      locStart,
      locEnd,
      source,
      name: 0,
      value: 2,
    },
    AttributeEmpty: {
      type: ConcreteNodeTypes.AttributeEmpty,
      locStart,
      locEnd,
      source,
      name: 0,
    },

    attributeName: textNode,

    attributeDoubleQuotedValue: 0,
    attributeSingleQuotedValue: 0,
    attributeUnquotedValue: 0,

    attributeDoubleQuotedTextNode: textNode,
    attributeSingleQuotedTextNode: textNode,
    attributeUnquotedTextNode: textNode,
  };

  const cst = toAST(matchResult, mapping) as ConcreteNode[];

  return cst;
}
