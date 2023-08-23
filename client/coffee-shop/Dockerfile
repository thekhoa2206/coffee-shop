FROM node:16.3.0-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]
