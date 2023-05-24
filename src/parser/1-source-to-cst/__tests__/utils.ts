import sourceToCST from '../';

export function expectOutput(input: string) {
  const output = sourceToCST(input);

  return expect(output);
}
