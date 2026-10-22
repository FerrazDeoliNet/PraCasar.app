# 💍 Planejamento de Casamento

App de planejamento com UI inspirada em **macOS 26 Tahoe (Liquid Glass)** + **Samsung One UI 9**, com sincronização em nuvem via **Supabase**.

## 🗂️ Estrutura

- `index.html` — shell do app
- `css/` — base, layout, componentes, views
- `js/` — config, estado, cloud, UI, views modulares
- ES Modules nativos (sem bundler)

## ⚙️ Setup do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute:

```sql
create table public.wedding_data (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz default now()
);

alter table public.wedding_data enable row level security;

create policy "public read"   on public.wedding_data for select using (true);
create policy "public write"  on public.wedding_data for insert with check (true);
create policy "public update" on public.wedding_data for update using (true);
create policy "public delete" on public.wedding_data for delete using (true);