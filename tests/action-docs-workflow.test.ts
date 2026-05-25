import { writeFileSync } from 'node:fs';
import * as path from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { generateActionMarkdownDocs, Options } from '../src';

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return { ...actual, writeFileSync: vi.fn() };
});

const fixtureDir = path.join('tests', 'fixtures', 'workflow');

describe('Test output', () => {
  test('With defaults.', async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, 'workflow.yml'),
      includeNameHeader: true,
    });
    expect(markdown).toMatchSnapshot();
  });

  test('With secrets.', async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, 'secrets_workflow.yml'),
      includeNameHeader: true,
    });
    expect(markdown).toMatchSnapshot();
  });

  test('A minimal workflow definition.', async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, 'minimal_workflow.yml'),
      includeNameHeader: true,
    });
    expect(markdown).toMatchSnapshot();
  });

  test('All fields workflow definition.', async () => {
    const markdown = await generateActionMarkdownDocs({
      sourceFile: path.join(fixtureDir, 'all_fields_workflow.yml'),
      includeNameHeader: true,
    });
    expect(markdown).toMatchSnapshot();
  });
});

describe('Test update readme ', () => {
  test('Empty readme (all fields)', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'all_fields_workflow.yml'),
      originalReadme: path.join(fixtureDir, 'all_fields_readme.input'),
    });
  });

  test('All fields one annotation', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'all_fields_workflow.yml'),
      originalReadme: path.join(fixtureDir, 'all_fields_one_annotation.input'),
    });
  });

  test('Filled readme (all fields)', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'all_fields_workflow.yml'),
      originalReadme: path.join(fixtureDir, 'all_fields_readme_filled.input'),
    });
  });

  test('Readme (all fields) with CRLF line breaks', async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, 'all_fields_workflow.yml'),
        originalReadme: path.join(fixtureDir, 'all_fields_readme.input.crlf'),
      },
      { lineBreaks: 'CRLF' },
    );
  });

  test('Readme (inputs) for action_docs_workflow', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'action_docs_workflow.yml'),
      originalReadme: path.join(
        fixtureDir,
        'action_docs_workflow_readme.input',
      ),
    });
  });

  test('Readme for two workflow.yml-s', async () => {
    await testReadme(
      {
        sourceFile: path.join(fixtureDir, 'action_docs_workflow.yml'),
        originalReadme: path.join(fixtureDir, 'two_workflows_readme.input'),
      },
      {},
      false,
    );

    await testReadme({
      sourceFile: path.join(fixtureDir, 'all_fields_workflow.yml'),
      originalReadme: path.join(fixtureDir, 'two_workflows_readme.input'),
    });
  });
});

describe('Test usage format', () => {
  test('Multi-line descriptions.', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'workflow.yml'),
      originalReadme: path.join(fixtureDir, 'workflow_usage_readme.input'),
    });
  });

  test('With and without defaults.', async () => {
    await testReadme({
      sourceFile: path.join(fixtureDir, 'all_fields_workflow.yml'),
      originalReadme: path.join(fixtureDir, 'all_fields_usage_readme.input'),
    });
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
) {
  let captured = '';
  vi.mocked(writeFileSync).mockImplementation(
    (_path: unknown, data: unknown) => {
      captured = String(data);
    },
  );

  await generateActionMarkdownDocs({
    sourceFile: files.sourceFile,
    updateReadme: true,
    readmeFile: files.originalReadme,
    includeNameHeader: true,
    ...overwriteOptions,
  });

  if (doExpect) {
    expect(captured).toMatchSnapshot();
  }
}
