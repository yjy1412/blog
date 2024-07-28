import { ValidationArguments } from 'class-validator';

export const generateMessageInvalidEmail = (
  validationArguments: ValidationArguments,
) => {
  const { property } = validationArguments;

  return `[ ${property} ]은(는) 이메일 형식이어야 합니다.`;
};
