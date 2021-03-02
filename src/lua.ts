import glue from "./glue";

let luaGlue = glue({
  print: console.log,
  printErr: console.error,
});

interface LuaStateUnique {
  readonly __luaStateBrand: unique symbol;
}
export type LuaState = number & LuaStateUnique;

// For usage in call and pcall
export const LUA_MULTRET = -1;

// Thread Status Codes
export const LUA_OK = 0;
export const LUA_YIELD = 1;
export const LUA_ERRRUN = 2;
export const LUA_ERRSYNTAX = 3;
export const LUA_ERRMEM = 4;
export const LUA_ERRERR = 5;

export interface lua {
  lua_close(L: LuaState): void;
  lua_getfield(L: LuaState, index: number, k: string): number;
  lua_getglobal(L: LuaState, name: string): number;
  lua_isstring(L: LuaState, index: number): number;
  lua_pcall(L: LuaState, nargs: number, nresults: number, msgh: number): number;
  lua_pcallk(
    L: LuaState,
    nargs: number,
    nresults: number,
    errfunc: number,
    ctx: number,
    k: number
  ): number;
  lua_setfield(L: LuaState, index: number, k: string): void;
  lua_tolstring(L: LuaState, index: number, size: number): string;
  lua_tostring(L: LuaState, index: number): string;
  lua_type(L: LuaState, index: number): number;
  lua_typename(L: LuaState, typePointer: number): string;
}

export const lua: lua = {
  lua_close: luaGlue.cwrap("lua_close", null, ["number"]),
  lua_getfield: luaGlue.cwrap("lua_getfield", "number", ["number", "number", "string"]),
  lua_getglobal: luaGlue.cwrap("lua_getglobal", null, ["number", "string"]),
  lua_isstring: luaGlue.cwrap("lua_isstring", "number", ["number", "number"]),
  // In C this is just a #define so we have to recreate it ourself
  lua_pcall: function (
    L: LuaState,
    nargs: number,
    nresults: number,
    msgh: number
  ) {
    return this.lua_pcallk(L, nargs, nresults, msgh, 0, 0);
  },
  lua_pcallk: luaGlue.cwrap("lua_pcallk", "number", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
  ]),
  lua_setfield: luaGlue.cwrap("lua_setfield", null, ["number", "number", "string"]),
  lua_tolstring: luaGlue.cwrap("lua_tolstring", "string", ["number", "number", "number"]),
  // In C this is just a #define so we have to recreate it ourself
  lua_tostring: function (L: LuaState, index: number) {
    return this.lua_tolstring(L, index, 0);
  },
  lua_type: luaGlue.cwrap("lua_type", "number", ["number", "number"]),
  lua_typename: luaGlue.cwrap("lua_typename", "string", ["number", "number"]),
};

export interface lualib {
  luaL_openlibs(L: LuaState): void;
}

export const lualib: lualib = {
  luaL_openlibs: luaGlue.cwrap("luaL_openlibs", null, ["number"]),
};

export interface lauxlib {
  luaL_dostring(L: LuaState, s: string): number;
  luaL_loadstring(
    L: LuaState,
    s: string
  ): typeof LUA_OK | typeof LUA_ERRSYNTAX | typeof LUA_ERRMEM;
  luaL_newstate(): LuaState;
}

export const lauxlib: lauxlib = {
  // In C this is just a #define so we have to recreate it ourself
  luaL_dostring: function (L: LuaState, s: string) {
    return this.luaL_loadstring(L, s) || lua.lua_pcall(L, 0, LUA_MULTRET, 0);
  },
  luaL_loadstring: luaGlue.cwrap("luaL_loadstring", "number", [
    "number",
    "string",
  ]),
  luaL_newstate: luaGlue.cwrap("luaL_newstate", "number", []),
};
