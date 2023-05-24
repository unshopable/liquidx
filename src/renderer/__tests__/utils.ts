import render from '..';

export function testRender(input: string, expected: string, { withSource = false } = {}) {
  const output = render(input, { withSource });

  expect(output).toBe(expected);
}
