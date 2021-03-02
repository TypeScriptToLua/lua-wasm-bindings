interface LuaEmscriptenModule extends EmscriptenModule {
  cwrap: typeof cwrap;
}

type EmscriptenModuleFactorySync<T extends EmscriptenModule = EmscriptenModule> = (
  moduleOverrides?: Partial<T>,
) => T;

export default {} as EmscriptenModuleFactorySync<LuaEmscriptenModule>;
