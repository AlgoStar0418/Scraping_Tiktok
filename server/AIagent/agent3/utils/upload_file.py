import requests

API_KEY = "M2KRRSS-PEEMJDV-NY3MF2A-KQVZ1BQ"

def run(file_name):
    endpoint = f"https://app.ayrshare.com/api/media/uploadUrl?fileName={file_name}&contentType=png"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
    }

    response = requests.get(endpoint, headers=headers)

    if response.status_code != 200:
        print(f"Request error: {response.status_code}")
        return

    json_data = response.json()
    print("Upload URL:", json_data)

    with open(file_name, 'rb') as file:
        file_data = file.read()

    headers = {
        "Content-Type": json_data["contentType"],
    }

    response = requests.put(json_data["uploadUrl"], headers=headers, data=file_data)

    if response.status_code != 200:
        print("Upload error:", response.status_code)
    else:
        print(response.text)
