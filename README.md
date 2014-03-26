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
grunt bakeproviders
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
http-server
```

If you visit http://localhost:8080 in your browser, you'll see the generated site.

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
