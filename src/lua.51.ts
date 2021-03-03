import { createLauxLib, createLua, createLuaLib } from "./binding-factory";
import glue from "./glue/glue-lua-5.1.5";
import { Lua, LuaState } from "./lua";

let luaGlue = glue({
    print: console.log,
    printErr: console.error,
});

// For 5.1 we need to plyfill getglobal and pcallk
export const lua = createLua(luaGlue, {
    // #define lua_getglobal(L,s)  lua_getfield(L, LUA_GLOBALSINDEX, s)
    lua_getglobal: function (L: LuaState, name: string) {
        // TODO avoid cast
        return (this as Lua).lua_getfield(L, -10002, name);
    },
    // Need to overwrite because in lua 5.1 this is a function and not a #define (5.2 and higher)
    lua_pcall: glue.cwrap("lua_pcall", "number", ["number", "number", "number", "number"]),
    // TODO there might be some way to mimic pcallk behaviour with 5.1 somehow
    lua_pcallk: function (_L: LuaState, _nargs: number, _nresults: number, _errfunc: number, _ctx: number, _k: number) {
        throw "pcallk not supported with Lua 5.1";
    },
});
export const lauxlib = createLauxLib(luaGlue, lua, {});
export const lualib = createLuaLib(luaGlue, {});
