#!/bin/bash
echo "Pulling latest code..."
git pull origin main
echo "Restarting server..."
pm2 restart ecosystem.config.js