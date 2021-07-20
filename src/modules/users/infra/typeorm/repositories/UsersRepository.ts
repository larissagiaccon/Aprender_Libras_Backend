import { getRepository, Not, Repository } from 'typeorm';

import User from '@entitiesUsers/User';
import ICreateUserDTO from '@dtosUsers/ICreateUserDTO';
import IFindAllProvidersDTO from '@dtosUsers/IFindAllProvidersDTO';
import IUsersRepository from '@interfaceRepositoriesUsers/IUsersRepository';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async delete(user_id: string): Promise<void> {
    await this.ormRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where({ id: user_id })
      .execute();
  }
}

export default UsersRepository;
