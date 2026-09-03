-- Jalankan script ini sekali di Supabase SQL Editor.
-- Policy ini mendukung customer/order user login dan guest checkout.

alter table public.orders
  add column if not exists order_status text not null default 'pending';

-- Order history menyimpan snapshot nama dan harga, jadi referensi produk boleh
-- menjadi NULL setelah produk dihapus dari katalog.
alter table public.order_items
  drop constraint if exists order_items_product_or_custom_bouquet_id;

alter table public.order_items
  add constraint order_items_product_or_custom_bouquet_id
  check (
    product_id is not null
    or custom_bouquet_id is not null
    or product_name is not null
  );

-- Cart item adalah data sementara. Saat produk dihapus permanen, referensi
-- cart terkait ikut dibersihkan tanpa mengubah histori order.
alter table public.cart_items
  drop constraint if exists cart_items_product_id_fkey;

alter table public.cart_items
  add constraint cart_items_product_id_fkey
  foreign key (product_id) references public.products(id)
  on delete cascade;

create or replace function public.delete_product_as_admin(product_uuid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if (auth.jwt() -> 'app_metadata' ->> 'role') <> 'admin' then
    raise exception 'Only admins can delete products';
  end if;

  if exists (
    select 1
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where oi.product_id = product_uuid and o.order_status = 'pending'
  ) then
    raise exception 'Produk masih ada di pesanan pending. Gunakan Nonaktifkan.';
  end if;

  delete from public.cart_items where product_id = product_uuid;
  update public.order_items set product_id = null where product_id = product_uuid;
  delete from public.products where id = product_uuid;
end;
$$;

grant execute on function public.delete_product_as_admin(uuid) to authenticated;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select to public using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_insert" on storage.objects;
create policy "product_images_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.is_guest_customer(customer_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.customers
    where id = customer_uuid and user_id is null
  );
$$;

create or replace function public.is_guest_order(order_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    join public.customers c on c.id = o.customer_id
    where o.id = order_uuid and c.user_id is null
  );
$$;

grant execute on function public.is_guest_customer(uuid) to anon, authenticated;
grant execute on function public.is_guest_order(uuid) to anon, authenticated;

-- Set role admin dari Supabase Dashboard, contoh:
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where email = 'admin@example.com';

alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.cart_items enable row level security;

drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products
  for select to anon, authenticated using (is_active = true or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert" on public.products
  for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update" on public.products
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete" on public.products
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "cart_items_admin_delete" on public.cart_items;
create policy "cart_items_admin_delete" on public.cart_items
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "categories_admin_insert" on public.categories;
create policy "categories_admin_insert" on public.categories
  for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "categories_admin_update" on public.categories;
create policy "categories_admin_update" on public.categories
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "categories_admin_delete" on public.categories;
create policy "categories_admin_delete" on public.categories
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "customers_insert_own" on public.customers;
create policy "customers_insert_own" on public.customers
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "customers_select_own" on public.customers;
create policy "customers_select_own" on public.customers
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "customers_update_own" on public.customers;
create policy "customers_update_own" on public.customers
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "customers_insert_guest" on public.customers;
create policy "customers_insert_guest" on public.customers
  for insert to anon
  with check (user_id is null);

-- Dibutuhkan agar insert(...).select().single() di checkout guest dapat
-- mengembalikan ID customer yang baru dibuat.
drop policy if exists "customers_select_guest" on public.customers;
create policy "customers_select_guest" on public.customers
  for select to anon
  using (user_id is null);

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert to authenticated
  with check (
    exists (
      select 1 from public.customers c
      where c.id = customer_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select to authenticated
  using (
    exists (
      select 1 from public.customers c
      where c.id = customer_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "orders_update_own" on public.orders;
create policy "orders_update_own" on public.orders
  for update to authenticated
  using (
    exists (
      select 1 from public.customers c
      where c.id = customer_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.customers c
      where c.id = customer_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "orders_insert_guest" on public.orders;
create policy "orders_insert_guest" on public.orders
  for insert to anon
  with check (public.is_guest_customer(customer_id));

drop policy if exists "orders_select_guest" on public.orders;
create policy "orders_select_guest" on public.orders
  for select to anon
  using (public.is_guest_customer(customer_id));

drop policy if exists "order_items_insert_own" on public.order_items;
create policy "order_items_insert_own" on public.order_items
  for insert to authenticated
  with check (
    exists (
      select 1
      from public.orders o
      join public.customers c on c.id = o.customer_id
      where o.id = order_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own" on public.order_items
  for select to authenticated
  using (
    exists (
      select 1
      from public.orders o
      join public.customers c on c.id = o.customer_id
      where o.id = order_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_admin_select" on public.order_items;
create policy "order_items_admin_select" on public.order_items
  for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "order_items_admin_update" on public.order_items;
create policy "order_items_admin_update" on public.order_items
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "order_items_insert_guest" on public.order_items;
create policy "order_items_insert_guest" on public.order_items
  for insert to anon
  with check (public.is_guest_order(order_id));
