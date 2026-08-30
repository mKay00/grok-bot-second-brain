export function readTemplate(args: { plan: string; name: string }): string {
  const start = `<!-- template:${args.name} -->`;
  const end = `<!-- /template:${args.name} -->`;
  const from = args.plan.indexOf(start);
  const to = args.plan.indexOf(end);
  if (from === -1 || to === -1 || to <= from) {
    throw new Error(`PLAN.md is missing template ${args.name}`);
  }
  return args.plan.slice(from + start.length, to).trim();
}

export function interpolate(args: { text: string; slots: Record<string, string> }): string {
  return args.text.replaceAll(/\{\{([a-z_]+)\}\}/g, (_match, key: string) => {
    if (!(key in args.slots)) {
      throw new Error(`unknown slot ${key}`);
    }
    const value = args.slots[key];
    if (value === undefined) {
      throw new Error(`unknown slot ${key}`);
    }
    return value;
  });
}
