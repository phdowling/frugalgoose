# coding=utf-8
import logging
import json
import uuid
import requests

with open("keys.json") as inf:
    keys = json.load(inf)

app_id = 'D4D52672-91D7-4C74-8AD8-42B1D98141A5'
instance_id = "503180ba-9334-11e6-9824-b8e8560bf588"

logger = logging.getLogger(__name__)


def search_images(query):
    headers = {
        # Request headers
        'Ocp-Apim-Subscription-Key': keys["bingImages"],
    }
    params = {
        # Request parameters
        'q': query,
        'count': '10',
        'offset': '0',
        'mkt': 'en-us',
        'safeSearch': 'Moderate',
    }
    try:
        response = requests.get('https://api.cognitive.microsoft.com/bing/v5.0/images/search', params=params, headers=headers)
        # conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
        # conn.request("GET", "/bing/v5.0/images/search?%s" % params, "{body}", headers)
        # response = conn.getresponse()
        res = response.json()
        # res = json.loads(data)
        # conn.close()
    except Exception as e:
        logger.exception("what")
        return []
    all_images = []
    for image_data in res["value"]:
        all_images.append(image_data["contentUrl"])
    return all_images