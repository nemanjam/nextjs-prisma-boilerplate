#!/bin/bash

F_NAME=$1

function_1() {
    echo "this is the function: $F_NAME with args: $@";
}

function_2() {
    echo "this is the function: $F_NAME with arg1: $1";
}

case "$1" in
    "") echo "No argument provided for scripts.sh" >&2; exit 2;;
    function_1) "$@"; exit;;
    function_2) "$@"; exit;;
    *) echo "Unkown function: $1()"; exit 2;;
esac