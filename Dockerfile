FROM node:lts as common

# Build common modules first
WORKDIR /app/common
COPY ./common/package*.json ./
RUN npm ci
COPY ./common ./
RUN npm run build

# Copy common from frontend
FROM node:lts as frontend
WORKDIR /app
COPY --from=common /app/common/package*.json ./common/
COPY --from=common /app/common/dist ./common/dist/

# Build frontend
WORKDIR /app/frontend
COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend ./
RUN npm run build

# Copy common from backend
FROM node:lts-alpine as backend
WORKDIR /app
COPY --from=common /app/common/dist ./common/dist/
COPY --from=common /app/common/package*.json ./common/
COPY package*.json ./
RUN npm ci

# Build backend
COPY ./src ./src
COPY tsconfig.json ./
RUN npm run build

# Copy frontend build
COPY --from=frontend /app/frontend/build ./frontend/build/

# Config and publish
EXPOSE 8080
ENV NODE_ENV production
CMD [ "node", "dist/index.js" ]
