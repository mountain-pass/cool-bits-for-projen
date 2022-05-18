# cool-bits-for-projen

A collection of cool projen components

[![License](https://img.shields.io/github/license/mountain-pass/cool-bits-for-projen?logo=apache)](https://github.com/mountain-pass/cool-bits-for-projen/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/@mountainpass/cool-bits-for-projen?logo=npm)](https://www.npmjs.com/package/@mountainpass/cool-bits-for-projen) [![npm downloads](https://img.shields.io/npm/dm/@mountainpass/cool-bits-for-projen?logo=npm)](https://www.npmjs.com/package/@mountainpass/cool-bits-for-projen)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmountain-pass%2Fcool-bits-for-projen.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmountain-pass%2Fcool-bits-for-projen?ref=badge_shield)

[![Build Status](https://img.shields.io/github/workflow/status/mountain-pass/cool-bits-for-projen/release?logo=github)](https://github.com/mountain-pass/cool-bits-for-projen/actions/workflows/release.yml) [![GitHub issues](https://img.shields.io/github/issues/mountain-pass/cool-bits-for-projen?logo=github)](https://github.com/mountain-pass/cool-bits-for-projen/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/mountain-pass/cool-bits-for-projen?logo=github)](https://github.com/mountain-pass/cool-bits-for-projen/pulls)

<!-- [![Quality](https://img.shields.io/codacy/grade/940768d54f7545f7b42f89b26c23c751?logo=codacy)](https://www.codacy.com/gh/mountain-pass/cool-bits-for-projen/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mountain-pass/cool-bits-for-projen&amp;utm_campaign=Badge_Grade) [![Coverage](https://img.shields.io/codacy/coverage/940768d54f7545f7b42f89b26c23c751?logo=codacy)](https://www.codacy.com/gh/mountain-pass/cool-bits-for-projen/dashboard?utm_source=github.com&utm_medium=referral&utm_content=mountain-pass/cool-bits-for-projen&utm_campaign=Badge_Coverage) -->

[![source code vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/mountain-pass/cool-bits-for-projen?label=source%20code%20vulnerabilities&logo=snyk)](https://snyk.io/test/github/mountain-pass/cool-bits-for-projen) [![npm package vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@mountainpass/cool-bits-for-projen@latest?label=npm%20package%20vulnerabilties&logo=snyk)](https://snyk.io/test/npm/@mountainpass/cool-bits-for-projen/latest)


[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

![I love badges](https://img.shields.io/badge/%E2%99%A5%20i%20love-%20badges-green?logo=heart)

<!-- [![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard) -->

## Installation & Usage

1. If you don't have projen installed and configured, you'll need to [go do that first](https://github.com/projen/projen#getting-started).

2. Add `@mountainpass/cool-bits-for-projen` to you development dependencies. e.g., in your `.projenrc.ts`

```ts
const project = new TypeScriptProject({
    //...
    devDeps: [
        //...
        "@mountainpass/cool-bits-for-projen"
    ],
    //...
});
```

or

```ts
const project = new TypeScriptProject({
    //...
});
project.addDevDeps("@mountainpass/cool-bits-for-projen");
```

3. Run `npx projen` to regenerate the project files
 
4. Add the components to you project in your `.projenrc.ts` file. For
   example, to add all the recommended components, add `Recommended`

```ts
import { Recommended } from "@mountainpass/cool-bits-for-projen";

//...

const project = new TypeScriptProject({
    ...Recommended.defaultProjectOptions,
    //...
});

new Recommended(project);

//...

project.synth();
```

or you can add individual components

```ts
import { Husky, EslintUnicorn } from "@mountainpass/cool-bits-for-projen";

//...

const project = new TypeScriptProject({
    ...EslintUnicorn.defaultProjectOptions,
    //...
});

new Husky(project);
new EslintUnicorn(project);

//...

project.synth();
```

5. Run `npx projen` to regenerate the project files 