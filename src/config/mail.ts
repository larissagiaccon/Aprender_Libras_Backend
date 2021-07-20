interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };

  template: 'handlebars';
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'equipe@aprenderlibras.com.br',
      name: 'Equipe Aprender Libras',
    },
  },

  template: 'handlebars',
} as IMailConfig;
