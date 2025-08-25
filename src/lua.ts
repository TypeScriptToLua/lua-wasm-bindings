interface LuaStateUnique {
    readonly __luaStateBrand: unique symbol;
}
export type LuaState = number & LuaStateUnique;

// For usage in call and pcall
export const LUA_MULTRET = -1;

// 5.0 & 5.1
export const LUA_GLOBALSINDEX_50 = -10001;
export const LUA_GLOBALSINDEX_51 = -10002;

// 5.2^
export const LUA_RIDX_GLOBALS = 2;

// Thread Status Codes
export const LUA_OK = 0;
export const LUA_YIELD = 1;
export const LUA_ERRRUN = 2;
export const LUA_ERRSYNTAX = 3;
export const LUA_ERRMEM = 4;
export const LUA_ERRERR = 5;

export interface Lua {
    lua_close(L: LuaState): void;
    lua_copy(L: LuaState, fromIndex: number, toIndex: number): void;
    // TODO returns int in some lua versions void in others
    lua_getfield(L: LuaState, index: number, k: string): number;
    lua_getglobal(L: LuaState, name: string): number;
    // TODO returns int in some lua versions void in others
    lua_gettable(L: LuaState, index: number): number;
	lua_gettop(L: LuaState): number;
    lua_insert(L: LuaState, index: number): void;
    lua_isstring(L: LuaState, index: number): number;
    lua_pcall(L: LuaState, nargs: number, nresults: number, msgh: number): number;
    lua_pcallk(L: LuaState, nargs: number, nresults: number, errfunc: number, ctx: number, k: number): number;
    lua_pop(L: LuaState, n: number): void;
    // TODO returns string in some lua versions void in others
    lua_pushstring(L: LuaState, s: string): string;
    lua_pushvalue(L: LuaState, index: number): void;
    lua_remove(L: LuaState, index: number): void;
    lua_replace(L: LuaState, index: number): void;
    lua_rotate(L: LuaState, index: number, n: number): void;
    lua_setfield(L: LuaState, index: number, k: string): void;
    lua_settable(L: LuaState, index: number): void;
    lua_settop(L: LuaState, index: number): void;
    lua_tolstring(L: LuaState, index: number, size: number): string;
    lua_tostring(L: LuaState, index: number): string;
    lua_type(L: LuaState, index: number): number;
    lua_typename(L: LuaState, typePointer: number): string;
}

export interface LuaLib {
    luaL_openlibs(L: LuaState): void;
    luaopen_base(L: LuaState): void,
    luaopen_math(L: LuaState): void,
    luaopen_string(L: LuaState): void,
    luaopen_io(L: LuaState): void,
    luaopen_table(L: LuaState): void,
    luaopen_debug(L: LuaState): void,
}

export interface LauxLib {
    luaL_dostring(L: LuaState, s: string): number;
    luaL_loadbuffer(L: LuaState, s: string, slen: number, name: string): typeof LUA_OK | typeof LUA_ERRSYNTAX | typeof LUA_ERRMEM
    luaL_loadstring(L: LuaState, s: string): typeof LUA_OK | typeof LUA_ERRSYNTAX | typeof LUA_ERRMEM;
    luaL_newstate(): LuaState;
}
