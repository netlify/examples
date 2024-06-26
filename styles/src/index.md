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

<section>

  <h3 id="syntax-highlighting">Syntax highlighting</h3>

  Provided by [highlight.js](https://highlightjs.org), this can be used either during the build (ideally), or client-side for simplicity in demos and examples. A custom palatte is included [in the CSS provided from this site](https://example-styles.netlify.app/styles.css).

  Add the following the the `<head>` of your HTML for a client-side drop-in:

  ```html
  <!-- syntax highlighting  -->
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@latest/build/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
  ```


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

```html
<footer>
  <div class="flex-btwn">
    <a href="https://www.netlify.com/"><img src="https://example-styles.netlify.app//images/logo-netlify-small-monochrome-lightmode.svg" class="nf-logo" alt="Netlify logo"></a>
    <div class="social-icons">
      <a href="https://youtube.com/Netlify"><img src="https://example-styles.netlify.app/icons/youtube.svg" alt="YouTube"></a>
      <a href="https://github.com/netlify/examples"><img src="https://example-styles.netlify.app/icons/github.svg" alt="GitHub"></a>
      <a href="https://x.com/Netlify"><img src="https://example-styles.netlify.app/icons/twitter.svg" alt="X"></a>
      <a href="https://linkedin.com/company/Netlify"><img src="https://example-styles.netlify.app/icons/linkedin.svg" alt="LinkedIn"></a>
      <a href="https://answers.netlify.com"><img src="https://example-styles.netlify.app/icons/discourse.svg" alt="Netlify Answers"></a>
    </div>
  </div>
  <div class="links-container">
    <section>
      <h3>Developers</h3>
      <ul role="list">
        <li><a href="https://developers.netlify.com/">Netlify Developers</a></li>
        <li><a href="https://developers.netlify.com/sdk/">Netlify SDK</a></li>
        <li><a href="https://developers.netlify.com/cli/">Netlify CLI</a></li>
        <li><a href="https://developers.netlify.com/feed/">Activity Feed</a></li>
        <li><a href="https://docs.netlify.com">Documentation</a></li>
        <li><a href="https://netlify.com/conference/">Compose Conference</a></li>
      </ul>
    </section>
    <section>
      <h3>Company</h3>
      <ul role="list">
        <li><a href="https://netlify.com/blog/">Blog</a></li>
        <li><a href="https://netlify.com/about/">About</a></li>
        <li><a href="https://netlify.com/careers/">Careers</a></li>
        <li><a href="https://netlify.com/press/">Press</a></li>
        <li><a href="https://swag.netlify.com/">Netlify Store</a></li>
        <li><a href="https://netlify.com/sustainability/">Sustainability</a></li>
      </ul>
    </section>
    <section>
      <h3>Contact Us</h3>
      <ul role="list">
        <li><a href="https://netlify.com/enterprise/contact/">Sales</a></li>
        <li><a href="https://netlify.com/support/">Support</a></li>
        <li><a href="https://netlifystatus.com/">Status</a></li>
        <li><a href="https://answers.netlify.com/">Forums</a></li>
        <li><a href="https://netlify.com/agency-directory/">Hire an Agency</a></li>
      </ul>
    </section>
  </div>
  <small>
    <ul>
      <li><a href="https://netlify.com/trust-center/">Trust Center</a></li>
      <li><a href="https://netlify.com/privacy/">Privacy</a></li>
      <li><a href="https://netlify.com/security/">Security</a></li>
      <li><a href="https://netlify.com/gdpr-ccpa/">GDPR/CCPA</a></li>
      <li><a href="mailto:fraud@netlify.com?subject=Abuse%20report&body=Please%20include%20the%20site%20URL%20and%20reason%20for%20your%20report%2C%20and%20we%20will%20reply%20promptly.">Abuse</a></li>
      </ul>
      <div>© 2024 Netlify</div>
    </small>
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
