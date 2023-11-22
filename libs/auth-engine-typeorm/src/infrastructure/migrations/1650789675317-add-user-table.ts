import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class addUserTable1650789675317 implements MigrationInterface {
  table = new Table({
    name: 'user',
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
        name: 'claims',
        type: 'jsonb',
        default: "'{}'",
      }),
      new TableColumn({
        name: 'validated',
        type: 'boolean',
        default: 'true',
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
