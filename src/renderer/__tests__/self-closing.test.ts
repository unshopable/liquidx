import dedent from 'dedent-js';
import { testRender } from './utils';

it('should render', () => {
  const input = dedent`
  <Icon/>
  <Icon />
  `;

  const expected = dedent`
  {% render 'Icon' %}
  {% render 'Icon' %}
  `;

  testRender(input, expected);
});
