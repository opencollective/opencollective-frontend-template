import fs from 'fs';
import { join } from 'path';

const dataDirectory = join(process.cwd(), '_dump');

export function getPostSlugs() {
  return fs.readdirSync(dataDirectory);
}

export function getDumpByTagAndPeriod(tag: string, period: string) {
  const files = fs.readdirSync(dataDirectory);
  const fileName = `${tag}-${period}.json`;
  const file = files.find(file => file === fileName);
  if (file) {
    const fullPath = join(dataDirectory, `${tag}-${period}.json`);
    const json = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(json);
    return data;
  }
  return null;
}
