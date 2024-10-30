declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ATLAS_URI: string;
            SECRET: string;
            PORT?: string;
        }
    }
}

export {}