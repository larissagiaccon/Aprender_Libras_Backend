import { getRepository, Repository } from 'typeorm';

import Connection from '@entitiesConnections/Connection';
import ICreateConnectionDTO from '@dtosConnections/ICreateConnectionDTO';
import IConnectionsRepository from '@interfaceRepositoriesConnections/IConnectionsRepository';

export default class ConnectionsRepository implements IConnectionsRepository {
  private ormRepository: Repository<Connection>;

  constructor() {
    this.ormRepository = getRepository(Connection);
  }

  public async create(
    connectionData: ICreateConnectionDTO,
  ): Promise<Connection> {
    const connection = this.ormRepository.create(connectionData);

    await this.ormRepository.save(connection);

    return connection;
  }

  public async findByUserId(user_id: string): Promise<Connection> {
    const connection = await this.ormRepository.findOne({
      user_id,
    });

    return connection;
  }

  public async findByUserIdDesc(user_id: string): Promise<Connection> {
    const connection = await this.ormRepository
      .createQueryBuilder()
      .orderBy('created_at', 'DESC')
      .where({ user_id })
      .getOne();

    return connection;
  }

  public async deleteAllConnections(user_id: string): Promise<void> {
    await this.ormRepository
      .createQueryBuilder()
      .delete()
      .from(Connection)
      .where({ user_id })
      .execute();
  }

  public async findBySocketID(socket_id: string): Promise<Connection> {
    const connection = await this.ormRepository.findOne({
      socket_id,
    });

    return connection;
  }
}
