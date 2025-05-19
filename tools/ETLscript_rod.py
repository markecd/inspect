import pandas as pd
import sqlite3

df = pd.read_excel("../InspectData.xlsx")
conn = sqlite3.connect("../inspect.db")
cursor = conn.cursor()



cursor.execute("SELECT id, naziv_druzine FROM DRUZINA")
druzina_id_map = {name: id for id,name in cursor.fetchall()}


for _, row in df.iterrows():
    if pd.isna(row['druzina']):
        print(f"⚠️ Skipping row with missing DRUZINA: {row['id']}")
        continue

    rod_id = row['id']
    rod_name = row['rod']
    rod_latinic = row['latinski_naziv']
    rod_opis = row['opis']
    rod_nahajalisce = row['nahajalisce']
    druzina_id = druzina_id_map[row['druzina']]

    cursor.execute("""
        INSERT OR IGNORE INTO ROD (id, naziv_rodu, latinski_naziv_rodu, opis_rodu, nahajalisce_rodu, TK_DRUZINA)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (rod_id, rod_name, rod_latinic, rod_opis, rod_nahajalisce, druzina_id))


conn.commit()
print("✅ Inserted ROD values with foreign keys")