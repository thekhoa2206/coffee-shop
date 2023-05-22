import i18n from "i18n";
import { isNil } from "lodash";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";

export function Error(e: any, enqueueSnackbar?: any) {
  let message = `Có lỗi xảy ra`;
  try {
    if (typeof e === "string") {
      message = e;
    } else if (e.request.status === 422) {
      try {
        const fieldErrors = e.response.request.response.data_error.errors;
        message = Object.keys(fieldErrors)
          .map((key) => (isNil(key) || key.trim().length === 0 ? fieldErrors[key] : `${key} : ${fieldErrors[key]}`))
          .join(" , ");
      } catch (e) {}
    } else if (e.response.status === 404) {
      const fieldErrors = e.response.request.response.error;
      message = Object.keys(fieldErrors)
        .map((key) => (isNil(key) || key.trim().length === 0 ? fieldErrors[key] : `${key} : ${fieldErrors[key]}`))
        .join(" , ");
    } else if (e.request.status === 403 || e.request.status === 401) {
      message = `Bạn không có quyền truy cập chức năng này`;
    }
  } catch (e) {}
  return SnackbarUtils.error(message);
}

export function getMessageError(e: any) {
  let message = `Có lỗi xảy ra`;
  try {
    if (typeof e === "string") {
      message = e;
    } else if (e.request.status === 422) {
      try {
        const fieldErrors = e.response.request.response.data_error.errors;
        message = Object.keys(fieldErrors)
          .map((key) => (isNil(key) || key.trim().length === 0 ? fieldErrors[key] : `${key} : ${fieldErrors[key]}`))
          .join(" , ");
      } catch (e) {}
    } else if (e.response.status === 404) {
      const fieldErrors = e.response.request.response.error;
      message = Object.keys(fieldErrors)
        .map((key) => (isNil(key) || key.trim().length === 0 ? fieldErrors[key] : `${key} : ${fieldErrors[key]}`))
        .join(" , ");
    } else if (e.request.status === 403 || e.request.status === 401) {
      message = `Bạn không có quyền truy cập chức năng này`;
    } else if (e.response.status === 500) {
      message = e.response.data.error.message;
    }
  } catch (e) {}
  return message;
}
export function getErrorMessage(e: any, messageDefault?: string) {
  let message = messageDefault ? messageDefault : `${i18n.t(`error:error.errorCommon`)}`;
  try {
    if (typeof e === "string") {
      message = e;
    } else if (e.request.status === 422) {
      try {
        const fieldErrors = e.response.request.response.data_error.errors;
        message = Object.keys(fieldErrors)
          .map((key) => (isNil(key) || key.trim().length === 0 ? fieldErrors[key] : `${fieldErrors[key]}`))
          .join(" , ");
      } catch (e) {}
    } else if (e.response.status === 404) {
      const fieldErrors = e.response.request.response.error;
      message = Object.keys(fieldErrors)
        .map((key) => (isNil(key) || key.trim().length === 0 ? fieldErrors[key] : `${fieldErrors[key]}`))
        .join(" , ");
    } else if (e.request.status === 403 || e.request.status === 401) {
      message = `${i18n.t(`error:error.notHaveAccess`)}`;
    } else if (e.response.status === 500) {
      message = e.response.data.error.message;
    }
  } catch (e) {}
  return message;
}
export function getMessageErrorNotKey(e: any) {
  let message = `${i18n.t(`error:error.errorCommon`)}`;
  try {
    if (typeof e === "string") {
      message = e;
    } else if (e.request.status === 422) {
      try {
        const fieldErrors = e.response.request.response.data_error.errors;
        message = Object.keys(fieldErrors)
          .map((key) => (isNil(key) || key.trim().length === 0 ? fieldErrors[key] : `${fieldErrors[key]}`))
          .join(" , ");
      } catch (e) {}
    } else if (e.response.status === 404) {
      const fieldErrors = e.response.request.response.error;
      message = Object.keys(fieldErrors)
        .map((key) => (isNil(key) || key.trim().length === 0 ? fieldErrors[key] : `${fieldErrors[key]}`))
        .join(" , ");
    } else if (e.request.status === 403 || e.request.status === 401) {
      message = `${i18n.t(`error:error.notHaveAccess`)}`;
    } else if (e.response.status === 500) {
      message = e.response.data.error.message;
    }
  } catch (e) {}
  return message;
}

