import { createLauxLib, createLua, createLuaLib } from "./binding-factory";
import glue from "./glue/glue-lua-5.4.2";

let luaGlue = glue({
    print: console.log,
    printErr: console.error,
});

export const lua = createLua(luaGlue, "5.4.2");
export const lauxlib = createLauxLib(luaGlue, lua, "5.4.2");
export const lualib = createLuaLib(luaGlue, "5.4.2");
