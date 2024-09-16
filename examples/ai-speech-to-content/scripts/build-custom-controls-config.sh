#!/bin/bash

cd .stackbit/custom-controls

# Get the property name and value from the script arguments
property_name="$1"
property_value="$2"

# Set the output JSON file name
OUTPUT_FILE="config.json"

# Create the JSON object using the input property name and value
json_content=$(cat <<EOF
{
  "$property_name": "$property_value"
}
EOF
)

# Write the JSON content to the file
echo "$json_content" > "$OUTPUT_FILE"

# Print a success message
echo "JSON content written to $OUTPUT_FILE"