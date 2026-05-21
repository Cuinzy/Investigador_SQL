import { CASES, SUSPECTS, DECLARATIONS } from "./gameData";

export function getCreateSQL(): string {
  return `
CREATE TABLE IF NOT EXISTS casos (
  id_caso INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_crimen TEXT NOT NULL,
  lugar_crimen TEXT NOT NULL,
  victima TEXT NOT NULL,
  dificultad TEXT DEFAULT 'media'
);

CREATE TABLE IF NOT EXISTS sospechosos (
  id_sospechoso INTEGER PRIMARY KEY,
  id_caso INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  edad INTEGER,
  profesion TEXT,
  relacion_victima TEXT,
  motivo_aparente TEXT,
  nivel_nerviosismo INTEGER DEFAULT 0,
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso)
);

CREATE TABLE IF NOT EXISTS declaraciones (
  id_declaracion INTEGER PRIMARY KEY,
  id_sospechoso INTEGER NOT NULL,
  id_caso INTEGER NOT NULL,
  declaracion TEXT NOT NULL,
  tema TEXT,
  FOREIGN KEY (id_sospechoso) REFERENCES sospechosos(id_sospechoso),
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso)
);

CREATE TABLE IF NOT EXISTS ubicaciones (
  id_ubicacion INTEGER PRIMARY KEY,
  id_caso INTEGER NOT NULL,
  persona TEXT NOT NULL,
  lugar TEXT NOT NULL,
  fecha_hora TEXT NOT NULL,
  fuente TEXT,
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso)
);

CREATE TABLE IF NOT EXISTS llamadas (
  id_llamada INTEGER PRIMARY KEY,
  id_caso INTEGER NOT NULL,
  persona_origen TEXT NOT NULL,
  persona_destino TEXT NOT NULL,
  fecha_hora TEXT NOT NULL,
  duracion_segundos INTEGER,
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso)
);

CREATE TABLE IF NOT EXISTS mensajes (
  id_mensaje INTEGER PRIMARY KEY,
  id_caso INTEGER NOT NULL,
  remitente TEXT NOT NULL,
  destinatario TEXT NOT NULL,
  fecha_hora TEXT NOT NULL,
  contenido TEXT,
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso)
);

CREATE TABLE IF NOT EXISTS camara_seguridad (
  id_registro INTEGER PRIMARY KEY,
  id_caso INTEGER NOT NULL,
  camara TEXT NOT NULL,
  lugar TEXT NOT NULL,
  persona_detectada TEXT,
  fecha_hora TEXT NOT NULL,
  descripcion TEXT,
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso)
);

CREATE TABLE IF NOT EXISTS accesos (
  id_acceso INTEGER PRIMARY KEY,
  id_caso INTEGER NOT NULL,
  persona TEXT NOT NULL,
  lugar TEXT NOT NULL,
  fecha_hora TEXT NOT NULL,
  metodo_acceso TEXT,
  resultado TEXT DEFAULT 'permitido',
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso)
);

CREATE TABLE IF NOT EXISTS transacciones (
  id_transaccion INTEGER PRIMARY KEY,
  id_caso INTEGER NOT NULL,
  persona TEXT NOT NULL,
  tipo TEXT,
  monto REAL,
  fecha_hora TEXT NOT NULL,
  descripcion TEXT,
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso)
);

CREATE TABLE IF NOT EXISTS evidencias (
  id_evidencia INTEGER PRIMARY KEY,
  id_caso INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  lugar_encontrado TEXT,
  fecha_hora_registro TEXT,
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso)
);

CREATE TABLE IF NOT EXISTS huellas (
  id_huella INTEGER PRIMARY KEY,
  id_caso INTEGER NOT NULL,
  id_evidencia INTEGER NOT NULL,
  persona TEXT NOT NULL,
  tipo_coincidencia TEXT NOT NULL,
  nivel_confianza REAL,
  FOREIGN KEY (id_caso) REFERENCES casos(id_caso),
  FOREIGN KEY (id_evidencia) REFERENCES evidencias(id_evidencia)
);

CREATE VIEW IF NOT EXISTS vista_sospechosos AS
SELECT id_sospechoso, id_caso, nombre, edad, profesion, relacion_victima, motivo_aparente, nivel_nerviosismo
FROM sospechosos;

CREATE VIEW IF NOT EXISTS vista_declaraciones AS
SELECT d.id_declaracion, d.id_caso, s.nombre AS sospechoso, d.declaracion, d.tema
FROM declaraciones d
JOIN sospechosos s ON d.id_sospechoso = s.id_sospechoso;

CREATE VIEW IF NOT EXISTS vista_casos AS
SELECT id_caso, titulo, descripcion, fecha_crimen, lugar_crimen, victima, dificultad
FROM casos;
`;
}

export function getSeedSQL(): string {
  const escape = (s: string) => s.replace(/'/g, "''");
  const lines: string[] = [];

  for (const c of CASES) {
    lines.push(
      `INSERT OR IGNORE INTO casos VALUES (${c.id},'${escape(c.titulo)}','${escape(c.descripcion)}','${c.fecha_crimen}','${escape(c.lugar_crimen)}','${escape(c.victima)}','${c.dificultad}');`
    );
  }

  for (const s of SUSPECTS) {
    lines.push(
      `INSERT OR IGNORE INTO sospechosos VALUES (${s.id},${s.id_caso},'${escape(s.nombre)}',${s.edad},'${escape(s.profesion)}','${escape(s.relacion_victima)}','${escape(s.motivo_aparente)}',${s.nivel_nerviosismo});`
    );
  }

  for (const d of DECLARATIONS) {
    lines.push(
      `INSERT OR IGNORE INTO declaraciones VALUES (${d.id},${d.id_sospechoso},${d.id_caso},'${escape(d.declaracion)}','${d.tema}');`
    );
  }

  return lines.join("\n");
}

const ubicaciones = `
INSERT OR IGNORE INTO ubicaciones VALUES (1,1,'Clara Vidal','Sala principal del museo','2026-03-14 20:00:00','Testimonio propio');
INSERT OR IGNORE INTO ubicaciones VALUES (2,1,'Clara Vidal','Sala principal del museo','2026-03-14 21:30:00','Registro de cámara 2');
INSERT OR IGNORE INTO ubicaciones VALUES (3,1,'Bruno Leal','Puesto de seguridad','2026-03-14 21:00:00','Registro del sistema');
INSERT OR IGNORE INTO ubicaciones VALUES (4,1,'Bruno Leal','Exterior norte del museo','2026-03-14 21:22:00','Cámara exterior norte');
INSERT OR IGNORE INTO ubicaciones VALUES (5,1,'Lucía Prado','Oficina de subdirección','2026-03-14 19:30:00','Tarjeta de acceso');
INSERT OR IGNORE INTO ubicaciones VALUES (6,1,'Lucía Prado','Bóveda principal','2026-03-14 21:32:00','Registro tarjeta de acceso');
INSERT OR IGNORE INTO ubicaciones VALUES (7,1,'Tomás Erazo','Sala de archivos','2026-03-14 19:00:00','Registro de visita');
INSERT OR IGNORE INTO ubicaciones VALUES (8,1,'Tomás Erazo','Calle frente al museo','2026-03-14 21:15:00','Testimonio de testigo anónimo');
INSERT OR IGNORE INTO ubicaciones VALUES (9,1,'Dr. Emilio Vargas','Bóveda principal','2026-03-14 21:15:00','Tarjeta de acceso');
INSERT OR IGNORE INTO ubicaciones VALUES (10,1,'Dr. Emilio Vargas','Sala de restauración','2026-03-14 21:35:00','Cámara de pasillo');

INSERT OR IGNORE INTO ubicaciones VALUES (11,2,'Mateo Ríos','Cafetería Aurora','2026-04-02 06:00:00','Registro de entrada laboral');
INSERT OR IGNORE INTO ubicaciones VALUES (12,2,'Mateo Ríos','Mostrador de café','2026-04-02 07:10:00','Cámara interior');
INSERT OR IGNORE INTO ubicaciones VALUES (13,2,'Irene Casas','Redacción del periódico','2026-04-02 06:05:00','Registro de acceso redacción');
INSERT OR IGNORE INTO ubicaciones VALUES (14,2,'Pablo Neri','Media cuadra de Cafetería Aurora','2026-04-02 07:05:00','Cámara exterior comercio vecino');
INSERT OR IGNORE INTO ubicaciones VALUES (15,2,'Sofía Landa','Gimnasio Central','2026-04-02 06:30:00','Registro de entrada gimnasio');
INSERT OR IGNORE INTO ubicaciones VALUES (16,2,'Valeria Montes','Cafetería Aurora','2026-04-02 07:00:00','Registro cámara entrada');
INSERT OR IGNORE INTO ubicaciones VALUES (17,2,'Pablo Neri','Hotel Plaza (su alojamiento)','2026-03-31 09:00:00','Check-in hotel');
INSERT OR IGNORE INTO ubicaciones VALUES (18,2,'Valeria Montes','Oficina Pablo Neri','2026-03-31 10:00:00','Testimonio recepcionista');

INSERT OR IGNORE INTO ubicaciones VALUES (19,3,'Camila Herrera','Archivo Histórico Municipal','2026-04-15 22:45:00','Registro tarjeta de acceso');
INSERT OR IGNORE INTO ubicaciones VALUES (20,3,'Rodrigo Salas','Sala de servidores del archivo','2026-04-15 20:00:00','Registro laboral');
INSERT OR IGNORE INTO ubicaciones VALUES (21,3,'Rodrigo Salas','Exterior del archivo','2026-04-15 21:00:00','Cámara exterior');
INSERT OR IGNORE INTO ubicaciones VALUES (22,3,'Marina Beltrán','Domicilio propio','2026-04-15 22:00:00','Actividad en sistema editorial remoto');
INSERT OR IGNORE INTO ubicaciones VALUES (23,3,'Julián Vera','Puesto de vigilancia','2026-04-15 22:00:00','Registro de turno');
INSERT OR IGNORE INTO ubicaciones VALUES (24,3,'Julián Vera','Cafetería cercana','2026-04-15 23:00:00','Testimonio de empleado de cafetería');
INSERT OR IGNORE INTO ubicaciones VALUES (25,3,'Andrés Patiño','Sala de expedientes históricos','2026-04-15 23:10:00','Última actividad registrada en terminal');
INSERT OR IGNORE INTO ubicaciones VALUES (26,3,'Camila Herrera','Zona de expedientes de licitaciones','2026-04-15 23:05:00','Inferido por origen del incendio y acceso registrado');

INSERT OR IGNORE INTO ubicaciones VALUES (27,4,'Natalia Fierro','Taller Galván','2026-04-28 17:00:00','Cámara interior del taller');
INSERT OR IGNORE INTO ubicaciones VALUES (28,4,'Natalia Fierro','Estacionamiento cercano','2026-04-28 17:20:00','Cámara de estacionamiento');
INSERT OR IGNORE INTO ubicaciones VALUES (29,4,'Óscar Meza','Dos cuadras del taller Galván','2026-04-28 18:30:00','Cámara de comercio vecino');
INSERT OR IGNORE INTO ubicaciones VALUES (30,4,'Bruno Salvatierra','Taller Galván','2026-04-28 18:00:00','Cámara interior');
INSERT OR IGNORE INTO ubicaciones VALUES (31,4,'Bruno Salvatierra','Restaurante El Olivo','2026-04-28 18:45:00','Registro de transacción con tarjeta');
INSERT OR IGNORE INTO ubicaciones VALUES (32,4,'Daniela Ponce','Oficina aseguradora','2026-04-28 18:00:00','Registro de acceso oficina');
INSERT OR IGNORE INTO ubicaciones VALUES (33,4,'Ernesto Galván','Taller privado','2026-04-28 18:00:00','Registro acceso propio');

INSERT OR IGNORE INTO ubicaciones VALUES (34,5,'Nora Valencia','Almacén de utilería del teatro','2026-05-05 19:45:00','Registro de acceso almacén');
INSERT OR IGNORE INTO ubicaciones VALUES (35,5,'Iván Torres','Almacén de utilería del teatro','2026-05-05 19:30:00','Registro de acceso almacén');
INSERT OR IGNORE INTO ubicaciones VALUES (36,5,'Iván Torres','Cabina de luces','2026-05-05 20:15:00','Registro de sistema de luces');
INSERT OR IGNORE INTO ubicaciones VALUES (37,5,'Paula Ríos','Sala de reuniones del teatro','2026-05-05 20:00:00','Testimonio de patrocinadores');
INSERT OR IGNORE INTO ubicaciones VALUES (38,5,'Samuel Díaz','Área de calentamiento de actores','2026-05-05 20:00:00','Testimonio de otros actores');
INSERT OR IGNORE INTO ubicaciones VALUES (39,5,'Mauricio Cid','Escenario principal','2026-05-05 20:25:00','Registro de cámara de producción');

INSERT OR IGNORE INTO ubicaciones VALUES (40,6,'Esteban Lira','Oficina ejecutiva de Héctor Molina','2026-05-12 21:55:00','Log de acceso de puerta con tarjeta');
INSERT OR IGNORE INTO ubicaciones VALUES (41,6,'Alicia Moreno','Domicilio propio','2026-05-12 21:00:00','Log de VPN corporativa');
INSERT OR IGNORE INTO ubicaciones VALUES (42,6,'Raúl Paredes','Bar El Rincón','2026-05-12 20:00:00','Registro de consumo con tarjeta');
INSERT OR IGNORE INTO ubicaciones VALUES (43,6,'Verónica Sol','Hotel Meridian','2026-05-12 20:45:00','Registro de llave magnética de habitación');
INSERT OR IGNORE INTO ubicaciones VALUES (44,6,'Héctor Molina','Oficina ejecutiva propia','2026-05-12 21:45:00','Registro de acceso con tarjeta personal');
INSERT OR IGNORE INTO ubicaciones VALUES (45,6,'Esteban Lira','Sala de servidores del piso 12','2026-05-12 22:10:00','Log de acceso a sala de servidores');

INSERT OR IGNORE INTO ubicaciones VALUES (46,7,'Valeria Cruz','Ruta 47, kilómetro 23','2026-05-19 01:10:00','Registro GPS del vehículo');
INSERT OR IGNORE INTO ubicaciones VALUES (47,7,'Marcos Gil','Domicilio propio','2026-05-18 22:00:00','Llamadas a teléfono fijo');
INSERT OR IGNORE INTO ubicaciones VALUES (48,7,'Elena Suárez','Comisaría local','2026-05-18 22:00:00','Registro de turno nocturno');
INSERT OR IGNORE INTO ubicaciones VALUES (49,7,'Elena Suárez','Ruta 47, kilómetro 23','2026-05-19 01:45:00','Registro de despacho policial');
INSERT OR IGNORE INTO ubicaciones VALUES (50,7,'Franco Nieto','Domicilio propio','2026-05-18 20:00:00','Testimonio de vecino');
INSERT OR IGNORE INTO ubicaciones VALUES (51,7,'Daniel Cifuentes','Ruta 47, kilómetro 23','2026-05-19 01:15:00','GPS del vehículo - última posición registrada');
`;

const llamadas = `
INSERT OR IGNORE INTO llamadas VALUES (1,1,'Bruno Leal','Rafael Torres','2026-03-14 21:22:00',840);
INSERT OR IGNORE INTO llamadas VALUES (2,1,'Lucía Prado','Comprador Privado','2026-03-14 22:15:00',320);
INSERT OR IGNORE INTO llamadas VALUES (3,1,'Dr. Emilio Vargas','Lucía Prado','2026-03-14 21:05:00',180);
INSERT OR IGNORE INTO llamadas VALUES (4,1,'Tomás Erazo','Fuente confidencial','2026-03-14 21:30:00',240);
INSERT OR IGNORE INTO llamadas VALUES (5,1,'Clara Vidal','Juan Vidal (hermano)','2026-03-14 22:00:00',120);

INSERT OR IGNORE INTO llamadas VALUES (6,2,'Pablo Neri','Mateo Ríos','2026-03-30 18:00:00',410);
INSERT OR IGNORE INTO llamadas VALUES (7,2,'Pablo Neri','Irene Casas','2026-03-26 11:00:00',890);
INSERT OR IGNORE INTO llamadas VALUES (8,2,'Sofía Landa','Valeria Montes','2026-03-31 20:00:00',300);
INSERT OR IGNORE INTO llamadas VALUES (9,2,'Mateo Ríos','Número desconocido','2026-04-01 22:00:00',60);
INSERT OR IGNORE INTO llamadas VALUES (10,2,'Irene Casas','Pablo Neri','2026-03-25 15:00:00',720);

INSERT OR IGNORE INTO llamadas VALUES (11,3,'Camila Herrera','Número privado','2026-04-15 19:00:00',360);
INSERT OR IGNORE INTO llamadas VALUES (12,3,'Camila Herrera','Rodrigo Salas','2026-04-14 10:00:00',90);
INSERT OR IGNORE INTO llamadas VALUES (13,3,'Marina Beltrán','Andrés Patiño','2026-04-14 17:00:00',250);
INSERT OR IGNORE INTO llamadas VALUES (14,3,'Julián Vera','Novia (Paola Rojas)','2026-04-15 22:50:00',1800);
INSERT OR IGNORE INTO llamadas VALUES (15,3,'Camila Herrera','Número privado','2026-04-16 01:00:00',120);

INSERT OR IGNORE INTO llamadas VALUES (16,4,'Óscar Meza','Comprador anónimo','2026-04-27 20:00:00',480);
INSERT OR IGNORE INTO llamadas VALUES (17,4,'Natalia Fierro','Ernesto Galván','2026-04-28 14:00:00',200);
INSERT OR IGNORE INTO llamadas VALUES (18,4,'Bruno Salvatierra','Ernesto Galván','2026-04-28 15:00:00',300);
INSERT OR IGNORE INTO llamadas VALUES (19,4,'Óscar Meza','Número desconocido','2026-04-28 20:15:00',60);

INSERT OR IGNORE INTO llamadas VALUES (20,5,'Iván Torres','Teatro Competidor Escena Viva','2026-05-03 11:00:00',1200);
INSERT OR IGNORE INTO llamadas VALUES (21,5,'Iván Torres','Teatro Competidor Escena Viva','2026-05-05 19:00:00',180);
INSERT OR IGNORE INTO llamadas VALUES (22,5,'Nora Valencia','Iván Torres','2026-05-05 19:20:00',120);
INSERT OR IGNORE INTO llamadas VALUES (23,5,'Paula Ríos','Compañía de Seguros','2026-05-04 10:00:00',600);
INSERT OR IGNORE INTO llamadas VALUES (24,5,'Samuel Díaz','Agente de casting','2026-05-05 18:00:00',300);

INSERT OR IGNORE INTO llamadas VALUES (25,6,'Esteban Lira','Banco offshore (Islas Caimán)','2026-05-12 21:30:00',840);
INSERT OR IGNORE INTO llamadas VALUES (26,6,'Alicia Moreno','Esteban Lira','2026-05-12 21:00:00',420);
INSERT OR IGNORE INTO llamadas VALUES (27,6,'Raúl Paredes','Ex-colega TI','2026-05-12 20:30:00',360);
INSERT OR IGNORE INTO llamadas VALUES (28,6,'Verónica Sol','Su abogado','2026-05-12 20:00:00',500);

INSERT OR IGNORE INTO llamadas VALUES (29,7,'Valeria Cruz','Elena Suárez','2026-05-19 00:45:00',600);
INSERT OR IGNORE INTO llamadas VALUES (30,7,'Daniel Cifuentes','Valeria Cruz','2026-05-18 23:30:00',180);
INSERT OR IGNORE INTO llamadas VALUES (31,7,'Franco Nieto','Intermediario desconocido','2026-05-17 14:00:00',300);
INSERT OR IGNORE INTO llamadas VALUES (32,7,'Marcos Gil','Compañía de seguros','2026-05-19 09:00:00',720);
INSERT OR IGNORE INTO llamadas VALUES (33,7,'Valeria Cruz','Elena Suárez','2026-05-19 02:00:00',420);
`;

const mensajes = `
INSERT OR IGNORE INTO mensajes VALUES (1,1,'Lucía Prado','Comprador Privado','2026-03-14 20:45:00','La entrega será esta noche. Tengo acceso. Precio acordado.');
INSERT OR IGNORE INTO mensajes VALUES (2,1,'Bruno Leal','Rafael Torres','2026-03-14 18:00:00','Necesito el dinero para mañana. Te llamo esta noche para arreglarlo.');
INSERT OR IGNORE INTO mensajes VALUES (3,1,'Tomás Erazo','Fuente confidencial','2026-03-14 20:30:00','Nos vemos frente al museo a las 9. Tengo los documentos.');
INSERT OR IGNORE INTO mensajes VALUES (4,1,'Comprador Privado','Lucía Prado','2026-03-14 21:00:00','Confirmado. El pago se hará después de verificar la pieza. Sé discreta.');

INSERT OR IGNORE INTO mensajes VALUES (5,2,'Pablo Neri','Mateo Ríos','2026-03-30 09:00:00','Haz lo que hablamos mañana en la mañana. La taza del fondo izquierdo. El resto ya lo sabes.');
INSERT OR IGNORE INTO mensajes VALUES (6,2,'Valeria Montes','Irene Casas','2026-04-01 16:00:00','El reportaje sale mañana. No lo puedo detener. Es demasiado importante.');
INSERT OR IGNORE INTO mensajes VALUES (7,2,'Irene Casas','Valeria Montes','2026-04-01 16:30:00','Estás cometiendo un error. Espera al menos una semana. Por favor.');
INSERT OR IGNORE INTO mensajes VALUES (8,2,'Sofía Landa','Valeria Montes','2026-03-30 19:00:00','Si publicas eso arruinas a muchas personas. Piénsalo bien. Necesito ese dinero.');

INSERT OR IGNORE INTO mensajes VALUES (9,3,'Marina Beltrán','Andrés Patiño','2026-04-14 18:00:00','Es la tercera vez que te pido el expediente 2019-LC-447. Si no me lo das, lo haré público de otra forma.');
INSERT OR IGNORE INTO mensajes VALUES (10,3,'Camila Herrera','Número privado','2026-04-15 15:00:00','Esta noche. Después de las 10. Ya sé cómo entrar.');
INSERT OR IGNORE INTO mensajes VALUES (11,3,'Camila Herrera','Número privado','2026-04-16 00:30:00','Hecho. Los documentos ya no existen. Liquida lo acordado.');

INSERT OR IGNORE INTO mensajes VALUES (12,4,'Óscar Meza','Red social (publicación)','2026-04-20 11:00:00','Galván me dejó sin trabajo y sin pagar. Haré que pague por esto.');
INSERT OR IGNORE INTO mensajes VALUES (13,4,'Óscar Meza','Comprador anónimo','2026-04-27 18:00:00','Tengo acceso y sé el código. Puedo conseguirte las piezas mañana.');

INSERT OR IGNORE INTO mensajes VALUES (14,5,'Iván Torres','Teatro Escena Viva','2026-05-03 09:00:00','Puedo darles el plan técnico del montaje completo. El precio es 15000.');
INSERT OR IGNORE INTO mensajes VALUES (15,5,'Iván Torres','Nora Valencia','2026-05-05 19:15:00','Te espero en el almacén en 10 minutos. Necesito hablar contigo antes del ensayo.');

INSERT OR IGNORE INTO mensajes VALUES (16,6,'Esteban Lira','Alicia Moreno','2026-05-12 20:00:00','Los documentos deben estar cambiados antes de que Héctor llegue. Es urgente.');
INSERT OR IGNORE INTO mensajes VALUES (17,6,'Alicia Moreno','Esteban Lira','2026-05-12 20:15:00','Ya están. Nadie notará nada. Pero esto es lo último que hago.');

INSERT OR IGNORE INTO mensajes VALUES (18,7,'Daniel Cifuentes','Valeria Cruz','2026-05-10 14:00:00','Las fotos siguen aquí. Este mes son 5000. Ya sabes dónde transferir.');
INSERT OR IGNORE INTO mensajes VALUES (19,7,'Valeria Cruz','Elena Suárez','2026-05-19 02:10:00','El accidente quedó en accidente ¿verdad? El resto del pago llegará mañana.');
INSERT OR IGNORE INTO mensajes VALUES (20,7,'Elena Suárez','Valeria Cruz','2026-05-19 02:15:00','Confirmado. El expediente dice accidente. Pero no me llames más a este número.');
`;

const camaras = `
INSERT OR IGNORE INTO camara_seguridad VALUES (1,1,'CAM-01 Entrada principal','Entrada principal del museo','Clara Vidal','2026-03-14 20:15:00','Clara Vidal ingresa al museo con materiales de restauración');
INSERT OR IGNORE INTO camara_seguridad VALUES (2,1,'CAM-02 Sala principal','Sala principal del museo','Clara Vidal','2026-03-14 21:45:00','Clara Vidal trabajando en vitrina de la sala principal');
INSERT OR IGNORE INTO camara_seguridad VALUES (3,1,'CAM-03 Pasillo norte','Pasillo hacia sala restauración','Persona con abrigo rojo','2026-03-14 21:34:00','Persona con abrigo rojo largo caminando hacia sala de restauración');
INSERT OR IGNORE INTO camara_seguridad VALUES (4,1,'CAM-04 Exterior norte','Exterior norte del museo','Bruno Leal','2026-03-14 21:22:00','Bruno Leal sale del edificio por la puerta lateral norte con teléfono en mano');
INSERT OR IGNORE INTO camara_seguridad VALUES (5,1,'CAM-05 Exterior principal','Fachada principal del museo','Tomás Erazo','2026-03-14 21:15:00','Tomás Erazo parado en la acera frente al museo, esperando a alguien');
INSERT OR IGNORE INTO camara_seguridad VALUES (6,1,'CAM-06 Estacionamiento','Estacionamiento trasero','Lucía Prado','2026-03-14 22:05:00','Lucía Prado sale hacia su vehículo cargando un bolso grande inusual');

INSERT OR IGNORE INTO camara_seguridad VALUES (7,2,'CAM-01 Exterior cafetería','Calle frente a Cafetería Aurora','Pablo Neri','2026-04-02 07:05:00','Hombre identificado como Pablo Neri a media cuadra de la cafetería');
INSERT OR IGNORE INTO camara_seguridad VALUES (8,2,'CAM-02 Interior cafetería','Barra de servicio','Mateo Ríos','2026-04-02 07:08:00','Mateo Ríos manipula varias tazas en el área de preparación, intercambia posición de dos tazas');
INSERT OR IGNORE INTO camara_seguridad VALUES (9,2,'CAM-03 Interior cafetería','Área de mesas','Valeria Montes','2026-04-02 07:15:00','Valeria Montes sentada consumiendo su café');
INSERT OR IGNORE INTO camara_seguridad VALUES (10,2,'CAM-04 Gimnasio','Entrada gimnasio Central','Sofía Landa','2026-04-02 06:32:00','Sofía Landa ingresa al gimnasio');

INSERT OR IGNORE INTO camara_seguridad VALUES (11,3,'CAM-01 Exterior archivo','Fachada del Archivo Histórico','Camila Herrera','2026-04-15 22:40:00','Camila Herrera ingresa al edificio después del horario de cierre');
INSERT OR IGNORE INTO camara_seguridad VALUES (12,3,'CAM-02 Pasillo expedientes','Pasillo zona de licitaciones','Persona no identificada','2026-04-15 23:02:00','Persona con capucha en zona de expedientes de licitaciones');
INSERT OR IGNORE INTO camara_seguridad VALUES (13,3,'CAM-03 Exterior','Exterior norte del archivo','Rodrigo Salas','2026-04-15 21:00:00','Rodrigo Salas sale del edificio con su caja de herramientas');
INSERT OR IGNORE INTO camara_seguridad VALUES (14,3,'CAM-04 Puesto vigilancia','Puesto de vigilancia','Julián Vera','2026-04-15 22:00:00','Julián Vera en puesto de vigilancia, último registro antes de ausentarse');

INSERT OR IGNORE INTO camara_seguridad VALUES (15,4,'CAM-01 Exterior taller','Calle frente al taller Galván','Óscar Meza','2026-04-28 18:30:00','Óscar Meza caminando por la calle a dos cuadras del taller');
INSERT OR IGNORE INTO camara_seguridad VALUES (16,4,'CAM-02 Taller interior','Interior del taller','Natalia Fierro','2026-04-28 17:05:00','Natalia Fierro discute acaloradamente con Ernesto Galván');
INSERT OR IGNORE INTO camara_seguridad VALUES (17,4,'CAM-02 Taller interior','Interior del taller','Bruno Salvatierra','2026-04-28 18:05:00','Bruno Salvatierra reunido con Ernesto Galván, tono calmado');
INSERT OR IGNORE INTO camara_seguridad VALUES (18,4,'CAM-03 Cámara de seguridad zona caja','Zona de caja fuerte','Sin registro','2026-04-28 18:45:00','Cámara apagada manualmente. Sin imagen desde las 18:45');

INSERT OR IGNORE INTO camara_seguridad VALUES (19,5,'CAM-01 Almacén utilería','Almacén de utilería y herramientas','Iván Torres','2026-05-05 19:32:00','Iván Torres accede al almacén con herramientas de trabajo');
INSERT OR IGNORE INTO camara_seguridad VALUES (20,5,'CAM-01 Almacén utilería','Almacén de utilería y herramientas','Nora Valencia','2026-05-05 19:47:00','Nora Valencia accede al almacén');
INSERT OR IGNORE INTO camara_seguridad VALUES (21,5,'CAM-02 Cabina luces','Cabina de iluminación','Sin registro de Iván','2026-05-05 20:05:00','Cabina de luces: Iván Torres no aparece en cámara entre 19:50 y 20:25');
INSERT OR IGNORE INTO camara_seguridad VALUES (22,5,'CAM-03 Escenario','Escenario principal del teatro','Mauricio Cid','2026-05-05 20:28:00','Mauricio Cid en escenario, acciona mecanismo del arnés');

INSERT OR IGNORE INTO camara_seguridad VALUES (23,6,'CAM-01 Piso ejecutivo','Pasillo piso 14 - oficinas ejecutivas','Esteban Lira','2026-05-12 21:53:00','Esteban Lira ingresa al pasillo de oficinas ejecutivas');
INSERT OR IGNORE INTO camara_seguridad VALUES (24,6,'CAM-02 Sala servidores','Sala de servidores piso 12','Esteban Lira','2026-05-12 22:08:00','Esteban Lira accede a sala de servidores');
INSERT OR IGNORE INTO camara_seguridad VALUES (25,6,'CAM-03 Estacionamiento','Estacionamiento del edificio','Esteban Lira','2026-05-12 22:45:00','Esteban Lira sale del edificio apresuradamente');

INSERT OR IGNORE INTO camara_seguridad VALUES (26,7,'CAM-01 Peaje Ruta 47','Caseta de peaje km 15','Vehículo TRP-2847','2026-05-19 00:58:00','Vehículo de transporte pasa el peaje. Se observa a una mujer en el asiento del conductor');
INSERT OR IGNORE INTO camara_seguridad VALUES (27,7,'CAM-02 Ruta 47','Cámara de tráfico km 20','Vehículo TRP-2847','2026-05-19 01:08:00','Vehículo a velocidad elevada en zona de curva peligrosa');
`;

const accesos = `
INSERT OR IGNORE INTO accesos VALUES (1,1,'Clara Vidal','Sala principal del museo','2026-03-14 20:10:00','Tarjeta de acceso','permitido');
INSERT OR IGNORE INTO accesos VALUES (2,1,'Bruno Leal','Puesto de seguridad','2026-03-14 20:00:00','Tarjeta de acceso','permitido');
INSERT OR IGNORE INTO accesos VALUES (3,1,'Lucía Prado','Oficina de subdirección','2026-03-14 19:25:00','Tarjeta de acceso','permitido');
INSERT OR IGNORE INTO accesos VALUES (4,1,'Lucía Prado','Bóveda principal','2026-03-14 21:32:00','Tarjeta de acceso','permitido');
INSERT OR IGNORE INTO accesos VALUES (5,1,'Tomás Erazo','Sala de archivos','2026-03-14 17:00:00','Pase temporal','permitido');
INSERT OR IGNORE INTO accesos VALUES (6,1,'Dr. Emilio Vargas','Bóveda principal','2026-03-14 21:15:00','Tarjeta de acceso','permitido');
INSERT OR IGNORE INTO accesos VALUES (7,1,'Dr. Emilio Vargas','Sala de restauración','2026-03-14 21:30:00','Tarjeta de acceso','permitido');

INSERT OR IGNORE INTO accesos VALUES (8,2,'Mateo Ríos','Cafetería Aurora - área de trabajo','2026-04-02 06:00:00','Llave de empleado','permitido');
INSERT OR IGNORE INTO accesos VALUES (9,2,'Irene Casas','Redacción periódico El Informador','2026-04-02 06:05:00','Tarjeta corporativa','permitido');
INSERT OR IGNORE INTO accesos VALUES (10,2,'Sofía Landa','Gimnasio Central','2026-04-02 06:32:00','Membresía','permitido');
INSERT OR IGNORE INTO accesos VALUES (11,2,'Pablo Neri','Hotel Plaza - habitación 412','2026-04-02 06:50:00','Tarjeta de habitación','permitido');

INSERT OR IGNORE INTO accesos VALUES (12,3,'Camila Herrera','Archivo Histórico Municipal','2026-04-15 22:45:00','Credencial nivel A','permitido');
INSERT OR IGNORE INTO accesos VALUES (13,3,'Rodrigo Salas','Archivo Histórico - sala técnica','2026-04-15 20:00:00','Orden de trabajo','permitido');
INSERT OR IGNORE INTO accesos VALUES (14,3,'Julián Vera','Puesto de vigilancia','2026-04-15 21:30:00','Registro de turno','permitido');
INSERT OR IGNORE INTO accesos VALUES (15,3,'Marina Beltrán','Archivo Histórico','2026-04-11 14:00:00','Pase de investigador','permitido');
INSERT OR IGNORE INTO accesos VALUES (16,3,'Marina Beltrán','Archivo Histórico - zona restringida','2026-04-11 14:30:00','Pase de investigador','denegado');

INSERT OR IGNORE INTO accesos VALUES (17,4,'Natalia Fierro','Taller Galván','2026-04-28 17:00:00','Intercomunicador','permitido');
INSERT OR IGNORE INTO accesos VALUES (18,4,'Bruno Salvatierra','Taller Galván','2026-04-28 18:00:00','Llave de socio','permitido');
INSERT OR IGNORE INTO accesos VALUES (19,4,'Daniela Ponce','Taller Galván','2026-04-21 10:00:00','Orden de inspección','permitido');

INSERT OR IGNORE INTO accesos VALUES (20,5,'Iván Torres','Almacén de utilería','2026-05-05 19:30:00','Tarjeta de empleado','permitido');
INSERT OR IGNORE INTO accesos VALUES (21,5,'Nora Valencia','Almacén de utilería','2026-05-05 19:45:00','Tarjeta de artista','permitido');
INSERT OR IGNORE INTO accesos VALUES (22,5,'Paula Ríos','Sala de reuniones del teatro','2026-05-05 19:55:00','Tarjeta de productora','permitido');
INSERT OR IGNORE INTO accesos VALUES (23,5,'Samuel Díaz','Área de actores','2026-05-05 19:00:00','Pase de ensayo','permitido');
INSERT OR IGNORE INTO accesos VALUES (24,5,'Iván Torres','Almacén de utilería','2026-05-05 20:05:00','Tarjeta de empleado','permitido');

INSERT OR IGNORE INTO accesos VALUES (25,6,'Esteban Lira','Piso 14 - zona ejecutiva','2026-05-12 21:50:00','Tarjeta directiva','permitido');
INSERT OR IGNORE INTO accesos VALUES (26,6,'Esteban Lira','Oficina privada de Héctor Molina','2026-05-12 21:55:00','Llave maestra + código','permitido');
INSERT OR IGNORE INTO accesos VALUES (27,6,'Esteban Lira','Sala de servidores piso 12','2026-05-12 22:08:00','Tarjeta directiva','permitido');
INSERT OR IGNORE INTO accesos VALUES (28,6,'Raúl Paredes','Sistema interno (acceso remoto)','2026-05-12 22:00:00','Cuenta de servicio desactivada','permitido');
INSERT OR IGNORE INTO accesos VALUES (29,6,'Alicia Moreno','VPN corporativa','2026-05-12 21:00:00','Credenciales corporativas','permitido');

INSERT OR IGNORE INTO accesos VALUES (30,7,'Valeria Cruz','Vehículo TRP-2847','2026-05-19 00:30:00','Llave del vehículo facilitada por Daniel','permitido');
INSERT OR IGNORE INTO accesos VALUES (31,7,'Elena Suárez','Sistema de gestión de expedientes','2026-05-19 02:30:00','Credenciales policiales','permitido');
INSERT OR IGNORE INTO accesos VALUES (32,7,'Franco Nieto','Vehículo TRP-2847 para mantenimiento','2026-05-12 09:00:00','Llave de taller','permitido');
`;

const transacciones = `
INSERT OR IGNORE INTO transacciones VALUES (1,1,'Lucía Prado','Depósito entrante',85000.00,'2026-03-14 22:45:00','Transferencia desde cuenta no identificada (código: REL-2026-0314)');
INSERT OR IGNORE INTO transacciones VALUES (2,1,'Bruno Leal','Pago de deuda',3500.00,'2026-03-14 23:00:00','Pago a prestamista informal Rafael Torres');
INSERT OR IGNORE INTO transacciones VALUES (3,1,'Tomás Erazo','Pago de honorario',500.00,'2026-03-15 00:30:00','Honorario por consultoría de fuente confidencial');

INSERT OR IGNORE INTO transacciones VALUES (4,2,'Pablo Neri','Pago a tercero',3000.00,'2026-03-30 10:00:00','Transferencia a cuenta de Mateo Ríos. Descripción: servicios de consultoría');
INSERT OR IGNORE INTO transacciones VALUES (5,2,'Mateo Ríos','Depósito recibido',3000.00,'2026-03-30 10:05:00','Recibo de Pablo Neri Consulting Group');
INSERT OR IGNORE INTO transacciones VALUES (6,2,'Mateo Ríos','Compra farmacia',87.50,'2026-03-31 14:00:00','Compra en Farmacia Central. Productos varios.');

INSERT OR IGNORE INTO transacciones VALUES (7,3,'Camila Herrera','Pago a cuenta privada',25000.00,'2026-04-16 00:45:00','Transferencia a cuenta anónima. Descripción: asesoría especial');
INSERT OR IGNORE INTO transacciones VALUES (8,3,'Julián Vera','Cobro de nomina',1200.00,'2026-04-15 08:00:00','Nómina mensual de vigilante');

INSERT OR IGNORE INTO transacciones VALUES (9,4,'Óscar Meza','Depósito recibido',15000.00,'2026-04-28 21:00:00','Transferencia anónima. Sin descripción.');
INSERT OR IGNORE INTO transacciones VALUES (10,4,'Bruno Salvatierra','Pago parcial de deuda',10000.00,'2026-04-28 19:00:00','Pago acordado a Ernesto Galván, verificado con recibo');

INSERT OR IGNORE INTO transacciones VALUES (11,5,'Iván Torres','Depósito recibido',15000.00,'2026-05-04 09:00:00','Transferencia desde Teatro Escena Viva. Descripción: consultoría técnica');
INSERT OR IGNORE INTO transacciones VALUES (12,5,'Paula Ríos','Prima de seguro',50000.00,'2026-04-30 11:00:00','Ampliación de póliza de seguro sobre la obra teatral');

INSERT OR IGNORE INTO transacciones VALUES (13,6,'Esteban Lira','Transferencia corporativa',450000.00,'2026-05-12 21:40:00','Transferencia desde cuenta operativa de Molina Tech a cuenta offshore BH-7734');
INSERT OR IGNORE INTO transacciones VALUES (14,6,'Esteban Lira','Transferencia corporativa',380000.00,'2026-05-10 16:00:00','Transferencia desde fondo de inversión a cuenta offshore BH-7734');
INSERT OR IGNORE INTO transacciones VALUES (15,6,'Raúl Paredes','Consulta saldo',0,'2026-05-12 22:05:00','Acceso a sistema financiero interno con cuenta de servicio');

INSERT OR IGNORE INTO transacciones VALUES (16,7,'Valeria Cruz','Pago mensual',5000.00,'2026-05-10 10:00:00','Transferencia a Daniel Cifuentes. Sin descripción.');
INSERT OR IGNORE INTO transacciones VALUES (17,7,'Valeria Cruz','Pago a cuenta privada',8000.00,'2026-05-19 03:00:00','Transferencia a cuenta vinculada a E. Suárez. Descripción: servicio especial.');
INSERT OR IGNORE INTO transacciones VALUES (18,7,'Franco Nieto','Depósito recibido',2000.00,'2026-05-17 15:00:00','Transferencia de intermediario. Descripción: revisión técnica prioritaria.');
`;

const evidencias = `
INSERT OR IGNORE INTO evidencias VALUES (1,1,'Reliquia precolombina desaparecida','Pieza de oro de 35 cm, período prehispánico. Valor estimado 200.000 USD. Fue retirada de la bóveda.','Bóveda principal','2026-03-15 02:00:00');
INSERT OR IGNORE INTO evidencias VALUES (2,1,'Fibra textil roja','Fibra de lana roja encontrada junto a la vitrina de la bóveda. Análisis indica tejido de alta calidad.','Bóveda principal, junto a vitrina central','2026-03-15 02:30:00');
INSERT OR IGNORE INTO evidencias VALUES (3,1,'Huella dactilar en vitrina','Huella dactilar en superficie de vitrina de la sala principal de exposición.','Sala principal, vitrina 7','2026-03-15 03:00:00');
INSERT OR IGNORE INTO evidencias VALUES (4,1,'Tarjeta de acceso caída','Tarjeta de acceso encontrada en el pasillo norte, cerca de la entrada a la bóveda.','Pasillo norte, frente a la bóveda','2026-03-15 02:45:00');

INSERT OR IGNORE INTO evidencias VALUES (5,2,'Taza con residuos','Taza de café con residuos de cianuro de potasio. Era la taza de Valeria Montes.','Mesa 4, Cafetería Aurora','2026-04-02 09:00:00');
INSERT OR IGNORE INTO evidencias VALUES (6,2,'Empaque de producto químico','Empaque vacío de reactivo de laboratorio (cianuro de potasio) encontrado en papelera del baño.','Baño de empleados, Cafetería Aurora','2026-04-02 09:30:00');
INSERT OR IGNORE INTO evidencias VALUES (7,2,'Recibo de farmacia','Recibo de compra de productos en farmacia a nombre de Mateo Ríos.','Bolsillo del delantal de Mateo Ríos','2026-04-02 10:00:00');

INSERT OR IGNORE INTO evidencias VALUES (8,3,'Acelerante de incendio','Resto de líquido inflamable no natural en zona de origen del incendio.','Sala de expedientes de licitaciones','2026-04-16 08:00:00');
INSERT OR IGNORE INTO evidencias VALUES (9,3,'Fragmento de tarjeta de acceso','Fragmento plástico quemado con número de serie parcial: **-4471.','Zona de origen del incendio','2026-04-16 09:00:00');
INSERT OR IGNORE INTO evidencias VALUES (10,3,'Grabación de acceso','Registro digital de tarjeta de acceso nivel A a las 22:45. ID del titular asociado.','Sistema de control de acceso del archivo','2026-04-16 06:00:00');

INSERT OR IGNORE INTO evidencias VALUES (11,4,'Guante negro con fibras','Guante de cuero negro con fibras de tela gris. Encontrado detrás de caja fuerte.','Taller Galván, zona de caja fuerte','2026-04-29 08:00:00');
INSERT OR IGNORE INTO evidencias VALUES (12,4,'Nota manuscrita con código','Papel con combinación de la caja fuerte escrita a mano.','Interior del guante negro','2026-04-29 08:30:00');
INSERT OR IGNORE INTO evidencias VALUES (13,4,'Cámara de seguridad manipulada','Cámara apagada manualmente. Solo personal con conocimiento técnico del sistema podía hacerlo.','Zona de caja fuerte del taller','2026-04-29 09:00:00');

INSERT OR IGNORE INTO evidencias VALUES (14,5,'Arnés manipulado','Arnés de seguridad con cortes deliberados en dos puntos de tensión. No son cortes por desgaste.','Almacén de utilería del teatro','2026-05-06 09:00:00');
INSERT OR IGNORE INTO evidencias VALUES (15,5,'Herramienta de corte','Cortador de cables encontrado entre herramientas de Iván Torres.','Caja de herramientas de Iván Torres','2026-05-06 10:00:00');
INSERT OR IGNORE INTO evidencias VALUES (16,5,'Registro de herramienta prestada','El arnés fue sacado del almacén a las 19:30 y devuelto a las 20:10 según registro manual.','Registro de almacén del teatro','2026-05-06 08:00:00');

INSERT OR IGNORE INTO evidencias VALUES (17,6,'Reloj de oficina alterado','El reloj de la oficina de Héctor estaba adelantado 25 minutos respecto a los sistemas del edificio.','Oficina ejecutiva de Héctor Molina','2026-05-13 07:00:00');
INSERT OR IGNORE INTO evidencias VALUES (18,6,'Log de servidor con IP','Registro de servidor muestra acceso a sistema financiero desde IP registrada al equipo de Esteban Lira.','Servidor de base de datos piso 12','2026-05-13 08:00:00');
INSERT OR IGNORE INTO evidencias VALUES (19,6,'Documento de transferencias','Impresión de transferencias a cuenta offshore BH-7734 por 830.000 USD en los últimos seis meses.','Impresora de la oficina de Esteban Lira','2026-05-13 09:00:00');

INSERT OR IGNORE INTO evidencias VALUES (20,7,'Registro GPS vehículo','El GPS registra paso por domicilio de Valeria Cruz a las 00:45, contradiciendo la ruta declarada.','Sistema GPS del vehículo TRP-2847','2026-05-19 08:00:00');
INSERT OR IGNORE INTO evidencias VALUES (21,7,'Imagen de cámara de peaje','Imagen del peaje km 15 muestra a una mujer conduciendo, no al titular del vehículo.','Cámara de peaje, km 15, Ruta 47','2026-05-19 09:00:00');
INSERT OR IGNORE INTO evidencias VALUES (22,7,'Registro de falla de frenos','El mecánico Franco Nieto omitió reportar una falla en el sistema de frenos en su informe.','Informe de revisión del vehículo TRP-2847','2026-05-19 10:00:00');
`;

const huellas = `
INSERT OR IGNORE INTO huellas VALUES (1,1,2,'Lucía Prado','fibra',92.50);
INSERT OR IGNORE INTO huellas VALUES (2,1,3,'Clara Vidal','huella',99.00);
INSERT OR IGNORE INTO huellas VALUES (3,1,4,'Lucía Prado','adn',87.00);

INSERT OR IGNORE INTO huellas VALUES (4,2,6,'Mateo Ríos','huella',95.00);
INSERT OR IGNORE INTO huellas VALUES (5,2,7,'Mateo Ríos','huella',88.00);

INSERT OR IGNORE INTO huellas VALUES (6,3,9,'Camila Herrera','adn',76.00);
INSERT OR IGNORE INTO huellas VALUES (7,3,8,'Sin identificar','huella',0.00);

INSERT OR IGNORE INTO huellas VALUES (8,4,11,'Óscar Meza','fibra',89.00);
INSERT OR IGNORE INTO huellas VALUES (9,4,12,'Óscar Meza','huella',94.00);

INSERT OR IGNORE INTO huellas VALUES (10,5,14,'Iván Torres','huella',91.00);
INSERT OR IGNORE INTO huellas VALUES (11,5,15,'Iván Torres','huella',98.00);

INSERT OR IGNORE INTO huellas VALUES (12,6,18,'Esteban Lira','adn',85.00);
INSERT OR IGNORE INTO huellas VALUES (13,6,19,'Esteban Lira','huella',97.00);

INSERT OR IGNORE INTO huellas VALUES (14,7,21,'Valeria Cruz','huella',83.00);
INSERT OR IGNORE INTO huellas VALUES (15,7,20,'Daniel Cifuentes','adn',99.00);
`;

export function getAdditionalSeedSQL(): string {
  return ubicaciones + llamadas + mensajes + camaras + accesos + transacciones + evidencias + huellas;
}
