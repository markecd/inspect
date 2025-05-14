from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import sys
import requests
import os
from bs4 import BeautifulSoup

def download_gbif_images(taxon_key, max_images=500, download_path=r"C:\Users\muric\OneDrive\Dokumenti\FAKS\2. semester 3. letnik\PROJEKT\ImagesDataset"):
    url = f"https://www.gbif.org/occurrence/gallery?taxon_key={taxon_key}"
    
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=options)
    driver.get(url)
    time.sleep(2)
    
    last_count = 0
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        
        try:
            load_more = driver.find_element(By.CSS_SELECTOR, "div[ng-click='occGallery.loadMore()']")
            load_more.click()
            time.sleep(2)
        except:
            print("Ni več gumba 'Load more' ali ni več slik.")
            break

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        images = soup.find_all("img")
        images = [img for img in images if "api.gbif.org/v1/image/cache" in img.get("src", "")]
        if len(images) >= max_images or len(images) == last_count:
            break
        last_count = len(images)

    soup = BeautifulSoup(driver.page_source, 'html.parser')
    images = soup.find_all("img")
    images = [img for img in images if "api.gbif.org/v1/image/cache" in img.get("src", "")]
    print(f"Najdenih slik: {len(images)}")
    
    save_dir = os.path.join(download_path, str(taxon_key))
    os.makedirs(save_dir, exist_ok=True)

    for i, img in enumerate(images[:max_images]):
        img_url = img['src']
        if img_url.startswith("//"):
            img_url = "https:" + img_url
        try:
            r = requests.get(img_url, timeout=10)
            with open(os.path.join(save_dir, f"{i+1}.jpg"), 'wb') as f:
                f.write(r.content)
        except Exception as e:
            print(f"Napaka pri prenosu {img_url}: {e}")

    driver.quit()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uporaba: python imageScraper.py <taxon_key>")
        sys.exit(1)

    taxon_key = sys.argv[1]
    download_gbif_images(taxon_key)