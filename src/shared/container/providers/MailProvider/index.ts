import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from '@modelsMailProvider/IMailProvider';
import EtherealMailProvider from '@allMailProvider/EtherealMailProvider';
import SESMailProvider from '@allMailProvider/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
