import sqlite3
import pandas as pd


df = pd.read_excel("C:/PROJEKT/InspectProjekt/InspectApp/achievements.xlsx")

conn = sqlite3.connect("C:/PROJEKT/InspectProjekt/InspectApp/mobileApp/assets/inspect.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS DOSEZEK (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naziv TEXT NOT NULL,
    opis TEXT NOT NULL,
    xp_vrednost INTEGER NOT NULL
);
""")

for _, row in df.iterrows():
    cursor.execute("""
        INSERT OR IGNORE INTO DOSEZEK (naziv, opis, xp_vrednost)
        VALUES (?, ?, ?)
    """, (row["naziv"], row["opis"], row["xp_vrednost"]))


conn.commit()
conn.close()

print("✅ Dosežki uspešno vstavljeni v tabelo DOSEZEK.")
