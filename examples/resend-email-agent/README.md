[Deploy to Netlify]: https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&create_from_path=examples/resend-email-agent&utm_campaign=dx-examples

![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# Resend Email Agent: Recipe Rescuer

This example demonstrates how to build an email-to-app pipeline using Netlify's platform primitives. Users email photos of handwritten recipes (like grandma's recipe cards) to an inbound address. The system extracts the recipe using AI-powered OCR, stores it, and displays it in a polished React frontend.

## Netlify Primitives in Action

This project showcases several Netlify primitives working together:

- **[AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/)**: Provides access to Google Gemini for OCR extraction without managing API keys.
- **[Netlify Functions](https://docs.netlify.com/functions/overview/)**: Serverless functions handle webhooks, serve APIs, and stream media.
- **[Background Functions](https://docs.netlify.com/functions/background-functions/)**: Long-running functions process email attachments asynchronously.
- **[Netlify Blobs](https://docs.netlify.com/blobs/overview/)**: Key-value storage persists recipes, images, and tag registry data.

## How It Works

1. **User emails a recipe photo** to a Resend inbound address
2. **Resend webhook** triggers a Netlify Function with the email metadata
3. **Background function** downloads the attachment via Resend's API
4. **Google Gemini extracts** title, description, ingredients, steps, tags, and more via OCR
5. **Recipe data and images** are stored in Netlify Blobs
6. **React frontend** displays recipes in a card grid with tag filtering
7. **Admins can edit** extracted data to fix OCR errors

The same email can contain multiple recipe images—each is processed and stored separately.

## Clone and Deploy

Deploy your own version by clicking the button below:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)][Deploy to Netlify]

This will:

1. Clone this example to your GitHub account
2. Create a new site in your Netlify account
3. Build and deploy the site with AI Gateway automatically enabled

### Configure Resend

This example uses [Resend](https://resend.com) for inbound email processing. You'll need a Resend account and a domain you control.

**1. Set up an inbound domain in Resend:**

- Go to [Resend Domains](https://resend.com/domains) and add a domain (e.g., `inbound.yourdomain.com`)
- Add the required DNS records (MX and TXT) to your domain
- Wait for verification to complete

**2. Create a webhook for inbound emails:**

- Go to [Resend Webhooks](https://resend.com/webhooks)
- Click "Add Webhook"
- Set the endpoint URL to `https://your-site.netlify.app/api/resend-inbound`
- Select the `email.received` event
- Copy the signing secret (starts with `whsec_`)

**3. Get your API key:**

- Go to [Resend API Keys](https://resend.com/api-keys)
- Create a new API key with "Sending access" permission (needed to fetch attachments)

**4. Configure environment variables in Netlify UI:**

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_WEBHOOK_SECRET` | Webhook signing secret (starts with `whsec_`) |
| `RESEND_INBOUND_ADDRESS` | Your inbound email (e.g., `recipes@inbound.yourdomain.com`) |
| `ADMIN_TOKEN` | Optional token for recipe editing (leave empty for demo mode) |

**5. Test it:**

Send an email with a recipe photo attached to your inbound address. The recipe should appear on your site within a few seconds.

## Local Development

After deploying with the button above:

```bash
# Clone YOUR newly created repo (not netlify/examples)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
cd YOUR_REPO_NAME

# Install dependencies
npm install

# Link to your Netlify site
netlify link

# Start the dev server
netlify dev
```

The `netlify link` command connects your local environment to the deployed site, enabling Blob storage and AI Gateway access.

For webhook testing, expose your local server using Tailscale or ngrok and update your Resend webhook URL accordingly.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + React Router
- **Backend**: Netlify Functions (modern `.mts` format)
- **Storage**: Netlify Blobs
- **AI**: Google Gemini via AI Gateway
- **Email**: Resend inbound webhooks with Svix signature verification
- **Icons**: Lucide React
- **Fonts**: Playfair Display + Inter (Google Fonts)

## More Examples

Explore other examples in the [Netlify examples repository](https://github.com/netlify/examples).
