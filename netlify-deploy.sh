#!/bin/bash

# Sales Tracker Netlify Deployment Script
echo "Preparing for Netlify deployment..."

# Make sure we're in the project root
echo "Checking for frontend and backend directories..."
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
  echo "Error: Please run this script from the project root directory."
  exit 1
fi

# Make sure netlify.toml exists
if [ ! -f "netlify.toml" ]; then
  echo "Error: netlify.toml file not found."
  echo "Please create it first according to the NETLIFY_DEPLOYMENT.md guide."
  exit 1
fi

# Check if Netlify CLI is installed
echo "Checking for Netlify CLI..."
if ! command -v netlify &> /dev/null; then
  echo "Netlify CLI not found. Would you like to install it? (y/n)"
  read -r response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    npm install -g netlify-cli
  else
    echo "Please install Netlify CLI to continue: npm install -g netlify-cli"
    exit 1
  fi
fi

# Check if user is logged in to Netlify
echo "Checking Netlify login status..."
netlify status &> /dev/null
if [ $? -ne 0 ]; then
  echo "You need to log in to Netlify first."
  netlify login
fi

# Build frontend
echo "Building frontend for production..."
cd frontend
npm install
npm run build
cd ..

echo "Deployment preparation complete!"
echo "You can now deploy your site to Netlify with: netlify deploy"
echo "For a production deployment use: netlify deploy --prod"
echo ""
echo "Don't forget to set your environment variables in the Netlify dashboard."
echo "See NETLIFY_DEPLOYMENT.md for more details." 