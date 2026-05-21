export interface Objective {
  code: string;
  description: string;
  hint: string;
}

export const OBJECTIVES: Objective[] = [
  { code: "Q01_EXPEDIENTE", description: "Consultar los datos generales del caso", hint: "Consulta la tabla vista_casos o casos" },
  { code: "Q02_SOSPECHOSOS", description: "Listar todos los sospechosos", hint: "Consulta la tabla vista_sospechosos o sospechosos" },
  { code: "Q03_DECLARACIONES", description: "Revisar declaraciones de los sospechosos", hint: "Consulta la tabla vista_declaraciones o declaraciones" },
  { code: "Q04_COARTADAS", description: "Consultar ubicaciones declaradas", hint: "Consulta la tabla ubicaciones" },
  { code: "Q05_HORA_CRIMEN", description: "Buscar movimientos durante la ventana del crimen", hint: "Consulta ubicaciones con condición de fecha/hora o BETWEEN" },
  { code: "Q06_CAMARAS", description: "Revisar cámaras cercanas al lugar del crimen", hint: "Consulta la tabla camara_seguridad" },
  { code: "Q07_ACCESOS", description: "Consultar entradas y salidas del lugar", hint: "Consulta la tabla accesos" },
  { code: "Q08_LLAMADAS", description: "Revisar llamadas antes y después del crimen", hint: "Consulta la tabla llamadas" },
  { code: "Q09_MENSAJES", description: "Consultar mensajes relevantes", hint: "Consulta la tabla mensajes" },
  { code: "Q10_TRANSACCIONES", description: "Buscar pagos, deudas o compras sospechosas", hint: "Consulta la tabla transacciones" },
  { code: "Q11_EVIDENCIAS", description: "Revisar evidencias físicas encontradas", hint: "Consulta la tabla evidencias" },
  { code: "Q12_HUELLAS", description: "Cruzar evidencias con huellas, ADN o fibras", hint: "Consulta la tabla huellas o haz JOIN con evidencias" },
  { code: "Q13_CONTRADICCION_1", description: "Detectar una primera contradicción mediante JOIN", hint: "Haz un JOIN entre al menos dos tablas diferentes" },
  { code: "Q14_CONTRADICCION_2", description: "Detectar una segunda contradicción", hint: "Haz otro JOIN con tablas diferentes al anterior" },
  { code: "Q15_MOTIVO_OPORTUNIDAD", description: "Relacionar motivo, oportunidad y evidencia", hint: "Usa GROUP BY, HAVING, COUNT u otras funciones de agregación" },
];

export function detectObjectives(sql: string, alreadyCompleted: Set<string>): string[] {
  const newlyCompleted: string[] = [];
  const upper = sql.toUpperCase();

  const check = (code: string, condition: boolean) => {
    if (condition && !alreadyCompleted.has(code)) {
      newlyCompleted.push(code);
    }
  };

  check("Q01_EXPEDIENTE", /\b(VISTA_CASOS|CASOS)\b/.test(upper));
  check("Q02_SOSPECHOSOS", /\b(SOSPECHOSOS|VISTA_SOSPECHOSOS)\b/.test(upper));
  check("Q03_DECLARACIONES", /\b(DECLARACIONES|VISTA_DECLARACIONES)\b/.test(upper));
  check("Q04_COARTADAS", /\bUBICACIONES\b/.test(upper));
  check(
    "Q05_HORA_CRIMEN",
    /\bUBICACIONES\b/.test(upper) && /\b(BETWEEN|>=|<=|FECHA_HORA)\b/.test(upper)
  );
  check("Q06_CAMARAS", /\bCAMARA_SEGURIDAD\b/.test(upper));
  check("Q07_ACCESOS", /\bACCESOS\b/.test(upper));
  check("Q08_LLAMADAS", /\bLLAMADAS\b/.test(upper));
  check("Q09_MENSAJES", /\bMENSAJES\b/.test(upper));
  check("Q10_TRANSACCIONES", /\bTRANSACCIONES\b/.test(upper));
  check("Q11_EVIDENCIAS", /\bEVIDENCIAS\b/.test(upper));
  check("Q12_HUELLAS", /\bHUELLAS\b/.test(upper));
  check("Q13_CONTRADICCION_1", /\bJOIN\b/.test(upper));
  check(
    "Q14_CONTRADICCION_2",
    /\bJOIN\b/.test(upper) && alreadyCompleted.has("Q13_CONTRADICCION_1")
  );
  check(
    "Q15_MOTIVO_OPORTUNIDAD",
    /\b(GROUP BY|HAVING|COUNT|SUM|AVG|MAX|MIN)\b/.test(upper) ||
      (upper.match(/\bJOIN\b/g) || []).length >= 2
  );

  return newlyCompleted;
}

export function isQueryAllowed(sql: string): boolean {
  const trimmed = sql.trim().toUpperCase();
  const blocked = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE|REPLACE|ATTACH|DETACH|PRAGMA\s+(?!table_info|foreign_key_list|index_list))\b/;
  if (blocked.test(trimmed)) return false;
  const allowed = /^(SELECT|SHOW|DESCRIBE|EXPLAIN|WITH|PRAGMA\s+(TABLE_INFO|FOREIGN_KEY_LIST|INDEX_LIST))/;
  return allowed.test(trimmed);
}
