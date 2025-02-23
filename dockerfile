# server/Dockerfile
FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["sh", "-c", "mkdir -p /app/database && npx ts-node src/scripts/seed.ts && npm run dev"]