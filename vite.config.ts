import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import { globSync } from "glob";

export default defineConfig(config => {
    const env: Record<string, string> = loadEnv(config.mode, process.cwd(), "VITE");

    const viteConfiguration: unknown = Object.entries(env).reduce((prev, [key, val]) => {
        return {
            ...prev,
            [key.substring("VITE_".length)]: val,
        };
    }, {});

    let htmlFiles: string[];

    if (config.mode === "development") {
        htmlFiles = globSync("**/*.html", {
            cwd: resolve(__dirname, "./wwwroot"),
        });
    }
    else {
        htmlFiles = globSync("wwwroot/**/*.html", {
            cwd: resolve(__dirname, "./"),
        });
    }

    const input: {
        [key: string]: string;
    } = {};

    htmlFiles.forEach((e: string, i: number) => {
        input[`app_${i}`] = resolve(e);
    });

    return {
        base: "./",
        root: "wwwroot",
        appType: "mpa",
        resolve: {
            alias: {
                "/src": resolve(__dirname, "./src"),
            },
        },
        build: {
            sourcemap: true,
            rollupOptions: {
                input: input,
            },
            outDir: resolve(__dirname, "./dist"),
            emptyOutDir: true,
        },
        esbuild: {
            supported: {
                "top-level-await": true,
            },
        },
        plugins: [],
        define: {
            viteConfiguration: viteConfiguration,
        },
        server: {
            strictPort: true,
            port: 3000,
        },
        preview: {
            strictPort: true,
            port: 3000,
        },
    };
});
