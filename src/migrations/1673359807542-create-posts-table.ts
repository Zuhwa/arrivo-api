import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPostsTable1673359807542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "posts" (
                id uuid DEFAULT uuid_generate_v4(),
                category_id uuid NOT NULL,
                title varchar NOT NULL,
                body varchar NOT NULL,
                status varchar NOT NULL,
                label varchar NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                updated_at TIMESTAMP WITH TIME ZONE,
                PRIMARY KEY (id),
                CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES categories (id)
            );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
