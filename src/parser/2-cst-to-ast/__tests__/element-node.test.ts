import { NodeTypes } from '..';
import { expectErrorMessage, expectOutput } from './utils';

it('should parse without children', () => {
  const input = '<Button></Button>';

  expectOutput(input).toHaveProperty('0.type', NodeTypes.ElementNode);
  expectOutput(input).toHaveProperty('0.name', 'Button');
  expectOutput(input).toHaveProperty('0.children', []);
});

it('should parse with text children', () => {
  const input = '<Button>Plain text</Button>';

  expectOutput(input).toHaveProperty('0.type', NodeTypes.ElementNode);
  expectOutput(input).toHaveProperty('0.name', 'Button');
  expectOutput(input).toHaveProperty('0.children.0.type', NodeTypes.TextNode);
});

it('should parse with element children', () => {
  const input = '<Box><Button>Plain text</Button></Box>';

  expectOutput(input).toHaveProperty('0.type', NodeTypes.ElementNode);
  expectOutput(input).toHaveProperty('0.name', 'Box');
  expectOutput(input).toHaveProperty('0.children.0.type', NodeTypes.ElementNode);
  expectOutput(input).toHaveProperty('0.children.0.name', 'Button');
  expectOutput(input).toHaveProperty('0.children.0.children.0.type', NodeTypes.TextNode);
});

it('should throw an error if corresponding closing tag is missing', () => {
  const input = '<Box>';

  expectErrorMessage(input).toMatchSnapshot();
});

it('should throw an error if corresponding opening tag is missing', () => {
  const input = '</Box>';

  expectErrorMessage(input).toMatchSnapshot();
});
