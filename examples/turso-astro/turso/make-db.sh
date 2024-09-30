turso db create temp-db --from-csv turso/seed.csv --csv-table-name temp-table
turso db shell temp-table .dump > csv-dump
turso db shell public < csv-dump
turso db destroy temp-db