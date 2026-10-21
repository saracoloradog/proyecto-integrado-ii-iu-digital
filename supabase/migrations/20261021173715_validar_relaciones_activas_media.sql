begin;

create function public.validar_relaciones_activas_media()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.generos where id = new.genero_id and estado = true
  ) then
    raise exception using errcode = '23514', message = 'El género seleccionado no existe o está inactivo';
  end if;

  if not exists (
    select 1 from public.directores where id = new.director_id and estado = true
  ) then
    raise exception using errcode = '23514', message = 'El director seleccionado no existe o está inactivo';
  end if;

  if not exists (
    select 1 from public.productoras where id = new.productora_id and estado = true
  ) then
    raise exception using errcode = '23514', message = 'La productora seleccionada no existe o está inactiva';
  end if;

  if not exists (select 1 from public.tipos where id = new.tipo_id) then
    raise exception using errcode = '23514', message = 'El tipo seleccionado no existe';
  end if;

  return new;
end;
$$;

create trigger media_validar_relaciones_activas
before insert or update of genero_id, director_id, productora_id, tipo_id
on public.media
for each row execute function public.validar_relaciones_activas_media();

revoke execute on function public.validar_relaciones_activas_media() from public, anon, authenticated;

commit;

