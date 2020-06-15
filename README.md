# Aven Actions

Pre-made "Actions" for deploying Aven projects with GitHub Actions

[![AvenCloud/actions status](https://github.com/AvenCloud/actions/workflows/Main/badge.svg?branch=master)](https://github.com/AvenCloud/actions/actions?query=branch%3Amaster)

- [New Server Quick Setup](#new-server-quick-setup)

| Action                | `uses`                          | Description                                                                                            |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Checkout](#checkout) | `AvenCloud/actions/checkout@v1` | Get the latest copy of code from github and install node dependencies                                  |
| [Prepare](#prepare)   | `AvenCloud/actions/prepare@v1`  | Prepare an Ubuntu server for running a node backend                                                    |
| [Deploy](#deploy)     | `AvenCloud/actions/deploy@v1`   | Prepare the runtime server environment, copy new compiled sources over, and start the new application. |

- [Development](#development)

## New Server Quick Setup

1. Generate a new deploy key pair `(mkfifo key ...`
2. Add key to GitHub Secrets
   - `DEPLOY_KEY`
3. Create new server instance
   - Use generated public key for `root` `authorized_keys`
   - get new server IP
4. Create DNS entry for IP
5. Add workflow file to repo
6. Commit & Push

### Generate Keys

Run this command on a linux bash shell to generate a new key pair.

<!-- cSpell:ignore mkfifo -->

```bash
(mkfifo key key.pub && cat key key.pub &) && echo "y" | ssh-keygen -t rsa -b 4096 -C "GitHub Action $(date +%Y-%m-%d)" -N '' -q -f key > /dev/null; rm key key.pub
```

1. Take the `-----BEGIN RSA PRIVATE KEY-----\n...[lines of base64]...\n-----END RSA PRIVATE KEY-----` and add to github secrets for project
2. Take the `ssh-rsa [bas64 data] GitHub Action ...` and use for new droplet with Digital Ocean.

### Workflow Config

Add a step to a GitHub Action `.yml` config like this, depending on the features you'd like to use.

A minimal, but complete, example `workflow.yml`:

```yml
on: push
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Latest
        uses: AvenCloud/actions/checkout@v1

      - name: Build Application
        run: yarn build

      - name: Deploy to Runtime Server
        uses: AvenCloud/actions/deploy@v1
        with:
          domains: example.com
          deploy-key: ${{ secrets.DEPLOY_KEY }}
          # See below for more options
```

## [Checkout](src/actions/checkout)

Checkout latest version of code and run `yarn` or `npm` to initialize dependencies.

### What it does

- Clones a (shallow) copy of the code base
  - Mostly matches `actions/checkout` official action
- Installs any needed operating system dependencies
  - References configuration file that specifies needed dependencies - _In progress_
- Installs yarn (or npm) dependencies
  - Automatic caching of dependencies

### Usage

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

      # Now you can do other stuff like...

      - name: Test and Check
        uses: yarn test

      - name: Build Application
        run: yarn build
```

## Prepare(src/actions/prepare)

Prepare an Ubuntu server for running a node backend

### Usage

```yml
on: push
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Latest
        uses: AvenCloud/actions/checkout@v1

      # Now you can do other stuff like...

      - name: Test and Check
        uses: yarn test

      - name: Build Application
        run: yarn build

      - name: Checkout Latest
        uses: AvenCloud/actions/prepare@v1
```

## [Deploy](src/actions/deploy)

Prepare the runtime server environment, copy new compiled sources over, and start the new application.

### Usage

```yml
jobs:
  my-job:
    runs-on: ubuntu-latest # Anything should work
    steps:
      - name: Use Aven Tools Deploy Action
        uses: AvenCloud/actions/deploy@v1
        with:
          domains: example.com
          deploy-key: ${{ secrets.DEPLOY_KEY }}

          ## Remaining options are optional

          # Give service a specific name
          service-name: myService

          # Default run command is `/usr/bin/npm start`
          start-server-command: /usr/bin/yarn my-start

          # Override default image timezone
          runtime-server-timezone: America/Los_Angeles

          # Authorize other keys to access the machine
          extra-keys: |
            https://exmaple.com/my.keys
            github-user-account

          # local directory to copy to remote
          deploy-directory: dist

          # Extra [Service] configuration for systemd service file
          service-configs: |
            # Raw text. Maybe bring in secrets:
            Environment=MY_SECRET=${{ toJSON(secrets.MY_SECRET) }}

          service-config-files: # List of extra files to copy as service file overrides

          # Change log level of action
          verbosity: 3
```

## Development

Run a single command to setup a development environment to work on AvenTools/actions:

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
