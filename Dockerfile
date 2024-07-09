FROM node:20-alpine

ARG SHOPIFY_STORE_URL
ARG SHOPIFY_ADMIN_TOKEN
ARG SHOPIFY_STOREFRONT_TOKEN

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000
