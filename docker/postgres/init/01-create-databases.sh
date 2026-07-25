#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
SELECT 'CREATE DATABASE extraction_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'extraction_db')\gexec

SELECT 'CREATE DATABASE todo_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'todo_db')\gexec
EOSQL
