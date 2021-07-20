import ISendMailDTO from '@dtosMailProvider/ISendMailDTO';

export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
