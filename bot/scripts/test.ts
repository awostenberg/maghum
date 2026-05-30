#!/usr/bin/env tsx
/**
 * Local tester for the Maghum bot logic.
 * Lets you test MH citation behavior without Discord.
 *
 * Usage examples:
 *   npx tsx bot/scripts/test.ts 47
 *   npx tsx bot/scripts/test.ts 42 48
 *   npx tsx bot/scripts/test.ts 100
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../../data/paragraphs.json');

interface Paragraph {
  number: number;
  text: string;
  section: string;
  subsection?: string;
}

let paragraphs: Paragraph[] = [];

async function loadParagraphs() {
  const raw = await fs.readFile(dataPath, 'utf-8');
  paragraphs = JSON.parse(raw);
}

function getParagraph(n: number): Paragraph | undefined {
  return paragraphs.find(p => p.number === n);
}

function formatCitation(n: number): string {
  return `MH ${n}`;
}

function printParagraph(p: Paragraph) {
  console.log(`\n${formatCitation(p.number)}`);
  console.log(`Section: ${p.section}${p.subsection ? ` → ${p.subsection}` : ''}`);
  console.log(`Link:   https://awostenberg.github.io/maghum/#mh-${p.number}`);
  console.log('─'.repeat(60));
  console.log(p.text);
  console.log('─'.repeat(60));
}

function printRange(start: number, end: number) {
  const selected = paragraphs.filter(p => p.number >= start && p.number <= end);

  if (selected.length === 0) {
    console.log(`No paragraphs found between ${formatCitation(start)} and ${formatCitation(end)}.`);
    return;
  }

  console.log(`\n${formatCitation(start)} – ${formatCitation(end)}`);
  console.log(`Link: https://awostenberg.github.io/maghum/#mh-${start}`);
  console.log('═'.repeat(60));

  for (const p of selected) {
    console.log(`\n${formatCitation(p.number)}`);
    console.log(p.text);
  }

  console.log('\n' + '═'.repeat(60));
}

async function main() {
  await loadParagraphs();

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  npx tsx bot/scripts/test.ts 47');
    console.log('  npx tsx bot/scripts/test.ts 42 48');
    process.exit(1);
  }

  const first = parseInt(args[0], 10);
  const second = args[1] ? parseInt(args[1], 10) : null;

  if (isNaN(first)) {
    console.error('First argument must be a number.');
    process.exit(1);
  }

  if (second !== null) {
    if (isNaN(second) || second < first) {
      console.error('Second argument must be a number greater than the first.');
      process.exit(1);
    }
    printRange(first, second);
  } else {
    const p = getParagraph(first);
    if (!p) {
      console.log(`Paragraph ${formatCitation(first)} not found.`);
      process.exit(1);
    }
    printParagraph(p);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
