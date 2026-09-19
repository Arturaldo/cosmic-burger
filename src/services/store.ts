import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { api } from '@services/api';
import { rootReducer } from '@services/root-reducer';

export const store = configureStore({
  reducer: rootReducer,
  // Усилитель RTK Query — через него проходят все действия, связанные с API.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
