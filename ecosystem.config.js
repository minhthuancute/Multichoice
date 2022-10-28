module.exports = {
  apps: [
    {
      name: 'multichoice-fe',
      script: 'serve',
      instances: 'max',
      env: {
        PM2_SERVE_PATH: 'dist/apps/multichoice/frontend',
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
        NODE_ENV: 'production',
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
        MYSQL_PASSWORD: 'password123',
        MYSQL_DATABASE: 'multichoice',
        JWT_KEY: 'ixfBMEgQWfKTjBLNoLa3',
        TOKEN_EXPIRED: '1d',
        UPLOAD_LOCATION: '',
        MAX_FILE_SIZE: '',
        NODE_ENV: 'production',
        APIKEY: 'AIzaSyDn0gyUmlxHUSJUPf-e3pxdARWojvtfBYM',
        AUTHDOMAIN: 'multichoice-9ee7a.firebaseapp.com',
        DATABASEURL: 'https://multichoice-9ee7a-default-rtdb.asia-southeast1.firebasedatabase.app',
        PROJECTID: 'multichoice-9ee7a',
        STORAGEBUCKET: 'multichoice-9ee7a.appspot.com',
        MESSAGINGSENDERID: '196861086410',
        APPID: '1:196861086410:web:6978c1d1d9caf409918233',
        MEASUREMENTID: 'G-LEYHV2FEX8'
      },
    },
  ],
};
