export const REGEX_PHONE_NUMBER = /^[0-9 +-]{8,25}$/;
export const REGEX_PHONE_NUMBER_VN = /([84|0]+(3|5|7|8|9))+([0-9]{8})\b/;
export const REGEX_OLD_PHONE_NUMBER_VN = /([84|0]+(1))+([0-9]{9})\b/;
// eslint-disable-next-line no-useless-escape
export const REGEX_HTTP = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
export const REGEX_PHONE_NUMBER_ONCHANGE = /^[0-9 +-]{1,25}$/;
export const REGEX_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,15}$/i;
// eslint-disable-next-line no-useless-escape
export const REGEX_FAX = /^[0-9\(\)\ \-\+]{8,25}$/;
export const REGEX_UNICODE_CHARACTER = /^[a-zA-Z0-9!@#$%^&*)(+=._\-,' ]*$/;
export const REGEX_SPECIAL_CHARACTER = /^[a-zA-Z0-9!@#$%^&*)(+=._\- ]*$/;
export const IDNETITY_CARD = /^[0-9]{1,50}$/;
export const REGEX_URL_HTTPS = /https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i;

export const REGEX_PHONE_NUMBER_FACEBOOK = /([84]+(3|5|7|8|9))+([0-9]{9})\b/;

//regexAlphabetSe
export const REGEX_ALPHABET_SE = /^[0-9 | a-zA-Z]+$/i;
export const REGEX_NUMBER = /^[0-9]+$/;
export const REGEX_CODE = /^[a-zA-Z0-9]*$/;
export const REGEX_NOT_ALLOW_SPECIAL_CHARACTER = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
export const REGEX_IP_ADDRESS = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})$/;
export const REGEX_PHONE_NUMBER_SM = /^[0-9]{8,25}$/;
