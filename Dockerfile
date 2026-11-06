FROM node:24-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./

RUN npm install

# Copy application source
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
