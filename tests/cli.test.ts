import * as cp from 'node:child_process';
import { copyFileSync, readFileSync, unlinkSync } from 'node:fs';
import * as path from 'node:path';
import { describe, expect, test } from 'vitest';

const fixtureDir = path.join('tests', 'fixtures', 'action');

describe('CLI tests', () => {
  test('Update readme default', async () => {
    await testReadme(
      path.join(fixtureDir, 'all_fields_action.yml'),
      path.join(fixtureDir, 'all_fields_readme.input'),
      '-n true',
    );
  });

  test('Update readme with CRLF line breaks.', async () => {
    await testReadme(
      path.join(fixtureDir, 'all_fields_action.yml.crlf'),
      path.join(fixtureDir, 'all_fields_readme.input.crlf'),
      '-l CRLF',
    );
  });

  test('Console output with TOC 3 and no banner.', async () => {
    const result = await cli(
      `-s ${path.join(fixtureDir, 'all_fields_action.yml')} -t 3 --no-banner`,
    );

    expect(result.code).toBe(0);
    expect(result.stdout).toMatchSnapshot();
  });

  test('Console output including name header and no banner.', async () => {
    const result = await cli(
      `-s ${path.join(fixtureDir, 'action.yml')} -n true --no-banner`,
    );

    expect(result.code).toBe(0);
    expect(result.stdout).toMatchSnapshot();
  });
});

interface CliResponse {
  code: number;
  error: cp.ExecException | null;
  stdout: string;
  stderr: string;
}

function cli(args: string): Promise<CliResponse> {
  return new Promise((resolve) => {
    cp.exec(
      `node ${path.resolve('lib/cli.js')} ${args}`,
      (error, stdout, stderr) => {
        resolve({
          code: error?.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      },
    );
  });
}

async function testReadme(
  sourceFile: string,
  originalReadme: string,
  extraArgs = '',
  exitCode = 0,
) {
  const tmpFile = `${originalReadme}.tmp`;
  copyFileSync(originalReadme, tmpFile);

  try {
    const result = await cli(`-u ${tmpFile} -s ${sourceFile} ${extraArgs}`);
    expect(result.code).toBe(exitCode);

    const updated = readFileSync(tmpFile, 'utf-8');
    expect(updated).toMatchSnapshot();
  } finally {
    unlinkSync(tmpFile);
  }
}
