import subprocess

ids_file = "ids.txt" 

with open(ids_file, "r") as f:
    ids = [line.strip() for line in f if line.strip()]

for taxon_id in ids:
    print(f"Scraping images for taxon_key: {taxon_id}")
    subprocess.run(["python", "imageScraper.py", taxon_id])
