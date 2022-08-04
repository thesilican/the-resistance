FROM node:14-alpine as common
WORKDIR /app/common
COPY common/package*.json ./
RUN npm i
COPY common/ ./
RUN npm run build

FROM node:14-alpine as frontend
WORKDIR /app
COPY --from=common /app/common/package*.json ./common/
COPY --from=common /app/common/dist/ ./common/dist/
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm i
COPY frontend/ ./
RUN npm run build

FROM node:14-alpine as backend
WORKDIR /app
COPY --from=common /app/common/package*.json ./common/
COPY --from=common /app/common/dist/ ./common/dist/
WORKDIR /app/backend
COPY ./backend/package*.json ./
RUN npm i
COPY ./backend/ ./
RUN npm run build

FROM node:14-alpine
WORKDIR /app
COPY --from=common /app/common/ ./common/
COPY --from=frontend /app/frontend/ ./frontend/
COPY --from=backend /app/backend/ ./backend

EXPOSE 8080
ENV NODE_ENV production
CMD ["node", "/app/backend/dist/index.js"]
