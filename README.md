# rx-maybe

Reactive Extenstions - represents a deferred computation and emission of a single value, no value at all or an exception. 

[![NPM](https://nodei.co/npm/rx-maybe.png)](https://nodei.co/npm/rx-maybe/)

[![](https://data.jsdelivr.com/v1/package/npm/rx-maybe/badge)](https://www.jsdelivr.com/package/npm/rx-maybe)
[![HitCount](http://hits.dwyl.io/lxsmnsyc/rx-maybe.svg)](http://hits.dwyl.io/lxsmnsyc/rx-maybe)

| Platform | Build Status |
| --- | --- |
| Linux | [![Build Status](https://travis-ci.org/LXSMNSYC/rx-maybe.svg?branch=master)](https://travis-ci.org/LXSMNSYC/rx-maybe) |
| Windows | [![Build status](https://ci.appveyor.com/api/projects/status/mkjwe462uk80axx4?svg=true)](https://ci.appveyor.com/project/LXSMNSYC/rx-maybe) |


[![codecov](https://codecov.io/gh/LXSMNSYC/rx-maybe/branch/master/graph/badge.svg)](https://codecov.io/gh/LXSMNSYC/rx-maybe)
[![Known Vulnerabilities](https://snyk.io/test/github/LXSMNSYC/rx-maybe/badge.svg?targetFile=package.json)](https://snyk.io/test/github/LXSMNSYC/rx-maybe?targetFile=package.json)

## Install

NPM

```bash
npm i rx-maybe
```

CDN

* jsDelivr
```html
<script src="https://unpkg.com/rx-scheduler/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/rx-maybe/dist/index.min.js"></script>
```

* unpkg
```html
<script src="https://unpkg.com/rx-scheduler/dist/index.min.js"></script>
<script src="https://unpkg.com/rx-maybe/dist/index.min.js"></script>
```

## Usage

### Loading the module

#### CommonJS

```js
const Maybe = require('rx-maybe');
```

Loading the CommonJS module provides the Maybe class.

#### Browser

Loading the JavaScript file for the rx-maybe provides the Maybe class

## Documentation

You can read the documentation at the [official doc site](https://lxsmnsyc.github.io/rx-maybe/)

## Build

Clone the repo first, then run the following to install the dependencies

```bash
npm install
```

To build the coverages, run the test suite, the docs, and the distributable modules:

```bash
npm run build
```

## Changelogs
* 0.2.0
  - now uses [Schedulers](https://github.com/LXSMNSYC/rx-scheduler)
  - `delay`, `delaySubscription`, `timeout` and `timer` now accepts `Schedulers` (defaults to `Scheduler.current`).
  - added two new operators: `observeOn` (observes the emissions on a given Scheduler) and `subscribeOn` (subscribes to a given Single on a given Scheduler).

* 0.1.0
  * Release