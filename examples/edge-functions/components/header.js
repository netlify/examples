export default function header({ title }) {
  return `
    <header>
      <nav>
        <a href="https://www.netlify.com/">
          <img src="https://example-styles.netlify.app/images/logo-netlify-small-monochrome-darkmode.svg" alt="Netlify">
        </a>
        <ul>
          <li><a href="/">Edge Functions Examples</a></li>
        </ul>
      </nav>
      <section>
        <h1>Edge Functions Examples</h1>
        <p>${title}</p>
      </section>
    </header>
  `;
}
