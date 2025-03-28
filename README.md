[![Build Status](https://github.com/poorprogrammer/cfo/actions/workflows/build.yml/badge.svg)](https://github.com/poorprogrammer/cfo/actions)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=poorprogrammer_cfo&metric=coverage)](https://sonarcloud.io/dashboard?id=poorprogrammer_cfo)[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=poorprogrammer_cfo&metric=bugs)](https://sonarcloud.io/dashboard?id=poorprogrammer_cfo)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=poorprogrammer_cfo&metric=code_smells)](https://sonarcloud.io/dashboard?id=poorprogrammer_cfo)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=poorprogrammer_cfo&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=poorprogrammer_cfo)

# Automated CFO for Odds

Automated Chief Financial Officer for Odds people

## Run unit test

```
make test-web
./script/unittestapi
```

## Run end-to-end test

```
make e2e
```

## Run api server

```
make dev-web
```

### Load initial fixtures

```
cd api
node tests/fixtures/loadData.js
```

## Run web server

```
make dev-web
```


## Production configuration 

overwrite it using Environment Variables. See `.env` for more details.

<https://cli.vuejs.org/guide/mode-and-env.html>
