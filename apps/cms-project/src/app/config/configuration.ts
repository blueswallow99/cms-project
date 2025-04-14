export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'cms_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'jwt_secret_key',
    expiresIn: '1d',
  },
});
