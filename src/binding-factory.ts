import { LuaEmscriptenModule } from "./glue/glue";
import { LauxLib, Lua, LuaLib, LuaState, LUA_MULTRET } from "./lua";

function safeCwrap(
    glue: LuaEmscriptenModule,
    ident: string,
    returnType: Emscripten.JSType | null,
    argTypes: Emscripten.JSType[],
    opts?: Emscripten.CCallOpts
): (...args: any[]) => any {
    try {
        return glue.cwrap(ident, returnType, argTypes, opts);
    } catch {
        return _args => {
            throw `${ident} not supported in this Lua version!`;
        };
    }
}

/** @internal */
export function createLua(glue: LuaEmscriptenModule, overrides: Partial<Lua>): Lua {
    const defaultLua: Lua = {
        lua_close: glue.cwrap("lua_close", null, ["number"]),
        lua_getfield: glue.cwrap("lua_getfield", "number", ["number", "number", "string"]),
        lua_getglobal: glue.cwrap("lua_getglobal", null, ["number", "string"]),
        lua_isstring: glue.cwrap("lua_isstring", "number", ["number", "number"]),
        // In C this is just a #define so we have to recreate it ourself
        lua_pcall: function (L: LuaState, nargs: number, nresults: number, msgh: number) {
            return this.lua_pcallk(L, nargs, nresults, msgh, 0, 0);
        },
        lua_pcallk: safeCwrap(glue, "lua_pcallk", "number", [
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
        ]),
        lua_setfield: glue.cwrap("lua_setfield", null, ["number", "number", "string"]),
        lua_tolstring: glue.cwrap("lua_tolstring", "string", ["number", "number", "number"]),
        // In C this is just a #define so we have to recreate it ourself
        lua_tostring: function (L: LuaState, index: number) {
            return this.lua_tolstring(L, index, 0);
        },
        lua_type: glue.cwrap("lua_type", "number", ["number", "number"]),
        lua_typename: glue.cwrap("lua_typename", "string", ["number", "number"]),
    };

    return Object.assign(defaultLua, overrides);
}

/** @internal */
export function createLauxLib(glue: LuaEmscriptenModule, lua: Lua, overrides: Partial<LauxLib>): LauxLib {
    const defaultLauxLib: LauxLib = {
        // In C this is just a #define so we have to recreate it ourself
        luaL_dostring: function (L: LuaState, s: string) {
            return this.luaL_loadstring(L, s) || lua.lua_pcall(L, 0, LUA_MULTRET, 0);
        },
        luaL_loadstring: glue.cwrap("luaL_loadstring", "number", ["number", "string"]),
        luaL_newstate: glue.cwrap("luaL_newstate", "number", []),
    };

    return Object.assign(defaultLauxLib, overrides);
}

/** @internal */
export function createLuaLib(glue: LuaEmscriptenModule, overrides: Partial<LuaLib>): LuaLib {
    const defaultLuaLib: LuaLib = {
        luaL_openlibs: glue.cwrap("luaL_openlibs", null, ["number"]),
    };

    return Object.assign(defaultLuaLib, overrides);
}
