import 'reflect-metadata';
import { container } from 'tsyringe';

import CreateConnectionService from '@servicesConnections/CreateConnectionService';
import DeleteConnectionService from '@servicesConnections/DeleteConnectionService';
import FindByUserDescConnectionService from '@servicesConnections/FindByUserDescConnectionService';
import FindBySocketConnectionService from '@servicesConnections/FindBySocketConnectionService';
import CreateMessageService from '@servicesMessages/CreateMessageService';
import ListByUserService from '@servicesMessages/ListByUserService';
import ListAllLastMessagesByUserService from '@servicesMessages/ListAllLastMessagesByUserService';

import { toDate } from 'date-fns';
import { io } from '../http';

interface INotification {
  id: string;
  count: number;
}

interface IConnection {
  id: string;
  user_id: string;
  provider_id: string;
  socket_id: string;
}

interface IRequest {
  user_name: string;
  user_id: string;
  provider_id: string;
  text: string;
}

interface ICall {
  userIdFromCall: string;
  userNameFromCall: string;
  userSocketFromCall: string;
  userIdToCall: string;
  signal: string;
  message: string;
}

interface IReceived {
  to: string;
  from: string;
  message: string;
}

interface IAnswer {
  to: string;
  from: string;
  signal: string;
  message: string;
}

interface IEnd {
  to: string;
  from: string;
  message: string;
}

interface ILeave {
  to: string;
  from: string;
}

interface ISocket {
  socket_id: string;
  user_id: string;
}

let sockets: ISocket[] = [];

io.on('connect', socket => {
  const createConnection = container.resolve(CreateConnectionService);
  const deleteAllConnections = container.resolve(DeleteConnectionService);
  const findByUserDescConnection = container.resolve(
    FindByUserDescConnectionService,
  );
  const findBySocketConnectionService = container.resolve(
    FindBySocketConnectionService,
  );

  const socket_id = socket.id;
  const createMessage = container.resolve(CreateMessageService);
  const listMessagesByUser = container.resolve(ListByUserService);
  const listAllLastMessagesByUser = container.resolve(
    ListAllLastMessagesByUserService,
  );

  let providersNewMessage: INotification[] = [];
  let userMessages: INotification[] = [];

  console.log(`Socket conectado: ${socket.id} ${new Date()}`);

  socket.emit('me', socket_id);

  socket.on('showLastMessages', async user_id => {
    try {
      if (user_id) {
        const lastMessages = await listAllLastMessagesByUser.execute(user_id);
        socket.emit('lastMessages', lastMessages);
      }
    } catch (error) {
      console.log('Socket showLastMessages: ', error);
    }
  });

  socket.on('verifiedUserReadMessages', async (provider_id: string) => {
    try {
      const updatedProvidersNewMessage: INotification[] = providersNewMessage.map(
        not => {
          if (not.id === provider_id) {
            return {
              id: not.id,
              count: 0,
            };
          }
          return {
            ...not,
          };
        },
      );

      providersNewMessage = updatedProvidersNewMessage;
    } catch (error) {
      console.log('Socket verifiedUserReadMessages: ', error);
    }
  });

  socket.on('userReadMessages', async ({ user_id, provider_id }: IRequest) => {
    try {
      const connectionProvider = await findByUserDescConnection.execute(
        provider_id,
      );

      if (connectionProvider) {
        io.to(connectionProvider.socket_id).emit(
          'verifiedUserReadMessages',
          user_id,
        );
      }

      // const updatedUserMessages: INotification[] = userMessages.map(not => {
      //   if (not.id === provider_id) {
      //     return {
      //       id: not.id,
      //       count: 0,
      //     };
      //   }
      //   return {
      //     ...not,
      //   };
      // });

      const updatedUserMessages: INotification[] = userMessages.filter(
        not => not.id !== provider_id,
      );

      userMessages = updatedUserMessages;

      const sumMessages = userMessages.reduce((acumulador, valorAtual) => {
        return acumulador + valorAtual.count;
      }, 0);

      let total: string;
      if (sumMessages === 0) {
        total = '';
      } else if (sumMessages <= 10) {
        total = String(sumMessages);
      } else {
        total = '10+';
      }

      socket.emit('teste', userMessages, total);
    } catch (error) {
      console.log('Socket userReadMessages: ', error);
    }
  });

  socket.on(
    'userReceivedMessages',
    async (providerId: string, count: number) => {
      try {
        const findProvider = userMessages.find(prov => prov.id === providerId);

        if (!findProvider) {
          const newData = {
            id: providerId,
            count,
          };

          userMessages.push(newData);
        } else {
          const updatedProviders: INotification[] = userMessages.map(not => {
            if (not.id === providerId) {
              return {
                id: not.id,
                count,
              };
            }
            return {
              ...not,
            };
          });

          userMessages = updatedProviders;
        }
        console.log(userMessages);
        const formatted: INotification[] = userMessages.filter((msg1, i) => {
          return !userMessages.some((msg2, j) => j < i && msg1.id === msg2.id);
        });

        const sumMessages = userMessages.reduce((acumulador, valorAtual) => {
          return acumulador + valorAtual.count;
        }, 0);

        let total: string;
        if (sumMessages === 0) {
          total = '';
        } else if (sumMessages <= 10) {
          total = String(sumMessages);
        } else {
          total = '10+';
        }

        socket.emit('teste', formatted, total);
      } catch (error) {
        console.log('Socket userReceivedMessages: ', error);
      }
    },
  );

  socket.on('userConnected', async (data: IRequest) => {
    try {
      const { user_name, user_id, text } = data as IRequest;
      let { provider_id } = data as IRequest;

      if (!provider_id) {
        provider_id = null;
      }

      const findSocket = sockets.find(skt => skt.socket_id === socket.id);
      const findUser = sockets.find(skt => skt.user_id === user_id);

      if (!findSocket && !findUser) {
        sockets.push({ socket_id, user_id });
        // console.log(sockets);
      }

      socket.broadcast.emit('users', sockets);
      socket.emit('users', sockets);

      const connection = await findByUserDescConnection.execute(user_id);

      if (!connection && user_id) {
        await createConnection.execute({
          user_id,
          provider_id,
          socket_id,
        });
      } else if (!connection && user_id && provider_id) {
        await createConnection.execute({
          user_id,
          provider_id,
          socket_id,
        });
      } else if (connection && user_id) {
        await deleteAllConnections.execute(user_id);

        await createConnection.execute({
          user_id,
          provider_id,
          socket_id,
        });
      } else if (connection && user_id && provider_id) {
        await deleteAllConnections.execute(user_id);

        await createConnection.execute({
          user_id,
          provider_id,
          socket_id,
        });
      }

      let connectionProvider: IConnection;

      if (provider_id) {
        connectionProvider = await findByUserDescConnection.execute(
          provider_id,
        );
      }

      if (user_id && provider_id && text) {
        await createMessage.execute({
          user_id,
          provider_id,
          text,
        });

        let findNotification = providersNewMessage.find(
          not => not.id === provider_id,
        );

        if (!findNotification) {
          const newData = {
            id: provider_id,
            count: 1,
          };

          providersNewMessage.push(newData);
        } else if (
          findNotification &&
          connectionProvider.provider_id !== user_id
        ) {
          const updatedProvidersNewMessage: INotification[] = providersNewMessage.map(
            not => {
              if (not.id === provider_id) {
                return {
                  id: not.id,
                  count: not.count + 1,
                };
              }
              return {
                ...not,
              };
            },
          );
          providersNewMessage = updatedProvidersNewMessage;

          findNotification = providersNewMessage.find(
            not => not.id === provider_id,
          );
        }

        if (connectionProvider && connectionProvider.provider_id !== user_id) {
          // console.log(
          //   'newMessage',
          //   connectionProvider?.socket_id,
          //   user_name,
          //   user_id,
          //   findNotification?.count || 1,
          //   text,
          // );
          socket
            .to(connectionProvider?.socket_id)
            .emit(
              'newMessage',
              user_name,
              user_id,
              findNotification?.count || 1,
              text,
            );
        }
      }
      // console.log(`${user_id} - UserSocket: ${connection?.socket_id}`);
      // console.log(
      //   `${provider_id} - ProviderSocket: ${connectionProvider?.socket_id}`,
      // );

      const lastMessages = await listAllLastMessagesByUser.execute(user_id);
      socket.emit('lastMessages', lastMessages);

      const allMessages = await listMessagesByUser.execute(
        user_id,
        provider_id,
      );

      socket.emit('allMessages', allMessages);

      if (connectionProvider && connectionProvider.provider_id === user_id) {
        socket
          .to(connectionProvider?.socket_id)
          .emit('receiveMessages', allMessages);

        const updatedProvidersNewMessage: INotification[] = providersNewMessage.map(
          not => {
            if (not.id === provider_id) {
              return {
                id: not.id,
                count: 0,
              };
            }
            return {
              ...not,
            };
          },
        );
        providersNewMessage = updatedProvidersNewMessage;
      }
    } catch (error) {
      console.log('Socket userConnected: ', error);
    }
  });

  socket.on('callUser', async (data: ICall) => {
    try {
      const {
        userIdFromCall,
        userSocketFromCall,
        userNameFromCall,
        userIdToCall,
        signal,
        message,
      } = data;

      const connectionProvider = await findByUserDescConnection.execute(
        userIdToCall,
      );

      const findProvider = sockets.find(skt => skt.user_id === userIdToCall);

      if (findProvider) {
        console.log('Call - socketFrom: ', userSocketFromCall);
        console.log('Call - socketTo: ', connectionProvider.socket_id);

        const userSocketToCall = connectionProvider.socket_id;
        io.to(connectionProvider.socket_id).emit('callUser', {
          signal,
          userIdFromCall,
          userSocketFromCall,
          userNameFromCall,
          userSocketToCall,
          message,
        });
      } else {
        io.to(userSocketFromCall).emit('userDisconnected', message);
      }
    } catch (error) {
      console.log('Socket callUser: ', error);
    }
  });

  socket.on('callAccepted', async (data: IAnswer) => {
    try {
      const { to, signal, from, message } = data;

      const connectionProvider = await findByUserDescConnection.execute(to);

      if (connectionProvider) {
        console.log('CallAccepted - socketFrom: ', from);
        console.log('CallAccepted - socketTo: ', connectionProvider.socket_id);

        io.to(connectionProvider.socket_id).emit('callAccepted', {
          signal,
          message,
        });
      }
    } catch (error) {
      console.log('Socket answerCall: ', error);
    }
  });

  socket.on('receivedCall', async (data: IReceived) => {
    try {
      const { to, from, message } = data;

      const connectionProvider = await findByUserDescConnection.execute(to);

      if (connectionProvider) {
        console.log('Received - socketFrom:', from);
        console.log('Received - socketTo:', connectionProvider.socket_id);

        io.to(connectionProvider.socket_id).emit('receivedCall', message);
      }
    } catch (error) {
      console.log('Socket receivedCall: ', error);
    }
  });

  socket.on('endCall', async (data: IEnd) => {
    try {
      const { to, from, message } = data;

      const connectionProvider = await findByUserDescConnection.execute(to);

      if (connectionProvider) {
        console.log('End - socketFrom:', from);
        console.log('End - socketTo:', connectionProvider.socket_id);

        io.to(connectionProvider.socket_id).emit('endCall', message);
      }
    } catch (error) {
      console.log('Socket endCall: ', error);
    }
  });

  socket.on('leaveCall', async (data: ILeave) => {
    try {
      const { to, from } = data;

      const connectionProvider = await findByUserDescConnection.execute(to);

      if (connectionProvider) {
        console.log('Leave - socketFrom:', from);
        console.log('Leave - socketTo:', connectionProvider.socket_id);

        io.to(connectionProvider.socket_id).emit('leaveCall');
      }
    } catch (error) {
      console.log('Socket leaveCall: ', error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      sockets = sockets.filter(skt => skt.socket_id !== socket.id);

      const connection = await findBySocketConnectionService.execute(socket.id);

      if (connection) {
        await deleteAllConnections.execute(connection.user_id);

        console.log(`Socket desconectado: ${socket.id} ${new Date()}`);
        // console.log(sockets);
        socket.broadcast.emit('users', sockets);
        io.to(socket.id).emit('disconnected');
      }
    } catch (error) {
      console.log('Socket disconnect: ', error);
    }
  });
});
