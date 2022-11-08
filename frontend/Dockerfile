FROM node:16-alpine as base

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:stable-alpine

COPY --from=base /app/build /var/www/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443 3000

CMD ["nginx", "-g", "daemon off;"]