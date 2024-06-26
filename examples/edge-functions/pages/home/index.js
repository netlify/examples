export default {
  title: "Home",
  metaDescription:
    "Explore our library of Edge Function examples and deploy your own to Netlify.",
  page: function () {
    return /* html */ `
    <hr>
    <section>
    <h2>Examples</h2>
    <p>
      Explore the examples below, or over in the <a href="https://github.com/netlify/examples/tree/main/examples/edge-functions" target="_BLANK" rel="noopener">GitHub repository</a> for this site.
    </p>

      <h3>Responses</h3>
      <ul>
        <li><a href="/example/hello">Hello world</a></li>
        <li><a href="/example/json">Return JSON</a></li>
        <li><a href="/example/image">Return an image</a></li>
      </ul>

    <h3>Rewrites and proxies</h3>
    <ul>
    <li><a href="/example/rewrite">Rewrite responses from another URL</a></li>
    <li><a href="/example/proxy-requests">Proxy requests to another source</a></li>
    </ul>

    <h3>HTTP Headers and Methods</h3>
    <ul>
    <li><a href="/example/set-request-header">Set custom HTTP request headers</a></li>
    <li><a href="/example/set-response-header">Set custom HTTP response headers</a></li>
    <li><a href="/example/method">Configure HTTP methods</a></li>
    </ul>

      <h3>Transforming responses</h3>
      <ul>
        <li><a href="/example/transform">Text transformations</a></li>
        <li><a href="/example/htmlrewriter">HTML transformations</a></li>
        <li><a href="/example/include">Content includes</a></li>
      </ul>

      <h3>Geolocation</h3>
      <ul>
        <li><a href="/example/geolocation">Determine a user's location</a></li>
        <li><a href="/example/country-block">Block content according to country</a></li>
        <li><a href="/example/localized-content">Serve localized content</a></li>
      </ul>

      <h3>Cookies</h3>
      <ul>
        <li><a href="/example/cookies-set">Set cookies</a></li>
        <li><a href="/example/cookies-read">Read cookies</a></li>
        <li><a href="/example/cookies-delete">Delete cookies</a></li>
        <li><a href="/example/abtest">Set up an A/B test using cookies</a></li>
      </ul>

      <h3>Streams</h3>
      <ul>
        <li><a href="/example/long-running">Long-running edge functions</a></li>
        <li><a href="/example/server-sent-events">Server-sent events (SSE)</a></li>
      </ul>

      <h3>WebAssembly</h3>
      <ul>
        <li><a href="/example/wasm">Edge WebAssembly</a></li>
      </ul>

      <h3>Environment and debugging</h3>
      <ul>
        <li><a href="/example/log">Write to the logs</a></li>
        <li><a href="/example/environment">Use environment variables</a></li>
        <li><a href="/example/uncaught-exceptions">Read logs for uncaught exceptions</a></li>
        <li><a href="/example/context-site">Access site information</a></li>
      </ul>
    </section>
  `;
  },
};
