import { ValidationArguments } from 'class-validator';

export const generateMessageInvalidLength = (
  validationArguments: ValidationArguments,
) => {
  const { property, constraints } = validationArguments;
  const [minLength, maxLength] = constraints;

  return `[ ${property} ]은(는) ${minLength}~${maxLength}자여야 합니다.`;
};
