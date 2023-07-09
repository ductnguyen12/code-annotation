FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm ci

EXPOSE 3000

CMD ["npm", "start"]