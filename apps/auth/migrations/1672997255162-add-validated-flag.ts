import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addValidatedFlag1672997255162 implements MigrationInterface {
  column = new TableColumn({
    name: 'validated',
    type: 'boolean',
    default: 'true',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('auth_user', this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('auth_user', this.column);
  }
}
