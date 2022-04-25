import { LauxLib, Lua, LuaLib } from "./dist/lua";

import * as Lua50 from "./dist/lua.50";
import * as Lua51 from "./dist/lua.51";
import * as Lua52 from "./dist/lua.52";
import * as Lua53 from "./dist/lua.53";
import * as Lua54 from "./dist/lua.54";

function simpleTest(luaBundle: {lua: Lua, lauxlib: LauxLib, lualib: LuaLib}) {
    const state = luaBundle.lauxlib.luaL_newstate();
    luaBundle.lualib.luaL_openlibs(state);
}

simpleTest(Lua50);
simpleTest(Lua51);
simpleTest(Lua52);
simpleTest(Lua53);
simpleTest(Lua54);