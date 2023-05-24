import sourceToAST from '../';

export function expectOutput(input: string) {
  const output = sourceToAST(input);

  return expect(output);
}

export function expectErrorMessage(input: string) {
  let errorMessage = '';

  try {
    sourceToAST(input);
  } catch (error: any) {
    errorMessage = error.message;
  }

  return expect(errorMessage);
}
