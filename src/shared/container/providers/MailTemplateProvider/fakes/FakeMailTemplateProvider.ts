import IMailTemplateProvider from '@modelsMailTemplateProvider/IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}
