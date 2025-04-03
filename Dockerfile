FROM nginx:stable

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /usr/share/nginx/html/h5

COPY dist/build/h5 /usr/share/nginx/html/h5

RUN chmod -R 777 /usr/share/nginx/html
