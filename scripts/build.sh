#!/bin/bash
set -e

# Build web app
pnpm turbo build --filter=@fetchkit/web

# Create Build Output API structure
mkdir -p .vercel/output/static/api
cp -r apps/web/dist/* .vercel/output/static/
cp api/openapi.json .vercel/output/static/api/openapi.json

# Bundle API function with esbuild (self-contained, no external deps to trace)
mkdir -p .vercel/output/functions/api/brand.func
npx esbuild api/_wrapper.ts --bundle --platform=node --format=cjs --outfile=.vercel/output/functions/api/brand.func/index.js

# Function config
cat > .vercel/output/functions/api/brand.func/.vc-config.json << 'VCEOF'
{
  "runtime": "nodejs20.x",
  "handler": "index.js",
  "launcherType": "Nodejs"
}
VCEOF

# Bundle Legal API function
mkdir -p .vercel/output/functions/api/legal.func
npx esbuild api/_legal-wrapper.ts --bundle --platform=node --format=cjs --outfile=.vercel/output/functions/api/legal.func/index.js

cat > .vercel/output/functions/api/legal.func/.vc-config.json << 'VCEOF'
{
  "runtime": "nodejs20.x",
  "handler": "index.js",
  "launcherType": "Nodejs"
}
VCEOF

# Build Output API config with rewrites
cat > .vercel/output/config.json << 'CFGEOF'
{
  "version": 3,
  "routes": [
    { "src": "/api/brand/(.*)", "dest": "/api/brand" },
    { "src": "/api/legal/(.*)", "dest": "/api/legal" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
CFGEOF
