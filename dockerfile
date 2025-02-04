# Use the official Node.js image from Docker Hub
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app will run on (same as in your index.ts)
EXPOSE 3001

# Command to start the application
CMD ["npm", "start"]
