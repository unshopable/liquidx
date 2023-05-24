import sourceToAST, {
  AttributeNode,
  ElementNode,
  LiquidDropNode,
  LiquidXNode,
  NodeTypes,
  TextNode,
} from '../parser/2-cst-to-ast';

function renderStartMarker() {
  return '{% # LIQUIDX:START - EDITS MADE TO THE CODE BETWEEN "LIQUIDX:START" and "LIQUIDX:END" WILL BE OVERWRITTEN %}';
}

function renderEndMarker(node: ElementNode) {
  return `{% # LIQUIDX:END - SOURCE ${JSON.stringify(
    node.source.slice(node.locStart, node.locEnd),
  )} %}`;
}

function renderElement(
  node: ElementNode,
  { withSource = false, isChildOfElementNode = false } = {},
) {
  let output = '';

  const attributes = node.attributes;

  if (withSource && !isChildOfElementNode) {
    output += renderStartMarker();
  }

  if (node.children.length > 0) {
    const captureName = `${node.name}Children`;

    output += `{% capture ${captureName} %}`;
    output += renderAST(node.children, { withSource, isChildOfElementNode: true });
    output += '{% endcapture %}';

    const childrenAttribute: AttributeNode = {
      type: NodeTypes.AttributeDoubleQuoted,
      locStart: 0,
      locEnd: 0,
      source: '',
      name: {
        type: NodeTypes.TextNode,
        locStart: 0,
        locEnd: 0,
        source: '',
        value: 'children',
      },
      value: {
        type: NodeTypes.LiquidDropNode,
        locStart: 0,
        locEnd: 0,
        source: '',
        value: captureName,
      },
    };

    attributes.push(childrenAttribute);
  }

  const renderedAttributes = node.attributes.map((attribute) => renderAST([attribute]));
  const separator = ', ';

  const attributesString =
    renderedAttributes.length > 0 ? `${separator}${renderedAttributes.join(separator)}` : '';

  output += `{% render '${node.name}'${attributesString} %}`;

  if (withSource && !isChildOfElementNode) {
    output += renderEndMarker(node);
  }

  return output;
}

function renderText(node: TextNode) {
  return node.value;
}

function renderLiquidDrop(node: LiquidDropNode) {
  return node.value;
}

function renderAST(
  ast: LiquidXNode[],
  { withSource = false, isChildOfElementNode = false } = {},
): string {
  let output = '';

  for (let i = 0; i < ast.length; i += 1) {
    const node = ast[i];

    switch (node.type) {
      case NodeTypes.TextNode: {
        output += renderText(node);

        break;
      }

      case NodeTypes.ElementNode: {
        output += renderElement(node, { withSource, isChildOfElementNode });

        break;
      }

      case NodeTypes.AttributeDoubleQuoted:
      case NodeTypes.AttributeSingleQuoted:
      case NodeTypes.AttributeUnquoted: {
        const name = renderText(node.name);
        let value = null;

        if (node.value.type === NodeTypes.TextNode) {
          value = JSON.stringify(renderText(node.value));
        } else {
          value = renderLiquidDrop(node.value);
        }

        output += `${name}: ${value}`;

        break;
      }

      case NodeTypes.AttributeEmpty: {
        const name = renderText(node.name);
        const value = true;

        output += `${name}: ${value}`;

        break;
      }

      default: {
        console.log(node);

        // TODO
        throw new Error('');
      }
    }
  }

  return output;
}

export default function render(source: string, { withSource = false } = {}) {
  const ast = sourceToAST(source);

  const ouput = renderAST(ast, { withSource });

  return ouput;
}
