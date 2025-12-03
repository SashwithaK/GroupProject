#!/bin/sh

# Define the environment variable name we want to inject
API_URL=${VITE_API_URL:-http://localhost:9000}

echo "Injecting API URL: $API_URL"

# Replace the placeholder or inject the variable into index.html
# We find the script tag we added: window.__ENV__ = window.__ENV__ || {};
# And inject the actual value before it.
sed -i "s|window.__ENV__ = window.__ENV__ \|\| {};|window.__ENV__ = { VITE_API_URL: '$API_URL' };|g" /usr/share/nginx/html/index.html

# Execute the CMD
exec "$@"
