import { inject, injectable } from 'tsyringe';

import Connection from '@entitiesConnections/Connection';
import IConnectionsRepository from '@interfaceRepositoriesConnections/IConnectionsRepository';

@injectable()
export default class FindBySocketConnectionService {
  constructor(
    @inject('ConnectionsRepository')
    private connectionsRepository: IConnectionsRepository,
  ) {}

  public async execute(socket_id: string): Promise<Connection> {
    const findSocket = await this.connectionsRepository.findBySocketID(
      socket_id,
    );

    return findSocket;
  }
}
