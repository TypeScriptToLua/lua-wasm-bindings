#!/bin/bash

mkdir -p `dirname "$0"`/../dist
mkdir -p `dirname "$0"`/../dist/glue

cd `dirname "$0"`/../thirdparty/$1

make clean

if [[ "$1" == "lua-5.0.3" ]]; then
    make all MYLIBS= MYCFLAGS= CC='emcc -O3' AR='emar rcu' RANLIB='emranlib'
else
    make generic MYLIBS= MYCFLAGS= CC='emcc -O3' AR='emar rcu' RANLIB='emranlib'
fi

cd ../..

# TODO write a proper script and clean up this mess

if [[ "$1" == "lua-5.0.3" ]]; then
    emcc -Ithirdparty/$1 thirdparty/$1/lib/liblua.a thirdparty/$1/lib/liblualib.a \
        -s WASM=1 -O3 -o dist/glue/glue-$1.js \
        -s EXPORTED_RUNTIME_METHODS="['cwrap', 'lengthBytesUTF8']" \
        -s MODULARIZE=1 \
        -s ALLOW_TABLE_GROWTH \
        -s EXPORT_NAME="glue" \
        -s ALLOW_MEMORY_GROWTH=1 \
        -s STRICT=1 \
        -s MALLOC=emmalloc \
        -s WASM_ASYNC_COMPILATION=0 \
        -s EXPORTED_FUNCTIONS="[
        '_luaL_loadbuffer', \
        '_lua_call', \
        '_lua_close', \
        '_lua_gettable', \
        '_lua_gettop', \
        '_lua_insert', \
        '_lua_isstring', \
        '_lua_open', \
        '_lua_pcall', \
        '_lua_pushstring', \
        '_lua_pushvalue', \
        '_lua_remove', \
        '_lua_replace', \
        '_lua_settable', \
        '_lua_settop', \
        '_lua_tostring', \
        '_lua_type', \
        '_lua_typename', \
        '_luaopen_math', \
        '_luaopen_string', \
        '_luaopen_io', \
        '_luaopen_table', \
        '_luaopen_debug', \
        '_luaopen_base' \
    ]"
elif [[ "$1" == "lua-5.1.5" ]]; then
    emcc -Ithirdparty/$1 thirdparty/$1/src/liblua.a \
        -s WASM=1 -O3 -o dist/glue/glue-$1.js \
        -s EXPORTED_RUNTIME_METHODS="['cwrap']" \
        -s MODULARIZE=1 \
        -s ALLOW_TABLE_GROWTH \
        -s EXPORT_NAME="glue" \
        -s ALLOW_MEMORY_GROWTH=1 \
        -s STRICT=1 \
        -s MALLOC=emmalloc \
        -s WASM_ASYNC_COMPILATION=0 \
        -s EXPORTED_FUNCTIONS="[
        '_luaL_newstate', \
        '_luaL_openlibs', \
        '_luaL_loadbuffer', \
        '_luaL_loadstring', \
		'_lua_call', \
        '_lua_close', \
        '_lua_getfield', \
        '_lua_gettable', \
		'_lua_gettop', \
        '_lua_insert', \
        '_lua_isstring', \
        '_lua_pcall', \
        '_lua_pushstring', \
        '_lua_pushvalue', \
        '_lua_remove', \
        '_lua_replace', \
        '_lua_setfield', \
        '_lua_settable', \
        '_lua_settop', \
        '_lua_tolstring', \
        '_lua_type', \
        '_lua_typename', \
        '_luaopen_math', \
        '_luaopen_string', \
        '_luaopen_io', \
        '_luaopen_table', \
        '_luaopen_debug', \
        '_luaopen_base' \
    ]"
elif [[ "$1" == "lua-5.2.4" ]]; then
    emcc -Ithirdparty/$1 thirdparty/$1/src/liblua.a \
        -s WASM=1 -O3 -o dist/glue/glue-$1.js \
        -s EXPORTED_RUNTIME_METHODS="['cwrap']" \
        -s MODULARIZE=1 \
        -s ALLOW_TABLE_GROWTH \
        -s EXPORT_NAME="glue" \
        -s ALLOW_MEMORY_GROWTH=1 \
        -s STRICT=1 \
        -s MALLOC=emmalloc \
        -s WASM_ASYNC_COMPILATION=0 \
        -s EXPORTED_FUNCTIONS="[
        '_luaL_newstate', \
        '_luaL_openlibs', \
        '_luaL_loadstring', \
		'_lua_callk', \
        '_lua_close', \
        '_lua_getfield', \
        '_lua_getglobal', \
        '_lua_gettable', \
		'_lua_gettop', \
        '_lua_insert', \
        '_lua_isstring', \
        '_lua_pcallk', \
        '_lua_pushstring', \
        '_lua_pushvalue', \
        '_lua_remove', \
        '_lua_replace', \
        '_lua_setfield', \
        '_lua_settable', \
        '_lua_settop', \
        '_lua_tolstring', \
        '_lua_type', \
        '_lua_typename', \
        '_luaopen_math', \
        '_luaopen_string', \
        '_luaopen_io', \
        '_luaopen_table', \
        '_luaopen_debug', \
        '_luaopen_base' \
    ]"
else
    emcc -Ithirdparty/$1 thirdparty/$1/src/liblua.a \
        -s WASM=1 -O3 -o dist/glue/glue-$1.js \
        -s EXPORTED_RUNTIME_METHODS="['cwrap']" \
        -s MODULARIZE=1 \
        -s ALLOW_TABLE_GROWTH \
        -s EXPORT_NAME="glue" \
        -s ALLOW_MEMORY_GROWTH=1 \
        -s STRICT=1 \
        -s MALLOC=emmalloc \
        -s WASM_ASYNC_COMPILATION=0 \
        -s EXPORTED_FUNCTIONS="[
        '_luaL_newstate', \
        '_luaL_openlibs', \
        '_luaL_loadstring', \
		'_lua_callk', \
        '_lua_close', \
        '_lua_copy', \
        '_lua_getfield', \
        '_lua_getglobal', \
        '_lua_gettable', \
		'_lua_gettop', \
        '_lua_isstring', \
        '_lua_pcallk', \
        '_lua_pushstring', \
        '_lua_pushvalue', \
        '_lua_rotate', \
        '_lua_setfield', \
        '_lua_settable', \
        '_lua_settop', \
        '_lua_tolstring', \
        '_lua_type', \
        '_lua_typename', \
        '_luaopen_math', \
        '_luaopen_string', \
        '_luaopen_io', \
        '_luaopen_table', \
        '_luaopen_debug', \
        '_luaopen_base' \
    ]"
fi
