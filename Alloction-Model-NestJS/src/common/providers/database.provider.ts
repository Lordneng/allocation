import { ConnectionOptions, createConnection } from 'typeorm';

const options: ConnectionOptions = {
  name: 'default',
  type: 'mssql',
  host: process.env.DATABASE_HOST || 'ptt-alomod-d01.ptt.corp',
  username: process.env.DATABASE_USERNAME || 'useralodev',
  password: process.env.DATABASE_PASSWORD || 'nFt4Dq38',
  database: process.env.DATABASE_DATABASE || 'ALO_DEV_DB',
  cache: true,
  entities: [__dirname + '/../../**/entity/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
  connectionTimeout: 30000,
  extra: {
    trustServerCertificate: true,
  },
  // migrationsTableName: '__MigrationHistory',
  // migrations: ['src/server/common/data/migrations/**{.js,.ts}'],
  // cli: {
  //     migrationsDir: 'src/server/common/data/migrations'
  // }
};

export const optionsdbSmartPrices: ConnectionOptions = {
  name: 'db_smartprices',
  type: 'mssql',
  host: process.env.SMART_DATABASE_HOST || 'ptt-smpdb-t01.ptt.corp',
  username: process.env.SMART_DATABASE_USERNAME || 'smpreadview',
  password: process.env.SMART_DATABASE_PASSWORD || 'csmpreadview',
  database: process.env.SMART_DATABASE_DATABASE || 'smp_bi_tst',
  cache: true,
  logging: false,
  extra: {
    trustServerCertificate: true,
  },
  // migrationsTableName: '__MigrationHistory',
  // migrations: ['src/server/common/data/migrations/**{.js,.ts}'],
  // cli: {
  //     migrationsDir: 'src/server/common/data/migrations'
  // }
};

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async () => await createConnection(options),
  },
];

export const connectiondbSmartPrices = createConnection(optionsdbSmartPrices);
