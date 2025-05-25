import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const dbName = 'inspect.db';
const dbPath = `${FileSystem.documentDirectory}${dbName}`;
let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (dbInstance) return dbInstance;

    const fileExists = await FileSystem.getInfoAsync(dbPath);

    if (!fileExists.exists) {
        console.log("📦 Copying preloaded DB from assets...");
        const asset = Asset.fromModule(require('../assets/inspect.db'));
        await asset.downloadAsync();
        await FileSystem.copyAsync({
        from: asset.localUri!,
        to: dbPath,
        });
    } else {
        console.log("✅ Database already exists, not copying again.");
    }

    dbInstance = SQLite.openDatabaseSync(dbPath);
    return dbInstance;
}
