import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPaymentsTable1673359959406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "payments" (
                  id uuid DEFAULT uuid_generate_v4(),
                  user_id uuid NOT NULL,
                  ref_id varchar NOT NULL,
                  amount decimal NOT NULL,
                  status varchar NOT NULL,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                  updated_at TIMESTAMP WITH TIME ZONE,
                  PRIMARY KEY (id),
                  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) 
                );
                `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payments"`);
  }
}
