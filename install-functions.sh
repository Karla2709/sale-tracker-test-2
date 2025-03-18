#!/bin/bash

# Install dependencies for Netlify Functions
echo "Installing dependencies for Netlify Functions..."

# Check if netlify/functions directory exists
if [ ! -d "netlify/functions" ]; then
  echo "Error: netlify/functions directory not found."
  exit 1
fi

# Install dependencies
cd netlify/functions
npm install

echo "Netlify Functions dependencies installed successfully!"
echo "You can now run 'netlify dev' to test the functions locally." 