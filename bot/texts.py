# coding=utf-8
def format_destinations(dests):
    return u"\n".join([u"%s: %s €" % (city, price) for (city, price) in dests])

destination_choice = [
    lambda dests: u"I found some great deals! How about these destinations:\n\n" + format_destinations(dests),
    lambda dests: u"Sounds great, here's what I found:\n\n" + format_destinations(dests),
    lambda dests: u"You're in luck, have a look at these deals:\n\n" + format_destinations(dests),
    lambda dests: u"I was able to find some super cheap flights to these cities:\n\n" + format_destinations(dests),
    lambda dests: u"These destinations are really affordable right now:\n\n" + format_destinations(dests),
]

yelp_into = [
    lambda dest: u"There is some great stuff to do in %s:" % dest,
    lambda dest: u"%s is great. Let me show you some of the local favorites!" % dest,
    lambda dest: u"Here are some of the best local spots in %s." % dest,
    lambda dest: u"These places are definitely worth checking out:" % dest,
    lambda dest: u"Here are some fun places in %s:" % dest,
    lambda dest: u"%s is a very interesting city. Here are some of the popular spots:" % dest
]
yelp_place_first = [
    lambda place: u'There\'s %s' % place,
    lambda place: u'Check out %s' % place,
    lambda place: u'"%s"' % place,
]
yelp_place_second = [
    lambda place: u'Here is some info on %s' % place,
    lambda place: u'There\'s also %s' % place,
    lambda place: u'%s is quite popular.' % place,
    lambda place: u'%s' % place,
    lambda place: u'%s is very cool.' % place,
    lambda place: u'"%s"' % place,
    lambda place: u'"%s"' % place,
    lambda place: u'Check out "%s"' % place,
    lambda place: u'Check out "%s"' % place,
]

booking = [
    lambda url: u"Sure! Here you go: %s" % url,
    lambda url: u"Definitely! %s" % url,
    lambda url: u"Here are the best offers I could find: %s" % url
]
bye = [
    "Catch you later!",
    "Bye!",
    "Have a nice day!",
    "Cheersy"
]
