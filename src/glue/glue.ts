export interface LuaEmscriptenModule extends EmscriptenModule {
    cwrap: typeof cwrap;
    lengthBytesUTF8: typeof lengthBytesUTF8;
}

export type EmscriptenModuleFactorySync<T extends EmscriptenModule = EmscriptenModule> = (
    moduleOverrides?: Partial<T>
) => T;

export default {} as EmscriptenModuleFactorySync<LuaEmscriptenModule>;
