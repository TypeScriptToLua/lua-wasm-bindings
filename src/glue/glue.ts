export interface LuaEmscriptenModule extends EmscriptenModule {
    cwrap: typeof cwrap;
}

export type EmscriptenModuleFactorySync<T extends EmscriptenModule = EmscriptenModule> = (
    moduleOverrides?: Partial<T>
) => T;

export default {} as EmscriptenModuleFactorySync<LuaEmscriptenModule>;
