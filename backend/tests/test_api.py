import requests
import os
import sys

# Add backend directory to path if needed, though this is a client script
# interacting with the running server.

BASE_URL = "http://127.0.0.1:5000/api"

def test_rice_calculation():
    print("Testing Rice Calculation...")
    url = f"{BASE_URL}/calculate_fertilizer/rice"
    
    # Adjust paths to where the images are located
    # Assuming running from backend/tests or root
    kaafi_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_images', 'kaafi.jpg')
    aam_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_images', 'aam.jpg')
    
    if not os.path.exists(kaafi_path):
        print(f"Error: Image not found at {kaafi_path}")
        return

    files = {
        'kaafi_image': open(kaafi_path, 'rb'),
        'aam_image': open(aam_path, 'rb')
    }
    data = {
        'variety': 'Super Basmati',
        'dat': '55'
    }
    
    try:
        response = requests.post(url, files=files, data=data)
        print("Status Code:", response.status_code)
        if response.status_code == 200:
            print("Response:", response.json())
        else:
            print("Error Response:", response.text)
    except Exception as e:
        print(f"Request failed: {e}")
    finally:
        files['kaafi_image'].close()
        files['aam_image'].close()

def test_wheat_calculation():
    print("\nTesting Wheat Calculation...")
    url = f"{BASE_URL}/calculate_fertilizer/wheat"
    
    kaafi_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_images', 'kaafi.jpg')
    aam_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_images', 'aam.jpg')

    files = {
        'kaafi_image': open(kaafi_path, 'rb'),
        'aam_image': open(aam_path, 'rb')
    }
    data = {
        'variety': 'Galaxy-13', # Variety just for record in Wheat
        'dat': '90' # DAS passed as dat
    }
    
    try:
        response = requests.post(url, files=files, data=data)
        print("Status Code:", response.status_code)
        if response.status_code == 200:
            print("Response:", response.json())
        else:
            print("Error Response:", response.text)
    except Exception as e:
        print(f"Request failed: {e}")
    finally:
        files['kaafi_image'].close()
        files['aam_image'].close()

if __name__ == "__main__":
    test_rice_calculation()
    test_wheat_calculation()
