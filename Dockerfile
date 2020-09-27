FROM node:10.15.3-alpine

WORKDIR /home/node/app

ADD package*.json ./

RUN yarn install

USER node