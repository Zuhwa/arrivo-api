import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1673350488185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" (
            id uuid DEFAULT uuid_generate_v4(),
            email varchar NOT NULL UNIQUE,
            full_name varchar NOT NULL,
            membership varchar NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY (id)
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
