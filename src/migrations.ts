import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

export type PlanMigration = {
  version: number;
  slug: string;
  dir: string;
  stepsPath: string;
  upScriptPath: string | null;
  touchesPrompts: boolean;
};

const DIR_RE = /^(\d{4})_(.+)$/;

export function listMigrations(migrationsDir: string): PlanMigration[] {
  if (!existsSync(migrationsDir)) {
    return [];
  }
  const entries = readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const migrations: PlanMigration[] = [];
  for (const name of entries) {
    const match = DIR_RE.exec(name);
    if (!match) {
      throw new Error(`migrations folder name must be NNNN_slug, got ${name}`);
    }
    const version = Number(match[1]);
    const slug = match[2] ?? "";
    const dir = path.join(migrationsDir, name);
    const stepsPath = path.join(dir, "steps.md");
    if (!existsSync(stepsPath)) {
      throw new Error(`migration ${name} is missing steps.md`);
    }
    const upPath = path.join(dir, "up.sh");
    const metaPath = path.join(dir, "meta.json");
    let touchesPrompts = false;
    if (existsSync(metaPath)) {
      const meta = JSON.parse(readFileSync(metaPath, "utf8")) as unknown;
      if (
        typeof meta === "object" &&
        meta !== null &&
        "touchesPrompts" in meta &&
        typeof (meta as { touchesPrompts: unknown }).touchesPrompts === "boolean"
      ) {
        touchesPrompts = (meta as { touchesPrompts: boolean }).touchesPrompts;
      } else {
        throw new Error(`migration ${name} meta.json must have boolean touchesPrompts`);
      }
    }
    migrations.push({
      version,
      slug,
      dir,
      stepsPath,
      upScriptPath: existsSync(upPath) ? upPath : null,
      touchesPrompts,
    });
  }
  return migrations;
}

export function headPlanVersion(migrationsDir: string): number {
  const migrations = listMigrations(migrationsDir);
  if (migrations.length === 0) {
    throw new Error("no plan migrations found");
  }
  return migrations[migrations.length - 1]?.version ?? 0;
}

export function pendingMigrations(args: {
  migrationsDir: string;
  planVersion: number;
}): PlanMigration[] {
  return listMigrations(args.migrationsDir).filter(
    (migration) => migration.version > args.planVersion,
  );
}
