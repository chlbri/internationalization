"use strict";
// import publish from '@bemedev/npm-publish';
require('@bemedev/npm-publish')
    .default({
    currentBranch: 'dev',
    productionBranch: 'dev',
    versionProps: '0.0.11',
    lib: 'lib',
})
    .then(() => 'ok'); //?
