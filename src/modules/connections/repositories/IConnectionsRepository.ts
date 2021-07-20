import Connection from '@entitiesConnections/Connection';
import ICreateConnectionDTO from '@dtosConnections/ICreateConnectionDTO';

export default interface IConnectionsRepository {
  create(data: ICreateConnectionDTO): Promise<Connection>;
  findByUserId(user_id: string): Promise<Connection>;
  findByUserIdDesc(user_id: string): Promise<Connection>;
  findBySocketID(socket_id: string): Promise<Connection>;
  deleteAllConnections(user_id: string): Promise<void>;
}
