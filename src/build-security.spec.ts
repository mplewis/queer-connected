import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';

/**
 * Read .env file and extract all secret values (values of environment variables)
 */
function getSecretsFromEnv(): string[] {
  const envPath = join(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  const secrets: string[] = [];

  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const [, value] = trimmed.split('=', 2);
    if (value) {
      secrets.push(value.trim());
    }
  }

  return secrets;
}

/**
 * Recursively read all files in a directory and return their contents
 */
function getAllFilesContent(dir: string): string[] {
  const results: string[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...getAllFilesContent(fullPath));
    } else {
      try {
        const content = readFileSync(fullPath, 'utf-8');
        results.push(content);
      } catch {
        // Skip files that can't be read as text
      }
    }
  }

  return results;
}

it('does not expose .env secrets in dist output', () => {
  const secrets = getSecretsFromEnv();
  const distPath = join(process.cwd(), 'dist');
  const distFiles = getAllFilesContent(distPath);

  for (const secret of secrets) {
    for (const fileContent of distFiles) {
      expect(fileContent).not.toContain(secret);
    }
  }
});
