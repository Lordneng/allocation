ARG NODE_VERSION=12

FROM node:${NODE_VERSION}-alpine AS builder

LABEL version="1.0"
LABEL description="This is my nest api docker file to expose the api"
LABEL maintainer "josete4ever@gmail.com"

RUN mkdir -p /api
WORKDIR /api

COPY package.json .
RUN echo "Installing NEST API server"
RUN npm install

RUN echo "Building NEST API server"
RUN npm build

RUN echo "Copying server to api folder"
COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm" ]
CMD ["run", "start:dev"]