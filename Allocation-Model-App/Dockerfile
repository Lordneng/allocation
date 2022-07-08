### STAGE 1: Build ###
FROM node:14-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod

### STAGE 2: Run ###
FROM nginx:1.13.12-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
