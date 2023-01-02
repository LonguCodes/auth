import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class addUserTable1650789675317 implements MigrationInterface {
  table = new Table({
    name: 'auth_user',
    columns: [
      new TableColumn({
        type: 'varchar',
        name: 'id',
        isPrimary: true,
        default: 'uuid_generate_v4()',
      }),
      new TableColumn({
        type: 'varchar',
        name: 'email',
      }),
      new TableColumn({
        type: 'varchar',
        name: 'password',
        isNullable: true,
        default: null,
      }),
      new TableColumn({
        name: 'google_id',
        type: 'varchar',
        default: null,
        isNullable: true,
      }),
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
