export default function header({ title }) {
  return `
    <header>
      <nav>
        <a href="https://www.netlify.com/">
          <img src="https://example-styles.netlify.app/images/logo-netlify-small-monochrome-darkmode.svg" alt="Netlify" class="nf-logo">
        </a>
        <ul>
           ${title == "Home" ? "" : `<ul><li>${title}</li></ul>`}
          <ul><a href="/">Edge Functions Examples</a></li>
        </ul>
      </nav>
      <section>
        <h1>Edge Functions on Netlify</h1>
        <p>Reference examples for learning about Edge Functions on Netlify.</p>
      </section>
    </header>
    <hr>
  `;
}
