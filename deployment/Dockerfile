# this two-stage build makes the final image much smaller
# as it contains only the final built app

# build environment
FROM node:16-alpine as build

WORKDIR /prov-vis-app
ENV PATH /prov-vis-app/node_modules/.bin:$PATH
COPY app/package.json ./
COPY app/package-lock.json ./
RUN npm ci --silent
COPY app ./
RUN npm run build


# production environment
FROM nginx:stable-alpine

COPY deployment/nginx-app.conf /etc/nginx/conf.d/default.conf
COPY --from=build /prov-vis-app/build /usr/share/nginx/html/prov-vis-app
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
