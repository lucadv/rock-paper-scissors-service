FROM node:8.11.4-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]
