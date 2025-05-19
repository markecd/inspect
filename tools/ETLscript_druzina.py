import pandas as pd
import sqlite3

df = pd.read_excel("../InspectData.xlsx")
conn = sqlite3.connect("../inspect.db")
cursor = conn.cursor()

red_mapping = {
    "H": "Hrošči",
    "K": "Kobilice",
    "M": "Metulji",
    "D": "Dvokrilci",
    "B": "Bogomolke",
    "KP": "Kačji pastirji",
    "KK": "Kožekrilci",
    "P": "Polkrilci"
}

cursor.execute("SELECT id, naziv_reda FROM RED")
red_id_map = {name: id for id,name in cursor.fetchall()}

druzina_groups = df[['druzina', 'red']].drop_duplicates()


for _, row in druzina_groups.iterrows():
    druzina_name = row['druzina']
    red_code = row['red']
    full_red_name = red_mapping.get(red_code)

    if full_red_name:
        red_id = red_id_map[full_red_name]
        cursor.execute("""
            INSERT OR IGNORE INTO DRUZINA (naziv_druzine, TK_RED)
            VALUES (?, ?)
        """, (druzina_name, red_id))


conn.commit()
print("✅ Inserted DRUZINA values with foreign keys")