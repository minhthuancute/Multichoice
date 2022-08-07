export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  database: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQ_PORT, 10) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  jwt_key: process.env.JWT_KEY
});
