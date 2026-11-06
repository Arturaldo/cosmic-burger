import { useDispatch, useSelector } from 'react-redux';

import type { TRootState } from '@services/root-reducer';
import type { TAppDispatch } from '@services/store';

export const useAppDispatch = useDispatch.withTypes<TAppDispatch>();
export const useAppSelector = useSelector.withTypes<TRootState>();
