import { createAction } from '@reduxjs/toolkit';

/**
 * Экшен выхода из системы. Живёт в отдельном файле, чтобы его мог диспатчить
 * `api.ts` при неудачном обновлении токена — без циклической зависимости
 * между слайсом пользователя и описанием API.
 */
export const userLoggedOut = createAction('user/loggedOut');
