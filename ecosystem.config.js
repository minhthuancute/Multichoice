module.exports = {
  apps: [
    {
      name: 'multichoice-fe',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: 'dist/apps/multichoice/frontend',
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
      },
    },
    {
      name: 'multichoice-be',
      script: 'dist/apps/multichoice/backend/main.js',
      exec_mode: 'cluster',
      instances: 'max',
      env: {
        PORT: '3333',
        MYSQL_HOST: 'localhost',
        MYSQL_PORT: '3306',
        MYSQL_USER: 'root',
        MYSQL_PASSWORD: '24EN4SPVSrTdyjS4hYrx',
        MYSQL_DATABASE: 'multichoice',
        JWT_KEY: 'ixfBMEgQWfKTjBLNoLa3',
        TOKEN_EXPIRED: '1d',
        UPLOAD_LOCATION: '',
        MAX_FILE_SIZE: '',
      },
    },
  ],
};
