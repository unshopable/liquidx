import { ElementNode, LiquidXNode, NodeTypes } from '.';
import {
  ConcreteElementClosingTagNode,
  ConcreteElementSelfClosingTagNode,
} from '../1-source-to-cst';
import { ASTParsingError } from '../errors';
import { deepGet, dropLast } from './utils';

export default class ASTBuilder {
  ast: LiquidXNode[];
  cursor: (string | number)[];
  source: string;

  constructor(source: string) {
    this.ast = [];
    this.cursor = [];
    this.source = source;
  }

  get current(): LiquidXNode[] {
    return deepGet<LiquidXNode[]>(this.cursor, this.ast);
  }

  get currentPosition(): number {
    return (this.current || []).length - 1;
  }

  get parent(): ElementNode | undefined {
    if (this.cursor.length == 0) return undefined;

    return deepGet<ElementNode>(dropLast(1, this.cursor), this.ast);
  }

  open(node: ElementNode) {
    this.push(node);
    this.cursor.push(this.currentPosition);
    this.cursor.push('children');
  }

  close(
    node: ConcreteElementClosingTagNode | ConcreteElementSelfClosingTagNode,
    nodeType: NodeTypes.ElementNode,
  ) {
    if (!this.parent || this.parent.name !== node.name || this.parent.type !== nodeType) {
      throw new ASTParsingError(
        `LiquidX element '${node.name}' has no corresponding opening tag`,
        this.source,
        node.locStart,
        node.locEnd,
      );
    }

    this.parent.locEnd = node.locEnd;

    this.cursor.pop();
    this.cursor.pop();
  }

  push(node: LiquidXNode) {
    this.current.push(node);
  }

  finish() {
    if (this.cursor.length > 0) {
      throw new ASTParsingError(
        `LiquidX element '${this.parent?.name}' has no corresponding closing tag.`,
        this.source,
        this.parent?.locStart ?? this.source.length - 1,
        this.parent?.locEnd ?? this.source.length,
      );
    }

    return this.ast;
  }
}
