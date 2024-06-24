---
layout: "_layouts/base.liquid"
title: "Netlify examples - style resources"
---

<section>
  <h2 id="usage">Usage</h2>  
  <p>
    A minified CSS file is available to use directly in your sites by linking to <a href="https://example-styles.netlify.app/styles.css">this stylesheet</a> URL. To ease the performance hit of sourcing the fonts from another domain via this CSS, we should preload those too
  </p>

```
<link rel="preload" href="https://example-styles.netlify.app/fonts/PacaembuVar-latin.woff2" as="font" type="font/woff2" />
<link rel="preload" href="https://example-styles.netlify.app/fonts/MulishVar-latin.woff2" as="font" type="font/woff2" />
<link rel="stylesheet" href="https://example-styles.netlify.app/styles.css">
```

Review the [reference](/reference) page to review how this stylesheet formats standard HTML elements and also for some additional utility classes which it makes available.

</section>
<hr>
<section>
  <h2>HTML snippets</h2>
  <p>
    In addition to using the provided CSS, a number of HTML snippets are available to include in your examples and demos in order to add some boilerplate page elements. These are provided here as HTML so that they can be used in whatever framework or components your project employs.
  </p>
  <h3>Header and global navigation</h3>
     
```
<header>
  <nav>
    <a href="https://www.netlify.com/">
      <img src="https://example-styles.netlify.app/images/logo-netlify-small-monochrome-darkmode.svg" alt="Netlify" class="nf-logo">
    </a>
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

<h3>Footer</h3>  

```
<footer>
  <nav>
    <ul>
      <li>
        <a href="https://www.netlify.com/">
          <img class="nf-logo" src="/images/logo-netlify-small-monochrome-lightmode.svg" alt="Netlify">
        </a>
      </li>
      <li><a href="https://github.com/netlify/examples">Netlify Examples</a></li>
      <li><a href="https://developers.netlify.com">Netlify Developer Hub</a></li>
    </ul>
  </nav>
</footer>
```

</section>
<hr>
<section>

  <h2>Codepen</h2>
  <p>
    For convenience, you can experiment with using example styles using a Codepen template.
  </p>
  <p>
    <a href="https://codepen.io/pen?template=OJYzMOY" class="btn-primary">Create new Codepen from template</a>
  </p>

</section>
