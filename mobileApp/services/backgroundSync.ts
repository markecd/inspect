import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import NetInfo from '@react-native-community/netinfo';
import { syncData } from './syncService';
import { BackgroundFetchStatus } from 'expo-background-fetch';

const BACKGROUND_TASK_NAME = 'background-sync-task';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      console.log('[BackgroundFetch] Ni povezave.');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    console.log('[BackgroundFetch] Začenjam sinhronizacijo...');
    await syncData();
    console.log('[BackgroundFetch] Sinhronizacija uspešna.');

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error('[BackgroundFetch] Napaka pri sinhronizaciji:', err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundSync() {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);

    if (status === BackgroundFetchStatus.Available && !isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
        minimumInterval: 15 * 60, 
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('[BackgroundFetch] Registrirano!');
    } else if (isRegistered) {
      console.log('[BackgroundFetch] Že registrirano.');
    } else {
      console.warn('[BackgroundFetch] Ni na voljo:', status);
    }
  } catch (err) {
    console.error('[BackgroundFetch] Napaka pri registraciji:', err);
  }
}
