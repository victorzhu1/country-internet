# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the frontend app
RUN npm run build

# Use Nginx as the server for the built frontend
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 5173 (or the port you are using)
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
