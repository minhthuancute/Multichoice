export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  database: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQ_PORT, 10) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  jwt_key: process.env.JWT_KEY,
  token_expired: process.env.TOKEN_EXPIRED,
  upload_location: process.env.UPLOAD_LOCATION,
  max_file_size: process.env.MAX_FILE_SIZE,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  mail: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
  },
  FE_APP_URL: process.env.FE_APP_URL,
});
