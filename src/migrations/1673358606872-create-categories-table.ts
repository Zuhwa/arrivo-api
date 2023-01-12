import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCategoriesTable1673358606872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "categories" (
            id uuid DEFAULT uuid_generate_v4(),
            name varchar NOT NULL,
            description varchar NOT NULL,
            activated bool DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE,
            deleted_at TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY (id)
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
