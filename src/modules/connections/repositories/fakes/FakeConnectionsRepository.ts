import { v4 as uuid } from 'uuid';

import Connection from '@entitiesConnections/Connection';
import ICreateConnectionDTO from '@dtosConnections/ICreateConnectionDTO';
import IConnectionsRepository from '@interfaceRepositoriesConnections/IConnectionsRepository';

export default class FakeConnectionsRepository
  implements IConnectionsRepository {
  private connections: Connection[] = [];

  public async create(
    connectionData: ICreateConnectionDTO,
  ): Promise<Connection> {
    const connection = new Connection();

    Object.assign(connection, { id: uuid() }, connectionData);

    this.connections.push(connection);

    return connection;
  }

  public async findByUserId(user_id: string): Promise<Connection> {
    const findConnection = this.connections.find(
      connection => connection.user_id === user_id,
    );

    return findConnection;
  }

  public async findByUserIdDesc(user_id: string): Promise<Connection> {
    const findConnection = this.connections.find(
      connection => connection.user_id === user_id,
    );

    return findConnection;
  }

  public async deleteAllConnections(user_id: string): Promise<void> {
    this.connections = this.connections.filter(
      connection => connection.user_id !== user_id,
    );
  }

  public async findBySocketID(socket_id: string): Promise<Connection> {
    const findConnection = this.connections.find(
      connection => connection.socket_id === socket_id,
    );

    return findConnection;
  }
}
