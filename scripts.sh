#!/bin/bash

# this file is meant for shell functions that will work as shell files-scripts
# currently not used

F_NAME=$1

function_1() {
    echo "this is the function: $F_NAME with args: $@";
}

function_2() {
    echo "this is the function: $F_NAME with arg1: $1";
}

# private
# dont need this for docker build prod
load_env_file() {
    echo "this is the function: ${FUNCNAME[0]} with args: $@";
    ENV_FILE=$1;

    if [ -f $ENV_FILE ] && [[ "$ENV_FILE" =~ ^\.env\..* ]]; then
        # export $(echo $(cat $ENV_FILE | sed 's/#.*//g' | sed 's/\r//g' | xargs) | envsubst);
    else
        echo "not a valid env file: $ENV_FILE"; 
        exit 2;
    fi
}

docker_compose_prod() {
    echo "this is the function: $F_NAME with arg1: $1";

    load_env_file ".env.production";
    load_env_file ".env.local";
    echo "DATABASE_URL=$(printenv DATABASE_URL)";

    # docker-compose -f docker-compose.prod.yml build --no-cache;
}

case "$1" in
    "") echo "No argument provided for scripts.sh" >&2; exit 2;;
    function_1) "$@"; exit;;
    function_2) "$@"; exit;;
    docker_compose_prod) "$@"; exit;;
    *) echo "Unkown function: $1()"; exit 2;;
esac