#!/usr/bin/env bash

SQL_FILE="$1"

sed -i -E -e '/-- Schema/d' \
    -e '/CREATE SCHEMA/d' \
    -e '/USE `[a-zA-Z]+`/d' \
    -e '/DELIMITER/d' \
    -e 's/\$\$/;/g' \
    -e 's/`mydb`\.//g' \
    "$SQL_FILE"
