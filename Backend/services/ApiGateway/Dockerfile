FROM node:16-alpine AS appbuild
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build

# Build Stage 2
# This build takes the combiled build

FROM node:16-alpine
WORKDIR /usr/src/app
ENV NODE_OPTIONS --enable-source-maps
COPY --from=appbuild /usr/src/app/dist ./
COPY --from=appbuild /usr/src/app/node_modules ./node_modules
CMD node index.js
