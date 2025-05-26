<!-- BADGES/ -->

![example workflow](https://github.com/npalm/ya-action-docs/actions/workflows/ci.yml/badge.svg) [![npm](https://img.shields.io/npm/v/ya-action-docs.svg)](https://npmjs.org/package/ya-action-docs) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ya-action-docs&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=ya-action-docs) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ya-action-docs&metric=coverage)](https://sonarcloud.io/dashboard?id=ya-action-docs) [![CodeScene Code Health](https://codescene.io/projects/49602/status-badges/code-health)](https://codescene.io/projects/49602)

<!-- /BADGES -->

# Action docs

A CLI to generate and update documentation for GitHub actions or workflows, based on the definition `.yml`. To update your README in a GitHub workflow you can use the [ya-action-docs-action](https://github.com/npalm/ya-action-docs-action).

## TL;DR

### Add the following comment blocks to your README.md

```md
<!-- ya-action-docs-header source="action.yml" -->

<!-- ya-action-docs-description source="action.yml" --> # applicable for actions only

<!-- ya-action-docs-inputs source="action.yml" -->

<!-- ya-action-docs-outputs source="action.yml" -->

<!-- ya-action-docs-runs source="action.yml" --> # applicable for actions only
```

Optionally you can also add the following section to generate a usage guide, replacing \<project\> and \<version\> with the name and version of your project you would like to appear in your usage guide.

```md
<!-- ya-action-docs-usage source="action.yml" project="<project>" version="<version>" -->
```

### Generate docs via CLI

```bash
npm install -g ya-action-docs
cd <your github action>

# write docs to console
ya-action-docs

# update README
ya-action-docs --update-readme
```

### Run the cli

```
ya-action-docs -u
```

## CLI

### Options

The following options are available via the CLI

```
Options:
      --version              Show version number                       [boolean]
  -t, --toc-level            TOC level used for markdown   [number] [default: 2]
  -a, --action               GitHub action file
             [deprecated: use "source" instead] [string] [default: "action.yml"]
  -s, --source               GitHub source file [string] [default: "action.yml"]
      --no-banner            Print no banner
  -u, --update-readme        Update readme file.                        [string]
  -l, --line-breaks          Used line breaks in the generated docs.
                          [string] [choices: "CR", "LF", "CRLF"] [default: "LF"]
  -n, --include-name-header  Include a header with the action/workflow name
                                                                       [boolean]
      --help                 Show help                                 [boolean]
```

### Update the README

Action-docs can update your README based on the `action.yml`. The following sections can be updated: name header, description, inputs, outputs, usage, and runs. Add the following tags to your README and run `ya-action-docs -u`.

```md
<!-- ya-action-docs-header source="action.yml" -->

<!-- ya-action-docs-description source="action.yml" -->

<!-- ya-action-docs-inputs source="action.yml" -->

<!-- ya-action-docs-outputs source="action.yml" -->

<!-- ya-action-docs-runs action="action.yml" -->

<!-- ya-action-docs-usage action="action.yml" project="<project>" version="<version>" -->
```

Or to include all of the above, use:

```md
<!-- ya-action-docs-all source="action.yml" project="<project>" version="<version>" -->
```

For updating other Markdown files add the name of the file to the command `ya-action-docs -u <file>`.

If you need to use `another/action.yml`:

1. write it in tags like `source="another/action.yml"`;
2. specify in a command via the `-s` option like `ya-action-docs -s another/action.yml`

### Examples

#### Print action markdown docs to console

```bash
ya-action-docs
```

#### Update README.md

```bash
ya-action-docs --update-readme
```

#### Print action markdown for non default action file

```bash
ya-action-docs --source another/action.yaml
```

#### Update readme, custom action file and set TOC level 3, custom readme

```bash
ya-action-docs --source ./some-dir/action.yml --toc-level 3 --update-readme docs.md
```

## API

```javascript
import { generateActionMarkdownDocs } from 'ya-action-docs'

await generateActionMarkdownDocs({
  sourceFile: 'action.yml'
  tocLevel: 2
  updateReadme: true
  readmeFile: 'README.md'
});
```

## Contribution

We welcome contributions, please checkout the [contribution guide](CONTRIBUTING.md).

## License

This project is released under the [MIT License](./LICENSE).
