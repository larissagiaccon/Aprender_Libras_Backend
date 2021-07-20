import { inject, injectable } from 'tsyringe';

import IConnectionsRepository from '@interfaceRepositoriesConnections/IConnectionsRepository';

@injectable()
export default class DeleteConnectionService {
  constructor(
    @inject('ConnectionsRepository')
    private connectionsRepository: IConnectionsRepository,
  ) {}

  public async execute(user_id: string): Promise<void> {
    this.connectionsRepository.deleteAllConnections(user_id);
  }
}
