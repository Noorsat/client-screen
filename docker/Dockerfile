# Set the base image to node:12-alpine
FROM node:14-alpine as build
LABEL stage=builder
LABEL build=$CI_REGISTRY_IMAGE_VERSION

# Specify where our app will live in the container
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn --network-timeout 100000

# Copy the React App to the container
COPY . /app/

# Prepare the container for building React
RUN yarn build

# Prepare nginx
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx/nginx.conf /etc/nginx/conf.d

# Fire up nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]