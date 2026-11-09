DROP DATABASE IF EXISTS Combat_gtaV;
CREATE DATABASE Combat_gtaV;
USE Combat_gtaV;

CREATE TABLE `Color` (
  `ID_Color` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Nombre_Color` varchar(255)
);

CREATE TABLE `ChalecoAntibalas` (
  `ID_ChalecoAntibalas` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Cantidad` integer,
  `Capacidad_De_Proteccion` integer,
  `Nombre_Chaleco` varchar(255),
  `Descripcion` varchar(255)
);

CREATE TABLE `Snack` (
  `ID_Snack` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Cantidad` integer,
  `Curacion` integer,
  `Nombre_Snack` varchar(255),
  `Descripcion` varchar(255)
);

CREATE TABLE `Tipo` (
  `ID_Tipo` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Nombre_Tipo` varchar(255)
);

CREATE TABLE `Municion` (
  `ID_Municion` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Capacidad` integer,
  `Cantidad_Actual` integer,
  `Nombre_Municion` varchar(255)
);

CREATE TABLE `Cualidad` (
  `ID_Cualidad` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Modificable` boolean
);

CREATE TABLE `Armas` (
  `ID_Armas` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Nombre_Arma` varchar(255),
  `ID_Tipo` integer,
  `ID_Cualidad` integer,
  `ID_Municion` integer,
  constraint Fk_ID_Tipo foreign key (ID_Tipo) references Tipo(ID_Tipo),
  constraint Fk_ID_Cualidad foreign key (ID_Cualidad) references Cualidad(ID_Cualidad),
  constraint Fk_ID_Municion foreign key (ID_Municion) references Municion(ID_Municion)
);

CREATE TABLE `Estadistica` (
  `ID_Estadistica` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Danio` integer,
  `Cadencia` integer,
  `Precision_Arma` integer,
  `Alcance` integer,
  `Precio` integer,
  `Descripcion` varchar(255),
  `ID_Armas` integer,
  constraint Fk_ID_Armas_Estadistica foreign key (ID_Armas) references Armas(ID_Armas)
);

CREATE TABLE `Paracaidas` (
  `ID_Paracaidas` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Humo` boolean,
  `Paracaidas_De_Reserva` boolean,
  `ID_Color` integer,
   constraint Fk_ID_Color foreign key (ID_Color) references Color(ID_Color)

);

CREATE TABLE `Inventario` (
  `ID_Inventario` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `ID_Snack` integer,
  `ID_Armas` integer,
  `ID_Paracaidas` integer,
  `ID_ChalecoAntibalas` integer,

  constraint Fk_ID_Snack foreign key (ID_Snack) references Snack(ID_Snack),
  constraint Fk_ID_Armas foreign key (ID_Armas) references Armas(ID_Armas),
  constraint Fk_ID_Paracaidas foreign key (ID_Paracaidas) references Paracaidas(ID_Paracaidas),
  constraint Fk_ID_ChalecoAntibalas foreign key (ID_ChalecoAntibalas) references ChalecoAntibalas(ID_ChalecoAntibalas)
);

CREATE TABLE `Personaje` (
  `ID_Personaje` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `ID_Inventario` integer,
   constraint Fk_ID_Inventario foreign key (ID_Inventario) references Inventario(ID_Inventario)

);

CREATE TABLE `Jugador` (
  `ID_Jugador` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Nombre_Jugador` varchar(255),
  `ID_Personaje` integer,
   constraint Fk_ID_Personaje foreign key (ID_Personaje) references Personaje(ID_Personaje)
);


USE Combat_gtaV;


 -- COLORES PARACAIDAS GTA ONLINE
INSERT INTO Color (Nombre_Color) VALUES
('Negro'),
('Rojo'),
('Azul'),
('Verde'),
('Blanco'),
('Amarillo'),
('Naranja'),
('Morado'),
('Rosa'),
('Gris'),
('Dorado'),
('Plateado'),
('Camuflaje'),
('Militar'),
('Azul oscuro');


-- CHALECOS ANTIBALAS
INSERT INTO ChalecoAntibalas
(Cantidad, Capacidad_De_Proteccion, Nombre_Chaleco, Descripcion) VALUES
(10,100,'Chaleco pesado','Proteccion completa'),
(5,90,'Chaleco militar','Proteccion avanzada'),
(2,80,'Chaleco tactico','Usado en misiones'),
(4,70,'Chaleco reforzado','Proteccion media'),
(1,50,'Chaleco ligero','Proteccion basica');


-- SNACKS GTA ONLINE
INSERT INTO Snack
(Cantidad, Curacion, Nombre_Snack, Descripcion) VALUES
(10,25,'EgoChaser','Barra energetica'),
(10,20,'Meteorite','Chocolate'),
(10,15,'Pisswasser','Cerveza'),
(10,30,'eCola','Bebida'),
(10,35,'Sprunk','Bebida energetica'),
(10,10,'Phat Chips','Snack rapido'),
(10,20,'P''s & Q''s','Dulce');


-- TIPOS DE ARMAS
INSERT INTO Tipo (Nombre_Tipo) VALUES
('Pistola'),
('Subfusil'),
('Fusil de asalto'),
('Escopeta'),
('Rifle francotirador'),
('Ametralladora'),
('Arma pesada'),
('Explosivo'),
('Cuerpo a cuerpo');


-- MUNICIONES
INSERT INTO Municion
(Capacidad,Cantidad_Actual,Nombre_Municion) VALUES
(120,120,'Municion 9mm'),
(150,150,'Municion .45 ACP'),
(300,30,'Municion 5.56mm'),
(300,150,'Municion 7.62mm'),
(100,100,'Cartuchos escopeta'),
(50,40,'Municion francotirador'),
(200,200,'Municion MG'),
(20,20,'Cohetes'),
(1,1,'Sin municion');


-- CUALIDADES
INSERT INTO Cualidad (Modificable) VALUES
(true),
(true),
(true),
(false),
(false),
(true);


INSERT INTO Armas
(Nombre_Arma,ID_Tipo,ID_Cualidad,ID_Municion) VALUES

-- PISTOLAS
('Pistola',1,1,1),
('Pistola de combate',1,1,2),
('Pistola perforante',1,2,1),
('Pistola pesada',1,3,2),
('Pistola vintage',1,1,1),
('Pistola de duelista',1,2,1),
('Pistola Mk II',1,2,1),
('Revólver pesado',1,3,2),
('Revólver pesado Mk II',1,2,2),
('Pistola de cerámica',1,1,1),
('Pistola SPN',1,1,1),
('Pistola SPN Mk II',1,2,1),

-- SUBFUSILES
('Microametralladora',2,1,1),
('Subfusil',2,1,2),
('Subfusil Mk II',2,2,2),
('Pistola ametralladora',2,1,1),
('ADP de combate',2,2,3),
('Subfusil táctico',2,2,2),

-- FUSILES DE ASALTO
('Rifle de asalto',3,1,3),
('Carabina especial',3,2,3),
('Carabina especial Mk II',3,2,3),
('Rifle avanzado',3,1,3),
('Rifle militar',3,3,4),
('Rifle de combate',3,2,4),
('Carabina de servicio',3,2,3),

-- ESCOPETAS
('Escopeta de bombeo',4,1,5),
('Escopeta recortada',4,2,5),
('Escopeta de combate',4,1,5),
('Escopeta pesada',4,3,5),
('Escopeta de asalto',4,2,5),
('Escopeta de bombeo Mk II',4,2,5),
('Mosquete',4,3,5),

-- RIFLES FRANCOTIRADOR
('Rifle de francotirador',5,1,6),
('Rifle de francotirador pesado',5,3,6),
('Rifle de francotirador pesado Mk II',5,2,6),
('Rifle de tirador',5,2,6),
('Rifle de tirador Mk II',5,2,6),

-- AMETRALLADORAS
('Ametralladora',6,1,7),
('Ametralladora de combate',6,2,7),
('Ametralladora de combate Mk II',6,2,7),
('Barredora Gusenberg',6,1,7),

-- ARMAS PESADAS
('Minigun',7,3,7),
('Lanzacohetes',7,3,8),
('Lanzagranadas',7,3,8),
('Cañón de pirotecnia',7,3,8),
('Railgun',7,3,8),
('Cañón orbital',7,3,8),
('Viuda negra',7,3,8),
('Lanzador teledirigido',7,3,8),
('Lanzador de PEM compacto',7,3,8),

-- EXPLOSIVOS
('Granada',8,4,9),
('Bomba adhesiva',8,4,9),
('Mina de proximidad',8,4,9),
('Gas lacrimógeno',8,4,9),
('Cóctel molotov',8,4,9),
('Bola de nieve',8,4,9),

-- CUERPO A CUERPO
('Cuchillo',9,4,9),
('Bate de béisbol',9,4,9),
('Palanca',9,4,9),
('Martillo',9,4,9),
('Hacha de guerra',9,4,9),
('Daga de caballería antigua',9,4,9),
('Machete',9,4,9),
('Linterna',9,4,9),
('Llave inglesa',9,4,9),
('Botella',9,4,9),
('Puño americano',9,4,9);




-- ESTADISTICAS ARMAS
INSERT INTO Estadistica
(Danio,Cadencia,Precision_Arma,Alcance,Precio,Descripcion,ID_Armas) VALUES
(26,40,48,30,0,'La pistola básica con la que parte cualquier personaje.',1),
(27,40,55,32,3200,'Pistola semiautomática compacta y fácil de controlar.',2),
(24,80,40,28,5000,'Pistola automática con mucha cadencia pero poco daño por bala.',3),
(40,32,50,35,3750,'Pistola de calibre grande con buen golpe a corta distancia.',4),
(34,36,45,30,3400,'Pistola de estilo antiguo con buen daño para su tamaño.',5),
(38,30,50,34,4000,'Pistola de un solo disparo por recarga, pensada para tiros precisos.',6),
(30,42,55,32,99000,'Pistola básica mejorada, con mira y cargador ampliado.',7),
(80,15,45,40,21600,'Revólver muy potente: pocos tiros, pero cada uno pega fuerte.',8),
(85,16,50,42,99000,'Revólver pesado mejorado, con munición especial y mira.',9),
(28,40,45,28,20000,'Pistola de cerámica que pasa desapercibida en detectores.',10),
(28,35,40,25,2750,'Pistola pequeña y barata, fácil de esconder.',11),
(30,37,45,27,99000,'Versión mejorada de la pistola SPN, con más opciones de personalización.',12),
(21,85,30,25,3750,'Subfusil compacto con mucha cadencia, ideal para disparar desde vehículos.',13),
(22,80,40,32,7500,'Subfusil equilibrado entre daño, control y alcance.',14),
(25,82,45,34,85500,'SMG mejorada que acepta munición especial y miras.',15),
(20,80,32,25,6250,'Pistola ametralladora pequeña, cabe en cualquier inventario.',16),
(28,72,45,35,11750,'Arma de defensa personal compacta con buena estabilidad.',17),
(23,85,42,30,15000,'Subfusil táctico ligero con cadencia muy alta.',18),
(30,70,50,45,8550,'El rifle de asalto clásico, confiable a media distancia.',19),
(32,72,58,48,14750,'Carabina precisa y estable, una de las favoritas de los jugadores.',20),
(35,74,62,50,135000,'Carabina especial mejorada con munición especial y accesorios.',21),
(32,74,55,46,14250,'Fusil de diseño bullpup con buena precisión.',22),
(40,55,60,55,20000,'Rifle de calibre grande con buen alcance y mira integrada.',23),
(42,52,55,52,18000,'Fusil pesado que dispara proyectiles de 7.62 mm.',24),
(36,62,62,55,25000,'Carabina moderna con cadencia controlada y buena precisión.',25),
(70,20,25,18,3500,'Escopeta tradicional de corredera, muy fuerte de cerca.',26),
(60,25,20,12,1450,'Escopeta de cañón corto, fácil de llevar pero con poco alcance.',27),
(68,35,28,20,29500,'Escopeta semiautomática que dispara más rápido que la de bombeo.',28),
(75,30,28,22,13550,'Escopeta pesada con cargador de tambor.',29),
(58,55,25,18,10000,'Escopeta automática para limpiar habitaciones rápido.',30),
(78,24,30,22,99000,'Escopeta de bombeo mejorada que acepta munición especial.',31),
(90,8,40,28,21400,'Arma de época que dispara lento pero con un daño enorme.',32),
(85,10,85,90,20000,'Rifle de francotirador estándar con mira telescópica.',33),
(95,8,90,98,38150,'Francotirador de gran calibre, muy poderoso contra vehículos.',34),
(100,9,92,100,165375,'El francotirador más fuerte del juego, con munición explosiva.',35),
(70,35,75,80,15000,'Rifle semiautomático que mezcla precisión con disparos seguidos.',36),
(75,37,80,82,99000,'Rifle de precisión mejorado con munición especial.',37),
(35,75,35,50,13500,'Ametralladora de cargador grande para fuego sostenido.',38),
(38,78,38,52,14800,'Ametralladora de combate con mucha munición disponible.',39),
(42,80,42,54,119000,'MG de combate mejorada, admite munición incendiaria y perforante.',40),
(32,82,30,38,14600,'Ametralladora de estilo años 20 con cargador de tambor.',41),
(30,100,25,45,50000,'Ametralladora rotativa con la mayor cadencia del juego.',42),
(100,5,60,70,26250,'Lanza un cohete explosivo, ideal contra vehículos.',43),
(95,15,45,55,32400,'Dispara granadas que rebotan antes de explotar.',44),
(85,6,40,60,0,'Lanza fuegos artificiales que explotan al impactar.',45),
(100,4,85,90,250000,'Arma experimental que dispara un proyectil electromagnético.',46),
(100,1,100,100,750000,'Ataque desde un satélite que destruye todo en la zona marcada.',47),
(60,100,30,45,0,'Ametralladora láser de ciencia ficción.',48),
(100,5,95,85,75000,'Lanzacohetes que persigue automáticamente a los vehículos.',49),
(20,5,50,40,0,'Lanza un pulso que apaga los vehículos sin destruirlos.',50),
(90,10,30,25,250,'Explosivo de mano que estalla a los pocos segundos.',51),
(95,10,50,20,600,'Explosivo que se pega a superficies y se detona a distancia.',52),
(95,5,0,5,1000,'Mina que explota cuando algo pasa cerca.',53),
(10,10,30,20,150,'Granada que libera gas y obliga a salir de la zona.',54),
(60,10,30,20,1500,'Botella incendiaria que prende fuego al impactar.',55),
(1,40,40,25,0,'Bola de nieve que solo aparece en eventos de invierno.',56),
(40,45,100,2,400,'Cuchillo básico para ataques sigilosos.',57),
(35,35,100,3,100,'Bate de béisbol, simple pero efectivo.',58),
(35,35,100,3,100,'Palanca que sirve como arma contundente.',59),
(38,35,100,2,500,'Martillo de herramientas usado como arma.',60),
(55,25,100,3,7500,'Hacha de batalla con golpes muy fuertes.',61),
(45,40,100,2,2000,'Daga antigua de colección.',62),
(50,35,100,3,8900,'Machete largo con buen alcance para un arma blanca.',63),
(20,40,100,2,200,'Linterna que ilumina y también sirve para golpear.',64),
(36,35,100,3,7500,'Llave de herramientas usada como arma contundente.',65),
(30,45,100,2,0,'Botella rota improvisada para peleas callejeras.',66),
(30,50,100,1,7500,'Puño americano que aumenta la fuerza de los golpes.',67);



-- PARACAIDAS
INSERT INTO Paracaidas
(Humo,Paracaidas_De_Reserva,ID_Color) VALUES
(true,true,1),
(true,true,2),
(true,false,3),
(false,true,4),
(true,true,5),
(false,false,6),
(true,false,7),
(true,true,8),
(false,true,9);


-- INVENTARIOS ONLINE
INSERT INTO Inventario
(ID_Snack,ID_Armas,ID_Paracaidas,ID_ChalecoAntibalas) VALUES
(1,1,1,1),
(2,11,2,2),
(3,26,3,3),
(4,16,4,1),
(5,19,5,4),
(6,28,6,5);


-- PERSONAJES ONLINE
INSERT INTO Personaje
(ID_Inventario) VALUES
(1),
(2),
(3),
(4),
(5),
(6);


-- JUGADORES ONLINE
INSERT INTO Jugador
(Nombre_Jugador,ID_Personaje) VALUES
('Jugador_Online_01',1),
('Jugador_Online_02',2),
('Jugador_Online_03',3),
('Jugador_Online_04',4),
('Jugador_Online_05',5),
('Jugador_Online_06',6);
