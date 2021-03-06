#!/bin/bash

mkdir -p `dirname "$0"`/../dist
mkdir -p `dirname "$0"`/../dist/glue

cd `dirname "$0"`/../thirdparty/$1

make clean
make generic MYLIBS= MYCFLAGS= CC='emcc -O3 -s WASM=1' AR='emar rcu' RANLIB='emranlib'

cd ../..

if [[ "$1" == "lua-5.1.5" ]]; then
    emcc -Ithirdparty/$1 thirdparty/$1/src/liblua.a \
        -s WASM=1 -O3 -o dist/glue/glue-$1.js \
        -s EXTRA_EXPORTED_RUNTIME_METHODS="['cwrap']" \
        -s MODULARIZE=1 \
        -s ALLOW_TABLE_GROWTH \
        -s EXPORT_NAME="glue" \
        -s ALLOW_MEMORY_GROWTH=1 \
        -s STRICT=1 \
        -s MALLOC=emmalloc \
        -s WASM_ASYNC_COMPILATION=0 \
        -s EXPORTED_FUNCTIONS="[
        '_luaL_newstate', \
        '_lua_close', \
        '_luaL_openlibs', \
        '_luaL_loadstring', \
        '_lua_getfield', \
        '_lua_isstring', \
        '_lua_pcall', \
        '_lua_setfield', \
        '_lua_tolstring', \
        '_lua_type', \
        '_lua_typename' \
    ]"
else
    emcc -Ithirdparty/$1 thirdparty/$1/src/liblua.a \
        -s WASM=1 -O3 -o dist/glue/glue-$1.js \
        -s EXTRA_EXPORTED_RUNTIME_METHODS="['cwrap']" \
        -s MODULARIZE=1 \
        -s ALLOW_TABLE_GROWTH \
        -s EXPORT_NAME="glue" \
        -s ALLOW_MEMORY_GROWTH=1 \
        -s STRICT=1 \
        -s MALLOC=emmalloc \
        -s WASM_ASYNC_COMPILATION=0 \
        -s EXPORTED_FUNCTIONS="[
        '_luaL_newstate', \
        '_lua_close', \
        '_luaL_openlibs', \
        '_luaL_loadstring', \
        '_lua_getfield', \
        '_lua_getglobal', \
        '_lua_isstring', \
        '_lua_pcallk', \
        '_lua_setfield', \
        '_lua_tolstring', \
        '_lua_type', \
        '_lua_typename' \
    ]"
fi
