# Use the Node.js Alpine image as the base
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy all project files first to make debugging simpler
COPY . .

# Debug to check if Prisma files are copied
RUN echo "Contents of /app:" && ls -R /app

# Copy the .env file into the container
COPY .env .env

# Install dependencies without running postinstall
RUN npm install --ignore-scripts

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma


# Expose port 3000 for the Next.js dev server
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]
