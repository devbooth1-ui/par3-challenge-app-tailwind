# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port 3000 for Next.js
EXPOSE 3000

# Start Next.js app
CMD ["npm", "run", "dev"]
