#!/bin/sh

export NODE=`which node`
export NODE_ENV=${NODE_ENV:=production}
# export NODE_OPTIONS=--max_old_space_size=1024
# export NODE_PG_FORCE_NATIVE=true

# FIX: https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
# "Typically it is unsafe to use synchronize: true for schema synchronization on production
# once you get data in your database. Here is where migrations come to help."

if [ -n "$*" -a "$1" = "start" ]; then
  $NODE dist/main.js

elif [ -n "$*" -a "$1" = "start:microservice" ]; then
  $NODE dist/src/microservice.js

fi
