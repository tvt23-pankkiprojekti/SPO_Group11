FROM mysql:8.0.36

COPY ./init.sql /docker-entrypoint-initdb.d/
