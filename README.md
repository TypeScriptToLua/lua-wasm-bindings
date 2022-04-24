## Lua WASM Bindings

WASM bindings and binaries for Lua 5.1 to 5.4.

Make sure to run `./scripts/setup.sh` (requires emscripten sdk) first before using `npm run build`.

### Important: This currently only includes the bindings used to test TypescriptToLua

In the future Bindings for the complete API may be added.

### Example

```ts
import { LUA_OK } from "lua-wasm-bindings/dist/lua";

import { lauxlib, lua, lualib } from "lua-wasm-bindings/dist/lua.54";

const luaCode = `return "Hello"`;
consol.log(executeLua(luaCode));

function executeLua(luaCode: string): string | Error | never {
  const L = lauxlib.luaL_newstate();
  lualib.luaL_openlibs(L);

  // Optional Load modules
  // lua.lua_getglobal(L, "package");
  // lua.lua_getfield(L, -1, "preload");
  // lauxlib.luaL_loadstring(L, jsonLib); // Load extenal package from string
  // lua.lua_setfield(L, -2, "json");

  const status = lauxlib.luaL_dostring(L, luaCode);

  if (status === LUA_OK) {
    if (lua.lua_isstring(L, -1)) {
      const result = lua.lua_tostring(L, -1);
      lua.lua_close(L);
      return result === null ? undefined : result;
    } else {
      const returnType = lua.lua_typename(L, lua.lua_type(L, -1));
      lua.lua_close(L);
      throw new Error(`Unsupported Lua return type: ${returnType}`);
    }
  } else {
    const luaStackString = lua.lua_tostring(L, -1);
    const message = luaStackString.replace(/^\[string "(--)?\.\.\."\]:\d+: /, "");
    lua.lua_close(L);
    return new Error(message);
  }
}
```
