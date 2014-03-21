# Affirmations Referral Network

A Google-spreadsheet backed directory of healthcare providers.

## Getting started

Clone the repository.

Install dependencies:

```
npm install
```

## Baking the providers JSON file

The list of healthcare providers is stored in a Google spreadsheet, but we bake it to a static JSON file for speed.  To fetch the latest list of healthcare providers and bake it to a JSON file, run this task:

```
grunt bakeproviders
```

## Building the site

```
grunt assemble
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

