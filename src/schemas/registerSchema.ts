import { Gender } from '@/types/gender.ts';
import { type ComposerTranslation } from 'vue-i18n';
import { z } from 'zod';

export const personalInformationSchema = (t: ComposerTranslation, noPesel: boolean) =>
    z
        .object({
            first_name: z
                .string()
                .min(1, {
                    message: t('validation.isRequired', {
                        field: t('field.firstName').toLowerCase(),
                    }),
                })
                .max(100, {
                    message: t('validation.maxLength', {
                        length: 100,
                    }),
                }),
            middle_name: z
                .string()
                .max(100, {
                    message: t('validation.maxLength', {
                        length: 100,
                    }),
                })
                .nullable()
                .optional(),
            last_name: z
                .string()
                .min(1, {
                    message: t('validation.isRequired', {
                        field: t('field.lastName').toLowerCase(),
                    }),
                })
                .max(100, {
                    message: t('validation.maxLength', {
                        length: 100,
                    }),
                }),
            date_of_birth: z.coerce
                .date({
                    message: t('validation.invalidDate'),
                })
                .max(new Date(new Date().setDate(new Date().getDate() - 1)), {
                    message: t('validation.invalidDate'),
                })
                .transform((val) => {
                    const year = val.getFullYear();
                    const month = String(val.getMonth() + 1).padStart(2, '0');
                    const day = String(val.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }),
            pesel: !noPesel
                ? z
                      .string({
                          message: t('validation.isRequired', {
                              field: t('field.pesel').toLowerCase(),
                          }),
                      })
                      .length(11, {
                          message: t('validation.invalidPesel'),
                      })
                : z.any(),
            document_number: noPesel
                ? z
                      .string({
                          message: t('validation.isRequired', {
                              field: t('field.otherDocument').toLowerCase(),
                          }),
                      })
                      .min(1, {
                          message: t('validation.isRequired', {
                              field: t('field.otherDocument').toLowerCase(),
                          }),
                      })
                      .max(30, {
                          message: t('validation.maxLength', {
                              length: 30,
                          }),
                      })
                : z.any(),
            gender: z.enum(Gender, {
                message: t('validation.invalidGender'),
            }),
        })
        .transform((data) => {
            const out = { ...data };

            if (noPesel) {
                delete out.pesel;
            } else {
                delete out.document_number;
            }

            if (!out.middle_name) {
                delete out.middle_name;
            }

            return out;
        });

export const addressSchema = (t: ComposerTranslation, isPoland: boolean, isDifferentMailing: boolean) =>
    z
        .object({
            country_id: z.number({
                message: t('validation.isRequired', {
                    field: t('field.country').toLowerCase(),
                }),
            }),
            voivodeship_id: isPoland
                ? z.number({
                      message: t('validation.isRequired', {
                          field: t('field.voivodeship').toLowerCase(),
                      }),
                  })
                : z.any().optional(),
            state: !isPoland
                ? z
                      .string({
                          message: t('validation.isRequired', {
                              field: t('field.state').toLowerCase(),
                          }),
                      })
                      .min(
                          1,
                          t('validation.isRequired', {
                              field: t('field.state').toLowerCase(),
                          }),
                      )
                      .max(255, {
                          message: t('validation.maxLength', { length: 255 }),
                      })
                : z.any().optional(),
            post_code: z
                .string()
                .min(1, {
                    message: t('validation.isRequired', {
                        field: t('field.postCode').toLowerCase(),
                    }),
                })
                .max(10, {
                    message: t('validation.maxLength', { length: 10 }),
                }),
            city: z
                .string()
                .min(1, {
                    message: t('validation.isRequired', {
                        field: t('field.city').toLowerCase(),
                    }),
                })
                .max(255, {
                    message: t('validation.maxLength', { length: 255 }),
                }),
            street: z
                .string()
                .min(1, {
                    message: t('validation.isRequired', {
                        field: t('field.street').toLowerCase(),
                    }),
                })
                .max(255, {
                    message: t('validation.maxLength', { length: 255 }),
                }),
            house_number: z
                .string()
                .min(1, {
                    message: t('validation.isRequired', {
                        field: t('field.houseNumber').toLowerCase(),
                    }),
                })
                .max(10, {
                    message: t('validation.maxLength', { length: 10 }),
                }),
            apartment_number: z
                .string()
                .max(10, {
                    message: t('validation.maxLength', { length: 10 }),
                })
                .optional(),
            post_office: z
                .string()
                .min(1, {
                    message: t('validation.isRequired', {
                        field: t('field.postOffice').toLowerCase(),
                    }),
                })
                .max(255, {
                    message: t('validation.maxLength', { length: 255 }),
                }),
            m_country_id: isDifferentMailing
                ? z.number({
                      message: t('validation.isRequired', {
                          field: t('field.country').toLowerCase(),
                      }),
                  })
                : z.any().nullable().optional(),
            m_voivodeship_id:
                isPoland && isDifferentMailing
                    ? z.number({
                          message: t('validation.isRequired', {
                              field: t('field.voivodeship').toLowerCase(),
                          }),
                      })
                    : z.any().nullable().optional(),
            m_state:
                !isPoland && isDifferentMailing
                    ? z
                          .string({
                              message: t('validation.isRequired', {
                                  field: t('field.state').toLowerCase(),
                              }),
                          })
                          .min(1, {
                              message: t('validation.isRequired', {
                                  field: t('field.state').toLowerCase(),
                              }),
                          })
                          .max(255, {
                              message: t('validation.maxLength', { length: 255 }),
                          })
                    : z.any().nullable().optional(),
            m_post_code: isDifferentMailing
                ? z
                      .string({
                          message: t('validation.isRequired', {
                              field: t('field.postCode').toLowerCase(),
                          }),
                      })
                      .min(1, {
                          message: t('validation.isRequired', {
                              field: t('field.postCode').toLowerCase(),
                          }),
                      })
                      .max(10, {
                          message: t('validation.maxLength', { length: 10 }),
                      })
                : z.any().nullable().optional(),
            m_city: isDifferentMailing
                ? z
                      .string({
                          message: t('validation.isRequired', {
                              field: t('field.city').toLowerCase(),
                          }),
                      })
                      .min(1, {
                          message: t('validation.isRequired', {
                              field: t('field.city').toLowerCase(),
                          }),
                      })
                      .max(255, {
                          message: t('validation.maxLength', { length: 255 }),
                      })
                : z.any().nullable().optional(),
            m_street: isDifferentMailing
                ? z
                      .string({
                          message: t('validation.isRequired', {
                              field: t('field.street').toLowerCase(),
                          }),
                      })
                      .min(1, {
                          message: t('validation.isRequired', {
                              field: t('field.street').toLowerCase(),
                          }),
                      })
                      .max(255, {
                          message: t('validation.maxLength', { length: 255 }),
                      })
                : z.any().nullable().optional(),
            m_house_number: isDifferentMailing
                ? z
                      .string({
                          message: t('validation.isRequired', {
                              field: t('field.houseNumber').toLowerCase(),
                          }),
                      })
                      .min(1, {
                          message: t('validation.isRequired', {
                              field: t('field.houseNumber').toLowerCase(),
                          }),
                      })
                      .max(10, {
                          message: t('validation.maxLength', { length: 10 }),
                      })
                : z.any().nullable().optional(),
            m_apartment_number: z
                .string()
                .max(10, {
                    message: t('validation.maxLength', { length: 10 }),
                })
                .nullable()
                .optional(),
            m_post_office: isDifferentMailing
                ? z
                      .string({
                          message: t('validation.isRequired', {
                              field: t('field.postOffice').toLowerCase(),
                          }),
                      })
                      .min(1, {
                          message: t('validation.isRequired', {
                              field: t('field.postOffice').toLowerCase(),
                          }),
                      })
                      .max(255, {
                          message: t('validation.maxLength', { length: 255 }),
                      })
                : z.any().nullable().optional(),
        })
        .transform((data) => {
            if (!isPoland) {
                data.voivodeship_id = null;
            } else {
                data.state = null;
            }

            if (!isDifferentMailing) {
                data.m_voivodeship_id = null;
                data.m_state = null;
                data.m_post_code = null;
                data.m_city = null;
                data.m_street = null;
                data.m_house_number = null;
                data.m_apartment_number = null;
                data.m_post_office = null;
            }

            return data;
        });

export const contactInformationSchema = (t: ComposerTranslation) =>
    z
        .object({
            email: z
                .email({
                    message: t('validation.invalidEmail'),
                })
                .min(1, {
                    message: t('validation.isRequired', {
                        field: t('field.email').toLowerCase(),
                    }),
                }),
            password: z.string().min(8, { message: t('validation.minLength', { length: 8 }) }),
            password_confirmation: z.string().min(1, {
                message: t('validation.isRequired', {
                    field: t('field.confirmPassword').toLowerCase(),
                }),
            }),
            phone_prefix: z.string().min(1, {
                message: t('validation.isRequired', {
                    field: t('field.phonePrefix').toLowerCase(),
                }),
            }),
            phone_number: z.string().min(1, {
                message: t('validation.isRequired', {
                    field: t('field.phone').toLowerCase(),
                }),
            }),
        })
        .refine((data) => data.password === data.password_confirmation, {
            message: t('validation.passwordNotMatch'),
            path: ['password_confirmation'],
        });
