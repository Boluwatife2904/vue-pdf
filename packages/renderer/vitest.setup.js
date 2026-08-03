import { expect } from 'vitest';
import path from 'path';
import url from 'url';
import kebabCase from 'lodash/kebabCase.js';
import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customSnapshotsDir: `${__dirname}/tests/snapshots`,
  customDiffDir: `${__dirname}/tests/diffs`,
  failureThreshold: 0.05,
  failureThresholdType: 'percent',
  customDiffConfig: { threshold: 0.3 },
  // The reference snapshots were produced with vitest 1.x, where
  // currentTestName included the test file path ("tests/x.test.jsx > ...").
  // Reproduce that identifier so the vue port is compared against the
  // original react-pdf reference images instead of writing new ones.
  customSnapshotIdentifier: ({ testPath, currentTestName, counter }) => {
    const base = path.basename(testPath);
    return `${kebabCase(`${base}-tests/${base} > ${currentTestName}`)}-${counter}-snap`;
  },
});

expect.extend({ toMatchImageSnapshot });
