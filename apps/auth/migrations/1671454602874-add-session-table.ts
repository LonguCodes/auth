import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class addSessionTable1671454602874 implements MigrationInterface {
  table = new Table({
    name: 'auth_session',
    columns: [
      new TableColumn({
        type: 'varchar',
        name: 'id',
        isPrimary: true,
        default: 'uuid_generate_v4()',
      }),
      new TableColumn({
        name: 'user_id',
        type: 'varchar',
      }),
    ],
    foreignKeys: [
      new TableForeignKey({
        name: 'user_session_user_id',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'auth_user',
      }),
    ],
    indices: [
      new TableIndex({
        name: 'idx_session_user_id',
        columnNames: ['user_id'],
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
