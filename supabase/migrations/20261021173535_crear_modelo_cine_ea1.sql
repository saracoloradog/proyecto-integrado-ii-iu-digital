begin;

create table public.generos (
  id bigint generated always as identity primary key,
  nombre varchar(120) not null unique,
  estado boolean not null default true,
  descripcion text,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),
  constraint genero_nombre_no_vacio check (length(trim(nombre)) > 0)
);

create table public.directores (
  id bigint generated always as identity primary key,
  nombres varchar(160) not null,
  estado boolean not null default true,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),
  constraint director_nombre_no_vacio check (length(trim(nombres)) > 0)
);

create table public.productoras (
  id bigint generated always as identity primary key,
  nombre varchar(160) not null unique,
  estado boolean not null default true,
  slogan text,
  descripcion text,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),
  constraint productora_nombre_no_vacio check (length(trim(nombre)) > 0)
);

create table public.tipos (
  id bigint generated always as identity primary key,
  nombre varchar(80) not null unique,
  descripcion text,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),
  constraint tipo_nombre_no_vacio check (length(trim(nombre)) > 0)
);

create table public.media (
  id bigint generated always as identity primary key,
  serial varchar(80) not null unique,
  titulo varchar(240) not null,
  sinopsis text not null,
  url_pelicula text not null unique,
  imagen_portada text,
  anio_estreno integer not null,
  genero_id bigint not null references public.generos(id) on delete restrict,
  director_id bigint not null references public.directores(id) on delete restrict,
  productora_id bigint not null references public.productoras(id) on delete restrict,
  tipo_id bigint not null references public.tipos(id) on delete restrict,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),
  constraint media_serial_no_vacio check (length(trim(serial)) > 0),
  constraint media_titulo_no_vacio check (length(trim(titulo)) > 0),
  constraint media_url_no_vacia check (length(trim(url_pelicula)) > 0),
  constraint media_anio_valido check (anio_estreno between 1888 and 2200)
);

create index media_genero_idx on public.media(genero_id);
create index media_director_idx on public.media(director_id);
create index media_productora_idx on public.media(productora_id);
create index media_tipo_idx on public.media(tipo_id);

create function public.actualizar_fecha_modificacion()
returns trigger language plpgsql set search_path = ''
as $$ begin new.fecha_actualizacion = now(); return new; end; $$;

create trigger generos_fecha_update before update on public.generos
for each row execute function public.actualizar_fecha_modificacion();
create trigger directores_fecha_update before update on public.directores
for each row execute function public.actualizar_fecha_modificacion();
create trigger productoras_fecha_update before update on public.productoras
for each row execute function public.actualizar_fecha_modificacion();
create trigger tipos_fecha_update before update on public.tipos
for each row execute function public.actualizar_fecha_modificacion();
create trigger media_fecha_update before update on public.media
for each row execute function public.actualizar_fecha_modificacion();

alter table public.generos enable row level security;
alter table public.directores enable row level security;
alter table public.productoras enable row level security;
alter table public.tipos enable row level security;
alter table public.media enable row level security;

revoke all on public.generos, public.directores, public.productoras, public.tipos, public.media
from anon, authenticated;
grant all on public.generos, public.directores, public.productoras, public.tipos, public.media to service_role;

insert into public.generos (nombre, descripcion) values
  ('Acción', 'Películas con secuencias de acción.'),
  ('Aventura', 'Historias de viajes, exploración y desafíos.'),
  ('Ciencia ficción', 'Historias basadas en ciencia, tecnología o futuros posibles.'),
  ('Drama', 'Historias centradas en conflictos humanos.'),
  ('Terror', 'Historias orientadas a provocar miedo o suspenso.');

insert into public.tipos (nombre, descripcion) values
  ('Película', 'Producción audiovisual de formato cinematográfico.'),
  ('Serie', 'Producción audiovisual organizada en episodios.');

commit;

