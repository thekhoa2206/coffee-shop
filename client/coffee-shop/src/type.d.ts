declare module "*.png";
declare module "*.svg";
declare module "*.svg?comp";
declare module "*.jpg";
declare module "*.gif";

declare namespace NodeJS {
  interface ProcessEnv {
    readonly PUBLIC_URL: string;
    readonly LOCALES_HASH: string;
  }
}

