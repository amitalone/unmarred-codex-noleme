# Mutation Testing with Stryker.js

This project uses [Stryker Mutator](https://stryker-mutator.io/) for mutation testing. Mutation testing helps ensure the quality of your test suite by making small changes (mutations) to your code and checking if your tests catch these changes.

## What is Mutation Testing?

Mutation testing is a technique to evaluate the quality of your tests. It works by:

1. Making small changes (mutations) to your code
2. Running your tests against the mutated code
3. If your tests pass despite the mutation, it indicates a potential weakness in your test suite

This helps identify areas where your tests might not be thorough enough.

## Project Setup

This project uses a shared Stryker configuration in the `packages/stryker-config` package, which is then extended by individual packages.

### Running Mutation Tests

To run mutation tests for all packages:

```bash
pnpm mutation
```

To run mutation tests for a specific package (e.g., UI package):

```bash
pnpm mutation:ui
```

### Viewing Reports

After running mutation tests, HTML reports are generated in the `reports/mutation/html` directory of each package. You can open these reports in your browser to see detailed information about the mutations.

For the UI package, you can use:

```bash
cd packages/ui
pnpm mutation:report
```

## Understanding the Results

The mutation testing report includes:

- **Mutation Score**: The percentage of mutations that were killed (detected by tests)
- **Mutants**: Details about each mutation that was made
- **Source Files**: A breakdown of mutation coverage by file

### Thresholds

The project has defined the following thresholds:

- **High**: 80% (good coverage)
- **Low**: 60% (needs improvement)
- **Break**: 50% (failing threshold)

## Adding Mutation Testing to a New Package

To add mutation testing to a new package:

1. Add `@repo/stryker-config` as a dependency in your package.json
2. Create a `stryker.config.js` file in your package root
3. Extend the shared configuration and add package-specific settings
4. Add mutation testing scripts to your package.json

Example `stryker.config.js`:

```javascript
module.exports = {
  preset: "@repo/stryker-config",
  // Add package-specific configuration here
};
```

Example package.json scripts:

```json
"scripts": {
  "mutation": "stryker run",
  "mutation:report": "open reports/mutation/html/index.html"
}
```
