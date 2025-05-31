#Use Node as the base image
FROM node:20-alpine

#Create an app directory
WORKDIR /app


#Install app dependencies
COPY package.json ./
RUN npm install


#Install CURL
RUN apk update && apk add curl 



#Copy all the files from the app directory into the image
COPY . .

#Build the app
RUN npm run build


#Expose the default port
EXPOSE 3000

#Start the app
CMD ["npm", "start"]


