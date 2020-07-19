FROM node:lts-alpine as common

WORKDIR /usr/src/app/common
COPY common/package*.json ./
RUN npm install --save-prod
COPY ./common ./
RUN npm run build

FROM node:lts as frontend
WORKDIR /usr/src/app
COPY --from=common /usr/src/app/common/dist ./common/dist/
COPY --from=common /usr/src/app/common/package*.json ./common/

WORKDIR /usr/src/app/frontend
COPY frontend/package*.json ./
RUN npm install --save-prod
COPY ./frontend ./
RUN npm run build

FROM node:lts-alpine as server
WORKDIR /usr/src/app
COPY --from=common /usr/src/app/common/dist ./common/dist/
COPY --from=common /usr/src/app/common/package*.json ./common/
COPY --from=frontend /usr/src/app/frontend/build ./frontend/build/
COPY package*.json ./
RUN npm install --save-prod
COPY ./src ./src
COPY tsconfig.json ./
RUN npm run build

EXPOSE 8080
ENV NODE_ENV production
CMD [ "node", "dist/index.js" ]