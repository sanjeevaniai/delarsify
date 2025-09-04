#!/bin/bash

# Exit on any error
set -e

echo "Cleaning previous installations..."
rm -rf package-lock.json node_modules

echo "Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

echo "Installing Rollup Linux dependencies..."
npm install @rollup/rollup-linux-x64-gnu --save-optional --legacy-peer-deps || echo "Rollup Linux dependency installation failed, continuing..."

echo "Building application..."
npm run build

echo "Build completed successfully!"
