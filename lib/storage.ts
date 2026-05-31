import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");

function ensureDir(dir: string) {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
}

export function readJson<T>(filename: string, subdir?: string): T {
	const dir = subdir ? join(DATA_DIR, subdir) : DATA_DIR;
	ensureDir(dir);
	const filePath = join(dir, filename);
	if (!existsSync(filePath)) {
		return [] as unknown as T;
	}
	return JSON.parse(readFileSync(filePath, "utf-8"));
}

export function writeJson<T>(filename: string, data: T, subdir?: string) {
	const dir = subdir ? join(DATA_DIR, subdir) : DATA_DIR;
	ensureDir(dir);
	writeFileSync(join(dir, filename), JSON.stringify(data, null, 2));
}
