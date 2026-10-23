FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8081

CMD ["sh", "-c", "npm ci && npx expo start --lan --port 8081"]
