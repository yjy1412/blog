import { join } from 'path';

/**
 * 폴더명 상수
 */
export const PUBLIC_FOLDER_NAME = 'public';
export const PUBLIC_TEMP_FOLDER_NAME = 'temp';
export const PUBLIC_IMAGE_FOLDER_NAME = 'images';
export const PUBLIC_IMAGE_POST_FOLDER_NAME = 'posts';

/**
 * 경로 상수
 */
export const PROJECT_ROOT_PATH = process.cwd();
export const PUBLIC_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);
export const PUBLIC_TEMP_PATH = join(PUBLIC_PATH, PUBLIC_TEMP_FOLDER_NAME);
export const PUBLIC_IMAGE_PATH = join(PUBLIC_PATH, PUBLIC_IMAGE_FOLDER_NAME);
export const PUBLIC_IMAGE_POST_PATH = join(
  PUBLIC_IMAGE_FOLDER_NAME,
  PUBLIC_IMAGE_POST_FOLDER_NAME,
);
