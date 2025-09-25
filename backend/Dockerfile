# Use Node.js base image
FROM node:18

# Work dir inside the container
WORKDIR /usr/src/app

# Copy dependency manifests & install prod deps
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the source code
COPY . .

# Cloud Run listens on $PORT (we default to 8080)
ENV PORT=8080
EXPOSE 8080

# Start the express server (defined in package.json "start")
CMD ["npm", "start"]
