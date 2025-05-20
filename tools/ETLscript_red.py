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

unique_redi = df['red'].map(red_mapping).dropna().unique()

for red_name in unique_redi:
    cursor.execute("""
        INSERT OR IGNORE INTO RED (naziv_reda)
        VALUES (?)
    """, (red_name,))

conn.commit()
conn.close()

print("✅ RED values inserted successfully.")