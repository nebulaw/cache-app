# Lightweight node image
FROM node:22-alpine

# Set the current working directory
WORKDIR /app/frontend

# Install node modules
COPY package*.json ./
RUN npm install

# Copy the project content
COPY . .

# Expose next.js port
EXPOSE 3000

# And run the application
CMD ["sh", "-c", "npm install && npm run build && npm run start"]
