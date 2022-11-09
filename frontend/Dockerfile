FROM node:16-alpine as base

WORKDIR /app

ENV SKIP_PREFLIGHT_CHECK 'true'
ENV REACT_APP_ENV PROD
ENV REACT_APP_URI_GATEWAY https://peerprep.live/api
ENV REACT_APP_LIVE_URL https://peerprep.live
ENV REACT_APP_API_PREFIX /api

COPY . .

RUN npm install

RUN npm run build

FROM nginx:stable-alpine

COPY --from=base /app/build /var/www/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443 3000

CMD ["nginx", "-g", "daemon off;"]