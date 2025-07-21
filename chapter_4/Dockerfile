#   Use official node.js parent image
FROM node:22-alpine

#   Set working directory in container
WORKDIR /app

#   Copy package.json and package-lock.json files to container
COPY package*.json .

#   Install the dependencies
RUN npm install

#   Copy rest of application
COPY . .

# After installing dependencies in Dockerfile
RUN npx prisma generate

#   Expose the port that app runs on
EXPOSE 5000

#   Define command to run application
#CMD [ "node", "./src/server.js" ]
CMD ["npm", "start"]