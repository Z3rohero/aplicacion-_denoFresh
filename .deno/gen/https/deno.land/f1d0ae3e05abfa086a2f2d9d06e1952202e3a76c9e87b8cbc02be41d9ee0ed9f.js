import { dirname, extname, fromFileUrl, join, toFileUrl, walk, } from "./deps.ts";
import { error } from "./error.ts";
export async function collect(directory) {
    const routesDir = join(directory, "./routes");
    const islandsDir = join(directory, "./islands");
    const routes = [];
    try {
        const routesUrl = toFileUrl(routesDir);
        for await (const _ of Deno.readDir(routesDir)) {
        }
        const routesFolder = walk(routesDir, {
            includeDirs: false,
            includeFiles: true,
            exts: ["tsx", "jsx", "ts", "js"],
        });
        for await (const entry of routesFolder) {
            if (entry.isFile) {
                const file = toFileUrl(entry.path).href.substring(routesUrl.href.length);
                routes.push(file);
            }
        }
    }
    catch (err) {
        if (err instanceof Deno.errors.NotFound) {
        }
        else {
            throw err;
        }
    }
    routes.sort();
    const islands = [];
    try {
        const islandsUrl = toFileUrl(islandsDir);
        for await (const entry of Deno.readDir(islandsDir)) {
            if (entry.isDirectory) {
                error(`Found subdirectory '${entry.name}' in islands/. The islands/ folder must not contain any subdirectories.`);
            }
            if (entry.isFile) {
                const ext = extname(entry.name);
                if (![".tsx", ".jsx", ".ts", ".js"].includes(ext))
                    continue;
                const path = join(islandsDir, entry.name);
                const file = toFileUrl(path).href.substring(islandsUrl.href.length);
                islands.push(file);
            }
        }
    }
    catch (err) {
        if (err instanceof Deno.errors.NotFound) {
        }
        else {
            throw err;
        }
    }
    islands.sort();
    return { routes, islands };
}
export async function generate(directory, manifest) {
    const { routes, islands } = manifest;
    const output = `// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running \`dev.ts\`.

${routes.map((file, i) => `import * as $${i} from "./routes${file}";`).join("\n")}
${islands.map((file, i) => `import * as $$${i} from "./islands${file}";`)
        .join("\n")}

const manifest = {
  routes: {
    ${routes.map((file, i) => `${JSON.stringify(`./routes${file}`)}: $${i},`)
        .join("\n    ")}
  },
  islands: {
    ${islands.map((file, i) => `${JSON.stringify(`./islands${file}`)}: $$${i},`)
        .join("\n    ")}
  },
  baseUrl: import.meta.url,
};

export default manifest;
`;
    const proc = Deno.run({
        cmd: [Deno.execPath(), "fmt", "-"],
        stdin: "piped",
        stdout: "piped",
        stderr: "null",
    });
    const raw = new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(output));
            controller.close();
        },
    });
    await raw.pipeTo(proc.stdin.writable);
    const out = await proc.output();
    await proc.status();
    proc.close();
    const manifestStr = new TextDecoder().decode(out);
    const manifestPath = join(directory, "./fresh.gen.ts");
    await Deno.writeTextFile(manifestPath, manifestStr);
    console.log(`%cThe manifest has been generated for ${routes.length} routes and ${islands.length} islands.`, "color: blue; font-weight: bold");
}
export async function dev(base, entrypoint) {
    entrypoint = new URL(entrypoint, base).href;
    const dir = dirname(fromFileUrl(base));
    let currentManifest;
    const prevManifest = Deno.env.get("FRSH_DEV_PREVIOUS_MANIFEST");
    if (prevManifest) {
        currentManifest = JSON.parse(prevManifest);
    }
    else {
        currentManifest = { islands: [], routes: [] };
    }
    const newManifest = await collect(dir);
    Deno.env.set("FRSH_DEV_PREVIOUS_MANIFEST", JSON.stringify(newManifest));
    const manifestChanged = !arraysEqual(newManifest.routes, currentManifest.routes) ||
        !arraysEqual(newManifest.islands, currentManifest.islands);
    if (manifestChanged)
        await generate(dir, newManifest);
    await import(entrypoint);
}
function arraysEqual(a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHR0cHM6Ly9kZW5vLmxhbmQveC9mcmVzaEAxLjAuMi9zcmMvZGV2L21vZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsT0FBTyxFQUNQLE9BQU8sRUFDUCxXQUFXLEVBQ1gsSUFBSSxFQUNKLFNBQVMsRUFDVCxJQUFJLEdBQ0wsTUFBTSxXQUFXLENBQUM7QUFDbkIsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQU9uQyxNQUFNLENBQUMsS0FBSyxVQUFVLE9BQU8sQ0FBQyxTQUFpQjtJQUM3QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFaEQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLElBQUk7UUFDRixNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFHdkMsSUFBSSxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtTQUU5QztRQUNELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkMsV0FBVyxFQUFFLEtBQUs7WUFDbEIsWUFBWSxFQUFFLElBQUk7WUFDbEIsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO1NBQ2pDLENBQUMsQ0FBQztRQUNILElBQUksS0FBSyxFQUFFLE1BQU0sS0FBSyxJQUFJLFlBQVksRUFBRTtZQUN0QyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FDL0MsU0FBUyxDQUFD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RTtRQUNqQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7S0FDakM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBkaXJuYW1lLFxuICBleHRuYW1lLFxuICBmcm9tRmlsZVVybCxcbiAgam9pbixcbiAgdG9GaWxlVXJsLFxuICB3YWxrLFxufSBmcm9tIFwiLi9kZXBzLnRzXCI7XG5pbXBvcnQgeyBlcnJvciB9IGZyb20gXCIuL2Vycm9yLnRzXCI7XG5cbmludGVyZmFjZSBNYW5pZmVzdCB7XG4gIHJvdXRlczogc3RyaW5nW107XG4gIGlzbGFuZHM6IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29sbGVjdChkaXJlY3Rvcnk6IHN0cmluZyk6IFByb21pc2U8TWFuaWZlc3Q+IHtcbiAgY29uc3Qgcm91dGVzRGlyID0gam9pbihkaXJlY3RvcnksIFwiLi9yb3V0ZXNcIik7XG4gIGNvbnN0IGlzbGFuZHNEaXIgPSBqb2luKGRpcmVjdG9yeSwgXCIuL2lzbGFuZHNcIik7XG5cbiAgY29uc3Qgcm91dGVzID0gW107XG4gIHRyeSB7XG4gICAgY29uc3Qgcm91dGVzVXJsID0gdG9GaWxlVXJsKHJvdXRlc0Rpcik7XG4gICAgLy8gVE9ETyhsdWNhY2Fzb25hdG8pOiByZW1vdmUgdGhlIGV4dHJhbmlvdXMgRGVuby5yZWFkRGlyIHdoZW5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZGVub2xhbmQvZGVub19zdGQvaXNzdWVzLzEzMTAgaXMgZml4ZWQuXG4gICAgZm9yIGF3YWl0IChjb25zdCBfIG9mIERlbm8ucmVhZERpcihyb3V0ZXNEaXIpKSB7XG4gICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxuICAgIGNvbnN0IHJvdXRlc0ZvbGRlciA9IHdhbGsocm91dGVzRGlyLCB7XG4gICAgICBpbmNsdWRlRGlyczogZmFsc2UsXG4gICAgICBpbmNsdWRlRmlsZXM6IHRydWUsXG4gICAgICBleHRzOiBbXCJ0c3hcIiwgXCJqc3hcIiwgXCJ0c1wiLCBcImpzXCJdLFxuICAgIH0pO1xuICAgIGZvciBhd2FpdCAoY29uc3QgZW50cnkgb2Ygcm91dGVzRm9sZGVyKSB7XG4gICAgICBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0b0ZpbGVVcmwoZW50cnkucGF0aCkuaHJlZi5zdWJzdHJpbmcoXG4gICAgICAgICAgcm91dGVzVXJsLmhyZWYubGVuZ3RoLFxuICAgICAgICApO1xuICAgICAgICByb3V0ZXMucHVzaChmaWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5Ob3RGb3VuZCkge1xuICAgICAgLy8gRG8gbm90aGluZy5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuICByb3V0ZXMuc29ydCgpO1xuXG4gIGNvbnN0IGlzbGFuZHMgPSBbXTtcbiAgdHJ5IHtcbiAgICBjb25zdCBpc2xhbmRzVXJsID0gdG9GaWxlVXJsKGlzbGFuZHNEaXIpO1xuICAgIGZvciBhd2FpdCAoY29uc3QgZW50cnkgb2YgRGVuby5yZWFkRGlyKGlzbGFuZHNEaXIpKSB7XG4gICAgICBpZiAoZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgZXJyb3IoXG4gICAgICAgICAgYEZvdW5kIHN1YmRpcmVjdG9yeSAnJHtlbnRyeS5uYW1lfScgaW4gaXNsYW5kcy8uIFRoZSBpc2xhbmRzLyBmb2xkZXIgbXVzdCBub3QgY29udGFpbiBhbnkgc3ViZGlyZWN0b3JpZXMuYCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgY29uc3QgZXh0ID0gZXh0bmFtZShlbnRyeS5uYW1lKTtcbiAgICAgICAgaWYgKCFbXCIudHN4XCIsIFwiLmpzeFwiLCBcIi50c1wiLCBcIi5qc1wiXS5pbmNsdWRlcyhleHQpKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgcGF0aCA9IGpvaW4oaXNsYW5kc0RpciwgZW50cnkubmFtZSk7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0b0ZpbGVVcmwocGF0aCkuaHJlZi5zdWJzdHJpbmcoaXNsYW5kc1VybC5ocmVmLmxlbmd0aCk7XG4gICAgICAgIGlzbGFuZHMucHVzaChmaWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5Ob3RGb3VuZCkge1xuICAgICAgLy8gRG8gbm90aGluZy5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuICBpc2xhbmRzLnNvcnQoKTtcblxuICByZXR1cm4geyByb3V0ZXMsIGlzbGFuZHMgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlKGRpcmVjdG9yeTogc3RyaW5nLCBtYW5pZmVzdDogTWFuaWZlc3QpIHtcbiAgY29uc3QgeyByb3V0ZXMsIGlzbGFuZHMgfSA9IG1hbmlmZXN0O1xuXG4gIGNvbnN0IG91dHB1dCA9IGAvLyBETyBOT1QgRURJVC4gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSBmcmVzaC5cbi8vIFRoaXMgZmlsZSBTSE9VTEQgYmUgY2hlY2tlZCBpbnRvIHNvdXJjZSB2ZXJzaW9uIGNvbnRyb2wuXG4vLyBUaGlzIGZpbGUgaXMgYXV0b21hdGljYWxseSB1cGRhdGVkIGR1cmluZyBkZXZlbG9wbWVudCB3aGVuIHJ1bm5pbmcgXFxgZGV2LnRzXFxgLlxuXG4ke1xuICAgIHJvdXRlcy5tYXAoKGZpbGUsIGkpID0+IGBpbXBvcnQgKiBhcyAkJHtpfSBmcm9tIFwiLi9yb3V0ZXMke2ZpbGV9XCI7YCkuam9pbihcbiAgICAgIFwiXFxuXCIsXG4gICAgKVxuICB9XG4ke1xuICAgIGlzbGFuZHMubWFwKChmaWxlLCBpKSA9PiBgaW1wb3J0ICogYXMgJCQke2l9IGZyb20gXCIuL2lzbGFuZHMke2ZpbGV9XCI7YClcbiAgICAgIC5qb2luKFwiXFxuXCIpXG4gIH1cblxuY29uc3QgbWFuaWZlc3QgPSB7XG4gIHJvdXRlczoge1xuICAgICR7XG4gICAgcm91dGVzLm1hcCgoZmlsZSwgaSkgPT4gYCR7SlNPTi5zdHJpbmdpZnkoYC4vcm91dGVzJHtmaWxlfWApfTogJCR7aX0sYClcbiAgICAgIC5qb2luKFwiXFxuICAgIFwiKVxuICB9XG4gIH0sXG4gIGlzbGFuZHM6IHtcbiAgICAke1xuICAgIGlzbGFuZHMubWFwKChmaWxlLCBpKSA9PiBgJHtKU09OLnN0cmluZ2lmeShgLi9pc2xhbmRzJHtmaWxlfWApfTogJCQke2l9LGApXG4gICAgICAuam9pbihcIlxcbiAgICBcIilcbiAgfVxuICB9LFxuICBiYXNlVXJsOiBpbXBvcnQubWV0YS51cmwsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtYW5pZmVzdDtcbmA7XG5cbiAgY29uc3QgcHJvYyA9IERlbm8ucnVuKHtcbiAgICBjbWQ6IFtEZW5vLmV4ZWNQYXRoKCksIFwiZm10XCIsIFwiLVwiXSxcbiAgICBzdGRpbjogXCJwaXBlZFwiLFxuICAgIHN0ZG91dDogXCJwaXBlZFwiLFxuICAgIHN0ZGVycjogXCJudWxsXCIsXG4gIH0pO1xuICBjb25zdCByYXcgPSBuZXcgUmVhZGFibGVTdHJlYW0oe1xuICAgIHN0YXJ0KGNvbnRyb2xsZXIpIHtcbiAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUob3V0cHV0KSk7XG4gICAgICBjb250cm9sbGVyLmNsb3NlKCk7XG4gICAgfSxcbiAgfSk7XG4gIGF3YWl0IHJhdy5waXBlVG8ocHJvYy5zdGRpbi53cml0YWJsZSk7XG4gIGNvbnN0IG91dCA9IGF3YWl0IHByb2Mub3V0cHV0KCk7XG4gIGF3YWl0IHByb2Muc3RhdHVzKCk7XG4gIHByb2MuY2xvc2UoKTtcblxuICBjb25zdCBtYW5pZmVzdFN0ciA9IG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShvdXQpO1xuICBjb25zdCBtYW5pZmVzdFBhdGggPSBqb2luKGRpcmVjdG9yeSwgXCIuL2ZyZXNoLmdlbi50c1wiKTtcblxuICBhd2FpdCBEZW5vLndyaXRlVGV4dEZpbGUobWFuaWZlc3RQYXRoLCBtYW5pZmVzdFN0cik7XG4gIGNvbnNvbGUubG9nKFxuICAgIGAlY1RoZSBtYW5pZmVzdCBoYXMgYmVlbiBnZW5lcmF0ZWQgZm9yICR7cm91dGVzLmxlbmd0aH0gcm91dGVzIGFuZCAke2lzbGFuZHMubGVuZ3RofSBpc2xhbmRzLmAsXG4gICAgXCJjb2xvcjogYmx1ZTsgZm9udC13ZWlnaHQ6IGJvbGRcIixcbiAgKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRldihiYXNlOiBzdHJpbmcsIGVudHJ5cG9pbnQ6IHN0cmluZykge1xuICBlbnRyeXBvaW50ID0gbmV3IFVSTChlbnRyeXBvaW50LCBiYXNlKS5ocmVmO1xuXG4gIGNvbnN0IGRpciA9IGRpcm5hbWUoZnJvbUZpbGVVcmwoYmFzZSkpO1xuXG4gIGxldCBjdXJyZW50TWFuaWZlc3Q6IE1hbmlmZXN0O1xuICBjb25zdCBwcmV2TWFuaWZlc3QgPSBEZW5vLmVudi5nZXQoXCJGUlNIX0RFVl9QUkVWSU9VU19NQU5JRkVTVFwiKTtcbiAgaWYgKHByZXZNYW5pZmVzdCkge1xuICAgIGN1cnJlbnRNYW5pZmVzdCA9IEpTT04ucGFyc2UocHJldk1hbmlmZXN0KTtcbiAgfSBlbHNlIHtcbiAgICBjdXJyZW50TWFuaWZlc3QgPSB7IGlzbGFuZHM6IFtdLCByb3V0ZXM6IFtdIH07XG4gIH1cbiAgY29uc3QgbmV3TWFuaWZlc3QgPSBhd2FpdCBjb2xsZWN0KGRpcik7XG4gIERlbm8uZW52LnNldChcIkZSU0hfREVWX1BSRVZJT1VTX01BTklGRVNUXCIsIEpTT04uc3RyaW5naWZ5KG5ld01hbmlmZXN0KSk7XG5cbiAgY29uc3QgbWFuaWZlc3RDaGFuZ2VkID1cbiAgICAhYXJyYXlzRXF1YWwobmV3TWFuaWZlc3Qucm91dGVzLCBjdXJyZW50TWFuaWZlc3Qucm91dGVzKSB8fFxuICAgICFhcnJheXNFcXVhbChuZXdNYW5pZmVzdC5pc2xhbmRzLCBjdXJyZW50TWFuaWZlc3QuaXNsYW5kcyk7XG5cbiAgaWYgKG1hbmlmZXN0Q2hhbmdlZCkgYXdhaXQgZ2VuZXJhdGUoZGlyLCBuZXdNYW5pZmVzdCk7XG5cbiAgYXdhaXQgaW1wb3J0KGVudHJ5cG9pbnQpO1xufVxuXG5mdW5jdGlvbiBhcnJheXNFcXVhbDxUPihhOiBUW10sIGI6IFRbXSk6IGJvb2xlYW4ge1xuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iXX0=