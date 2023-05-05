## [2.1.1-beta.2](https://github.com/herbsjs/herbs2knex/compare/v2.1.1-beta.1...v2.1.1-beta.2) (2023-05-05)


### Bug Fixes

* **convention:** fix camel to snake case for FK ([33a673a](https://github.com/herbsjs/herbs2knex/commit/33a673aa4ca1b20cd62bd0ff5d560734006447fc))
* **convention:** fix camel to snake for complex names ([a1c7f4c](https://github.com/herbsjs/herbs2knex/commit/a1c7f4c51f79837e9c8e9ea03ee0edfe1291c235))
* **lint:** semicolon ([4384453](https://github.com/herbsjs/herbs2knex/commit/4384453125d96c04e856bb3e82cfd5ceb22b4dc1))

## [2.1.1-beta.1](https://github.com/herbsjs/herbs2knex/compare/v2.1.0...v2.1.1-beta.1) (2023-03-30)


### Reverts

* Revert "Revert "ci(semantic release): improve version to release (beta, alpha, etc)"" ([dbc370a](https://github.com/herbsjs/herbs2knex/commit/dbc370af1eede681348a7973af6cef8d2a9705ee))
* Revert "revert(node): bump node version to 16x" ([4ee8ed8](https://github.com/herbsjs/herbs2knex/commit/4ee8ed8df1f46c27c5991c604dfeb5529301de35))

# [2.1.0](https://github.com/herbsjs/herbs2knex/compare/v2.0.0...v2.1.0) (2023-03-30)


### Features

* **depencency:** bump herbs version ([dd3eac6](https://github.com/herbsjs/herbs2knex/commit/dd3eac6bab39b2eaa7250a87463c390c165548e9))

# [2.0.0](https://github.com/herbsjs/herbs2knex/compare/v1.5.10...v2.0.0) (2023-03-07)


### Bug Fixes

* **package.json:** up herbs version ([483131b](https://github.com/herbsjs/herbs2knex/commit/483131bd4358b845f571e197f27b4339ebfdea8b))


### Continuous Integration

* fix cd ([c656951](https://github.com/herbsjs/herbs2knex/commit/c6569515f26ba8e64e61da35816db8c84de11515))


### BREAKING CHANGES

* upgrade buchu to 2.0

## [1.5.10](https://github.com/herbsjs/herbs2knex/compare/v1.5.9...v1.5.10) (2023-01-23)


### Bug Fixes

* **deps:** bump knex from 2.4.0 to 2.4.2 ([2592682](https://github.com/herbsjs/herbs2knex/commit/2592682834c0f92f19404fd499ef104657ded43a))

## [1.5.9](https://github.com/herbsjs/herbs2knex/compare/v1.5.8...v1.5.9) (2023-01-09)


### Performance Improvements

* **knex:** upgrade knex and dependencies ([2b9474c](https://github.com/herbsjs/herbs2knex/commit/2b9474c671f5e2561bd0d1807ff3cec8cf6fdf07))

## [1.5.8](https://github.com/herbsjs/herbs2knex/compare/v1.5.7...v1.5.8) (2022-09-16)


### Bug Fixes

* **sqlite:** update sqlite version, knex version and herbs version ([95c14e6](https://github.com/herbsjs/herbs2knex/commit/95c14e6bc13d8c92843932558e8692beaa4ffdcd))

## [1.5.7](https://github.com/herbsjs/herbs2knex/compare/v1.5.6...v1.5.7) (2022-08-15)


### Bug Fixes

* **herbs:** update herbs dependency ([5b68e71](https://github.com/herbsjs/herbs2knex/commit/5b68e7124a51c8d55a727bec952799a7898c6462))

## [1.5.6](https://github.com/herbsjs/herbs2knex/compare/v1.5.5...v1.5.6) (2022-08-07)


### Bug Fixes

* **depencency:** remove gotu and suma dependency. move all to herbs lib ([d844119](https://github.com/herbsjs/herbs2knex/commit/d844119b66bc64ed7237726f0704d72dd5bfe9b3))

## [1.5.5](https://github.com/herbsjs/herbs2knex/compare/v1.5.4...v1.5.5) (2022-07-24)


### Bug Fixes

* **deps:** bump knex from 2.1.0 to 2.2.0 ([ca72afa](https://github.com/herbsjs/herbs2knex/commit/ca72afa16a7ecd2fcd07bb39acbfaa54ff332e9e))

## [1.5.4](https://github.com/herbsjs/herbs2knex/compare/v1.5.3...v1.5.4) (2022-07-18)


### Bug Fixes

* **sqlite:** fix error-prone last inserted id ([8103193](https://github.com/herbsjs/herbs2knex/commit/81031934fd7af577f7a8fc2ff5a1a09a52f26f48))

## [1.5.3](https://github.com/herbsjs/herbs2knex/compare/v1.5.2...v1.5.3) (2022-07-18)


### Bug Fixes

* **herbs:** change gotu and suma to peerDependencies ([9caa5e4](https://github.com/herbsjs/herbs2knex/commit/9caa5e48acb8816d3158a5b83ffe74518dc2a73c))
* **sqlite:** fix returning sqlite and add tests for support sqlite ([74240b4](https://github.com/herbsjs/herbs2knex/commit/74240b490f5bf6764cc80e9cd6a93bb089c948ba)), closes [#58](https://github.com/herbsjs/herbs2knex/issues/58)

## [1.5.2](https://github.com/herbsjs/herbs2knex/compare/v1.5.1...v1.5.2) (2022-06-17)


### Bug Fixes

* update dependencies ([783ab1c](https://github.com/herbsjs/herbs2knex/commit/783ab1ced376c8deb90b21e978f1be18a7eb9567))

## [1.5.1](https://github.com/herbsjs/herbs2knex/compare/v1.5.0...v1.5.1) (2022-05-30)


### Bug Fixes

* **deps:** bump knex from 2.0.0 to 2.1.0 ([90530f6](https://github.com/herbsjs/herbs2knex/commit/90530f6fd5b0c26cebc4524f8a28f46387c57e05))

# [1.5.0](https://github.com/herbsjs/herbs2knex/compare/v1.4.7...v1.5.0) (2022-05-19)


### Features

* add support for new version of knex ([7bbe395](https://github.com/herbsjs/herbs2knex/commit/7bbe39514256257d2b64fb8d4984c20d15e78764))

## [1.4.7](https://github.com/herbsjs/herbs2knex/compare/v1.4.6...v1.4.7) (2022-05-09)


### Bug Fixes

* **deps:** bump @herbsjs/suma from 1.3.0 to 1.3.1 ([8e6ac82](https://github.com/herbsjs/herbs2knex/commit/8e6ac82963b44c2822354a032d30ed20fc1b1b8d))

## [1.4.6](https://github.com/herbsjs/herbs2knex/compare/v1.4.5...v1.4.6) (2022-04-22)


### Bug Fixes

* **deps:** bump @herbsjs/gotu from 1.1.1 to 1.1.2 ([07009d4](https://github.com/herbsjs/herbs2knex/commit/07009d4b9688d0c457a1f6fa0e779e81f26492ba))

## [1.4.5](https://github.com/herbsjs/herbs2knex/compare/v1.4.4...v1.4.5) (2022-04-21)


### Bug Fixes

* **deps:** bump ansi-regex from 3.0.0 to 3.0.1 ([c048c16](https://github.com/herbsjs/herbs2knex/commit/c048c165b7e64933b87ae052b2cdb1c22f53f8ed))

## [1.4.4](https://github.com/herbsjs/herbs2knex/compare/v1.4.3...v1.4.4) (2022-04-20)


### Bug Fixes

* update gotu version ([ef48f49](https://github.com/herbsjs/herbs2knex/commit/ef48f49782eb35f9c2a454504a7a562883de6837))

## [1.4.3](https://github.com/herbsjs/herbs2knex/compare/v1.4.2...v1.4.3) (2022-04-14)


### Bug Fixes

* **deps:** bump knex from 1.0.5 to 1.0.7 ([cb8a8e6](https://github.com/herbsjs/herbs2knex/commit/cb8a8e6deac5d0006c94fa957adfa6198ba641c4))

## [1.4.2](https://github.com/herbsjs/herbs2knex/compare/v1.4.1...v1.4.2) (2022-04-09)


### Bug Fixes

* 🐛 update knex and database packages dependencies ([5bea990](https://github.com/herbsjs/herbs2knex/commit/5bea9905f6823d7bfa5a04ce1149297bfd62b376))

## [1.4.1](https://github.com/herbsjs/herbs2knex/compare/v1.4.0...v1.4.1) (2022-01-15)


### Bug Fixes

* **dependency version update:** fixed the version of the package `tedious` ([0fed5f0](https://github.com/herbsjs/herbs2knex/commit/0fed5f0e0636f8251fd6ad506787663e23d35f7f))

# [1.4.0](https://github.com/herbsjs/herbs2knex/compare/v1.3.1...v1.4.0) (2022-01-15)


### Features

* **repository:** adds support to identify entity ids automatically ([d6e2fd2](https://github.com/herbsjs/herbs2knex/commit/d6e2fd2e0f579741a94a94c607b1de3d7023eed3)), closes [#35](https://github.com/herbsjs/herbs2knex/issues/35)

## [1.3.1](https://github.com/herbsjs/herbs2knex/compare/v1.3.0...v1.3.1) (2022-01-15)


### Bug Fixes

* update herbs depedencies ([ba83c3a](https://github.com/herbsjs/herbs2knex/commit/ba83c3a0671f7843ab5cb969c9d27ea924104e0e))

# [1.3.0](https://github.com/herbsjs/herbs2knex/compare/v1.2.0...v1.3.0) (2022-01-15)


### Features

* change custom convention integration test name ([04c66bf](https://github.com/herbsjs/herbs2knex/commit/04c66bfc76c8754712e4790f4ef0168f368b43e5))
* change static from Convention class for create a new instance always  repository is created ([17dc9a8](https://github.com/herbsjs/herbs2knex/commit/17dc9a8f1c2bb90e601d482134fd7bbb9adf4f98))
* include custom convention to read database fields ([6ea3118](https://github.com/herbsjs/herbs2knex/commit/6ea3118db6b92d654a9712cf15820e14f95e38e2))
* include unit tests for custom convention ([2532ebb](https://github.com/herbsjs/herbs2knex/commit/2532ebba87525943b47f3eb9d8f18b50b20fc1d8))
* update custom convention example on readme ([31717fb](https://github.com/herbsjs/herbs2knex/commit/31717fbbd540c02ca1c77ca9a119cbaf72304cae))

# [1.2.0](https://github.com/herbsjs/herbs2knex/compare/v1.1.2...v1.2.0) (2022-01-10)


### Features

* include integration and unit folders to segregate tests ([22c5260](https://github.com/herbsjs/herbs2knex/commit/22c52602d3b4fb04759ae5f172b58b8afb1e26bd))

## [1.1.2](https://github.com/herbsjs/herbs2knex/compare/v1.1.1...v1.1.2) (2021-10-26)


### Bug Fixes

* **mysql:** fix mysql update ([d3250c4](https://github.com/herbsjs/herbs2knex/commit/d3250c4b3c16de8edd73263ab38527d1d46e740a)), closes [#32](https://github.com/herbsjs/herbs2knex/issues/32)

## [1.1.1](https://github.com/herbsjs/herbs2knex/compare/v1.1.0...v1.1.1) (2021-10-17)


### Bug Fixes

* update dependency of db libraries ([ee0f054](https://github.com/herbsjs/herbs2knex/commit/ee0f0547748ff9a75506b9e825957957fe93f982))

# [1.1.0](https://github.com/herbsjs/herbs2knex/compare/v1.0.0...v1.1.0) (2021-10-11)


### Features

* **first:** add first method feature ([0bfe46e](https://github.com/herbsjs/herbs2knex/commit/0bfe46e7a45a48eca9f16f07536187e9c64ba7c0)), closes [#26](https://github.com/herbsjs/herbs2knex/issues/26)

# 1.0.0 (2021-06-23)


### Features

* change library to herbs organization ([8ebcba2](https://github.com/herbsjs/herbs2knex/commit/8ebcba2dacf9ca931b23c3326ff96a38670d2542))
