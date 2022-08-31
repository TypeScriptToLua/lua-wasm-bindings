export interface LuaEmscriptenModule extends EmscriptenModule {
    allocateUTF8: typeof allocateUTF8;
    lengthBytesUTF8: typeof lengthBytesUTF8;
    cwrap: typeof cwrap;
}

export type EmscriptenModuleFactorySync<T extends EmscriptenModule = EmscriptenModule> = (
    moduleOverrides?: Partial<T>
) => T;

export default {} as EmscriptenModuleFactorySync<LuaEmscriptenModule>;
