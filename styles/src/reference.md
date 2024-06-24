---
layout: "_layouts/base.liquid"
title: "Netlify examples - styles reference"
---

<section>

  ## HTML elements & utility classes

  These examples styles target plan HTML elements to make it as easy as possible to use them in any [POSH](https://microformats.org/wiki/posh) site site without the need to add custom CSS classes.

  In addition, a number of common utility classes are provided to help express more detailed designs.

</section>
<hr>
<section>

## HTML elements


### Sections and paragraphs

Wrapping elements in a `<section>` applies the line-length constraint and centers content in the page.

Paragraphs `<p>` have been given some spacing. 

A horizontal rule `<hr>` can be used to add some subtle visual separation.

</section>
<hr>
<section>

### Headings

```html
<h1>h1. First level header</h1>
<h2>h2. Second level header</h2>
<h3>h3. Third level header</h3>
<h4>h4. Fourth level header</h4>
```

  # h1. First level header
  ## h2. Second level header
  ### h3. Third level header
  #### h4. Fourth level header



</section>
<hr>
<section id="links-and-buttons">

  ### Links and buttons

  Inline anchor tags [appear like this](/) without any additional css.

  Button styles are available to use direclty on button elements or by adding a class to an anchor element.

```html
  <button>Button</button>
  <button disabled>Disabled button</button>
```

  <button>Button</button>
  <button disabled>Disabled button</button>

</section>
<hr>
<section>

  ### Blockquotes

  ```html
  <blockquote>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque perspiciatis placeat sit deserunt suscipit quisquam eaque hic dolorum libero magnam! Ducimus quis adipisci amet mollitia atque dicta iste aut ratione?
  </blockquote>
  ```

  > Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque perspiciatis placeat sit deserunt suscipit quisquam eaque hic dolorum libero magnam! Ducimus quis adipisci amet mollitia atque dicta iste aut ratione?

  ### Lists
  
  Ordered and unordered lists get a little breathing room. We also style the number or bullet with a tiny bit of color variation.

```html
<ol>
  <li>Ordered lists</li>
  <li>Show numbered items </li>
  <li>With this formatting</li>
</ol>
```

  1. Ordered lists
  1. Show numbered items 
  1. With this formatting


```html
<ul>
  <li>Unordered lists</li>
  <li>Show bullet items </li>
  <li>With this formatting</li>
</ul>
```


  - Unordered lists
  - Show bullet items 
  - With this formatting

</section>
<hr>
<section>

## Utility classes

Handy for some additional styling control and UI elements.

### Buttons

If a [button element](#links-and-buttons) is not appropriate, anchor tags can be styled as a button via the `btn-primary` and `btn-secondary` classes.

```html
<a href="/" class="btn-primary">Button link</a>
<a href="/" class="btn-secondary">Button link</a>
```

<p>
  <a href="#" class="btn-primary">Primary button link</a>
  <a href="#" class="btn-secondary">Secondary button link</a>
</p>

