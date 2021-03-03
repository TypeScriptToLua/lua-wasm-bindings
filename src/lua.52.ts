import { createLauxLib, createLua, createLuaLib } from "./binding-factory";
import glue from "./glue/glue-lua-5.2.4";

let luaGlue = glue({
    print: console.log,
    printErr: console.error,
});

export const lua = createLua(luaGlue, {});
export const lauxlib = createLauxLib(luaGlue, lua, {});
export const lualib = createLuaLib(luaGlue, {});
