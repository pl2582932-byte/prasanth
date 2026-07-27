FROM nginx:alpine

COPY ./online-voting-app /usr/share/nginx/html

# Add Health Check (checks every 30s if index page returns HTTP 200)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
