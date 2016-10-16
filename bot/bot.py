# coding=utf-8
import json
import logging
import random
import base64

import requests
import telegram
from pydub import AudioSegment
from telegram.ext import CommandHandler
from telegram.ext import MessageHandler, Filters
from telegram.ext import Updater

import texts
from microsoft_apis import search_images
from google_apis import voice_recognize


with open("keys.json") as inf:
    keys = json.load(inf)

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

updater = Updater(token=keys["telegram"])
bot = telegram.Bot(token=keys["telegram"])

states = {}

dispatcher = updater.dispatcher


def shorten_link(url):
    token = keys["linkShorten"]
    response = requests.post("https://www.googleapis.com/urlshortener/v1/url?key=" + token, json={"longUrl": url})
    return response.json()["id"]


continentsToCountries = {}
continentCodesToNames = {}

with open("countries.json", "r") as inf1:
    res = json.load(inf1)

    for code, name in res["continents"].items():
        continentsToCountries[name.lower()] = []
        continentCodesToNames[code] = name.lower()

    for country_code, info in res["countries"].items():
        cont = continentCodesToNames[info["continent"]]
        continentsToCountries[cont].append(info["name"].lower())

with open("countriesToCities.json", "r") as inf2:
    countries_to_cities = json.load(inf2)

new_countries_to_cities = {}
for key, val in countries_to_cities.items():
    new_countries_to_cities[key.lower()] = val

countries_to_cities = new_countries_to_cities

def start(bot, update):
    bot.sendMessage(chat_id=update.message.chat_id, text="I'm a bot, please talk to me!")


def find_dest_in_text(text):
    t = "all"

    dest = [cont for cont in continentsToCountries if cont in text]
    if dest:
        t = "continent"
    else:
        dest = [country for country in countries_to_cities if country in text and country]  # TODO maybe NLP
        if dest:
            t = "country"
    if dest:
        dest = dest[0]
    else:
        dest = None
    return dest, t


def find_city_in_text(chat_id, message):
    candidates = [city.lower() for (city, price) in states[chat_id]["city_prices"]]
    city = [candidate for candidate in candidates if candidate in message]
    if not city:
        city = states[chat_id]["last_city"]  # reuse
    else:
        city = city[0]

    states[chat_id]["last_city"] = city
    return city


def resolve_command(chat_id, message):
    message = message.strip().lower()
    if "flights" in message or "travel" in message or "go to" in message:
        return "destination_search", find_dest_in_text(message)

    if "tell me" in message or "sounds nice" in message or "what about" in message or ("show me" in message and not ("pic" in message or "photo" in message)):
        return "more_info", find_city_in_text(chat_id, message)

    if "pictures" in message or "images" in message or ("look like" in message and "what" in message) or "photos" in message or "pics" in message:
        # TODO more info on what?
        return "pictures", find_city_in_text(chat_id, message)

    if "book" in message:
        return "book", find_city_in_text(chat_id, message)

    if message == "thanks":
        return "bye", None


def speech_handler(bot, update):
    file_id = update.message.voice.file_id
    chat_id = update.message.chat_id
    newFile = bot.getFile(file_id)
    newFile.download('voice%s.ogg' % chat_id)
    ogg_file = AudioSegment.from_ogg('voice%s.ogg' % chat_id)
    ogg_file.export("voice%s.flac" % chat_id, format="flac")


    with open("voice%s.flac" % chat_id, 'rb') as speech:
        # Base64 encode the binary audio file for inclusion in the JSON
        # request.
        speech_content = base64.b64encode(speech.read())

    body = {
        'config': {
        #     # There are a bunch of config options you can specify. See
        #     # https://goo.gl/KPZn97 for the full list.
            'encoding': 'FLAC',  # raw 16-bit signed LE samples
            'sampleRate': 48000,  # 16 khz
        #     # See https://goo.gl/A9KJ1A for a list of supported languages.
            'languageCode': 'en-US',  # a BCP-47 language tag
        },
        'audio': {
            'content': speech_content.decode('UTF-8')
        }
    }

    update.message.text = voice_recognize(body)
    language_command_handler(bot, update)



def language_command_handler(bot, update):
    chat_id = update.message.chat_id
    text = update.message.text
    command, args = resolve_command(chat_id, text)
    if command == "destination_search":
        query_dest(bot, chat_id, *args)

    elif command == "more_info":
        query_yelp(bot, chat_id, args)

    elif command == "pictures":
        query_images(bot, chat_id, args)

    elif command == "book":
        book_flight(bot, chat_id, args)

    elif command == "bye":
        say_bye(bot, chat_id)


def say_bye(bot, chat_id):
    bot.sendMessage(chat_id=chat_id, text=random.choice(texts.bye))
    # states[chat_id] TODO reset?


def book_flight(bot, chat_id, city):
    res = requests.get("http://localhost:3000/bookingurl?from=Bremen&to={city}".format(city=city))
    bot.sendMessage(chat_id=chat_id, text=random.choice(texts.booking)(shorten_link(res.json()["url"])))


def query_dest(bot, chat_id, location, type):
    # TODO query skyscanner
    if not location:
        location = random.choice(list(continentsToCountries.keys()))
        bot.sendMessage(chat_id=chat_id, text=(u"Let's see what we can find in %s.." % location.capitalize()))
    res = requests.get("http://localhost:3000/destinations?from=Bremen&to={location}".format(location=location))

    city_prices = [(i["destination"]["CityName"], i.get("price", "??")) for i in res.json()]
    bot.sendMessage(chat_id=chat_id, text=random.choice(texts.destination_choice)(city_prices))
    states[chat_id] = {"last_action": "suggested", "city_prices": city_prices, "last_city": None}


def query_yelp(bot, chat_id, city):
    res = requests.get("http://localhost:3000/things?place={city}".format(city=city))
    bizzes = res.json()["businesses"]
    bot.sendMessage(chat_id=chat_id, text=random.choice(texts.yelp_into)(city.capitalize()))
    for idx, thing in list(enumerate(bizzes))[:5]:
        name = thing["name"]
        if idx == 0:
            text = random.choice(texts.yelp_place_first)(name)
        else:
            text = random.choice(texts.yelp_place_second)(name)

        text += (u" (Rating: %s. See %s.)" % (thing["rating"], shorten_link(thing["url"])))
        if "image_url" in thing and thing["image_url"]:
            # bot.sendPhoto(chat_id=chat_id, photo=thing["image_url"])
            bot.sendMessage(chat_id=chat_id, text=text)
        else:
            bot.sendMessage(chat_id=chat_id, text=text)


def query_images(bot, chat_id, city):
    urls = search_images(city + " photo")
    idxs = list(range(len(urls)))
    random.shuffle(idxs)
    bot.sendMessage(chat_id=chat_id, text="Here are some pictures of %s!" % city.capitalize())
    for idx in idxs[:min(len(idxs), int(random.random() * 9) + 1)]:
        bot.sendPhoto(chat_id=chat_id, photo=urls[idx])


def dont_know(bot, chat_id):
    bot.sendMessage(chat_id=chat_id, text="Sorry, I didn't understand that!")


# sendImage(bot, update.message.chat_id, "https://i.imgur.com/emxhXFm.jpg", u"was für 1 hackathon")
def sendImage(bot, chat_id, image_url, text=None):
    bot.sendPhoto(chat_id=chat_id, photo=image_url, caption=text)


def unknown(bot, update):
    bot.sendMessage(chat_id=update.message.chat_id, text="Sorry, I didn't understand that command.")

start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)

echo_handler = MessageHandler([Filters.text], language_command_handler)
dispatcher.add_handler(echo_handler)

talk_handler = MessageHandler([Filters.voice], speech_handler)
dispatcher.add_handler(talk_handler)

# MUST BE LAST
unknown_handler = MessageHandler([Filters.command], unknown)
dispatcher.add_handler(unknown_handler)

updater.start_polling()