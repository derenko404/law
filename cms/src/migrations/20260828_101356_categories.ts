import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "articles" ADD COLUMN "category_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_category_id" integer;
  ALTER TABLE "cases" ADD COLUMN "category_id" integer;
  ALTER TABLE "_cases_v" ADD COLUMN "version_category_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  CREATE UNIQUE INDEX "categories_title_idx" ON "categories" USING btree ("title");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cases_v" ADD CONSTRAINT "_cases_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "_articles_v_version_version_category_idx" ON "_articles_v" USING btree ("version_category_id");
  CREATE INDEX "cases_category_idx" ON "cases" USING btree ("category_id");
  CREATE INDEX "_cases_v_version_version_category_idx" ON "_cases_v" USING btree ("version_category_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");

  -- Seed initial categories and remap the old free-text values (including
  -- pre-rename "…право" spellings still present in version history).
  INSERT INTO "categories" ("title", "slug", "order") VALUES
    ('Кримінальні справи', 'kryminalni-spravy', 0),
    ('Митні справи', 'mytni-spravy', 1),
    ('Адміністративні справи', 'administratyvni-spravy', 2),
    ('Цивільні справи', 'tsyvilni-spravy', 3),
    ('Сімейні справи', 'simeyni-spravy', 4),
    ('Земельні справи', 'zemelni-spravy', 5),
    ('Трудові справи', 'trudovi-spravy', 6),
    ('Військові справи', 'viyskovi-spravy', 7),
    ('Обслуговування бізнесу', 'obsluhovuvannya-biznesu', 8);

  UPDATE "articles" t SET "category_id" = c."id" FROM "categories" c
    WHERE c."title" = CASE t."category"
      WHEN 'Кримінальне право' THEN 'Кримінальні справи'
      WHEN 'Митне право' THEN 'Митні справи'
      WHEN 'Митне право та міграційні спори' THEN 'Митні справи'
      WHEN 'Адміністративне право' THEN 'Адміністративні справи'
      WHEN 'Адміністративні правопорушення' THEN 'Адміністративні справи'
      WHEN 'Цивільне право' THEN 'Цивільні справи'
      WHEN 'Сімейне право' THEN 'Сімейні справи'
      WHEN 'Земельне право' THEN 'Земельні справи'
      WHEN 'Трудове право' THEN 'Трудові справи'
      WHEN 'Військове право' THEN 'Військові справи'
      ELSE t."category" END;
  UPDATE "_articles_v" t SET "version_category_id" = c."id" FROM "categories" c
    WHERE c."title" = CASE t."version_category"
      WHEN 'Кримінальне право' THEN 'Кримінальні справи'
      WHEN 'Митне право' THEN 'Митні справи'
      WHEN 'Митне право та міграційні спори' THEN 'Митні справи'
      WHEN 'Адміністративне право' THEN 'Адміністративні справи'
      WHEN 'Адміністративні правопорушення' THEN 'Адміністративні справи'
      WHEN 'Цивільне право' THEN 'Цивільні справи'
      WHEN 'Сімейне право' THEN 'Сімейні справи'
      WHEN 'Земельне право' THEN 'Земельні справи'
      WHEN 'Трудове право' THEN 'Трудові справи'
      WHEN 'Військове право' THEN 'Військові справи'
      ELSE t."version_category" END;
  UPDATE "cases" t SET "category_id" = c."id" FROM "categories" c
    WHERE c."title" = CASE t."category"
      WHEN 'Кримінальне право' THEN 'Кримінальні справи'
      WHEN 'Митне право' THEN 'Митні справи'
      WHEN 'Митне право та міграційні спори' THEN 'Митні справи'
      WHEN 'Адміністративне право' THEN 'Адміністративні справи'
      WHEN 'Адміністративні правопорушення' THEN 'Адміністративні справи'
      WHEN 'Цивільне право' THEN 'Цивільні справи'
      WHEN 'Сімейне право' THEN 'Сімейні справи'
      WHEN 'Земельне право' THEN 'Земельні справи'
      WHEN 'Трудове право' THEN 'Трудові справи'
      WHEN 'Військове право' THEN 'Військові справи'
      ELSE t."category" END;
  UPDATE "_cases_v" t SET "version_category_id" = c."id" FROM "categories" c
    WHERE c."title" = CASE t."version_category"
      WHEN 'Кримінальне право' THEN 'Кримінальні справи'
      WHEN 'Митне право' THEN 'Митні справи'
      WHEN 'Митне право та міграційні спори' THEN 'Митні справи'
      WHEN 'Адміністративне право' THEN 'Адміністративні справи'
      WHEN 'Адміністративні правопорушення' THEN 'Адміністративні справи'
      WHEN 'Цивільне право' THEN 'Цивільні справи'
      WHEN 'Сімейне право' THEN 'Сімейні справи'
      WHEN 'Земельне право' THEN 'Земельні справи'
      WHEN 'Трудове право' THEN 'Трудові справи'
      WHEN 'Військове право' THEN 'Військові справи'
      ELSE t."version_category" END;

  ALTER TABLE "articles" DROP COLUMN "category";
  ALTER TABLE "_articles_v" DROP COLUMN "version_category";
  ALTER TABLE "cases" DROP COLUMN "category";
  ALTER TABLE "_cases_v" DROP COLUMN "version_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "categories" CASCADE;
  ALTER TABLE "articles" DROP CONSTRAINT "articles_category_id_categories_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_category_id_categories_id_fk";
  
  ALTER TABLE "cases" DROP CONSTRAINT "cases_category_id_categories_id_fk";
  
  ALTER TABLE "_cases_v" DROP CONSTRAINT "_cases_v_version_category_id_categories_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_categories_fk";
  
  DROP INDEX "articles_category_idx";
  DROP INDEX "_articles_v_version_version_category_idx";
  DROP INDEX "cases_category_idx";
  DROP INDEX "_cases_v_version_version_category_idx";
  DROP INDEX "payload_locked_documents_rels_categories_id_idx";
  ALTER TABLE "articles" ADD COLUMN "category" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_category" varchar;
  ALTER TABLE "cases" ADD COLUMN "category" varchar;
  ALTER TABLE "_cases_v" ADD COLUMN "version_category" varchar;
  UPDATE "articles" t SET "category" = c."title" FROM "categories" c WHERE t."category_id" = c."id";
  UPDATE "_articles_v" t SET "version_category" = c."title" FROM "categories" c WHERE t."version_category_id" = c."id";
  UPDATE "cases" t SET "category" = c."title" FROM "categories" c WHERE t."category_id" = c."id";
  UPDATE "_cases_v" t SET "version_category" = c."title" FROM "categories" c WHERE t."version_category_id" = c."id";
  ALTER TABLE "articles" DROP COLUMN "category_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_category_id";
  ALTER TABLE "cases" DROP COLUMN "category_id";
  ALTER TABLE "_cases_v" DROP COLUMN "version_category_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";`)
}
