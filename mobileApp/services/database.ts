import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const dbName = 'inspect.db';
const dbPath = `${FileSystem.documentDirectory}${dbName}`;
let dbInstance: SQLite.SQLiteDatabase | null = null;
let initializing = false;
let waiters: ((db: SQLite.SQLiteDatabase) => void)[] = [];

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (dbInstance) return dbInstance;

      if (initializing) {
    return new Promise((resolve) => waiters.push(resolve));
  }
  initializing = true;

  try {
    const fileExists = await FileSystem.getInfoAsync(dbPath);
    if (!fileExists.exists) {
      console.log("Copying preloaded DB from assets...");
      const asset = Asset.fromModule(require('../assets/inspect.db'));
      await asset.downloadAsync();
      await FileSystem.copyAsync({
        from: asset.localUri!,
        to: dbPath,
      });
    } else {
      console.log("Database already exists, not copying again.");
    }

    dbInstance = SQLite.openDatabaseSync(dbPath);
    console.log("Database initialized");

    waiters.forEach((resolve) => resolve(dbInstance!));
    waiters = [];

    return dbInstance;
  } catch (err) {
    console.error("Error initializing database", err);
    throw err;
  } finally {
    initializing = false;
  }
}