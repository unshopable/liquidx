import dedent from 'dedent-js';
import { testRender } from './utils';

it('should render string', () => {
  const input = dedent`
  <Icon str="STRING" />
  `;

  const expected = dedent`
  {% render 'Icon', str: "STRING" %}
  `;

  testRender(input, expected);
});

it('should render number', () => {
  const input = dedent`
  <Icon num="{{ 0 }}" />
  `;

  const expected = dedent`
  {% render 'Icon', num: 0 %}
  `;

  testRender(input, expected);
});

it('should render float', () => {
  const input = dedent`
  <Icon num="{{ 1.1 }}" />
  `;

  const expected = dedent`
  {% render 'Icon', num: 1.1 %}
  `;

  testRender(input, expected);
});

it('should render boolean (explicit)', () => {
  const input = dedent`
  <Icon bool1="{{ true }}" bool2="{{ false }}" />
  `;

  const expected = dedent`
  {% render 'Icon', bool1: true, bool2: false %}
  `;

  testRender(input, expected);
});

it('should render boolean (implicit)', () => {
  const input = dedent`
  <Icon bool />
  `;

  const expected = dedent`
  {% render 'Icon', bool: true %}
  `;

  testRender(input, expected);
});

it('should render null', () => {
  const input = dedent`
  <Icon a="{{ null }}" />
  `;

  const expected = dedent`
  {% render 'Icon', a: null %}
  `;

  testRender(input, expected);
});

it('should render computed', () => {
  const input = dedent`
  <Icon attr="{{ foo }}" />
  `;

  const expected = dedent`
  {% render 'Icon', attr: foo %}
  `;

  testRender(input, expected);
});
