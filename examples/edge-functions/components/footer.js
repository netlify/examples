export default function footer() {
  const date = new Date();
  const year = date.getFullYear();
  return `

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
        <li><a id="cta-footer-sales" href="https://netlify.com/enterprise/contact/">Sales</a></li>
        <li><a id="cta-footer-support" href="https://netlify.com/support/">Support</a></li>
        <li><a id="cta-footer-status" href="https://netlifystatus.com/">Status</a></li>
        <li><a id="cta-footer-answers" href="https://answers.netlify.com/">Forums</a></li>
        <li><a id="cta-footer-agencyDirectory" href="https://netlify.com/agency-directory/">Hire an Agency</a></li>
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
  `;
}
