"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getCreateSQL, getSeedSQL, getAdditionalSeedSQL } from "./dbSetup";

export interface QueryResult {
  columns: string[];
  rows: (string | number | null)[][];
  rowCount: number;
}

type DbInstance = {
  run: (sql: string) => void;
  exec: (sql: string) => { columns: string[]; values: (string | number | null)[][] }[];
};
type InitSqlJsFn = (config: { locateFile: (f: string) => string }) => Promise<{ Database: new () => DbInstance }>;

declare global {
  interface Window { initSqlJs?: InitSqlJsFn; }
}

const SQL_JS_CDN = "https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/sql-wasm.js";
const WASM_CDN = "https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/sql-wasm.wasm";

let globalDb: DbInstance | null = null;
let initPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function initDb() {
  await loadScript(SQL_JS_CDN);
  const initFn = window.initSqlJs;
  if (!initFn) throw new Error("initSqlJs not found on window");
  const SQL = await initFn({ locateFile: () => WASM_CDN });
  const db = new SQL.Database();
  db.run(getCreateSQL());
  db.run(getSeedSQL());
  db.run(getAdditionalSeedSQL());
  globalDb = db;
}

export function useDatabase() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dbRef = useRef<DbInstance | null>(null);

  useEffect(() => {
    if (globalDb) {
      dbRef.current = globalDb;
      setReady(true);
      return;
    }

    if (!initPromise) {
      initPromise = initDb();
    }

    let cancelled = false;
    initPromise
      .then(() => {
        if (!cancelled && globalDb) {
          dbRef.current = globalDb;
          setReady(true);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });

    return () => { cancelled = true; };
  }, []);

  const execute = useCallback((sql: string): QueryResult => {
    if (!dbRef.current) throw new Error("Base de datos no disponible");
    const results = dbRef.current.exec(sql);
    if (!results || results.length === 0) {
      return { columns: [], rows: [], rowCount: 0 };
    }
    const { columns, values } = results[0];
    return { columns, rows: values, rowCount: values.length };
  }, []);

  return { ready, error, execute };
}
