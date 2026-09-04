FROM node:20-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

EXPOSE 3002

CMD ["node", "server.js"]
