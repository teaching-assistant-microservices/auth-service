import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  HOST: string;
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SYNCHRONIZE: boolean;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    HOST: joi.string().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_SYNCHRONIZE: joi.boolean().default(false),
    JWT_ACCESS_EXPIRES_IN: joi.string().default('1h'),
    JWT_REFRESH_EXPIRES_IN: joi.string().default('7d'),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  host: envVars.HOST,
  nodeEnv: envVars.NODE_ENV,
  database: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    synchronize: envVars.DB_SYNCHRONIZE,
  },
  jwt: {
    accessTokenExpiresIn: envVars.JWT_ACCESS_EXPIRES_IN,
    refreshTokenExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
  },
};
