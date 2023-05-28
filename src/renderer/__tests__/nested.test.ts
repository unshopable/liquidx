import dedent from 'dedent-js';
import { testRender } from './utils';

it('should render text in element', () => {
  const input = dedent`
  <Button>Hello, World!</Button>
  `;

  const expected = dedent`
  {% capture ButtonChildren %}Hello, World!{% endcapture %}{% render 'Button', children: ButtonChildren %}
  `;

  testRender(input, expected);
});

it('should render element in element', () => {
  const input = dedent`
  <Button>
    <Text>Hello, World!</Text>
  </Button>
  `;

  const expected = dedent`
  {% capture ButtonChildren %}
    {% capture TextChildren %}Hello, World!{% endcapture %}{% render 'Text', children: TextChildren %}
  {% endcapture %}{% render 'Button', children: ButtonChildren %}
  `;

  testRender(input, expected);
});

it('should render element in text', () => {
  const input = dedent`
  <button>
    <Text>Hello, World!</Text>
  </button>
  `;

  const expected = dedent`
  <button>
    {% capture TextChildren %}Hello, World!{% endcapture %}{% render 'Text', children: TextChildren %}
  </button>
  `;

  testRender(input, expected);
});
