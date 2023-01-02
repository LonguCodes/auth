import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addRoleToUser1671533643111 implements MigrationInterface {
  column = new TableColumn({
    name: 'roles',
    isArray: true,
    type: 'text',
    default: 'array[]::text[]',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('auth_user', this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('auth_user', this.column);
  }
}
