import * as path from "../path/mod.ts";
import { basename, normalize } from "../path/mod.ts";
export function isSubdir(src, dest, sep = path.sep) {
    if (src === dest) {
        return false;
    }
    const srcArray = src.split(sep);
    const destArray = dest.split(sep);
    return srcArray.every((current, i) => destArray[i] === current);
}
export function getFileInfoType(fileInfo) {
    return fileInfo.isFile
        ? "file"
        : fileInfo.isDirectory
            ? "dir"
            : fileInfo.isSymlink
                ? "symlink"
                : undefined;
}
export function createWalkEntrySync(path) {
    path = normalize(path);
    const name = basename(path);
    const info = Deno.statSync(path);
    return {
        path,
        name,
        isFile: info.isFile,
        isDirectory: info.isDirectory,
        isSymlink: info.isSymlink,
    };
}
export async function createWalkEntry(path) {
    path = normalize(path);
    const name = basename(path);
    const info = await Deno.stat(path);
    return {
        path,
        name,
        isFile: info.isFile,
        isDirectory: info.isDirectory,
        isSymlink: info.isSymlink,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJodHRwczovL2Rlbm8ubGFuZC9zdGRAMC4xNTAuMC9mcy9fdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEtBQUssSUFBSSxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFRckQsTUFBTSxVQUFVLFFBQVEsQ0FDdEIsR0FBVyxFQUNYLElBQVksRUFDWixNQUFjLElBQUksQ0FBQyxHQUFHO0lBRXRCLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtRQUNoQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBVUQsTUFBTSxVQUFVLGVBQWUsQ0FBQyxRQUF1QjtJQUNyRCxPQUFPLFFBQVEsQ0FBQyxNQUFNO1FBQ3BCLENBQUMsQ0FBQyxNQUFNO1FBQ1IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXO1lBQ3RCLENBQUMsQ0FBQyxLQUFLO1lBQ1AsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTO2dCQUNwQixDQUFDLENBQUMsU0FBUztnQkFDWCxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ2hCLENBQUM7QUFPRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsSUFBWTtJQUM5QyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLE9BQU87UUFDTCxJQUFJO1FBQ0osSUFBSTtRQUNKLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtRQUNuQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7UUFDN0IsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO0tBQzFCLENBQUM7QUFDSixDQUFDO0FBR0QsTUFBTSxDQUFDLEtBQUssVUFBVSxlQUFlLENBQUMsSUFBWTtJQUNoRCxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsT0FBTztRQUNMLElBQUk7UUFDSixJQUFJO1FBQ0osTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1FBQ25CLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztRQUM3QixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7S0FDMUIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwiLi4vcGF0aC9tb2QudHNcIjtcbmltcG9ydCB7IGJhc2VuYW1lLCBub3JtYWxpemUgfSBmcm9tIFwiLi4vcGF0aC9tb2QudHNcIjtcblxuLyoqXG4gKiBUZXN0IHdoZXRoZXIgb3Igbm90IGBkZXN0YCBpcyBhIHN1Yi1kaXJlY3Rvcnkgb2YgYHNyY2BcbiAqIEBwYXJhbSBzcmMgc3JjIGZpbGUgcGF0aFxuICogQHBhcmFtIGRlc3QgZGVzdCBmaWxlIHBhdGhcbiAqIEBwYXJhbSBzZXAgcGF0aCBzZXBhcmF0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3ViZGlyKFxuICBzcmM6IHN0cmluZyxcbiAgZGVzdDogc3RyaW5nLFxuICBzZXA6IHN0cmluZyA9IHBhdGguc2VwLFxuKTogYm9vbGVhbiB7XG4gIGlmIChzcmMgPT09IGRlc3QpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3Qgc3JjQXJyYXkgPSBzcmMuc3BsaXQoc2VwKTtcbiAgY29uc3QgZGVzdEFycmF5ID0gZGVzdC5zcGxpdChzZXApO1xuICByZXR1cm4gc3JjQXJyYXkuZXZlcnkoKGN1cnJlbnQsIGkpID0+IGRlc3RBcnJheVtpXSA9PT0gY3VycmVudCk7XG59XG5cbmV4cG9ydCB0eXBlIFBhdGhUeXBlID0gXCJmaWxlXCIgfCBcImRpclwiIHwgXCJzeW1saW5rXCI7XG5cbi8qKlxuICogR2V0IGEgaHVtYW4gcmVhZGFibGUgZmlsZSB0eXBlIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gZmlsZUluZm8gQSBGaWxlSW5mbyBkZXNjcmliZXMgYSBmaWxlIGFuZCBpcyByZXR1cm5lZCBieSBgc3RhdGAsXG4gKiAgICAgICAgICAgICAgICAgYGxzdGF0YFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZUluZm9UeXBlKGZpbGVJbmZvOiBEZW5vLkZpbGVJbmZvKTogUGF0aFR5cGUgfCB1bmRlZmluZWQge1xuICByZXR1cm4gZmlsZUluZm8uaXNGaWxlXG4gICAgPyBcImZpbGVcIlxuICAgIDogZmlsZUluZm8uaXNEaXJlY3RvcnlcbiAgICA/IFwiZGlyXCJcbiAgICA6IGZpbGVJbmZvLmlzU3ltbGlua1xuICAgID8gXCJzeW1saW5rXCJcbiAgICA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXYWxrRW50cnkgZXh0ZW5kcyBEZW5vLkRpckVudHJ5IHtcbiAgcGF0aDogc3RyaW5nO1xufVxuXG4vKiogQ3JlYXRlIFdhbGtFbnRyeSBmb3IgdGhlIGBwYXRoYCBzeW5jaHJvbm91c2x5ICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV2Fsa0VudHJ5U3luYyhwYXRoOiBzdHJpbmcpOiBXYWxrRW50cnkge1xuICBwYXRoID0gbm9ybWFsaXplKHBhdGgpO1xuICBjb25zdCBuYW1lID0gYmFzZW5hbWUocGF0aCk7XG4gIGNvbnN0IGluZm8gPSBEZW5vLnN0YXRTeW5jKHBhdGgpO1xuICByZXR1cm4ge1xuICAgIHBhdGgsXG4gICAgbmFtZSxcbiAgICBpc0ZpbGU6IGluZm8uaXNGaWxlLFxuICAgIGlzRGlyZWN0b3J5OiBpbmZvLmlzRGlyZWN0b3J5LFxuICAgIGlzU3ltbGluazogaW5mby5pc1N5bWxpbmssXG4gIH07XG59XG5cbi8qKiBDcmVhdGUgV2Fsa0VudHJ5IGZvciB0aGUgYHBhdGhgIGFzeW5jaHJvbm91c2x5ICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2Fsa0VudHJ5KHBhdGg6IHN0cmluZyk6IFByb21pc2U8V2Fsa0VudHJ5PiB7XG4gIHBhdGggPSBub3JtYWxpemUocGF0aCk7XG4gIGNvbnN0IG5hbWUgPSBiYXNlbmFtZShwYXRoKTtcbiAgY29uc3QgaW5mbyA9IGF3YWl0IERlbm8uc3RhdChwYXRoKTtcbiAgcmV0dXJuIHtcbiAgICBwYXRoLFxuICAgIG5hbWUsXG4gICAgaXNGaWxlOiBpbmZvLmlzRmlsZSxcbiAgICBpc0RpcmVjdG9yeTogaW5mby5pc0RpcmVjdG9yeSxcbiAgICBpc1N5bWxpbms6IGluZm8uaXNTeW1saW5rLFxuICB9O1xufVxuIl19