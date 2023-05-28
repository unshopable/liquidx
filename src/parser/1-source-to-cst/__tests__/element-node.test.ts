import { expectOutput } from './utils';

describe('opening tag', () => {
  it('should parse without attributes', () => {
    const input = '<Button>';

    expectOutput(input).toHaveProperty('0.type', 'ElementOpeningTag');
    expectOutput(input).toHaveProperty('0.name', 'Button');
    expectOutput(input).toHaveProperty('0.attributes.length', 0);
  });

  it('should parse with single attribute', () => {
    const input = '<Button secondary>';

    expectOutput(input).toHaveProperty('0.type', 'ElementOpeningTag');
    expectOutput(input).toHaveProperty('0.name', 'Button');
    expectOutput(input).toHaveProperty('0.attributes.0.name.value', 'secondary');
    expectOutput(input).toHaveProperty('0.attributes.length', 1);
  });

  it('should parse with multiple attributes', () => {
    const input = '<Button secondary icon="IconShoppingBag">';

    expectOutput(input).toHaveProperty('0.type', 'ElementOpeningTag');
    expectOutput(input).toHaveProperty('0.name', 'Button');
    expectOutput(input).toHaveProperty('0.attributes.0.name.value', 'secondary');
    expectOutput(input).toHaveProperty('0.attributes.1.name.value', 'icon');
    expectOutput(input).toHaveProperty('0.attributes.length', 2);
  });
});

describe('closing tag', () => {
  it('should parse', () => {
    const input = '</Button>';

    expectOutput(input).toHaveProperty('0.type', 'ElementClosingTag');
    expectOutput(input).toHaveProperty('0.name', 'Button');
  });
});

describe('self-closing tag', () => {
  it('should parse without attributes', () => {
    const input = '<Icon/>';

    expectOutput(input).toHaveProperty('0.type', 'ElementSelfClosingTag');
    expectOutput(input).toHaveProperty('0.name', 'Icon');
    expectOutput(input).toHaveProperty('0.attributes.length', 0);
  });

  it('should parse with single attribute', () => {
    const input = '<Icon icon="IconShoppingBag" />';

    expectOutput(input).toHaveProperty('0.type', 'ElementSelfClosingTag');
    expectOutput(input).toHaveProperty('0.name', 'Icon');
    expectOutput(input).toHaveProperty('0.attributes.0.name.value', 'icon');
    expectOutput(input).toHaveProperty('0.attributes.length', 1);
  });

  it('should parse with multiple attributes', () => {
    const input = '<Icon icon="IconShoppingBag" size="sm" />';

    expectOutput(input).toHaveProperty('0.type', 'ElementSelfClosingTag');
    expectOutput(input).toHaveProperty('0.name', 'Icon');
    expectOutput(input).toHaveProperty('0.attributes.0.name.value', 'icon');
    expectOutput(input).toHaveProperty('0.attributes.1.name.value', 'size');
    expectOutput(input).toHaveProperty('0.attributes.length', 2);
  });
});

describe('attributes', () => {
  it('should parse double quoted attribute', () => {
    const input = '<Button attr="test">';

    expectOutput(input).toHaveProperty('0.attributes.0.type', 'AttributeDoubleQuoted');
  });

  it('should parse single quoted attribute', () => {
    const input = "<Button attr='test'>";

    expectOutput(input).toHaveProperty('0.attributes.0.type', 'AttributeSingleQuoted');
  });

  it('should parse unquoted attribute', () => {
    const input = '<Button attr=test>';

    expectOutput(input).toHaveProperty('0.attributes.0.type', 'AttributeUnquoted');
  });

  it('should parse empty attribute', () => {
    const input = '<Button attr>';

    expectOutput(input).toHaveProperty('0.attributes.0.type', 'AttributeEmpty');
  });

  describe('values', () => {
    it('should parse text attribute value', () => {
      const input = '<Button attr1="test" attr2="0" attr3="true">';

      expectOutput(input).toHaveProperty('0.attributes.0.name.value', 'attr1');
      expectOutput(input).toHaveProperty('0.attributes.0.value.type', 'TextNode');
      expectOutput(input).toHaveProperty('0.attributes.0.value.value', 'test');

      expectOutput(input).toHaveProperty('0.attributes.1.name.value', 'attr2');
      expectOutput(input).toHaveProperty('0.attributes.1.value.type', 'TextNode');
      expectOutput(input).toHaveProperty('0.attributes.1.value.value', '0');

      expectOutput(input).toHaveProperty('0.attributes.2.name.value', 'attr3');
      expectOutput(input).toHaveProperty('0.attributes.2.value.type', 'TextNode');
      expectOutput(input).toHaveProperty('0.attributes.2.value.value', 'true');
    });

    it('should parse liquid drop attribute value', () => {
      const input = '<Button attr1="{{ \'test\' }}" attr2="{{ 0 }}" attr3="{{ true }}">';

      expectOutput(input).toHaveProperty('0.attributes.0.name.value', 'attr1');
      expectOutput(input).toHaveProperty('0.attributes.0.value.type', 'LiquidDropNode');
      expectOutput(input).toHaveProperty('0.attributes.0.value.value', "'test'");

      expectOutput(input).toHaveProperty('0.attributes.1.name.value', 'attr2');
      expectOutput(input).toHaveProperty('0.attributes.1.value.type', 'LiquidDropNode');
      expectOutput(input).toHaveProperty('0.attributes.1.value.value', '0');

      expectOutput(input).toHaveProperty('0.attributes.2.name.value', 'attr3');
      expectOutput(input).toHaveProperty('0.attributes.2.value.type', 'LiquidDropNode');
      expectOutput(input).toHaveProperty('0.attributes.2.value.value', 'true');
    });
  });
});
