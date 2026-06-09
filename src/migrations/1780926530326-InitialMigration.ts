import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1780926530326 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {}

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
