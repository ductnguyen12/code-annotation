FROM node:lts-slim as build
WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY public /app/public
RUN npm run copy-scratch-media
COPY . /app

FROM build as development
WORKDIR /app
EXPOSE 3000
CMD npx react-inject-env set -d public && npm start

FROM build as production_build
WORKDIR /app
ARG REACT_APP_ENABLE_HTTPS
ENV REACT_APP_ENABLE_HTTPS=$REACT_APP_ENABLE_HTTPS
RUN npx react-inject-env set -d public && npm run build

FROM nginx:mainline-alpine as production
# Replace default.conf configuration to remove unnecessary rules
COPY react_nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=production_build /app/build /usr/share/nginx/html