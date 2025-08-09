# Use the official Node.js LTS image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your backend runs on (adjust as needed)
EXPOSE 8080

# Set the default command to run your backend
CMD ["npm", "start"]
