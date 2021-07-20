import IParseMailTemplateDTO from '@dtosMailTemplateProvider/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
