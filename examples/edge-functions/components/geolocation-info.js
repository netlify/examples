export default function geolocation({ city, countryCode, countryName, latitude, longitude, timezone }) {
  return `
    <div class="panel">
      <img src="https://flagcdn.com/96x72/${countryCode?.toLowerCase()}.png" style="height:2em;" alt="${countryName}" />
      <dl>
        <dt>Your country name</dt><dd>${countryName}</dd>
        <dt>Your country code</dt><dd>${countryCode}</dd>
        <dt>Your city</dt><dd>${city}</dd>
        <dt>Your coordinatse</dt><dd>${latitude}, ${longitude}</dd>
        <dt>Your timezone</dt><dd>${timezone}</dd>
      </dl>
    </div>
  `;
}
