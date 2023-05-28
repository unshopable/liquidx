export function deepGet<T = any>(path: (string | number)[], obj: any): T {
  return path.reduce((curr: any, k: string | number) => {
    if (curr && curr[k] !== undefined) return curr[k];

    return undefined;
  }, obj);
}

export function dropLast<T>(num: number, xs: readonly T[]) {
  const result = [...xs];

  for (let i = 0; i < num; i += 1) {
    result.pop();
  }

  return result;
}
