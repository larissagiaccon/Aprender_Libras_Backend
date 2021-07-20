import { inject, injectable } from 'tsyringe';

import Connection from '@entitiesConnections/Connection';
import IConnectionsRepository from '@interfaceRepositoriesConnections/IConnectionsRepository';
import ICreateConnectionDTO from '@dtosConnections/ICreateConnectionDTO';

@injectable()
export default class CreateConnectionService {
  constructor(
    @inject('ConnectionsRepository')
    private connectionsRepository: IConnectionsRepository,
  ) {}

  public async execute({
    user_id,
    socket_id,
    provider_id,
  }: ICreateConnectionDTO): Promise<Connection> {
    const connection = this.connectionsRepository.create({
      user_id,
      provider_id,
      socket_id,
    });

    return connection;
  }
}
