import { writeFileSync } from 'node:fs';
import * as path from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { generateActionMarkdownDocs, Options } from '../src';

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return { ...actual, writeFileSync: vi.fn() };
});

const fixtureDir = path.join('tests', 'fixtures', 'action');

describe('Test output', () => {
  test('With defaults.', async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, 'action.yml'),
    });
    expect(markdown).toMatchSnapshot();
  });

  test('With name header included.', async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, 'action.yml'),
      includeNameHeader: true,
    });
    expect(markdown).toMatchSnapshot();
  });

  test('A minimal action definition.', async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, 'minimal_action.yml'),
    });
    expect(markdown).toMatchSnapshot();
  });

  test('All fields action definition.', async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, 'all_fields_action.yml'),
    });
    expect(markdown).toMatchSnapshot();
  });
});

describe('Test update readme ', () => {
  test('Empty readme (all fields)', async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, 'all_fields_action.yml'),
        originalReadme: path.join(fixtureDir, 'all_fields_readme.input'),
      },
      {
        includeNameHeader: true,
      },
    );
  });
  test('Empty readme (all fields) with header', async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, 'all_fields_action.yml'),
        originalReadme: path.join(fixtureDir, 'all_fields_readme.input'),
      },
      {
        includeNameHeader: true,
      },
      false,
      true,
    );
  });

  test('All fields one annotation', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'all_fields_action.yml'),
      originalReadme: path.join(fixtureDir, 'all_fields_one_annotation.input'),
    });
  });

  test('Filled readme (all fields)', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'all_fields_action.yml'),
      originalReadme: path.join(fixtureDir, 'all_fields_readme_filled.input'),
    });
  });

  test('Filled readme (all fields) with header', async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, 'all_fields_action.yml'),
        originalReadme: path.join(fixtureDir, 'all_fields_readme.input'),
      },
      {
        includeNameHeader: true,
      },
      false,
      true,
    );
  });

  test('Readme (all fields) with CRLF line breaks', async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, 'all_fields_action.yml.crlf'),
        originalReadme: path.join(fixtureDir, 'all_fields_readme.input.crlf'),
      },
      { lineBreaks: 'CRLF' },
    );
  });

  test('Readme (inputs) for ya-action-docs-action', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'action_docs_action_action.yml'),
      originalReadme: path.join(fixtureDir, 'action_docs_action_readme.input'),
    });
  });

  test('Readme for two action.yml-s', async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, 'action_docs_action_action.yml'),
        originalReadme: path.join(fixtureDir, 'two_actions_readme.input'),
      },
      {},
      false,
    );

    await testReadme({
      sourceFile: path.join(fixtureDir, 'all_fields_action.yml'),
      originalReadme: path.join(fixtureDir, 'two_actions_readme.input'),
    });
  });

  test('Readme for deprecated inputs', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'deprecated_input_action.yml'),
      originalReadme: path.join(fixtureDir, 'deprecated_input_action.input'),
    });
  });
});

describe('Test usage format', () => {
  test('Multi-line descriptions.', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'action.yml'),
      originalReadme: path.join(fixtureDir, 'action_usage_readme.input'),
    });
  });

  test('With and without defaults.', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'all_fields_action.yml'),
      originalReadme: path.join(fixtureDir, 'all_fields_usage_readme.input'),
    });
  });
});

describe('Backwards compatibility', () => {
  test('Deprecated action option still works correctly', async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, 'all_fields_action.yml'),
        originalReadme: path.join(fixtureDir, 'action_deprecated.input'),
      },
      {
        includeNameHeader: true,
      },
    );
  });
});

interface ReadmeTestFixtures {
  sourceFile: string;
  originalReadme: string;
}

async function testReadme(
  files: ReadmeTestFixtures,
  overwriteOptions?: Options,
  doExpect = true,
  includeNameHeader = false,
) {
  let captured = '';
  vi.mocked(writeFileSync).mockImplementation((_path: unknown, data: unknown) => {
    captured = String(data);
  });

  await generateActionMarkdownDocs({
    sourceFile: files.sourceFile,
    updateReadme: true,
    includeNameHeader,
    readmeFile: files.originalReadme,
    ...overwriteOptions,
  });

  if (doExpect) {
    expect(captured).toMatchSnapshot();
  }
}
