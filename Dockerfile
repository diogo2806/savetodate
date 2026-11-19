## Multi-stage Dockerfile: build with Node, serve with nginx
FROM node:18-alpine AS build
WORKDIR /app

# install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# copy sources and build
COPY . .
RUN npm run build

## Serve with nginx
# NGINX OSS stable 1.30.7, official Alpine image (build-time selection).
# Fix level: https://nginx.org/en/security_advisories.html
# Image tag and platforms: https://github.com/docker-library/official-images/blob/master/library/nginx
FROM nginx:1.30.7-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Single-page app fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
