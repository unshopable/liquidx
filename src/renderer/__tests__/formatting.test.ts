import dedent from 'dedent-js';
import { testRender } from './utils';

it('should preserve formatting (single-line)', () => {
  const input = '<Button>Hello, World!</Button>';

  const expected = dedent`
  {% capture ButtonChildren %}Hello, World!{% endcapture %}{% render 'Button', children: ButtonChildren %}
  `;

  testRender(input, expected);
});

it('should preserve formatting (multi-line #1)', () => {
  const input = dedent`
  <Button>Hello, World!
  </Button>
  `;

  const expected = dedent`
  {% capture ButtonChildren %}Hello, World!
  {% endcapture %}{% render 'Button', children: ButtonChildren %}
  `;

  testRender(input, expected);
});

it('should preserve formatting (multi-line #2)', () => {
  const input = dedent`
  <Button>
    Hello, World!</Button>
  `;

  const expected = dedent`
  {% capture ButtonChildren %}
    Hello, World!{% endcapture %}{% render 'Button', children: ButtonChildren %}
  `;

  testRender(input, expected);
});

it('should preserve formatting (multi-line #3)', () => {
  const input = dedent`
  <Button>
    Hello, World!
  </Button>
  `;

  const expected = dedent`
  {% capture ButtonChildren %}
    Hello, World!
  {% endcapture %}{% render 'Button', children: ButtonChildren %}
  `;

  testRender(input, expected);
});

it('should preserve formatting (deeply nested)', () => {
  const input = dedent`
  <div>
    <div>
      <Button>
        <Text>
          <span>Hello, World!</span>
        </Text>
      </Button>
    </div>
  </div>
  `;

  const expected = dedent`
  <div>
    <div>
      {% capture ButtonChildren %}
        {% capture TextChildren %}
          <span>Hello, World!</span>
        {% endcapture %}{% render 'Text', children: TextChildren %}
      {% endcapture %}{% render 'Button', children: ButtonChildren %}
    </div>
  </div>
  `;

  testRender(input, expected);
});
