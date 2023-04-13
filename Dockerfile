FROM node:19-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --omit=dev

COPY . .

EXPOSE 9000

CMD node main.js