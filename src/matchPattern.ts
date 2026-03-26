export type MatchParams = Record<string, string | undefined>;

function toObject(x: string[]) {
  return x.reduce<Record<string, unknown>>((p, v, k) => {
    p[String(k)] = v;

    return p;
  }, {});
}

export function matchPattern(
  pattern: unknown,
  value: unknown,
): MatchParams | null {
  if (Array.isArray(pattern)) {
    for (let p of pattern) {
      let matches = matchPattern(p, value);

      if (matches) return matches;
    }

    return null;
  }

  if (pattern instanceof RegExp) {
    let matches = String(value).match(pattern);

    if (matches)
      return {
        ...toObject(Array.from(matches).slice(1)),
        ...matches.groups,
      } as MatchParams;
  }

  if (pattern === "*" || pattern === value) return {} as MatchParams;

  return null;
}
