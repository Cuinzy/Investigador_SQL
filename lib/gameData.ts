export interface Case {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_crimen: string;
  lugar_crimen: string;
  victima: string;
  dificultad: "baja" | "media" | "alta";
  id_culpable: number;
}

export interface Suspect {
  id: number;
  id_caso: number;
  nombre: string;
  edad: number;
  profesion: string;
  relacion_victima: string;
  motivo_aparente: string;
  nivel_nerviosismo: number;
}

export interface Declaration {
  id: number;
  id_sospechoso: number;
  id_caso: number;
  declaracion: string;
  tema: string;
  es_mentira: boolean;
  explicacion_admin: string;
}

// Culprits by case_id -> suspect_id (used server-side only for accusation check)
export const CULPRITS: Record<number, number> = {
  1: 3,   // Lucía Prado
  2: 7,   // Pablo Neri
  3: 9,   // Camila Herrera
  4: 14,  // Óscar Meza
  5: 18,  // Iván Torres
  6: 21,  // Esteban Lira
  7: 25,  // Valeria Cruz
};

export const CASES: Case[] = [
  {
    id: 1,
    titulo: "La llave del museo",
    descripcion: "El curador del Museo Central, Dr. Emilio Vargas, fue encontrado sin vida en la sala de restauración. Una reliquia precolombina de incalculable valor desapareció de la bóveda principal. El crimen ocurrió en horario nocturno, con acceso restringido. Solo personal autorizado podía acceder a la bóveda.",
    fecha_crimen: "2026-03-14 21:40:00",
    lugar_crimen: "Sala de restauración, Museo Central",
    victima: "Dr. Emilio Vargas",
    dificultad: "media",
    id_culpable: 3,
  },
  {
    id: 2,
    titulo: "El último café",
    descripcion: "Valeria Montes, periodista de investigación, murió envenenada en la Cafetería Aurora durante su rutina matutina. Horas antes de su muerte estaba a punto de publicar un reportaje explosivo que comprometía a figuras del mundo empresarial. El veneno fue administrado en su café.",
    fecha_crimen: "2026-04-02 07:15:00",
    lugar_crimen: "Cafetería Aurora, Centro",
    victima: "Valeria Montes",
    dificultad: "media",
    id_culpable: 7,
  },
  {
    id: 3,
    titulo: "Archivo en llamas",
    descripcion: "Andrés Patiño, archivista municipal, fue encontrado muerto en el Archivo Histórico de la ciudad tras un incendio provocado. El fuego destruyó expedientes de una licitación pública que estaba siendo investigada por irregularidades. El incendio se originó en una zona sin fallas eléctricas previas.",
    fecha_crimen: "2026-04-15 23:20:00",
    lugar_crimen: "Archivo Histórico Municipal",
    victima: "Andrés Patiño",
    dificultad: "alta",
    id_culpable: 9,
  },
  {
    id: 4,
    titulo: "El guante negro",
    descripcion: "Ernesto Galván, joyero reconocido, fue hallado muerto en su taller privado. La caja fuerte había sido abierta con el código correcto y varias joyas de alto valor fueron robadas. Una cámara de seguridad fue apagada manualmente antes del crimen.",
    fecha_crimen: "2026-04-28 18:50:00",
    lugar_crimen: "Taller privado de joyería Galván",
    victima: "Ernesto Galván",
    dificultad: "media",
    id_culpable: 14,
  },
  {
    id: 5,
    titulo: "Silencio en el teatro",
    descripcion: "Mauricio Cid, director teatral, murió al caer desde el escenario durante un ensayo nocturno en el Teatro Bellavista. El arnés de seguridad presentaba cortes deliberados. El accidente fue provocado en un momento en que la sala estaba casi vacía.",
    fecha_crimen: "2026-05-05 20:30:00",
    lugar_crimen: "Teatro Bellavista, escenario principal",
    victima: "Mauricio Cid",
    dificultad: "alta",
    id_culpable: 18,
  },
  {
    id: 6,
    titulo: "El reloj detenido",
    descripcion: "Héctor Molina, empresario tecnológico, fue encontrado muerto en su oficina privada durante una reunión que él mismo había convocado. El reloj de la oficina había sido alterado, y los registros de acceso presentan una anomalía horaria sospechosa. Millones de dólares desaparecieron de las cuentas corporativas esa misma noche.",
    fecha_crimen: "2026-05-12 22:05:00",
    lugar_crimen: "Oficina ejecutiva, Torre Molina Tech",
    victima: "Héctor Molina",
    dificultad: "alta",
    id_culpable: 21,
  },
  {
    id: 7,
    titulo: "La ruta 47",
    descripcion: "Daniel Cifuentes, conductor de transporte privado, fue encontrado muerto en la Ruta 47. El caso fue inicialmente catalogado como accidente de tránsito, pero evidencias posteriores revelan que fue un atropello encubierto. El GPS del vehículo y una cámara de peaje contradicen la versión oficial.",
    fecha_crimen: "2026-05-19 01:15:00",
    lugar_crimen: "Carretera secundaria, Ruta 47, kilómetro 23",
    victima: "Daniel Cifuentes",
    dificultad: "alta",
    id_culpable: 25,
  },
];

export const SUSPECTS: Suspect[] = [
  // Case 1
  { id: 1, id_caso: 1, nombre: "Clara Vidal", edad: 34, profesion: "Restauradora de arte", relacion_victima: "Colega, acusada por la víctima de falsificar piezas", motivo_aparente: "Vengarse por la acusación de falsificación", nivel_nerviosismo: 7 },
  { id: 2, id_caso: 1, nombre: "Bruno Leal", edad: 41, profesion: "Guardia nocturno", relacion_victima: "Empleado del museo bajo supervisión de la víctima", motivo_aparente: "Graves deudas con prestamistas", nivel_nerviosismo: 8 },
  { id: 3, id_caso: 1, nombre: "Lucía Prado", edad: 47, profesion: "Subdirectora del museo", relacion_victima: "Superior jerárquico de la víctima", motivo_aparente: "Contactos con compradores privados de arte ilegal", nivel_nerviosismo: 5 },
  { id: 4, id_caso: 1, nombre: "Tomás Erazo", edad: 52, profesion: "Historiador externo", relacion_victima: "Colaborador académico con disputa reciente", motivo_aparente: "Discusión intensa con la víctima sobre autoría de un hallazgo", nivel_nerviosismo: 4 },
  // Case 2
  { id: 5, id_caso: 2, nombre: "Mateo Ríos", edad: 26, profesion: "Barista", relacion_victima: "Servidor habitual de la víctima en la cafetería", motivo_aparente: "Fue investigado por la víctima por fraude laboral", nivel_nerviosismo: 9 },
  { id: 6, id_caso: 2, nombre: "Irene Casas", edad: 44, profesion: "Editora jefe", relacion_victima: "Jefa directa de la víctima", motivo_aparente: "Quería detener la publicación del reportaje", nivel_nerviosismo: 6 },
  { id: 7, id_caso: 2, nombre: "Pablo Neri", edad: 55, profesion: "Empresario", relacion_victima: "Figura central del reportaje de la víctima", motivo_aparente: "El reportaje lo habría arruinado política y económicamente", nivel_nerviosismo: 3 },
  { id: 8, id_caso: 2, nombre: "Sofía Landa", edad: 31, profesion: "Amiga y confidente", relacion_victima: "Amiga cercana con disputa reciente por una herencia", motivo_aparente: "Disputa personal por herencia familiar compartida", nivel_nerviosismo: 7 },
  // Case 3
  { id: 9, id_caso: 3, nombre: "Camila Herrera", edad: 39, profesion: "Funcionaria pública", relacion_victima: "Solicitaba acceso frecuente a expedientes bajo custodia de la víctima", motivo_aparente: "Los expedientes destruidos la comprometían en un escándalo de corrupción", nivel_nerviosismo: 4 },
  { id: 10, id_caso: 3, nombre: "Rodrigo Salas", edad: 33, profesion: "Técnico eléctrico", relacion_victima: "Realizó trabajos de mantenimiento eléctrico esa noche", motivo_aparente: "Tensión laboral con la víctima por un pago pendiente", nivel_nerviosismo: 7 },
  { id: 11, id_caso: 3, nombre: "Marina Beltrán", edad: 46, profesion: "Investigadora independiente", relacion_victima: "Necesitaba un expediente que la víctima se negaba a entregarle", motivo_aparente: "Un expediente oculto era clave para su investigación periodística", nivel_nerviosismo: 6 },
  { id: 12, id_caso: 3, nombre: "Julián Vera", edad: 28, profesion: "Vigilante nocturno", relacion_victima: "Responsable de la seguridad del archivo esa noche", motivo_aparente: "Abandonó su puesto y no reportó el incendio a tiempo", nivel_nerviosismo: 9 },
  // Case 4
  { id: 13, id_caso: 4, nombre: "Natalia Fierro", edad: 36, profesion: "Clienta frecuente", relacion_victima: "La víctima retenía una joya de su propiedad por disputa de pago", motivo_aparente: "Recuperar su joya sin pagar la deuda pendiente", nivel_nerviosismo: 8 },
  { id: 14, id_caso: 4, nombre: "Óscar Meza", edad: 24, profesion: "Ex-aprendiz despedido", relacion_victima: "Aprendiz recientemente despedido sin indemnización", motivo_aparente: "Venganza por el despido y conocimiento del código de la caja", nivel_nerviosismo: 6 },
  { id: 15, id_caso: 4, nombre: "Bruno Salvatierra", edad: 50, profesion: "Socio comercial", relacion_victima: "Socio con deudas pendientes con la víctima", motivo_aparente: "Graves problemas económicos y deudas con la víctima", nivel_nerviosismo: 8 },
  { id: 16, id_caso: 4, nombre: "Daniela Ponce", edad: 42, profesion: "Tasadora de seguros", relacion_victima: "Investigaba posible fraude de seguros de la víctima", motivo_aparente: "Silenciar una investigación comprometedora", nivel_nerviosismo: 5 },
  // Case 5
  { id: 17, id_caso: 5, nombre: "Nora Valencia", edad: 29, profesion: "Actriz principal", relacion_victima: "Próxima a ser reemplazada por decisión de la víctima", motivo_aparente: "Evitar ser reemplazada en el papel protagónico", nivel_nerviosismo: 9 },
  { id: 18, id_caso: 5, nombre: "Iván Torres", edad: 37, profesion: "Técnico de iluminación y estructuras", relacion_victima: "Empleado de confianza que conocía toda la maquinaria del teatro", motivo_aparente: "Conflicto laboral por recorte salarial y venta de información a competidores", nivel_nerviosismo: 5 },
  { id: 19, id_caso: 5, nombre: "Paula Ríos", edad: 45, profesion: "Productora teatral", relacion_victima: "Productora con seguro millonario sobre la obra", motivo_aparente: "Cobrar el seguro ante el fracaso comercial de la obra", nivel_nerviosismo: 6 },
  { id: 20, id_caso: 5, nombre: "Samuel Díaz", edad: 25, profesion: "Actor suplente", relacion_victima: "Aspiraba al papel protagónico que la víctima no le daba", motivo_aparente: "Obtener el papel principal eliminando al director", nivel_nerviosismo: 8 },
  // Case 6
  { id: 21, id_caso: 6, nombre: "Esteban Lira", edad: 44, profesion: "Director financiero", relacion_victima: "Mano derecha del empresario, acceso total a las cuentas", motivo_aparente: "Ocultar un desvío de fondos que la víctima había descubierto", nivel_nerviosismo: 4 },
  { id: 22, id_caso: 6, nombre: "Alicia Moreno", edad: 38, profesion: "Abogada corporativa", relacion_victima: "Abogada de confianza que modificó documentos legales", motivo_aparente: "Encubrir modificaciones fraudulentas de contratos", nivel_nerviosismo: 6 },
  { id: 23, id_caso: 6, nombre: "Raúl Paredes", edad: 30, profesion: "Programador senior despedido", relacion_victima: "Ex-empleado despedido con acceso a sistemas internos", motivo_aparente: "Venganza por despido injustificado", nivel_nerviosismo: 8 },
  { id: 24, id_caso: 6, nombre: "Verónica Sol", edad: 49, profesion: "Inversionista principal", relacion_victima: "Inversionista que perdería millones si la empresa cerraba", motivo_aparente: "Evitar la bancarrota que la víctima estaba considerando declarar", nivel_nerviosismo: 7 },
  // Case 7
  { id: 25, id_caso: 7, nombre: "Valeria Cruz", edad: 33, profesion: "Ejecutiva de ventas", relacion_victima: "Pasajera frecuente del servicio de la víctima", motivo_aparente: "Eliminarlo para silenciar un chantaje que la víctima ejercía sobre ella", nivel_nerviosismo: 6 },
  { id: 26, id_caso: 7, nombre: "Marcos Gil", edad: 48, profesion: "Dueño del vehículo de transporte", relacion_victima: "Empleador del conductor fallecido", motivo_aparente: "Cobrar el seguro del vehículo y eliminar a un empleado problemático", nivel_nerviosismo: 7 },
  { id: 27, id_caso: 7, nombre: "Elena Suárez", edad: 40, profesion: "Oficial de policía local", relacion_victima: "Oficial asignada al caso, conocía a la víctima personalmente", motivo_aparente: "Encubrir sus propias irregularidades que la víctima había documentado", nivel_nerviosismo: 5 },
  { id: 28, id_caso: 7, nombre: "Franco Nieto", edad: 35, profesion: "Mecánico de vehículos", relacion_victima: "Mecánico que realizó la última revisión del vehículo", motivo_aparente: "Ocultó modificaciones peligrosas realizadas al vehículo por encargo", nivel_nerviosismo: 8 },
];

export const DECLARATIONS: Declaration[] = [
  // Case 1 - Clara Vidal
  { id: 1, id_sospechoso: 1, id_caso: 1, declaracion: "Estuve trabajando en la sala principal toda la tarde y noche. Mis herramientas estaban allí.", tema: "coartada", es_mentira: false, explicacion_admin: "Clara efectivamente trabajaba en la sala principal esa noche." },
  { id: 2, id_sospechoso: 1, id_caso: 1, declaracion: "No entré a la sala de restauración después de las 6:00 p.m. No tenía nada que hacer allí.", tema: "acceso", es_mentira: false, explicacion_admin: "Cierto, sus huellas en la vitrina son de su trabajo diurno legítimo." },
  { id: 3, id_sospechoso: 1, id_caso: 1, declaracion: "Mis huellas pueden estar en algunas vitrinas porque las restauré la semana pasada. Es mi trabajo.", tema: "evidencia", es_mentira: false, explicacion_admin: "Correcto, las huellas de Clara son de restauración legítima previa." },
  // Case 1 - Bruno Leal
  { id: 4, id_sospechoso: 2, id_caso: 1, declaracion: "Patrullé todo el museo durante mi turno sin ninguna interrupción.", tema: "coartada", es_mentira: true, explicacion_admin: "Bruno estuvo ausente 40 minutos coordinando una apuesta ilegal por teléfono." },
  { id: 5, id_sospechoso: 2, id_caso: 1, declaracion: "No hablé con el Dr. Vargas en ningún momento esa noche.", tema: "comunicacion", es_mentira: false, explicacion_admin: "No hay registro de contacto entre Bruno y la víctima esa noche." },
  { id: 6, id_sospechoso: 2, id_caso: 1, declaracion: "Estaba en mi puesto de seguridad a las 9:40 p.m., como siempre.", tema: "coartada", es_mentira: true, explicacion_admin: "Las cámaras muestran que Bruno estaba en el exterior norte a esa hora." },
  // Case 1 - Lucía Prado [CULPABLE]
  { id: 7, id_sospechoso: 3, id_caso: 1, declaracion: "Salí del museo antes de las 8:00 p.m. Tenía una cena familiar.", tema: "coartada", es_mentira: true, explicacion_admin: "Su tarjeta de acceso registra entrada a la bóveda a las 21:32." },
  { id: 8, id_sospechoso: 3, id_caso: 1, declaracion: "No tengo acceso autorizado a la bóveda donde se guardaba la reliquia.", tema: "acceso", es_mentira: true, explicacion_admin: "Como subdirectora, Lucía tenía acceso completo a todas las áreas, incluyendo la bóveda." },
  { id: 9, id_sospechoso: 3, id_caso: 1, declaracion: "Nunca he hablado con compradores privados de arte. No tengo esos contactos.", tema: "contactos", es_mentira: true, explicacion_admin: "Hay registro de llamadas y mensajes con un comprador privado esa misma noche." },
  // Case 1 - Tomás Erazo
  { id: 10, id_sospechoso: 4, id_caso: 1, declaracion: "Terminé mi consulta en el archivo a las 7:00 p.m. y me retiré inmediatamente.", tema: "coartada", es_mentira: true, explicacion_admin: "Una cámara lo captó frente al museo a las 9:15 p.m., reuniéndose con una fuente." },
  { id: 11, id_sospechoso: 4, id_caso: 1, declaracion: "No estuve cerca del museo después de las 7:00 p.m.", tema: "ubicacion", es_mentira: true, explicacion_admin: "Tomás fue captado frente al museo a las 21:15 reuniéndose con un informante, no relacionado con el crimen." },
  { id: 12, id_sospechoso: 4, id_caso: 1, declaracion: "Mi discusión con el doctor fue puramente académica. Le cuestioné la datación de una pieza.", tema: "motivo", es_mentira: false, explicacion_admin: "La discusión fue real pero solo académica. Tomás no tuvo participación en el crimen." },
  // Case 2 - Mateo Ríos
  { id: 13, id_sospechoso: 5, id_caso: 2, declaracion: "Preparo los mismos cafés todos los días. Nunca alteraría la bebida de un cliente.", tema: "accion", es_mentira: true, explicacion_admin: "Mateo fue pagado por Pablo Neri para añadir el veneno al café de Valeria." },
  { id: 14, id_sospechoso: 5, id_caso: 2, declaracion: "No conozco personalmente a Valeria Montes más allá de ser mi clienta habitual.", tema: "relacion", es_mentira: false, explicacion_admin: "Mateo no conocía a Valeria más allá de la relación cliente-barista." },
  { id: 15, id_sospechoso: 5, id_caso: 2, declaracion: "No compré ningún químico ni sustancia extraña recientemente.", tema: "evidencia", es_mentira: true, explicacion_admin: "Mateo compró cianuro de potasio dos días antes del crimen." },
  // Case 2 - Irene Casas
  { id: 16, id_sospechoso: 6, id_caso: 2, declaracion: "Quería que Valeria revisara el reportaje, no detenerlo. Solo pedía más fuentes.", tema: "motivo", es_mentira: true, explicacion_admin: "Irene presionó activamente para cancelar la publicación porque comprometía a un anunciante clave." },
  { id: 17, id_sospechoso: 6, id_caso: 2, declaracion: "Estaba en la redacción esa mañana desde las 6:00 a.m.", tema: "coartada", es_mentira: false, explicacion_admin: "El registro de acceso de la redacción confirma su presencia desde las 6:05 a.m." },
  { id: 18, id_sospechoso: 6, id_caso: 2, declaracion: "No tuve contacto con Pablo Neri en los últimos tres meses.", tema: "contactos", es_mentira: true, explicacion_admin: "Irene se reunió con Pablo Neri una semana antes del crimen para coordinar la supresión del reportaje." },
  // Case 2 - Pablo Neri [CULPABLE]
  { id: 19, id_sospechoso: 7, id_caso: 2, declaracion: "No estuve en la Cafetería Aurora esa mañana ni ninguna mañana reciente.", tema: "coartada", es_mentira: true, explicacion_admin: "Una cámara exterior lo capta a media cuadra de la cafetería a las 7:05 a.m." },
  { id: 20, id_sospechoso: 7, id_caso: 2, declaracion: "No conozco personalmente a Valeria Montes. Solo sé que era periodista.", tema: "relacion", es_mentira: true, explicacion_admin: "Pablo y Valeria tuvieron una reunión dos días antes del crimen. Valeria tenía documentos firmados por Pablo." },
  { id: 21, id_sospechoso: 7, id_caso: 2, declaracion: "No tengo ninguna relación con Mateo Ríos ni con ningún empleado de esa cafetería.", tema: "contactos", es_mentira: true, explicacion_admin: "Pablo pagó a Mateo 3 días antes del crimen para que administrara el veneno." },
  // Case 2 - Sofía Landa
  { id: 22, id_sospechoso: 8, id_caso: 2, declaracion: "Valeria y yo habíamos arreglado nuestros problemas. Nuestra amistad estaba bien.", tema: "relacion", es_mentira: true, explicacion_admin: "La disputa por la herencia seguía activa. Sofía le reclamó dinero a Valeria dos días antes." },
  { id: 23, id_sospechoso: 8, id_caso: 2, declaracion: "Estaba en el gimnasio esa mañana de 6:30 a.m. a 8:00 a.m.", tema: "coartada", es_mentira: false, explicacion_admin: "El registro del gimnasio confirma su presencia." },
  { id: 24, id_sospechoso: 8, id_caso: 2, declaracion: "No sé nada del reportaje que Valeria estaba preparando.", tema: "informacion", es_mentira: true, explicacion_admin: "Sofía sabía del reportaje y había advertido a Valeria que lo detuviera por su bien." },
  // Case 3 - Camila Herrera [CULPABLE]
  { id: 25, id_sospechoso: 9, id_caso: 3, declaracion: "Estuve en mi casa toda la noche. No me acerqué al archivo.", tema: "coartada", es_mentira: true, explicacion_admin: "Su tarjeta de acceso registra entrada al archivo a las 22:45, después del cierre oficial." },
  { id: 26, id_sospechoso: 9, id_caso: 3, declaracion: "No tengo acceso al archivo histórico fuera del horario laboral.", tema: "acceso", es_mentira: true, explicacion_admin: "Como funcionaria de alto rango, Camila tenía credenciales de acceso 24 horas." },
  { id: 27, id_sospechoso: 9, id_caso: 3, declaracion: "Los expedientes que yo consultaba eran documentos públicos sin nada comprometedor.", tema: "documentos", es_mentira: true, explicacion_admin: "Los expedientes destruidos la vinculaban directamente con sobornos en una licitación pública." },
  // Case 3 - Rodrigo Salas
  { id: 28, id_sospechoso: 10, id_caso: 3, declaracion: "Terminé el mantenimiento eléctrico a las 9:00 p.m. y me fui. El sistema quedó en perfectas condiciones.", tema: "coartada", es_mentira: false, explicacion_admin: "Los registros eléctricos confirman que el sistema estaba en orden cuando Rodrigo se fue." },
  { id: 29, id_sospechoso: 10, id_caso: 3, declaracion: "No tuve ningún conflicto serio con el señor Patiño. El pago pendiente era un malentendido.", tema: "relacion", es_mentira: false, explicacion_admin: "El conflicto era real pero menor. No guarda relación con el crimen." },
  { id: 30, id_sospechoso: 10, id_caso: 3, declaracion: "No regresé al archivo después de terminar mi trabajo.", tema: "coartada", es_mentira: false, explicacion_admin: "No hay registro de retorno de Rodrigo al archivo." },
  // Case 3 - Marina Beltrán
  { id: 31, id_sospechoso: 11, id_caso: 3, declaracion: "Dejé de intentar obtener el expediente hace semanas. No valía la pena.", tema: "motivo", es_mentira: true, explicacion_admin: "Marina envió un correo amenazante a la víctima el día anterior exigiendo el expediente." },
  { id: 32, id_sospechoso: 11, id_caso: 3, declaracion: "Estaba en casa redactando un artículo cuando ocurrió el incendio.", tema: "coartada", es_mentira: false, explicacion_admin: "Su actividad en el sistema editorial confirma que estaba escribiendo a esa hora." },
  { id: 33, id_sospechoso: 11, id_caso: 3, declaracion: "Nunca haría daño a nadie por una investigación periodística.", tema: "accion", es_mentira: false, explicacion_admin: "Marina no tuvo participación en el crimen. Su amenaza era solo verbal." },
  // Case 3 - Julián Vera
  { id: 34, id_sospechoso: 12, id_caso: 3, declaracion: "Estuve en mi puesto de vigilancia toda la noche sin ausentarme.", tema: "coartada", es_mentira: true, explicacion_admin: "Julián se ausentó de su puesto durante 90 minutos. Lo hizo para reunirse con su novia." },
  { id: 35, id_sospechoso: 12, id_caso: 3, declaracion: "Detecté el humo y di la alarma inmediatamente.", tema: "accion", es_mentira: true, explicacion_admin: "El incendio llevaba más de 20 minutos activo cuando Julián dio la alarma." },
  { id: 36, id_sospechoso: 12, id_caso: 3, declaracion: "No conozco a ninguno de los otros sospechosos.", tema: "relacion", es_mentira: false, explicacion_admin: "Julián realmente no conocía a los otros sospechosos. Su abandono fue por razones personales." },
  // Case 4 - Natalia Fierro
  { id: 37, id_sospechoso: 13, id_caso: 4, declaracion: "Fui al taller solo a recuperar mi joya. Tuvimos una discusión pero me fui sin resolver nada.", tema: "coartada", es_mentira: false, explicacion_admin: "Natalia estuvo en el taller a las 5:00 p.m. pero se fue antes del crimen." },
  { id: 38, id_sospechoso: 13, id_caso: 4, declaracion: "No sé el código de la caja fuerte ni cómo abrirla.", tema: "conocimiento", es_mentira: false, explicacion_admin: "Natalia nunca tuvo acceso al código de la caja." },
  { id: 39, id_sospechoso: 13, id_caso: 4, declaracion: "No volví al taller después de las 5:30 p.m.", tema: "coartada", es_mentira: false, explicacion_admin: "Las cámaras confirman que Natalia se fue a las 5:20 y no regresó." },
  // Case 4 - Óscar Meza [CULPABLE]
  { id: 40, id_sospechoso: 14, id_caso: 4, declaracion: "Estuve en casa todo el día desde que me despidieron. No tengo nada que ver.", tema: "coartada", es_mentira: true, explicacion_admin: "Una cámara cercana lo ubica a dos cuadras del taller a las 6:30 p.m." },
  { id: 41, id_sospechoso: 14, id_caso: 4, declaracion: "No recuerdo el código de la caja fuerte. El señor Galván me lo mostró una vez pero nunca lo memoricé.", tema: "conocimiento", es_mentira: true, explicacion_admin: "Óscar memorizó el código. Lo anotó en su teléfono durante el período de aprendizaje." },
  { id: 42, id_sospechoso: 14, id_caso: 4, declaracion: "No guardo rencor hacia el señor Galván. Entiendo que los negocios son así.", tema: "motivo", es_mentira: true, explicacion_admin: "Óscar publicó mensajes en redes sociales amenazando con 'hacer que pagara' por el despido." },
  // Case 4 - Bruno Salvatierra
  { id: 43, id_sospechoso: 15, id_caso: 4, declaracion: "Llegué a una reunión con Ernesto a las 6:00 p.m. Discutimos sobre las deudas y me fui a las 6:30 p.m.", tema: "coartada", es_mentira: false, explicacion_admin: "Bruno efectivamente estuvo en el taller de 6:00 a 6:30 p.m. según registros de cámara." },
  { id: 44, id_sospechoso: 15, id_caso: 4, declaracion: "Sí, tengo deudas con la empresa, pero estábamos negociando un plan de pago.", tema: "relacion", es_mentira: false, explicacion_admin: "Las deudas eran reales y había negociaciones activas." },
  { id: 45, id_sospechoso: 15, id_caso: 4, declaracion: "Después de irme del taller fui directo al restaurante donde cené con mi familia.", tema: "coartada", es_mentira: false, explicacion_admin: "La familia confirma la cena y hay transacción de tarjeta en el restaurante." },
  // Case 4 - Daniela Ponce
  { id: 46, id_sospechoso: 16, id_caso: 4, declaracion: "Visité el taller la semana pasada por la investigación de seguros, pero no ayer.", tema: "coartada", es_mentira: false, explicacion_admin: "Daniela no estuvo en el taller el día del crimen." },
  { id: 47, id_sospechoso: 16, id_caso: 4, declaracion: "Mi investigación de seguros era rutinaria. No encontré nada irregular aún.", tema: "investigacion", es_mentira: false, explicacion_admin: "La investigación era en curso pero no motivó el crimen de Daniela." },
  { id: 48, id_sospechoso: 16, id_caso: 4, declaracion: "Estaba en la oficina de la aseguradora hasta las 8:00 p.m. ayer.", tema: "coartada", es_mentira: false, explicacion_admin: "El sistema de acceso de la aseguradora confirma su presencia." },
  // Case 5 - Nora Valencia
  { id: 49, id_sospechoso: 17, id_caso: 5, declaracion: "No sabía que iba a ser reemplazada. Mauricio nunca me lo dijo directamente.", tema: "motivo", es_mentira: true, explicacion_admin: "Mauricio le comunicó oficialmente su reemplazo tres días antes." },
  { id: 50, id_sospechoso: 17, id_caso: 5, declaracion: "Estaba en mi camerino durante el tiempo del accidente.", tema: "coartada", es_mentira: true, explicacion_admin: "Nora no estaba en su camerino; estaba con Iván Torres en el almacén. Ocultó el romance." },
  { id: 51, id_sospechoso: 17, id_caso: 5, declaracion: "No entré al almacén de utilería esa noche.", tema: "acceso", es_mentira: true, explicacion_admin: "Nora estuvo en el almacén con Iván, pero para un encuentro romántico, no para manipular el arnés." },
  // Case 5 - Iván Torres [CULPABLE]
  { id: 52, id_sospechoso: 18, id_caso: 5, declaracion: "Revisé el arnés en la mañana y estaba en perfectas condiciones. No lo toqué de nuevo.", tema: "evidencia", es_mentira: true, explicacion_admin: "Iván accedió al almacén donde se guardaba el arnés a las 7:30 p.m. Dos horas antes del accidente." },
  { id: 53, id_sospechoso: 18, id_caso: 5, declaracion: "Estuve en la cabina de luces toda la noche durante el ensayo.", tema: "coartada", es_mentira: true, explicacion_admin: "Iván salió de la cabina de luces durante 35 minutos antes del accidente." },
  { id: 54, id_sospechoso: 18, id_caso: 5, declaracion: "No tengo ningún contacto fuera del teatro relacionado con información interna.", tema: "contactos", es_mentira: true, explicacion_admin: "Iván vendió información sobre los montajes del teatro a un teatro competidor." },
  // Case 5 - Paula Ríos
  { id: 55, id_sospechoso: 19, id_caso: 5, declaracion: "El seguro es estándar, no me beneficio especialmente de la muerte de Mauricio.", tema: "motivo", es_mentira: true, explicacion_admin: "Paula había inflado el valor del seguro antes del estreno. Se beneficiaba directamente." },
  { id: 56, id_sospechoso: 19, id_caso: 5, declaracion: "Estaba en la sala de reuniones con los patrocinadores a las 8:30 p.m.", tema: "coartada", es_mentira: false, explicacion_admin: "Tres patrocinadores confirman su presencia en la reunión hasta las 9:00 p.m." },
  { id: 57, id_sospechoso: 19, id_caso: 5, declaracion: "Nunca manipularía los equipos de seguridad. Eso está muy por encima de mis conocimientos técnicos.", tema: "capacidad", es_mentira: false, explicacion_admin: "Paula no tiene conocimientos técnicos para manipular el arnés." },
  // Case 5 - Samuel Díaz
  { id: 58, id_sospechoso: 20, id_caso: 5, declaracion: "Sé que no tengo el papel principal, pero Mauricio prometió considerarme para el siguiente proyecto.", tema: "motivo", es_mentira: true, explicacion_admin: "Mauricio le había dicho a Samuel que nunca sería protagonista en su compañía." },
  { id: 59, id_sospechoso: 20, id_caso: 5, declaracion: "Estaba en el área de actores durante el accidente, calentando para el ensayo.", tema: "coartada", es_mentira: false, explicacion_admin: "Otros actores confirman la presencia de Samuel en el área de calentamiento." },
  { id: 60, id_sospechoso: 20, id_caso: 5, declaracion: "No entré al almacén de utilería esta semana.", tema: "acceso", es_mentira: false, explicacion_admin: "El registro de acceso al almacén no muestra entradas de Samuel." },
  // Case 6 - Esteban Lira [CULPABLE]
  { id: 61, id_sospechoso: 21, id_caso: 6, declaracion: "Estuve en la reunión con Héctor hasta las 9:00 p.m. y luego me fui a mi oficina.", tema: "coartada", es_mentira: true, explicacion_admin: "El log del servidor muestra actividad desde la computadora de Esteban en la oficina privada a las 10:02 p.m." },
  { id: 62, id_sospechoso: 21, id_caso: 6, declaracion: "Los registros financieros están en orden. Cualquier irregularidad es un error contable.", tema: "finanzas", es_mentira: true, explicacion_admin: "Esteban desvió 2.3 millones a cuentas offshore durante seis meses." },
  { id: 63, id_sospechoso: 21, id_caso: 6, declaracion: "No tenía acceso físico a la oficina privada de Héctor.", tema: "acceso", es_mentira: true, explicacion_admin: "Como director financiero, Esteban tenía llave y código de acceso a todas las oficinas ejecutivas." },
  // Case 6 - Alicia Moreno
  { id: 64, id_sospechoso: 22, id_caso: 6, declaracion: "Los cambios en los contratos fueron debidamente autorizados por Héctor antes de su muerte.", tema: "documentos", es_mentira: true, explicacion_admin: "Los cambios fueron realizados postfirma. Las marcas de tiempo digitales lo demuestran." },
  { id: 65, id_sospechoso: 22, id_caso: 6, declaracion: "Estaba en casa trabajando de forma remota esa noche.", tema: "coartada", es_mentira: false, explicacion_admin: "El log de VPN confirma conexión desde su casa entre las 9:00 p.m. y 11:30 p.m." },
  { id: 66, id_sospechoso: 22, id_caso: 6, declaracion: "No tengo comunicación con Esteban Lira fuera de lo estrictamente profesional.", tema: "contactos", es_mentira: true, explicacion_admin: "Alicia y Esteban se comunicaban frecuentemente por un canal de mensajería cifrada." },
  // Case 6 - Raúl Paredes
  { id: 67, id_sospechoso: 23, id_caso: 6, declaracion: "No tengo acceso a los sistemas de la empresa desde que me despidieron.", tema: "acceso", es_mentira: true, explicacion_admin: "Raúl mantuvo una cuenta de servicio activa que el área de IT no desactivó." },
  { id: 68, id_sospechoso: 23, id_caso: 6, declaracion: "Estaba en un bar con amigos desde las 8:00 p.m. hasta la medianoche.", tema: "coartada", es_mentira: false, explicacion_admin: "Tres amigos y el bartender confirman su presencia en el bar." },
  { id: 69, id_sospechoso: 23, id_caso: 6, declaracion: "No fui a las oficinas de la empresa esa noche.", tema: "coartada", es_mentira: false, explicacion_admin: "No hay registro de acceso físico de Raúl en el edificio." },
  // Case 6 - Verónica Sol
  { id: 70, id_sospechoso: 24, id_caso: 6, declaracion: "Me enteré de las irregularidades financieras esa noche, igual que todos.", tema: "informacion", es_mentira: true, explicacion_admin: "Verónica conocía las irregularidades desde hace dos meses pero prefirió no actuar para proteger su inversión." },
  { id: 71, id_sospechoso: 24, id_caso: 6, declaracion: "Estaba en el hotel donde me hospedo. No asistí a esa reunión.", tema: "coartada", es_mentira: false, explicacion_admin: "El registro del hotel confirma que Verónica usó la llave magnética a las 8:45 p.m." },
  { id: 72, id_sospechoso: 24, id_caso: 6, declaracion: "Mis intereses económicos estaban mejor protegidos con Héctor vivo.", tema: "motivo", es_mentira: false, explicacion_admin: "En efecto, Verónica no tenía incentivo económico para matar a Héctor." },
  // Case 7 - Valeria Cruz [CULPABLE]
  { id: 73, id_sospechoso: 25, id_caso: 7, declaracion: "Solo era una clienta. No tengo ningún problema personal con Daniel.", tema: "relacion", es_mentira: true, explicacion_admin: "Daniel tenía fotos comprometedoras de Valeria y la chantajeaba mensualmente." },
  { id: 74, id_sospechoso: 25, id_caso: 7, declaracion: "No estuve en ese sector de la Ruta 47 esa noche.", tema: "coartada", es_mentira: true, explicacion_admin: "El GPS del vehículo registra paso por la residencia de Valeria esa noche." },
  { id: 75, id_sospechoso: 25, id_caso: 7, declaracion: "No conozco a Elena Suárez ni a ningún oficial de policía de esa zona.", tema: "contactos", es_mentira: true, explicacion_admin: "Hay una transferencia de Valeria a una cuenta vinculada a Elena horas después del crimen." },
  // Case 7 - Marcos Gil
  { id: 76, id_sospechoso: 26, id_caso: 7, declaracion: "Daniel era mi mejor conductor. No tenía ningún motivo para hacerle daño.", tema: "motivo", es_mentira: false, explicacion_admin: "Marcos tenía seguro sobre el vehículo pero Daniel era su empleado más confiable. Sin motivo claro." },
  { id: 77, id_sospechoso: 26, id_caso: 7, declaracion: "Estaba dormido en casa desde las 10:00 p.m.", tema: "coartada", es_mentira: false, explicacion_admin: "Llamadas entrantes a su teléfono fijo desde las 10:30 p.m. confirman que estaba en casa." },
  { id: 78, id_sospechoso: 26, id_caso: 7, declaracion: "El vehículo estaba en perfectas condiciones. Franco hizo una revisión completa hace una semana.", tema: "vehiculo", es_mentira: false, explicacion_admin: "La revisión fue real. El vehículo no tenía fallas mecánicas que causaran el accidente." },
  // Case 7 - Elena Suárez
  { id: 79, id_sospechoso: 27, id_caso: 7, declaracion: "Catalogué el caso como accidente porque la evidencia inicial así lo indicaba.", tema: "investigacion", es_mentira: true, explicacion_admin: "Elena descartó deliberadamente evidencias que contradecían la versión de accidente." },
  { id: 80, id_sospechoso: 27, id_caso: 7, declaracion: "No conozco personalmente a ninguno de los implicados en este caso.", tema: "relacion", es_mentira: true, explicacion_admin: "Elena conocía a Valeria Cruz. Hay registros de llamadas entre ellas previos al crimen." },
  { id: 81, id_sospechoso: 27, id_caso: 7, declaracion: "No recibí ningún pago ni beneficio relacionado con este caso.", tema: "soborno", es_mentira: true, explicacion_admin: "Elena recibió una transferencia de cuenta anónima (vinculada a Valeria) horas después del crimen." },
  // Case 7 - Franco Nieto
  { id: 82, id_sospechoso: 28, id_caso: 7, declaracion: "La revisión del vehículo fue completa y no encontré ninguna anomalía.", tema: "vehiculo", es_mentira: true, explicacion_admin: "Franco detectó un fallo en el sistema de frenos pero no lo reportó porque alguien lo presionó." },
  { id: 83, id_sospechoso: 28, id_caso: 7, declaracion: "Nadie me pidió que alterara el vehículo ni que ignorara algún problema.", tema: "soborno", es_mentira: true, explicacion_admin: "Franco recibió un pago para no reportar el fallo de frenos, pero no fue quien provocó el crimen directamente." },
  { id: 84, id_sospechoso: 28, id_caso: 7, declaracion: "No conozco a Valeria Cruz ni a ninguna otra persona involucrada en el transporte.", tema: "relacion", es_mentira: false, explicacion_admin: "Franco no conocía a Valeria. Fue presionado por un intermediario." },
];
