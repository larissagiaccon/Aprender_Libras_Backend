export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    // TODO ALTERAR TEMPO DE EXPIRAÇÃO DO TOKEN
    expiresIn: 60 * 60 * 24,
    // expiresIn: '1d',
    // TODO COLOCAR 3H PARA O REFRESH TOKEN
    timeToRefresh: 50,
    // timeToRefresh: '3h',
  },
};
