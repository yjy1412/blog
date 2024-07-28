import { ValidationArguments } from 'class-validator';

export const generateMessageInvalidNumberType = (
  validationArguments: ValidationArguments,
) => {
  const { property } = validationArguments;

  return `[ ${property} ]은(는) 숫자여야 합니다.`;
};
