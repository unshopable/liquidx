import dedent from 'dedent-js';
import { testRender } from './utils';

it('should render source', () => {
  const input = dedent`<Icon />`;

  const expected = dedent`
  {% # LIQUIDX:START - EDITS MADE TO THE CODE BETWEEN \"LIQUIDX:START\" and \"LIQUIDX:END\" WILL BE OVERWRITTEN %}{% render 'Icon' %}{% # LIQUIDX:END - SOURCE \"<Icon />\" %}
  `;

  testRender(input, expected, { withSource: true });
});
