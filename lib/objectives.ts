export interface Objective {
  code: string;
  description: string;
  hint: string;
}

export const OBJECTIVES: Objective[] = [
  { code: "Q01_EXPEDIENTE",       description: "Consultar los datos generales del caso",              hint: "Consulta la tabla vista_casos o casos" },
  { code: "Q02_SOSPECHOSOS",      description: "Listar todos los sospechosos",                        hint: "Consulta la tabla vista_sospechosos o sospechosos" },
  { code: "Q03_DECLARACIONES",    description: "Revisar declaraciones de los sospechosos",            hint: "Consulta la tabla vista_declaraciones o declaraciones" },
  { code: "Q04_COARTADAS",        description: "Consultar ubicaciones declaradas",                    hint: "Consulta la tabla ubicaciones" },
  { code: "Q05_HORA_CRIMEN",      description: "Buscar movimientos durante la ventana del crimen",    hint: "Consulta ubicaciones con condición de fecha/hora o BETWEEN" },
  { code: "Q06_CAMARAS",          description: "Revisar cámaras cercanas al lugar del crimen",        hint: "Consulta la tabla camara_seguridad" },
  { code: "Q07_ACCESOS",          description: "Consultar entradas y salidas del lugar",              hint: "Consulta la tabla accesos" },
  { code: "Q08_LLAMADAS",         description: "Revisar llamadas antes y después del crimen",         hint: "Consulta la tabla llamadas" },
  { code: "Q09_MENSAJES",         description: "Consultar mensajes relevantes",                       hint: "Consulta la tabla mensajes" },
  { code: "Q10_TRANSACCIONES",    description: "Buscar pagos, deudas o compras sospechosas",          hint: "Consulta la tabla transacciones" },
  { code: "Q11_EVIDENCIAS",       description: "Revisar evidencias físicas encontradas",              hint: "Consulta la tabla evidencias" },
  { code: "Q12_HUELLAS",          description: "Cruzar evidencias con huellas, ADN o fibras",         hint: "Consulta la tabla huellas o haz JOIN con evidencias" },
  { code: "Q13_CONTRADICCION_1",  description: "Detectar una primera contradicción mediante JOIN",    hint: "Haz un JOIN entre al menos dos tablas diferentes" },
  { code: "Q14_CONTRADICCION_2",  description: "Detectar una segunda contradicción",                  hint: "Haz otro JOIN con tablas diferentes al anterior" },
  { code: "Q15_MOTIVO_OPORTUNIDAD", description: "Relacionar motivo, oportunidad y evidencia",       hint: "Usa GROUP BY, HAVING, COUNT u otras funciones de agregación" },
];

/**
 * Detects which objectives are newly completed by a query.
 *
 * Uses two complementary strategies:
 *   1. SQL text — checks if the query mentions a known table name (case-insensitive).
 *   2. Result columns — checks if the returned columns are distinctive of a table,
 *      so that JOINs, aliases, or subqueries still trigger detection.
 *
 * @param sql             The SQL string the student typed.
 * @param resultColumns   Column names returned by the query (empty array if no result / error).
 * @param alreadyCompleted Set of objective codes already completed in this session.
 */
export function detectObjectives(
  sql: string,
  resultColumns: string[],
  alreadyCompleted: Set<string>
): string[] {
  const newlyCompleted: string[] = [];

  // Normalise for comparison
  const q = sql.toUpperCase();
  const cols = new Set(resultColumns.map((c) => c.toUpperCase()));

  const check = (code: string, condition: boolean) => {
    if (condition && !alreadyCompleted.has(code)) {
      newlyCompleted.push(code);
    }
  };

  // Helpers
  const hasTbl  = (...names: string[]) => names.some((n) => q.includes(n));
  const hasCol  = (...names: string[]) => names.some((n) => cols.has(n));
  const hasAllC = (...names: string[]) => names.every((n) => cols.has(n));

  // ── Table / result-column rules ──────────────────────────────────────────

  // Q01: casos — distinctive columns: VICTIMA, LUGAR_CRIMEN, FECHA_CRIMEN
  check("Q01_EXPEDIENTE",
    hasTbl("CASOS", "VISTA_CASOS") ||
    (hasCol("VICTIMA") && hasCol("LUGAR_CRIMEN")));

  // Q02: sospechosos — distinctive: NIVEL_NERVIOSISMO, MOTIVO_APARENTE
  check("Q02_SOSPECHOSOS",
    hasTbl("SOSPECHOSOS", "VISTA_SOSPECHOSOS") ||
    hasCol("NIVEL_NERVIOSISMO") ||
    hasCol("MOTIVO_APARENTE"));

  // Q03: declaraciones — distinctive: DECLARACION, TEMA
  check("Q03_DECLARACIONES",
    hasTbl("DECLARACIONES", "VISTA_DECLARACIONES") ||
    hasCol("DECLARACION") ||
    (hasCol("TEMA") && hasCol("ID_DECLARACION")));

  // Q04: ubicaciones — distinctive: FUENTE (only in ubicaciones)
  check("Q04_COARTADAS",
    hasTbl("UBICACIONES") ||
    hasCol("FUENTE") ||
    hasAllC("PERSONA", "LUGAR", "FECHA_HORA", "ID_UBICACION"));

  // Q05: ubicaciones + time filter
  check("Q05_HORA_CRIMEN",
    (hasTbl("UBICACIONES") && (q.includes("BETWEEN") || q.includes(">=") || q.includes("<=") || q.includes("FECHA_HORA"))) ||
    (hasCol("FUENTE") && (q.includes("BETWEEN") || q.includes(">=") || q.includes("<="))));

  // Q06: camara_seguridad — distinctive: CAMARA, PERSONA_DETECTADA
  check("Q06_CAMARAS",
    hasTbl("CAMARA_SEGURIDAD") ||
    hasCol("CAMARA") ||
    hasCol("PERSONA_DETECTADA"));

  // Q07: accesos — distinctive: METODO_ACCESO
  check("Q07_ACCESOS",
    hasTbl("ACCESOS") ||
    hasCol("METODO_ACCESO"));

  // Q08: llamadas — distinctive: PERSONA_ORIGEN, DURACION_SEGUNDOS
  check("Q08_LLAMADAS",
    hasTbl("LLAMADAS") ||
    hasCol("PERSONA_ORIGEN") ||
    hasCol("DURACION_SEGUNDOS"));

  // Q09: mensajes — distinctive: REMITENTE, DESTINATARIO
  check("Q09_MENSAJES",
    hasTbl("MENSAJES") ||
    (hasCol("REMITENTE") && hasCol("DESTINATARIO")));

  // Q10: transacciones — distinctive: MONTO
  check("Q10_TRANSACCIONES",
    hasTbl("TRANSACCIONES") ||
    hasCol("MONTO"));

  // Q11: evidencias — distinctive: LUGAR_ENCONTRADO, FECHA_HORA_REGISTRO
  check("Q11_EVIDENCIAS",
    hasTbl("EVIDENCIAS") ||
    hasCol("LUGAR_ENCONTRADO") ||
    hasCol("FECHA_HORA_REGISTRO"));

  // Q12: huellas — distinctive: TIPO_COINCIDENCIA, NIVEL_CONFIANZA
  check("Q12_HUELLAS",
    hasTbl("HUELLAS") ||
    hasCol("TIPO_COINCIDENCIA") ||
    hasCol("NIVEL_CONFIANZA"));

  // ── JOIN / aggregation rules ─────────────────────────────────────────────

  check("Q13_CONTRADICCION_1", q.includes("JOIN"));

  check("Q14_CONTRADICCION_2",
    q.includes("JOIN") && alreadyCompleted.has("Q13_CONTRADICCION_1"));

  check("Q15_MOTIVO_OPORTUNIDAD",
    q.includes("GROUP BY") ||
    q.includes("HAVING")   ||
    q.includes("COUNT")    ||
    q.includes("SUM")      ||
    q.includes("AVG")      ||
    q.includes("MAX")      ||
    q.includes("MIN")      ||
    (q.match(/JOIN/g) ?? []).length >= 2);

  return newlyCompleted;
}

export function isQueryAllowed(sql: string): boolean {
  const trimmed = sql.trim().toUpperCase();
  const blocked = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE|REPLACE|ATTACH|DETACH|PRAGMA\s+(?!TABLE_INFO|FOREIGN_KEY_LIST|INDEX_LIST))\b/;
  if (blocked.test(trimmed)) return false;
  const allowed = /^(SELECT|SHOW|DESCRIBE|EXPLAIN|WITH|PRAGMA\s+(TABLE_INFO|FOREIGN_KEY_LIST|INDEX_LIST))/;
  return allowed.test(trimmed);
}
