export interface LuaEmscriptenModule extends EmscriptenModule {
    cwrap: typeof cwrap;
    stackSave: typeof stackSave;
    stackRestore: typeof stackRestore;
    lengthBytesUTF8: typeof lengthBytesUTF8;
    allocateUTF8OnStack: typeof allocateUTF8;
}

export type EmscriptenModuleFactorySync<T extends EmscriptenModule = EmscriptenModule> = (
    moduleOverrides?: Partial<T>
) => T;

export default {} as EmscriptenModuleFactorySync<LuaEmscriptenModule>;
