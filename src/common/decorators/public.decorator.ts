import { SetMetadata } from '@nestjs/common';

import { METADATA_IS_PUBLIC_KEY } from '../constants/metadata.constant';

export const Public = () => SetMetadata(METADATA_IS_PUBLIC_KEY, true);
