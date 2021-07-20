import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailTemplateProvider from '@modelsMailTemplateProvider/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@allMailTemplateProvider/HandlebarsMailTemplateProvider';

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers[mailConfig.template],
);
