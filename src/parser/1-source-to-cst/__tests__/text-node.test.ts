import { expectOutput } from './utils';

it('should parse plain text', () => {
  const input = 'Plain text';

  expectOutput(input).toHaveProperty('0.type', 'TextNode');
  expectOutput(input).toHaveProperty('0.value', 'Plain text');
});

it('should parse native HTML elements', () => {
  const input = '<button></button>';

  expectOutput(input).toHaveProperty('0.type', 'TextNode');
  expectOutput(input).toHaveProperty('0.value', '<button></button>');
});

it('should parse custom HTML elements', () => {
  const input = '<custom-button></custom-button>';

  expectOutput(input).toHaveProperty('0.type', 'TextNode');
  expectOutput(input).toHaveProperty('0.value', '<custom-button></custom-button>');
});
