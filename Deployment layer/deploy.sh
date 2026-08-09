#!/bin/bash
echo "🚀 Starting Deployment Process..."
echo "📦 Installing dependencies..."
npm install --production
echo "🗄️ Running database migrations (if any)..."
# node Database_Layer/seed.js
echo "✅ Deployment complete. Server ready to start!"