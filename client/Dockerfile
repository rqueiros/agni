FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the default Vue CLI port
EXPOSE 8080

# Run the Vue development server
CMD ["npm", "run", "serve"]