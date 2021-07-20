import { container } from 'tsyringe';

import IHashProvider from '@modelsHashProvidersUsers/IHashProvider';
import BCryptHashProvider from '@allHashProvidersUsers/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
