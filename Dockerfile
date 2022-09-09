# build environment
FROM node:16 as builder
WORKDIR /usr/src/app
COPY client/package*.json ./
RUN npm install
# layers should be cached till here, no npm install on rebuild

COPY client .
RUN npm run build


# production environment
FROM node:16
WORKDIR /usr/src/app
COPY server/package*.json ./
RUN npm install
# layers should be cached till here, no npm install on rebuild

COPY server .
COPY --from=builder /usr/src/app/public public
EXPOSE 80
CMD [ "node", "server.js" ]
