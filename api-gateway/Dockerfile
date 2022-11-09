FROM node:16-alpine

ENV API_PREFIX /api

WORKDIR /app

COPY . /app/

RUN npm install

CMD ["npm", "run", "start"]
