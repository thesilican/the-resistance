FROM node:lts-alpine

# Install common
WORKDIR /usr/src/app/common
COPY common/package*.json ./
COPY common/tsconfig.json ./
RUN npm install
COPY ./common .
RUN npm run build

# Install frontend
WORKDIR /usr/src/app/frontend
COPY frontend/package*.json ./
COPY frontend/tsconfig.json ./
RUN npm install
COPY ./frontend .
RUN npm run build

# Run app
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY ./src ./src
RUN npm run build

EXPOSE 8080
CMD [ "node", "dist/index.js" ]