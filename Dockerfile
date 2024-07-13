FROM node:16-alpine AS common
WORKDIR /app/common
COPY common/package*.json ./
RUN npm ci
COPY common/ ./
RUN npm run build

FROM node:16-alpine AS frontend
COPY --from=common /app/common/ /app/common
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG PUBLIC_URL
RUN npm run build

FROM node:16-alpine AS backend
COPY --from=common /app/common/ /app/common
WORKDIR /app/backend
COPY ./backend/package*.json ./
RUN npm ci
COPY ./backend/ ./
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=common /app/common/ ./common/
COPY --from=frontend /app/frontend/build/ ./frontend/build/
COPY --from=backend /app/backend/ ./backend/

EXPOSE 8080
ENV NODE_ENV production
CMD ["node", "/app/backend/dist/index.js"]
