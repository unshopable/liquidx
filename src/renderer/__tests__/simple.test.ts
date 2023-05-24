import { testRender } from './utils';

it('should render text', () => {
  const input = '<button>Hello, World</button>';

  const expected = '<button>Hello, World</button>';

  testRender(input, expected);
});

it('should render element without children', () => {
  const input = '<Button></Button>';

  const expected = "{% render 'Button' %}";

  testRender(input, expected);
});
