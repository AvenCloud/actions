## Aven Actions

Pre-made "Actions" for deploying Aven projects with GitHub Actions

[![AvenCloud/actions status](https://github.com/AvenCloud/actions/workflows/Main/badge.svg?branch=master)](https://github.com/AvenCloud/actions/actions?query=branch%3Amaster)

## Usage

![Usage Map](Usage.svg)

Add a couple files to your repository.

1. Workflow config
2. Aven config
3. Add secrets

### Workflow Config

Add a step to a GitHub Action `.yml` config like this, depending on the features you'd like to use.

A minimal, but complete, example `workflow.yml`:

```yml
on: push
jobs:
  my-job:
    runs-on: ubuntu-latest # Anything should work
    steps:
      - name: Checkout Latest
        uses: AvenCloud/actions/checkout@v1

      - name: Test and Check
        uses: yarn test

      - name: Build Application
        run: yarn build

      - name: Deploy to Runtime Server
        uses: AvenCloud/actions/deploy@v1
        with:
          deploy-directory: dist
```

### Aven Config

Create a file `aven.json` at the top level of your project.

This file describes how to setup your app on a Debian environment.

```json
{
  "domains": ["my.domain.com", "www.my.domain.com", "alternate.domain.com"],
  "serviceName": "my-systemd-service",
  "timezone": "America/Los_Angeles",
  "aptDependencies": [],
  "runtimeAptDependencies": []
}
```

### Secrets

A couple secrets need to be added to GitHub as well:

#### Deploy Keys

Keys that will allow root access to server we're deploying to.

Run this command on a linux bash shell to generate a new key pair.

- `DEPLOY_KEY` _Example: `-----BEGIN RSA PRIVATE KEY-----\n...[lines of base64]...\n-----END RSA PRIVATE KEY-----`_
- `DEPLOY_KEY_PUB` _Example: `ssh-rsa AAAAB...[base64]...m6Q== GitHub Action 2020-02-17`_

<!-- cSpell:ignore mkfifo -->

```bash
(mkfifo key key.pub && cat key key.pub &) && echo "y" | ssh-keygen -t rsa -b 4096 -C "GitHub Action $(date +%Y-%m-%d)" -N '' -q -f key ; rm key key.pub
```

### Checkout

Setup the working environment.

- Clone a (shallow) copy of the code base
  - Mostly matches `actions/checkout` official action
- Install any needed operating system dependencies
  - References configuration file that specifies needed dependencies?
- Install yarn (or npm) dependencies
  - Automatic caching of dependencies

```yml
jobs:
  my-job:
    runs-on: ubuntu-latest # Anything should work
    steps:
      - name: Use Aven Tools Checkout Action
        uses: AvenCloud/actions/checkout@v1
        with:
          # All optional
          ref: Git Reference to download
          repo: GitHub Repository to download
          token: GH Token Override
```

### Deploy

Do the deploy step specified by the aven project.
Likely includes migration script.

- Run `npm run deploy`

```yml
jobs:
  my-job:
    runs-on: ubuntu-latest # Anything should work
    steps:
      - name: Use Aven Tools Deploy Action
        uses: AvenCloud/actions/deploy@v1
        with:
          deploy-directory: dist
          verbosity: 3
```

## New Server Setup

1. Generate a new deploy key pair `(mkfifo key ...`
2. Add keys to GitHub Secrets
   - `DEPLOY_KEY`
   - `DEPLOY_KEY_PUB`
3. Create new server instance
   - Use generated key for `root` `authorized_keys`
   - get new server IP
4. Create DNS entry for IP
5. Add files to repo
   - `aven.json`
   - GitHub Workflow
6. Commit & Push

## Development

Setup everything

```bash
npm i
```

### Build

Instead of using complicated `scripts` in `package.json`, we use a powerful Node.js script to actually do the building we happen to require.

![Build Map](Export.svg)

### Publish

GitHub Actions, to be usable, need to be released with a "ready to run" version of the code directly from a repository on GitHub.
This goes against the ethos of git that you should not check-in compiled code.

GitHub Actions do allow you to specify a version to actually use.
GitHub recommends "`v1`" as a nice short tag name to use for a released/ready to go version of the code.
The name of the tag is treated like a simplified semver-specifier and it is expected that the maintainer moves this tag when the latest version is released.
Of course extra tags can be used to tag specific minor or patch versions of the releases.

Instead of using tags, we'll be using branches as they support being moved more conventionally.
Specific versions will get tagged.

For performance reasons, there is no need to include the sources in the compiled releases.
Therefore, there is no reason to link the two (source and release) trees.
So the release tree will be independent but reflect the master tree.

We also want to have a set of different tools that are easy to use with interconnected functionality.
Instead of publishing to a number of different repositories so that they each have a different name, we'll use sub-folders of the released versions.

The source for the prepare script that runs on the remote system is also compiled to a sub-folder of `prepare` for consumption by various actions.
