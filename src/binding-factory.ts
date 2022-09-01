import { satisfies } from "semver";
import { LuaEmscriptenModule } from "./glue/glue";
import { LauxLib, Lua, LuaLib, LuaState, LUA_GLOBALSINDEX_50, LUA_GLOBALSINDEX_51, LUA_MULTRET } from "./lua";

type luaBindingFactoryFunc = (luaGlue: LuaEmscriptenModule) => Partial<Lua>;
const luaBindings: Record<string, luaBindingFactoryFunc> = {
    "*": function(luaGlue: LuaEmscriptenModule) {
        return {
            lua_close: luaGlue.cwrap("lua_close", null, ["number"]),
            lua_gettable: luaGlue.cwrap("lua_gettable", "number", ["number", "number"]),
            lua_isstring: luaGlue.cwrap("lua_isstring", "number", ["number", "number"]),
            // #define in all versions
            lua_pop: function(L: LuaState, n: number) {
                (this as Lua).lua_settop(L, -(n)-1);
            },
            lua_pushstring: luaGlue.cwrap("lua_pushstring", "string", ["number", "string"]),
            lua_pushvalue: luaGlue.cwrap("lua_pushvalue", null, ["number", "number"]),
            lua_settable: luaGlue.cwrap("lua_settable", null, ["number", "number"]),
            lua_settop: luaGlue.cwrap("lua_settop", null, ["number", "number"]),
            lua_type: luaGlue.cwrap("lua_type", "number", ["number", "number"]),
            lua_typename: luaGlue.cwrap("lua_typename", "string", ["number", "number"]),
        };
    },
    "5.0.x": function(luaGlue: LuaEmscriptenModule){
        return {
            // #define lua_getglobal(L,s)  lua_getfield(L, LUA_GLOBALSINDEX, s)
            lua_getglobal: function (L: LuaState, name: string) {
                return (this as Lua).lua_getfield(L, LUA_GLOBALSINDEX_50, name);
            },
            lua_getfield: function(L: LuaState, index: number, k: string) {
                (this as Lua).lua_pushstring(L, k);

                // Relative offsets must move if the stack pointer moves
                const isRelativeOffset = index < 0 && index !== LUA_GLOBALSINDEX_50;

                return (this as Lua).lua_gettable(L, isRelativeOffset ? index - 1 : index);
            },
            lua_setfield: function(L: LuaState, index: number, k: string) {
                // The value to set is expected to be on the top of the stack
                
                // Push Key
                (this as Lua).lua_pushstring(L, k);
    
                // Swap key and value because settable expects stack in that order
                (this as Lua).lua_insert(L, -2);
    
                // Relative offsets must move if the stack pointer moves
                const isRelativeOffset = index < 0 && index !== LUA_GLOBALSINDEX_50;

                const result = (this as Lua).lua_settable(L, isRelativeOffset ? index - 1 : index);
    
                return result;
            },
            lua_tolstring: function(_L: LuaState, _index: number, _size: number) {
                throw "lua_tolstring is currently not supported in 5.0";
            },
            lua_tostring: luaGlue.cwrap("lua_tostring", "string", ["number", "number"])
        };
    },
    "5.1.x": function(_luaGlue: LuaEmscriptenModule){
        return {
            // #define lua_getglobal(L,s)  lua_getfield(L, LUA_GLOBALSINDEX, s)
            lua_getglobal: function (L: LuaState, name: string) {
                return (this as Lua).lua_getfield(L, LUA_GLOBALSINDEX_51, name);
            }
        };
    },
    "<=5.1.x": function(luaGlue: LuaEmscriptenModule){
        return {
            // Need to overwrite because in lua 5.1 this is a function and not a #define (5.2 and higher)
            lua_pcall: luaGlue.cwrap("lua_pcall", "number", ["number", "number", "number", "number"]),
            // TODO there might be some way to mimic pcallk behaviour with 5.1 somehow
            lua_pcallk: function (_L: LuaState, _nargs: number, _nresults: number, _errfunc: number, _ctx: number, _k: number) {
                throw "pcallk not supported with Lua 5.1 and lower";
            }
        };
    },
    ">=5.1.0": function(luaGlue: LuaEmscriptenModule){
        return {
            lua_getfield: luaGlue.cwrap("lua_getfield", "number", ["number", "number", "string"]),
            lua_setfield: luaGlue.cwrap("lua_setfield", null, ["number", "number", "string"]),
            // TODO 3rd param is a output param (currently ignored)
            lua_tolstring: luaGlue.cwrap("lua_tolstring", "string", ["number", "number", "number"]),
            // #define
            lua_tostring: function (L: LuaState, index: number) {
                return (this as Lua).lua_tolstring(L, index, 0);
            },
        };
    },
    ">=5.2.0": function(luaGlue: LuaEmscriptenModule){
        return {
            lua_getglobal: luaGlue.cwrap("lua_getglobal", "number", ["number", "string"]),
            lua_pcall: function (L: LuaState, nargs: number, nresults: number, msgh: number) {
                return (this as Lua).lua_pcallk(L, nargs, nresults, msgh, 0, 0);
            },
            lua_pcallk: luaGlue.cwrap("lua_pcallk", "number", [
                "number",
                "number",
                "number",
                "number",
                "number",
                "number",
            ])
        };
    },
    "<=5.2.x": function(luaGlue: LuaEmscriptenModule){
        return {
            lua_copy: function (_L: LuaState, _fromIndex: number, _toIndex: number) {
                throw "lua_copy not supported with Lua 5.2 and lower";
            },
            lua_insert: luaGlue.cwrap("lua_insert", null, ["number", "number"]),
            lua_remove: luaGlue.cwrap("lua_remove", null, ["number", "number"]),
            lua_replace: luaGlue.cwrap("lua_replace", null, ["number", "number"]),
            lua_rotate: function (_L: LuaState, _index: number, _n: number) {
                throw "lua_rotate not supported with Lua 5.2 and lower";
            }
        };
    },
    ">=5.3.0": function(luaGlue: LuaEmscriptenModule){
        return {
            lua_copy: luaGlue.cwrap("lua_copy", null, ["number", "number", "number"]),
            // #define
            lua_insert: function (L: LuaState, index: number) {
                (this as Lua).lua_rotate(L, index, 1);
            },
            // #define
            lua_remove: function (L: LuaState, index: number) {
                (this as Lua).lua_rotate(L, index, -1);
                (this as Lua).lua_pop(L, 1);
            },
            // #define
            lua_replace: function (L: LuaState, index: number) {
                (this as Lua).lua_copy(L, -1, index);
                (this as Lua).lua_pop(L, 1);
            },
            lua_rotate: luaGlue.cwrap("lua_rotate", null, ["number", "number", "number"]),
        };
    }
}

/** @internal */
export function createLua(luaGlue: LuaEmscriptenModule, version: string): Lua {
    const result: Partial<Lua> = {};
    for (const [supportedVersion, factoryFunc] of Object.entries(luaBindings)) {
        if (satisfies(version, supportedVersion)) {
            const addedFunctions = factoryFunc(luaGlue);
            
            // Validate
            if (Object.keys(addedFunctions).some(k => k in result)) {
                throw "Error multiple possible bindings for one function, please ensure that only a single possible function exists for a specific version!";
            }

            Object.assign(result, addedFunctions);
        }
    }

    return result as Lua;
}

type lauxBindingFactoryFunc = (luaGlue: LuaEmscriptenModule, lua: Lua) => Partial<LauxLib>;
const lauxBindings: Record<string, lauxBindingFactoryFunc> = {
    "5.0.x": function(luaGlue: LuaEmscriptenModule, lua: Lua) {
        return {
            luaL_dostring: function(L: LuaState, s: string) {
                return (this as LauxLib).luaL_loadstring(L, s) || lua.lua_pcall(L, 0, LUA_MULTRET, 0);
            },
            luaL_loadstring: function(L: LuaState, s: string) {
                const lastStack = luaGlue.stackSave();
                const cstr = luaGlue.allocateUTF8OnStack(s) as unknown;
                const result = (this as LauxLib).luaL_loadbuffer(L, cstr as string, luaGlue.lengthBytesUTF8(s), s);
                luaGlue.stackRestore(lastStack);
                return result;
            },
            // Note that s has a "number" type, so we can pass a raw pointer
            luaL_loadbuffer: luaGlue.cwrap("luaL_loadbuffer", "number", ["number", "number", "number", "string"]),
            luaL_newstate: luaGlue.cwrap("lua_open", "number", []),
        }
    },
    "5.1.x": function(luaGlue: LuaEmscriptenModule, _lua: Lua) {
        return {
            luaL_loadbuffer: luaGlue.cwrap("luaL_loadbuffer", "number", ["number", "string", "number", "string"]),
        }
    },
    ">=5.1.0": function(luaGlue: LuaEmscriptenModule, lua: Lua) {
        return {
            // #define
            luaL_dostring: function (L: LuaState, s: string) {
                return (this as LauxLib).luaL_loadstring(L, s) || lua.lua_pcall(L, 0, LUA_MULTRET, 0);
            },
            luaL_loadstring: luaGlue.cwrap("luaL_loadstring", "number", ["number", "string"]),
            luaL_newstate: luaGlue.cwrap("luaL_newstate", "number", []),
        }
    },
    ">=5.2.0": function(_luaGlue: LuaEmscriptenModule, _lua: Lua) {
        return {
            luaL_loadbuffer: function(_L: LuaState, _s: string, _slen: number, _name: string) {
                throw "luaL_loadbuffer not supported in 5.2 and higher use luaL_loadstring instead.";
            }
        }
    },
}

/** @internal */
export function createLauxLib(luaGlue: LuaEmscriptenModule, lua: Lua, version: string): LauxLib {
    const result: Partial<LauxLib> = {};
    for (const [supportedVersion, factoryFunc] of Object.entries(lauxBindings)) {
        if (satisfies(version, supportedVersion)) {
            const addedFunctions = factoryFunc(luaGlue, lua);

            // Validate
            if (Object.keys(addedFunctions).some(k => k in result)) {
                throw "Error multiple possible bindings for one function, please ensure that only a single possible function exists for a specific version!";
            }

            Object.assign(result, addedFunctions);
        }
    }

    return result as LauxLib;
}

type luaLibBindingFactoryFunc = (luaGlue: LuaEmscriptenModule) => Partial<LuaLib>;
const luaLibBindings: Record<string, luaLibBindingFactoryFunc> = {
    "*": function(luaGlue: LuaEmscriptenModule) {
        return {
            luaopen_base: luaGlue.cwrap("luaopen_base", null, ["number"]),
            luaopen_math: luaGlue.cwrap("luaopen_math", null, ["number"]),
            luaopen_string: luaGlue.cwrap("luaopen_string", null, ["number"]),
            luaopen_io: luaGlue.cwrap("luaopen_io", null, ["number"]),
            luaopen_table: luaGlue.cwrap("luaopen_table", null, ["number"]),
            luaopen_debug: luaGlue.cwrap("luaopen_debug", null, ["number"]),
        }
    },
    "5.0.x": function(_luaGlue: LuaEmscriptenModule) {
        return {
            luaL_openlibs: function(L: LuaState) {
                (this as LuaLib).luaopen_base(L);
                (this as LuaLib).luaopen_math(L);
                (this as LuaLib).luaopen_string(L);
                (this as LuaLib).luaopen_io(L);
                (this as LuaLib).luaopen_table(L);
                (this as LuaLib).luaopen_debug(L);
            }
        }
    },
    ">=5.1.0": function(luaGlue: LuaEmscriptenModule) {
        return {
            luaL_openlibs: luaGlue.cwrap("luaL_openlibs", null, ["number"]),
        }
    },
}

/** @internal */
export function createLuaLib(luaGlue: LuaEmscriptenModule, version: string): LuaLib {
    const result: Partial<LuaLib> = {};
    for (const [supportedVersion, factoryFunc] of Object.entries(luaLibBindings)) {
        if (satisfies(version, supportedVersion)) {
            const addedFunctions = factoryFunc(luaGlue);
            
            // Validate
            if (Object.keys(addedFunctions).some(k => k in result)) {
                throw "Error multiple possible bindings for one function, please ensure that only a single possible function exists for a specific version!";
            }

            Object.assign(result, addedFunctions);
        }
    }

    return result as LuaLib;
}