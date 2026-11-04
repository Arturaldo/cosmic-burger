import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@utils/constants';

/** Сохраняет cookie на указанное время (в секундах). */
export const setCookie = (name: string, value: string, maxAge: number): void => {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/`;
};

/** Возвращает значение cookie или undefined, если cookie не найдена. */
export const getCookie = (name: string): string | undefined => {
  const cookie = document.cookie
    .split('; ')
    .find((item): boolean => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined;
};

/** Удаляет cookie. */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; max-age=0; path=/`;
};

/** Сохраняет пару токенов после успешного входа или регистрации. */
export const saveAuthTokens = (accessToken: string, refreshToken: string): void => {
  // accessToken живёт около 20 минут, refreshToken сервер выдаёт на более долгий срок.
  setCookie(ACCESS_TOKEN_COOKIE, accessToken, 1200);
  setCookie(REFRESH_TOKEN_COOKIE, refreshToken, 2_592_000);
};

/** Удаляет оба токена — используется при выходе из системы. */
export const clearAuthCookies = (): void => {
  deleteCookie(ACCESS_TOKEN_COOKIE);
  deleteCookie(REFRESH_TOKEN_COOKIE);
};
