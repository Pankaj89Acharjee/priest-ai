#Creating a Production-Ready Dockerfile with Multi-Stage Builds

#------- Stage 1: Build Stage -------
FROM node:20-alpine AS builder

#Create an app directory
WORKDIR /app

#Copy package.json and package-lock.json
COPY package*.json ./


#Install dependencies using 'npm ci' for reproducibility, it uses the exact versions in the package-lock.json file. Its faster and reliable than npm install. It removes node_modules and ensures a clean install.
RUN npm ci

#Copy the rest of the application code
COPY . .

#Build the application
RUN npm run build


#------- Stage 2: RUN Production Stage -------
FROM node:20-alpine AS runner

#Set the working directory
WORKDIR /app

#Copy only production dependencies from builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/.env* ./
COPY --from=builder /app/postcss.config.mjs ./



#Expose the default port
EXPOSE 3000


#set environment to the prodduction
ENV NODE_ENV=production

#Start the application
CMD ["npm", "start"]







