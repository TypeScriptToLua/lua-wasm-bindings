import type { EmscriptenModuleFactorySync, LuaEmscriptenModule } from "./glue";

declare const glue: EmscriptenModuleFactorySync<LuaEmscriptenModule>;

export default glue;