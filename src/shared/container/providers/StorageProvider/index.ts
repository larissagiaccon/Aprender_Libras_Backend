import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from '@modelsStorageProvider/IStorageProvider';
import DiskStorageProvider from '@allStorageProvider/DiskStorageProvider';
import S3StorageProvider from '@allStorageProvider/S3StorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
