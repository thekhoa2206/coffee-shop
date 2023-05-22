import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import withI18nDebugger from "./i18nDebugger";

let localesHash = process.env.LOCALES_HASH;

let loadPath = `/v3/locales/${localesHash}/{{lng}}/{{ns}}.json`;

if (process.env.NODE_ENV === "production") {
  loadPath = `${process.env.REACT_APP_CDN_URL}locales/${localesHash}/{{lng}}/{{ns}}.json`;
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["cookie", "querystring"],
      lookupCookie: "lang",
    },
    fallbackLng: "vi",
    debug: false,
    supportedLngs: ["th", "vi"],
    ns: [
      "analytics",
      "component",
      "menu",
      "common",
      "error",
      "onboarding",
      "notfound",
      "theme",
      "utilities",
      "dashboard",
      "customer",
      "customerGroup",
      "product",
      "composites",
      "variant",
      "packsize",
      "category",
      "lotsDate",
      "orderReturn",
      "order",
      "einvoice",
      "action_log",
      "shipment",
      "tenant",
      "tenant_setting",
      "location",
      "accounts",
      "tenant_roles",
      "receiptVoucher",
      "paymentVoucher",
      "loyalty",
      "purchase_order",
      "stockTransfer",
      "serial",
      "reports",
      "settings",
      "setting",
      "tenant"
    ],
    backend: {
      // backend: Http,
      loadPath: loadPath,
      // backendOption: {
      //   loadPath: "/v3/locales/{{lng}}/{{ns}}.json",
      // },
    },
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default withI18nDebugger(i18n, process.env.REACT_APP_NAME, "public/locales/{{lng}}/{{ns}}.json");
