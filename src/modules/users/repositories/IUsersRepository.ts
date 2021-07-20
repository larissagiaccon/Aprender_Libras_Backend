import User from '@entitiesUsers/User';
import ICreateUserDTO from '@dtosUsers/ICreateUserDTO';
import IFindAllProvidersDTO from '@dtosUsers/IFindAllProvidersDTO';

export default interface IUsersRepository {
  save(user: User): Promise<User>;
  create(data: ICreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
  delete(id: string): Promise<void>;
}
