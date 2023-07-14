# version of node to use
FROM node:18
# define working directory for docker
WORKDIR /usr/src/app
# copy all our source code into the working directory
COPY . .
# install npm dependencies and pm2
RUN npm install --only=production && npm install -g pm2
# expose port 80 for our server to run on
# EXPOSE 80 8080 7070 5001 Expose all ports...
# command to start our server
CMD [ "pm2-runtime", "start", "server.js" ]