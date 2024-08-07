import { ValidationArguments } from 'class-validator';

export const generateMessageInvalidLength = (
  validationArguments: ValidationArguments,
) => {
  const { property, constraints } = validationArguments;
  const [minLength, maxLength] = constraints;

  return `[ ${property} ]은(는) ${minLength}~${maxLength}자여야 합니다.`;
};

export const generateMessageInvalidNumberType = (
  validationArguments: ValidationArguments,
) => {
  const { property } = validationArguments;

  return `[ ${property} ]은(는) 숫자여야 합니다.`;
};

export const generateMessageInvalidStringType = (
  validationArguments: ValidationArguments,
) => {
  const { property } = validationArguments;

  return `[ ${property} ]은(는) 문자열이어야 합니다.`;
};

export const generateMessageInvalidEmail = (
  validationArguments: ValidationArguments,
) => {
  const { property } = validationArguments;

  return `[ ${property} ]은(는) 이메일 형식이어야 합니다.`;
};

export const generateMessageNotIncludedEnumValue = (
  validationArguments: ValidationArguments,
) => {
  const { property, constraints } = validationArguments;

  return `[ ${property} ]은(는) ${constraints} 중 하나여야 합니다.`;
};
