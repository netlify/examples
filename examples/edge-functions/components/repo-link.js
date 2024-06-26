export default function repoLink(file, customText) {
  const text = customText || "The Edge Function code:";

  const root = "https://github.com/netlify/examples/tree/main/examples/edge-functions/netlify/edge-functions";

  return `${text} <a href="${root}/${file}" target="_BLANK" rel="noopener">${file}</a>`;
}
