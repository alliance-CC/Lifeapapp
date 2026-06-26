-- ============================================================
-- ライフアップ専用アプリ: profiles テーブル & 初回登録者=manager
-- Supabase ダッシュボード > SQL Editor で実行してください
-- ============================================================

-- 1. profiles テーブル
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL DEFAULT '',
  email       TEXT        NOT NULL DEFAULT '',
  role        TEXT        NOT NULL DEFAULT 'general'
                          CHECK (role IN ('manager', 'leader', 'general')),
  department  TEXT        NOT NULL DEFAULT '',
  job_type    TEXT        NOT NULL DEFAULT '',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーは全員のプロフィールを読める（ランキング表示等に必要）
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- 自分自身のプロフィールは更新可（ただしroleは変更不可）
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- 3. 新規登録時に自動でprofileを作成するトリガー
--    最初の登録者(profiles行ゼロ)は manager、以降は general
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count  INT;
  assign_role TEXT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  assign_role := CASE WHEN user_count = 0 THEN 'manager' ELSE 'general' END;

  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    assign_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. updated_at を自動更新するトリガー
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
