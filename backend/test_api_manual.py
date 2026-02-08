import requests

# url = "https://zerkhez-backend.onrender.com/api/calculate_fertilizer/rice"
url = "http://13.220.97.126:5000/api/calculate_fertilizer/rice"
# or if testing locally:
# url = "http://127.0.0.1:5000/api/calculate_fertilizer/rice"

files = {
    "kaafi_image": ("kaafi.jpg", open("d:/FYP/zerkhez/backend/images/kaafi.jpg", "rb"), "image/jpeg"),
    "aam_image": ("aam.jpg", open("d:/FYP/zerkhez/backend/images/aam.jpg", "rb"), "image/jpeg"),
}

data = {
    "variety": "Super Basmati",
    "dat": "55"
}

try:
    response = requests.post(url, files=files, data=data, timeout=100)

    print("Status Code:", response.status_code)
    print("Headers:", response.headers)
    print("Raw Response:", response.text)

    # Safely try JSON
    try:
        print("JSON Response:", response.json())
    except ValueError:
        print("Response is not JSON")

except requests.exceptions.RequestException as e:
    print("Request failed:", e)

finally:
    # Close files
    files["kaafi_image"][1].close()
    files["aam_image"][1].close()
