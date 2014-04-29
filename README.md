# Affirmations Referral Network

A Google-spreadsheet backed directory of healthcare providers.

## Getting started

Clone the repository.

Install dependencies:

```
npm install
```

Install front-end dependencies:

```
bower install
```

## Baking the providers JSON file

The list of healthcare providers is stored in a Google spreadsheet, but we bake it to a static JSON file for speed.  To fetch the latest list of healthcare providers and bake it to a JSON file, run this task:

```
grunt bakeproviders:local
```

This will update the data file in ``src/data/providers.json``.

## Building the site

```
grunt
```

If you want to automatically regenerate the site as you edit files in your local environment, run:

```
grunt watch
```

## Previewing the site

The site uses protocol-independent URLs for some static libraries.  This makes it hard to just load the generated files in your browser.

Instead, we'll use a simple HTTP server to preview the local version.

First make sure the Node.js [http-server](https://github.com/nodeapps/http-server) package is installed.

```
npm install -g  npm install http-server -g
```

Then serve the built files

```
http-server ./dist
```

If you visit http://localhost:8080 in your browser, you'll see the generated site.

## Deploying the site

The site is intended to be deployed on [GitHub pages](https://pages.github.com/), with the help of [grunt-build-control](https://github.com/robwierzbowski/grunt-build-control).

To build and deploy the site

```
grunt deploy
``` 

## Automation

The project is configured to use Travis CI to run tests, and on success,
rebuild and redeploy the site to GitHub pages.  This will be triggered with
every push to master.

### Automatically incorporating spreadsheet changes

Running the following command will cause the most recent data to be
fetched from the Google Spreadsheet and, if it differs from the data in the
git repo, update the version in the repo:

```
grunt bakeproviders:github
```

This task requires that you create a GitHub [access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use) and set the
``GH_TOKEN`` environment variable to that token value.

This command can be run easily as a cron job or as a scheduled task on Heroku
using the free [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler). The production site currently uses Heroku Scheduler to update the JSON file
(and trigger a rebuild via Travis CI).

To set up the schedule task on Heroku:

```
# Create the app
heroku create
# Deploy the code
git push heroku master
# Set the GH_TOKEN environment variable
heroku config:set GH_TOKEN=your_token_value
# Install the Heroku Scheduler add-on
heroku addons:add scheduler:standard
# Open the web browser to define the schedule task
heroku addons:open scheduler
# In that page, you should enter the scheduled command as:
# ./node_modules/.bin/grunt bakeproviders:github
```

To test the scheduled task, run

```
heroku run ./node_modules/.bin/grunt bakeproviders:github
```


## Editing content

For the most part you'll only want to edit the Markdown files in the ``src/content`` directory and not touch template or data files.

You can clone the respository, or use [Prose.io](http://prose.io/) to make edits.

### Introduction

This is the text that appears below the title on the home page.

File: ``src/content/introduction.md`` 

### About page

File: ``src/content/about.md``

## Data formatting

### Multifields

Some fields in the spreadsheet, such as ``type`` can have multiple values.  The multiple values should be separated by a ``;`` (semicolon) character.
