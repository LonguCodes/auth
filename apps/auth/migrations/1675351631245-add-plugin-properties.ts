import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addPluginProperties1675351631245 implements MigrationInterface {
  googleIdColumn = new TableColumn({
    name: 'google_id',
    type: 'varchar',
    default: null,
    isNullable: true,
  });

  pluginPropertiesColumn = new TableColumn({
    name: 'plugin_properties',
    type: 'jsonb',
    default: "'{}'",
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('auth_user', this.googleIdColumn);
    await queryRunner.addColumn('auth_user', this.pluginPropertiesColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('auth_user', this.pluginPropertiesColumn);
    await queryRunner.addColumn('auth_user', this.googleIdColumn);
  }
}
