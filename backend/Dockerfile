# Use Node.js base image
FROM node:18-slim

# Work dir inside the container
WORKDIR /usr/src/app

# Copy dependency manifests & install prod deps
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy the rest of the source code
COPY . .

# Cloud Run listens on $PORT (default to 8080 just in case)
ENV PORT=8080
EXPOSE 8080

# Start the express server
CMD ["npm", "start"]
