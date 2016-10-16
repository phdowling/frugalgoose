# coding=utf-8
import logging
import httplib
import json
import urllib
import uuid
import requests

with open("keys.json") as inf:
    keys = json.load(inf)

app_id = 'D4D52672-91D7-4C74-8AD8-42B1D98141A5'
instance_id = "503180ba-9334-11e6-9824-b8e8560bf588"

logger = logging.getLogger(__name__)


speech_key = keys["bingSpeech"]


def voice_recognize(filename):
    headers = {
        # Request headers
        'Ocp-Apim-Subscription-Key': keys["bingVoiceKey"],
    }

    res = requests.post("https://api.cognitive.microsoft.com/sts/v1.0/issueToken", headers=headers)

    headers = {
        # Request headers
        'Authorization': 'Bearer %s' % res.content,
        "Content-Type": "audio/pcm; codec=”audio/pcm”; samplerate=8000; sourcerate=8000; trustsourcerate=false"
    }

    params = urllib.urlencode({
        # Request parameters
        'Version': "3.0",
        'requestid': str(uuid.uuid1()),
        "appid": app_id,
        "format": "json",
        "locale": "en-US",
        "device.os": "Android",
        "scenarios": "ulm",
        "instanceid": instance_id
    })


    try:
        inf = open(filename, "rb")
        res = requests.post(url='https://speech.platform.bing.com/recognize?%s' % params,
                                data=inf.read(),
                                headers=headers)
        inf.close()
        #conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
        #conn.request("POST", "/recognize?%s" % params, headers)
        #response = conn.getresponse()
        #data = response.read()
        #conn.close()
        jsonn = res.json()
        return jsonn
    except Exception as e:
        logger.exception("what")
        return []



def search_images(query):
    headers = {
        # Request headers
        'Ocp-Apim-Subscription-Key': keys["bingImages"],
    }
    params = urllib.urlencode({
        # Request parameters
        'q': query,
        'count': '10',
        'offset': '0',
        'mkt': 'en-us',
        'safeSearch': 'Moderate',
    })
    try:
        conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
        conn.request("GET", "/bing/v5.0/images/search?%s" % params, "{body}", headers)
        response = conn.getresponse()
        data = response.read()
        res = json.loads(data)
        conn.close()
    except Exception as e:
        logger.exception("what")
        return []
    all_images = []
    for image_data in res["value"]:
        all_images.append(image_data["contentUrl"])
    return all_images