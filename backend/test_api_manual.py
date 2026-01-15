import requests

# We will need to have the server running. 
# Since I cannot spawn the server and run this script in the same immediate turn easily without background processes, 
# I will use this script structure for the user or subsequent steps.

url = "http://127.0.0.1:5000/api/calculate_fertilizer/rice"

# These should be valid file paths on the system
files = {
    'kaafi_image': open('d:/FYP/zerkhez/backend/images/kaafi.jpg', 'rb'),
    'aam_image': open('d:/FYP/zerkhez/backend/images/aam.jpg', 'rb')
}
data = {
    'variety': 'Super Basmati',
    'dat': '55'
}

response = requests.post(url, files=files, data=data)
print("Status Code:", response.status_code)
print("Response Text:", response.text)

# Only do this if response is JSON
if response.headers.get("Content-Type") == "application/json":
    print(response.json())
