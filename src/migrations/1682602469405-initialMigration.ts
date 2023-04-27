import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1682602469405 implements MigrationInterface {
    name = 'initialMigration1682602469405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "user_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "status" "user_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "operation_id" uuid NOT NULL, "user_id" uuid NOT NULL, "amount" real NOT NULL, "user_balance" real NOT NULL, "operation_response" character varying NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e28cccb0d33870ac1f81f7a727" ON "record" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "operation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "cost" integer NOT NULL, CONSTRAINT "UQ_cd0195651a1f3814d39050c74f4" UNIQUE ("type"), CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cd0195651a1f3814d39050c74f" ON "operation" ("type") `);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_e28cccb0d33870ac1f81f7a727d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_dfb4a21d5021ce5c510d4855ed1" FOREIGN KEY ("operation_id") REFERENCES "operation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`INSERT INTO "operation" (type, cost) VALUES ('addition', 1000)`);
        await queryRunner.query(`INSERT INTO "operation" (type, cost) VALUES ('subtraction', 2000)`);
        await queryRunner.query(`INSERT INTO "operation" (type, cost) VALUES ('multiplication', 1400)`);
        await queryRunner.query(`INSERT INTO "operation" (type, cost) VALUES ('division', 700)`);
        await queryRunner.query(`INSERT INTO "operation" (type, cost) VALUES ('squareRoot', 900)`);
        await queryRunner.query(`INSERT INTO "operation" (type, cost) VALUES ('randomString', 1500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_dfb4a21d5021ce5c510d4855ed1"`);
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_e28cccb0d33870ac1f81f7a727d"`);
        await queryRunner.query(`DROP INDEX "IDX_cd0195651a1f3814d39050c74f"`);
        await queryRunner.query(`DROP TABLE "operation"`);
        await queryRunner.query(`DROP INDEX "IDX_e28cccb0d33870ac1f81f7a727"`);
        await queryRunner.query(`DROP TABLE "record"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_status_enum"`);
    }

}
