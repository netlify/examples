import { Raindrop } from '@liquidmetal-ai/lm-raindrop';

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Initialize Raindrop client
    const client = new Raindrop({
      apiKey: process.env.RAINDROP_API_KEY,
    });

    const smartSqlLocation = {
      smartSql: {
        name: process.env.RAINDROP_SMARTSQL_NAME,
        version: process.env.RAINDROP_APPLICATION_VERSION,
        application_name: process.env.RAINDROP_APPLICATION_NAME,
      }
    };

    // Check if tables already exist
    try {
      const metadata = await client.getMetadata.retrieve({
        smartSqlLocation: smartSqlLocation,
      });

      // If tables exist, return early
      if (metadata.tables && metadata.tables.length > 0) {
        const tableNames = metadata.tables.map(t => t.tableName);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: true,
            message: 'Database already seeded',
            tablesExist: tableNames,
            alreadySeeded: true,
          }),
        };
      }
    } catch (metadataError) {
      // If metadata retrieval fails, tables probably don't exist yet - continue with seeding
      console.log('No existing tables found, proceeding with seed');
    }

    // Step 1: Create each table with separate calls
    await client.executeQuery.execute({
      smartSqlLocation: smartSqlLocation,
      sqlQuery: `CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, created_at TEXT NOT NULL)`,
    });

    await client.executeQuery.execute({
      smartSqlLocation: smartSqlLocation,
      sqlQuery: `CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, price REAL NOT NULL, category TEXT NOT NULL)`,
    });

    await client.executeQuery.execute({
      smartSqlLocation: smartSqlLocation,
      sqlQuery: `CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, order_date TEXT NOT NULL, total_amount REAL NOT NULL, FOREIGN KEY (customer_id) REFERENCES customers(id))`,
    });

    await client.executeQuery.execute({
      smartSqlLocation: smartSqlLocation,
      sqlQuery: `CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL, price REAL NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(id), FOREIGN KEY (product_id) REFERENCES products(id))`,
    });

    // Step 2: Insert all customers in one query
    await client.executeQuery.execute({
      smartSqlLocation: smartSqlLocation,
      sqlQuery: `INSERT INTO customers (id, name, email, created_at) VALUES
        (1, 'Alice Johnson', 'alice@example.com', '2024-01-15'),
        (2, 'Bob Smith', 'bob@example.com', '2024-02-20'),
        (3, 'Carol Williams', 'carol@example.com', '2024-03-10'),
        (4, 'David Brown', 'david@example.com', '2024-04-05'),
        (5, 'Emma Davis', 'emma@example.com', '2024-05-12'),
        (6, 'Frank Miller', 'frank@example.com', '2024-06-18'),
        (7, 'Grace Wilson', 'grace@example.com', '2024-07-22'),
        (8, 'Henry Moore', 'henry@example.com', '2024-08-30'),
        (9, 'Ivy Taylor', 'ivy@example.com', '2024-09-14'),
        (10, 'Jack Anderson', 'jack@example.com', '2024-10-25')`,
    });

    // Step 3: Insert all products in one query
    await client.executeQuery.execute({
      smartSqlLocation: smartSqlLocation,
      sqlQuery: `INSERT INTO products (id, name, price, category) VALUES
        (1, 'Laptop Pro', 1299.99, 'Electronics'),
        (2, 'Wireless Mouse', 29.99, 'Electronics'),
        (3, 'Desk Chair', 249.99, 'Furniture'),
        (4, 'Standing Desk', 499.99, 'Furniture'),
        (5, 'USB-C Cable', 19.99, 'Electronics'),
        (6, 'Monitor 27"', 399.99, 'Electronics'),
        (7, 'Keyboard Mechanical', 149.99, 'Electronics'),
        (8, 'Desk Lamp', 79.99, 'Furniture'),
        (9, 'Webcam HD', 89.99, 'Electronics'),
        (10, 'Headphones', 199.99, 'Electronics'),
        (11, 'Mouse Pad', 14.99, 'Electronics'),
        (12, 'Cable Organizer', 24.99, 'Furniture'),
        (13, 'Phone Stand', 34.99, 'Furniture'),
        (14, 'Laptop Stand', 59.99, 'Furniture'),
        (15, 'External SSD 1TB', 129.99, 'Electronics'),
        (16, 'USB Hub', 39.99, 'Electronics'),
        (17, 'Desk Mat', 44.99, 'Furniture'),
        (18, 'Monitor Arm', 119.99, 'Furniture'),
        (19, 'Docking Station', 199.99, 'Electronics'),
        (20, 'Portable Charger', 49.99, 'Electronics')`,
    });

    // Step 4: Insert all orders in one query
    await client.executeQuery.execute({
      smartSqlLocation: smartSqlLocation,
      sqlQuery: `INSERT INTO orders (id, customer_id, order_date, total_amount) VALUES
        (1, 1, '2024-11-01', 1329.98),
        (2, 2, '2024-11-02', 749.98),
        (3, 3, '2024-11-03', 279.98),
        (4, 1, '2024-11-04', 449.98),
        (5, 4, '2024-11-05', 1699.97),
        (6, 5, '2024-11-06', 89.99),
        (7, 2, '2024-11-07', 549.98),
        (8, 6, '2024-11-08', 229.98),
        (9, 7, '2024-11-09', 1499.98),
        (10, 3, '2024-11-10', 169.98),
        (11, 8, '2024-11-11', 679.97),
        (12, 1, '2024-11-12', 249.99),
        (13, 9, '2024-11-13', 1829.96),
        (14, 4, '2024-11-14', 399.99),
        (15, 10, '2024-11-15', 289.98),
        (16, 5, '2024-11-16', 519.97),
        (17, 6, '2024-11-17', 1549.97),
        (18, 7, '2024-11-18', 79.99),
        (19, 8, '2024-11-19', 959.96),
        (20, 2, '2024-11-20', 329.98),
        (21, 9, '2024-11-21', 649.98),
        (22, 10, '2024-11-22', 1199.98),
        (23, 3, '2024-11-23', 199.99),
        (24, 4, '2024-11-24', 879.97),
        (25, 5, '2024-11-25', 149.99),
        (26, 1, '2024-11-26', 459.98),
        (27, 6, '2024-11-27', 1099.98),
        (28, 7, '2024-11-28', 239.98),
        (29, 8, '2024-11-29', 729.97),
        (30, 9, '2024-11-30', 399.99)`,
    });

    // Step 5: Insert all order_items in one query
    await client.executeQuery.execute({
      smartSqlLocation: smartSqlLocation,
      sqlQuery: `INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES
        (1, 1, 1, 1, 1299.99),
        (2, 1, 2, 1, 29.99),
        (3, 2, 3, 1, 249.99),
        (4, 2, 4, 1, 499.99),
        (5, 3, 7, 1, 149.99),
        (6, 3, 9, 1, 89.99),
        (7, 3, 11, 1, 14.99),
        (8, 3, 5, 1, 19.99),
        (9, 4, 6, 1, 399.99),
        (10, 4, 18, 1, 119.99),
        (11, 5, 1, 1, 1299.99),
        (12, 5, 6, 1, 399.99),
        (13, 6, 9, 1, 89.99),
        (14, 7, 4, 1, 499.99),
        (15, 7, 8, 1, 79.99),
        (16, 8, 10, 1, 199.99),
        (17, 8, 2, 1, 29.99),
        (18, 9, 1, 1, 1299.99),
        (19, 9, 10, 1, 199.99),
        (20, 10, 7, 1, 149.99),
        (21, 10, 5, 1, 19.99),
        (22, 11, 15, 1, 129.99),
        (23, 11, 4, 1, 499.99),
        (24, 11, 18, 1, 119.99),
        (25, 12, 3, 1, 249.99),
        (26, 13, 1, 1, 1299.99),
        (27, 13, 6, 1, 399.99),
        (28, 13, 15, 1, 129.99),
        (29, 14, 6, 1, 399.99),
        (30, 15, 19, 1, 199.99),
        (31, 15, 9, 1, 89.99),
        (32, 16, 4, 1, 499.99),
        (33, 16, 5, 1, 19.99),
        (34, 17, 1, 1, 1299.99),
        (35, 17, 7, 1, 149.99),
        (36, 17, 19, 1, 199.99),
        (37, 18, 8, 1, 79.99),
        (38, 19, 1, 1, 1299.99),
        (39, 19, 2, 1, 29.99),
        (40, 19, 5, 2, 39.98),
        (41, 20, 7, 1, 149.99),
        (42, 20, 10, 1, 199.99),
        (43, 21, 4, 1, 499.99),
        (44, 21, 7, 1, 149.99),
        (45, 22, 1, 1, 1299.99),
        (46, 22, 16, 1, 39.99),
        (47, 23, 10, 1, 199.99),
        (48, 24, 6, 1, 399.99),
        (49, 24, 4, 1, 499.99),
        (50, 25, 7, 1, 149.99),
        (51, 26, 6, 1, 399.99),
        (52, 26, 18, 1, 119.99),
        (53, 27, 1, 1, 1299.99),
        (54, 27, 10, 1, 199.99),
        (55, 28, 3, 1, 249.99),
        (56, 29, 4, 1, 499.99),
        (57, 29, 19, 1, 199.99),
        (58, 29, 2, 1, 29.99),
        (59, 30, 6, 1, 399.99)`,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Database seeded successfully',
        tables: ['customers', 'products', 'orders', 'order_items'],
        stats: {
          customers: 10,
          products: 20,
          orders: 30,
          orderItems: 59
        }
      }),
    };
  } catch (error) {
    console.error('Seed error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to seed database',
        details: error.message
      }),
    };
  }
};
