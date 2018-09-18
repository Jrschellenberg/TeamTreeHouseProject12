FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run deployProduction
EXPOSE ${PORT}
CMD [ "npm", "run", "runProduction" ]