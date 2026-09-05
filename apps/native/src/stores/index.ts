import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthStore } from '@8848digital/catalyst';

export const useAuthStore = createAuthStore(AsyncStorage);
