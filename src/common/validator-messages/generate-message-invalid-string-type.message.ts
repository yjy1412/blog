import { ValidationArguments } from 'class-validator';

export const generateMessageInvalidStringType = (
  validationArguments: ValidationArguments,
) => {
  const { property } = validationArguments;

  return `[ ${property} ]은(는) 문자열이어야 합니다.`;
};
