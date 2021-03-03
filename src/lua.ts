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

export interface Lua {
    lua_close(L: LuaState): void;
    lua_getfield(L: LuaState, index: number, k: string): number;
    lua_getglobal(L: LuaState, name: string): number;
    lua_isstring(L: LuaState, index: number): number;
    lua_pcall(L: LuaState, nargs: number, nresults: number, msgh: number): number;
    lua_pcallk(L: LuaState, nargs: number, nresults: number, errfunc: number, ctx: number, k: number): number;
    lua_setfield(L: LuaState, index: number, k: string): void;
    lua_tolstring(L: LuaState, index: number, size: number): string;
    lua_tostring(L: LuaState, index: number): string;
    lua_type(L: LuaState, index: number): number;
    lua_typename(L: LuaState, typePointer: number): string;
}

export interface LuaLib {
    luaL_openlibs(L: LuaState): void;
}

export interface LauxLib {
    luaL_dostring(L: LuaState, s: string): number;
    luaL_loadstring(L: LuaState, s: string): typeof LUA_OK | typeof LUA_ERRSYNTAX | typeof LUA_ERRMEM;
    luaL_newstate(): LuaState;
}
