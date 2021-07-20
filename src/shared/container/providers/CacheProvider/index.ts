import { container } from 'tsyringe';

import ICacheProvider from '@modelsCacheProvider/ICacheProvider';
import RedisCacheProvider from '@allCacheProvider/RedisCacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
