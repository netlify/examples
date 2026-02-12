# SmartSQL

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&subdirectory=smartsql)

Natural language database queries on Netlify. SmartSQL converts plain English to SQL automatically, making data accessible without SQL expertise.

## Netlify Primitives in Action

- **Netlify Functions** - Serverless endpoints for database seeding and queries
- **Environment Variables** - Automatic configuration via Raindrop integration
- **Raindrop SmartSQL** - Natural language to SQL query conversion with AI
- **Edge Computing** - Fast query execution close to users

## How It Works

1. Click "Seed Database" to populate sample sales data (customers, products, orders)
2. Switch to "Query Data" tab
3. Type a natural language question like "Show me top customers by order value"
4. SmartSQL converts the question to SQL query automatically
5. Results display with AI reasoning and the generated SQL
6. Try example queries or ask your own questions

## Clone and Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&subdirectory=smartsql)

Clicking this button will:
1. Clone this example to a new Netlify project
2. Prompt you to add the Raindrop integration (auto-configures environment variables)
3. Deploy your SmartSQL app instantly

## Local Development

### Prerequisites
- Node.js 18+ installed
- Netlify CLI installed (`npm install -g netlify-cli`)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/netlify/examples.git
   cd examples/smartsql
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link to your Netlify project:
   ```bash
   netlify link
   ```
   This connects your local environment to the deployed site and pulls environment variables.

4. Run the development server:
   ```bash
   netlify dev
   ```

### Environment Variables

The following are automatically set when you add the Raindrop integration:
- `RAINDROP_API_KEY` - Your Raindrop API authentication key
- `RAINDROP_SMARTSQL_NAME` - SmartSQL instance identifier
- `RAINDROP_APPLICATION_NAME` - Application namespace
- `RAINDROP_APPLICATION_VERSION` - Version identifier

No manual configuration needed!

## Tech Stack

- **[Netlify Functions](https://docs.netlify.com/functions/overview/)** - Serverless API endpoints
- **[Raindrop SmartSQL](https://docs.liquidmetal.ai/)** - Natural language database queries
- **[@liquidmetal-ai/lm-raindrop](https://www.npmjs.com/package/@liquidmetal-ai/lm-raindrop)** - Raindrop JavaScript SDK
- **SQLite** - Embedded relational database (via SmartSQL)
- **Vanilla JavaScript** - Frontend with no framework dependencies

## Project Structure

```
smartsql/
├── netlify.toml                    # Netlify configuration
├── netlify/functions/
│   ├── seed.js                     # Seeds database with sample data
│   └── query.js                    # Handles natural language queries
└── public/
    ├── index.html                  # Query UI
    ├── style.css                   # Styling
    └── app.js                      # Client-side logic
```

## Database Schema

The starter creates a relational sales database:

**customers**
- id, name, email, created_at

**products**
- id, name, price, category

**orders**
- id, customer_id, order_date, total_amount

**order_items**
- id, order_id, product_id, quantity, price

Sample data: 10 customers, 20 products, 30 orders with line items

## Example Queries

Try these natural language questions:
- "Show me the top 5 customers by total order value"
- "What is the total revenue for November 2024?"
- "Which products have been ordered more than 5 times?"
- "Show me all orders from the Electronics category"
- "What is the average order value?"
- "List customers who haven't placed any orders"

## More Examples

Check out more examples in the [Netlify examples repository](https://github.com/netlify/examples).
