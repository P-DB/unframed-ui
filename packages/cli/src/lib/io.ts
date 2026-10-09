import { createInterface } from 'node:readline/promises';

/** Where commands write their output, so tests can capture it. */
export interface Io {
  cwd: string;
  out: (text: string) => void;
  err: (text: string) => void;
  /** Whether prompts can be shown. */
  interactive: boolean;
  ask: (question: string) => Promise<string>;
}

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code: number) => (text: string) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text);

export const color = {
  bold: paint(1),
  dim: paint(2),
  green: paint(32),
  yellow: paint(33),
  red: paint(31),
  cyan: paint(36),
};

export function processIo(): Io {
  // Output piped into e.g. `head` closes early; exit quietly instead of crashing.
  process.stdout.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EPIPE') process.exit(0);
    throw error;
  });
  return {
    cwd: process.cwd(),
    out: (text) => process.stdout.write(`${text}\n`),
    err: (text) => process.stderr.write(`${text}\n`),
    interactive: Boolean(process.stdin.isTTY && process.stdout.isTTY),
    ask: async (question) => {
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      try {
        return await rl.question(question);
      } finally {
        rl.close();
      }
    },
  };
}

/** Asks with a default; returns the default when not interactive. */
export async function prompt(io: Io, question: string, fallback: string): Promise<string> {
  if (!io.interactive) return fallback;
  const answer = (await io.ask(`${question} ${color.dim(`(${fallback})`)} `)).trim();
  return answer || fallback;
}

/** Asks to pick one of several choices; returns the default when not interactive. */
export async function choose<T extends string>(io: Io, question: string, choices: T[], fallback: T): Promise<T> {
  if (!io.interactive) return fallback;
  for (;;) {
    const answer = (await prompt(io, `${question} [${choices.join('/')}]`, fallback)) as T;
    if (choices.includes(answer)) return answer;
    io.err(color.yellow(`Please answer one of: ${choices.join(', ')}`));
  }
}

export async function confirm(io: Io, question: string, fallback = false): Promise<boolean> {
  if (!io.interactive) return fallback;
  const answer = (await io.ask(`${question} ${color.dim(fallback ? '(Y/n)' : '(y/N)')} `)).trim().toLowerCase();
  return answer ? answer.startsWith('y') : fallback;
}
