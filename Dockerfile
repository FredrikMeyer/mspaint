# ---- Base Node ----
FROM node:14 as base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# ---- Prod ----
FROM nginx:1.21.1
# Copy needed files
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=base /usr/src/app/dist /usr/share/nginx/html
