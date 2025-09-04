#!/bin/bash

# Exit on any error
set -e

echo "Installing dependencies..."
npm ci

echo "Checking if vite is available..."
which vite || echo "vite not found in PATH"
ls -la node_modules/.bin/vite || echo "vite not found in node_modules/.bin"

echo "Building application with npx..."
npx vite build

echo "Build completed successfully!"
