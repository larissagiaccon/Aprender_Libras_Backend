import IMailProvider from '@modelsMailProvider/IMailProvider';
import ISendMailDTO from '@dtosMailProvider/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}
