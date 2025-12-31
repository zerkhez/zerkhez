import requests

# We will need to have the server running. 
# Since I cannot spawn the server and run this script in the same immediate turn easily without background processes, 
# I will use this script structure for the user or subsequent steps.

url = "http://127.0.0.1:5000/calculate_fertilizer"

# These should be valid file paths on the system
files = {
    'kaafi_image': open('d:/FYP/zerkhez_backend/test_kaafi.jpg', 'rb'),
    'aam_image': open('d:/FYP/zerkhez_backend/test_aam.jpg', 'rb')
}
data = {
    'variety': 'Super Basmati',
    'dat': '45'
}

response = requests.post(url, files=files, data=data)
print(response.json())
