# Netlify Example Styles

Quickly apply some simple branding to Netlify examples and demos

https://example-styles.netlify.app

---

## Usage

### CSS via CDN

A minified CSS file is available to use directly in your sites by linking to this stylesheet URL. To ease the performance hit of sourcing the fonts from another domain via this CSS, we should preload those too

```html
<link rel="preload" href="https://example-styles.netlify.app/fonts/PacaembuVar-latin.woff2" as="font" type="font/woff2" />
<link rel="preload" href="https://example-styles.netlify.app/fonts/MulishVar-latin.woff2" as="font" type="font/woff2" />
<link rel="stylesheet" href="https://example-styles.netlify.app/styles.css">
```


### HTML snippets

In addition to using the provided CSS, a number of HTML snippets are available to include in your examples and demos in order to add some boilerplate page elements. These are provided here as HTML so that they can be used in whatever framework or components your project employs.

#### Header and global navigation

```html
<header>
  <nav>
    <a href="https://www.netlify.com/"><img src="/images/logo-netlify-small-monochrome-darkmode.svg" alt="Netlify"></a>
    <ul>
      <li>Active page</li>
      <li><a href="/">Navigation</a></li>
    </ul>
  </nav>
  <section>
    <h1>Example title</h1>
    <p>Short description of example</p>
  </section>
</header>
```


## Development and deployment

We use Sass and Eleventy to bundle and minify our CSS. After cloning this repository you can install the dependencies and run a local dev server to facilitate development of the styles and boilerplate.


### Prerequisites

- [pnpm](https://pnpm.io/) (recommended to manage dependencies due to its more efficient use of local packages)
- [Netlify Dev](https://developers.netlify.com/cli)

```shell
# install dependencies
pnpm i

# run local build a and dev server
ntl dev
```

### Deployment

This repo is the source of the site deployed at https://example-styles.netlify.app. Pushing to the `main` branch will update the site.
