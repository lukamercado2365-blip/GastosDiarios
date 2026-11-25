FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci \
    && npm install --global @expo/ngrok

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel", "--port", "8081"]
