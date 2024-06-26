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
<section>



### Sections and paragraphs

Wrapping elements in a `<section>` applies the line-length constraint and centers content in the page.

Paragraphs `<p>` have been given some spacing. 

A horizontal rule `<hr>` can be used to add some subtle visual separation.

<p>
<small>
  
  Small-print or [side comments](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small) can be added using the `<small>` element as usual.

</small>
</p>


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


  <blockquote>
  <h2>Titles in blockquotes</h2>
  <p>
   Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque perspiciatis placeat sit deserunt suscipit quisquam eaque hic dolorum libero magnam! Ducimus quis adipisci amet mollitia atque dicta iste aut ratione?
  </p>
  </blockquote>


  ### Lists
  
  Ordered and unordered lists get a little breathing room. We also style the number or bullet with a tiny bit of color variation.

  #### Ordered lists

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

#### Unordered lists

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

  #### Description lists

  ```html
  <dl>
    <dt>Description term</dt><dd>Description data</dd>
    <dt>Description term</dt><dd>Description data</dd>
    <dt>Description term</dt><dd>Description data</dd>
  </dl>
  ```

  <dl>
    <dt>Description term</dt><dd>Description data</dd>
    <dt>Description term</dt><dd>Description data</dd>
    <dt>Description term</dt><dd>Description data</dd>
  </dl>

</section>
<hr>
<section>

## Form elements

Using `input` elements nested inside `labels` for implicit association. 

```html
<form>

  <!-- Text inputs -->
  <label>Text input label
    <input type="text" placeholder="text input">
  </label>
  
  <!-- Password inputs -->
  <label>Password input label
    <input type="password" placeholder="password input">
  </label>

  <!-- Select inputs -->
  <label>Select input label
    <select>
      <option value="1" selected>Option one</option>
      <option value="2">Option two</option>
      <option value="3">Option three</option>
    </select>
  </label>

  <!-- Submit button -->
  <input type="submit" value="Submit button">
  
</form>
```

<form>
  <label>Text input label
    <input type="text" placeholder="text input">
  </label>
  <label>Password input label
    <input type="password" placeholder="password input">
  </label>
  <label>Select input label
    <select>
      <option value="1" selected>Option one</option>
      <option value="2">Option two</option>
      <option value="3">Option three</option>
    </select>
  </label>
  <input type="submit" value="Submit button">
</form>
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

### Presentation blocks

#### Panels

A visual container can be applied with the use of the `panel` class. This encloses the element in a subtle shaded box, without effected in the markup semantics, like so:

```html
<div class="panel">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit...
  </p>
</div>
```

<div class="panel">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque perspiciatis placeat sit deserunt suscipit quisquam eaque hic dolorum libero magnam! Ducimus quis adipisci amet mollitia atque dicta iste aut ratione?
  </p>
</div>


### Flexbox

Adding the class `flex-btwn` applies the following CSS to an element:

```CSS
.flex-btwn {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
```

This can be helpful for the common layout task of spacing some items out across a containing element, for example:

```html
<ul class="flex-btwn">
  <li>Items</li>
  <li>Spread</li>
  <li>Across</li>
  <li>Element</li>
</ul>

```

<ul class="flex-btwn">
  <li>Items</li>
  <li>Spread</li>
  <li>Across</li>
  <li>Element</li>
</ul>
