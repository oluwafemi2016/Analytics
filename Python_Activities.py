
# coding: utf-8

# ### Activity 1: The goal of this code is to extract numbers in a text document and sum all the numbers together

# In[3]:


#Importing regular expression library
import re


# In[69]:


#get the 2D array containing array of numbers for each line
handle = open("regex_sum_1119177.txt")
numlist = list()

for line in handle:
    line = line.rstrip()
    nums = re.findall('([0-9]+)',line)
    #print(nums)
    if len(nums) <1 : continue
    numlist.append(nums)      


# In[70]:


print((len(numlist)))


# In[71]:


# get all the numbers into 1D array
numblist = list()
numbs = list()
for j in range(len(numlist)):
    numbs = numlist[j]
    #print(numbs)
    for num in numbs:
        numblist.append(num)
        #print(numblist)   


# In[72]:


#print((numblist))


# In[73]:


# turn the array of strings to array of floats

numbers = list()
for j in range(len(numblist)):
    numbers.append(float(numblist[j]))


# In[74]:


#print(numbers)


# In[75]:


sum = 0
for number in numbers:
    sum = sum + number


# In[76]:


print("sum of numbers in the text:", sum)


# ### Activity 2: Get the minimum and maximum values from a list of numbers

# In[65]:


def Minimax(num):
    largest = 0
    smallest = None
    while True:
        if num == "done" : 
            break
        try :
            numVal = int(num)
            ##numVals = num
        except:
            print("Invalid input")


        if numVal > largest:
            largest = numVal

        if smallest is None :
            smallest = numVal
        elif numVal < smallest :
            smallest = numVal
    

#print("Maximum is", largest)
#print("Minimum is", smallest)


# ### Activity 3: Writing a program that prompts for a file name, then opens that file and reads through the file, and print the contents of the file in upper case. Use the file words.txt to produce the output below.

# In[66]:


def UpperCase(fname):
    try:
        fh = open(fname)
        for line in fh:
            line = (line.rstrip()).upper()
            print(line)
    except:
        print("Filename",fname, "does not exist")


# ### Activity 4: Writing a program that prompts for a file name, then opens that file and reads through the file, looking for lines of the form X-DSPAM-Confidence:    0.8475 Count these lines and extract the floating point values from each of the lines and compute the average of those values and produce an output as shown below. Do not use the sum() function or a variable named sum in your solution.
# 

# In[67]:


def extract(fname):
    snum = 0;
    try:
        fh = open(fname)
    except:
        print("Filename does not exist")
    count = 0
    for line in fh:
        line = line.rstrip()
        if line.startswith("X-DSPAM-Confidence:") :
            count = count + 1
            idx = line.find("0")
            num = float(line[idx:])
            snum = snum+num
            continue 

    print("Average spam confidence:", snum/count)


# ### Activity 5: Open the file romeo.txt and read it line by line. For each line, split the line into a list of words using the split() method. The program should build a list of words. For each word on each line check to see if the word is already in the list and if not append it to the list. When the program completes, sort and print the resulting words in alphabetical order.

# In[68]:


def textToList(fname):
    try:
        fh = open(fname)
        lst = list()
        for line in fh:
            line = line.rstrip()
            linesplit = line.split()
            for word in linesplit:
               if not word in lst:
                    lst.append(word)
                    lst.sort()
    except:
        print("File", fname, "does not exist")


    print(lst)


# ### Activity 6: Open the file mbox-short.txt and read it line by line. After finding a line that starts with 'From ' like the following line: From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008 You will parse the From line using split() and print out the second word in the line (i.e. the entire address of the person who sent the message). Then print out a count at the end. Hint: make sure not to include the lines that start with 'From:'. Also look at the last line of the sample output to see how to print the count.
# 

# In[70]:


def ExtractEmail(fname):
    fh = open(fname)
    count = 0
    lnsp = list()
    for line in fh:
        line = line.rstrip()
        if line.startswith("From "):
            lnsp = line.split()[1]
            print(lnsp)
            count = count+1



    print("There were", count, "lines in the file with From as the first word")


# ### Activity 7: Writing a program to read through the mbox-short.txt and figure out who has sent the greatest number of mail messages. The program looks for 'From ' lines and takes the second word of those lines as the person who sent the mail. The program creates a Python dictionary that maps the sender's mail address to a count of the number of times they appear in the file. After the dictionary is produced, the program reads through the dictionary using a maximum loop to find the most prolific committer.

# In[71]:


def EmailSenders(fname):
    handle = open(fname)
    dicts = dict()
    senders = list()
    for line in handle:
        line = line.rstrip()
        if line.startswith("From "):
            senders.append(line.split()[1])
    ##print(senders)

    for sender in senders:
        dicts[sender] = dicts.get(sender,0)+1

    #getting the maximum
    bigCount = None
    bigSender = None

    for sender,count in dicts.items():
        if bigCount is None or count > bigCount:
            bigCount = count
            bigSender = sender

    print(bigSender, bigCount)

    #print(dicts)

            


# ### Activity 8: Writing a program to read through the mbox-short.txt and figure out the distribution by hour of the day for each of the messages. You can pull the hour out from the 'From ' line by finding the time and then splitting the string a second time using a colon. From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008  Once you have accumulated the counts for each hour, print out the counts, sorted by hour as shown below.

# In[72]:


def HourDistribution(fname):
    handle = open(fname)
    dicts = dict()
    senders = list()
    times = list()
    for line in handle:
        line = line.rstrip()
        if line.startswith("From "):
            senders.append(line.split()[5])
    for time in senders:
        times.append(time.split(":")[0])

    #print(times)
    for time in times:
        dicts[time] = dicts.get(time,0)+1
    #print(dicts)

    for key,value in sorted(dicts.items()):
        print(key,value)


# ### Activity 9: Retrieving the following document using the HTTP protocol in a way that can examine the HTTP Response headers

# In[1]:


import socket


# In[2]:


#creating the connection
mysock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
mysock.connect(('data.pr4e.org', 80))


# In[3]:


#sending the request
## converts unicode to UTF8 using encode
cmd = 'GET http://data.pr4e.org/intro-short.txt HTTP/1.0\r\n\r\n'.encode()
mysock.send(cmd)


# In[4]:


#receiving data stream from server
while True:
    data = mysock.recv(512)
    if len(data)<1:
        break
    print(data.decode())
mysock.close()


# In[2]:


print(ord('i'))


# In[7]:


import urllib.request, urllib.parse, urllib.error


# In[8]:


x = urllib.request.urlopen('http://data.pr4e.org/romeo.txt')


# In[9]:


print(x)


# ### Activity 10: Scraping HTML Data with BeautifulSoup: 
# #### The program will use urllib to read the HTML from the data files below, and parse the data, extracting numbers and compute the sum of the numbers in the file

# In[220]:


from urllib.request import urlopen
from bs4 import BeautifulSoup
import ssl
# Ignore SSL certificate errors
#Secure Sockets Layer, are cryptographic protocols designed to
#provide communications security over a computer network
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "http://py4e-data.dr-chuck.net/comments_1119179.html"
html = urlopen(url, context=ctx).read()
soup = BeautifulSoup(html, 'html.parser')


# In[209]:


#getting the text in the html document
tags = soup('span')


# In[210]:


print(tags)


# In[211]:


#Importing regular expression library
import re
taglist = list()
for tag in tags:
    nums = tag.contents[0]
    #print(nums)
    if len(nums) <1 : continue
    taglist.append(nums)      


# In[212]:


print(((taglist)))


# In[213]:


# get all the numbers into 1D array
Tagslist = list()
tnumbs = list()
for j in range(len(taglist)):
    tnumbs.append(float(taglist[j]))
    #print(tnumbs)
    #for tnum in tnumbs:
        #Tagslist.append(tnum)


# In[214]:


print(tnumbs)


# In[215]:


sums = 0
for number in tnumbs:
    sums = sums + number


# In[216]:


print("sum of numbers in the text:", sums)


# ### Activity 11: Following Links in HTML Using Beautiful Soup
# #### The program will use urllib to read the HTML from the data files below, extract the href= values from the anchor tags, scan for a tag that is in a particular position from the top and follow that link, repeat the process a number of times, and report the last name you find.
# 
# In this assignment you will write a Python program that expands on http://www.py4e.com/code3/urllinks.py. The program will use urllib to read the HTML from the data files below, extract the href= vaues from the anchor tags, scan for a tag that is in a particular position relative to the first name in the list, follow that link and repeat the process a number of times and report the last name you find.

# In[280]:


import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
import ssl
# Ignore SSL certificate errors
#Secure Sockets Layer, are cryptographic protocols designed to
#provide communications security over a computer network
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "http://py4e-data.dr-chuck.net/known_by_Charmaine.html"


# In[281]:


# Retrieve all of the anchor tags
repeat = 7
position = 18
while repeat >0:
    html = urllib.request.urlopen(url, context=ctx).read()
    soup = BeautifulSoup(html, 'html.parser')
    tags = soup('a')
    taglst = list()
    for tag in tags:
        taglst.append(tag.get('href', None))
    url = taglst[position-1]
    repeat = repeat - 1  
print(url)


# In[282]:


#Extract the last name from the url
urlName = list()
urlName.append(url)
LastName = re.findall('by_(\S.*\S)[^ html]', urlName[0])
print(LastName[0])


# ### Activity 12: Extract Data from XML
# #### The program will prompt for a URL, read the XML data from that URL using urllib and then parse and extract the comment counts from the XML data, compute the sum of the numbers in the file and enter the sum,
# Write a Python program somewhat similar to http://www.py4e.com/code3/geoxml.py. The program will prompt for a URL, read the XML data from that URL using urllib and then parse and extract the comment counts from the XML data, compute the sum of the numbers in the file.
# The data consists of a number of names and comment counts in XML as follows:
# 
# 
# 
# <comment>
#   <name>Matthias</name>
#   <count>97</count>
# </comment>
# 
# 
# You are to look through all the <comment> tags and find the <count> values sum the numbers. The closest sample code that shows how to parse XML is geoxml.py. But since the nesting of the elements in our data is different than the data we are parsing in that sample code you will have to make real changes to the code.
# To make the code a little simpler, you can use an XPath selector string to look through the entire tree of XML for any tag named 'count' with the following line of code:
# 
# counts = tree.findall('.//count')
# 
# Take a look at the Python ElementTree documentation and look for the supported XPath syntax for details. You could also work from the top of the XML down to the comments node and then loop through the child nodes of the comments node.

# In[37]:


import urllib.request, urllib.parse, urllib.error
import xml.etree.ElementTree as ET
import ssl


# In[38]:


# Ignore SSL certificate errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


# In[110]:


#Parsing the XML in Python and extracting the count values
url = "http://py4e-data.dr-chuck.net/comments_1119181.xml"
parms = dict()
parms['url'] = url
data = urllib.request.urlopen(url, context=ctx).read()
#print('Retrieved', len(data), 'characters')
#print(data.decode())
tree = ET.fromstring(data)
counts = tree.findall('comments/comment/count')


# In[111]:


#print((counts))


# In[112]:


countlist = list()
for count in counts:
    countlist.append(int(count.text))


# In[113]:


print((countlist))


# In[114]:


sum_count = 0
for number in countlist:
    sum_count = sum_count + number
print(sum_count)


# ### Activity 13: Extracting Data from JSON
# #### The program will prompt for a URL, read the JSON data from that URL using urllib and then parse and extract the comment counts from the JSON data, compute the sum of the numbers in the file.
# 
# write a Python program somewhat similar to http://www.py4e.com/code3/json2.py. The program will prompt for a URL, read the JSON data from that URL using urllib and then parse and extract the comment counts from the JSON data, compute the sum of the numbers in the file and enter the sum below:
# We provide two files for this assignment. One is a sample file where we give you the sum for your testing and the

# In[4]:


import json
import urllib.request, urllib.parse, urllib.error
import xml.etree.ElementTree as ET
import ssl


# In[22]:


url = "http://py4e-data.dr-chuck.net/comments_1119182.json"
# Ignore SSL certificate errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
data = urllib.request.urlopen(url, context=ctx).read()


# In[23]:


info = json.loads(data)


# In[24]:


## getting the comments list
comments = info['comments']


# In[25]:


## get the counts
countlist = list()
for count in comments:
    countlist.append(count['count'])
print(countlist)


# In[26]:


## the sum
SumCount = 0
for count in countlist:
    SumCount = SumCount + count
print(SumCount)


# ### Activity 14: Using the GeoJSON API
# #### In this program you will use a GeoLocation lookup API modelled after the Google API to look up some universities and parse the returned data.
# 
# Write a Python program somewhat similar to http://www.py4e.com/code3/geojson.py. The program will prompt for a location, contact a web service and retrieve JSON for the web service and parse that data, and retrieve the first place_id from the JSON. A place ID is a textual identifier that uniquely identifies a place as within Google Maps.
# API End Points
# 
# To complete this project, use this API endpoint that has a static subset of the Google Data:
# 
# http://py4e-data.dr-chuck.net/json?
# This API uses the same parameter (address) as the Google API. This API also has no rate limit so you can test as often as you like. If you visit the URL with no parameters, you get "No address..." response.
# To call the API, you need to include a key= parameter and provide the address that you are requesting as the address= parameter that is properly URL encoded using the urllib.parse.urlencode() function as shown in http://www.py4e.com/code3/geojson.py
# 
# Make sure to check that your code is using the API endpoint is as shown above. You will get different results from the geojson and json endpoints so make sure you are using the same end point as this autograder is using.

# In[1]:


import urllib.request, urllib.parse, urllib.error
import json
import ssl

api_key = False
# If you have a Google Places API key, enter it here
# api_key = 'AIzaSy___IDByT70'
# https://developers.google.com/maps/documentation/geocoding/intro

if api_key is False:
    api_key = 42
    serviceurl = 'http://py4e-data.dr-chuck.net/json?'
else :
    serviceurl = 'https://maps.googleapis.com/maps/api/geocode/json?'

# Ignore SSL certificate errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


# In[6]:


address = input('Enter location: ')
parms = dict()
parms['address'] = address
if api_key is not False: parms['key'] = api_key
url = serviceurl + urllib.parse.urlencode(parms)

print('Retrieving', url)
uh = urllib.request.urlopen(url, context=ctx)
data = uh.read().decode()
print('Retrieved', len(data), 'characters')

try:
    js = json.loads(data)
except:
    js = None

if not js or 'status' not in js or js['status'] != 'OK':
    print('==== Failure To Retrieve ====')
    print(data)

print(json.dumps(js, indent=4))

lat = js['results'][0]['geometry']['location']['lat']
lng = js['results'][0]['geometry']['location']['lng']
print('lat', lat, 'lng', lng)
location = js['results'][0]['formatted_address']
print(location)


# ### Activity 15:  Counting Email in a Database
# #### This application will read the mailbox data (mbox.txt) and count the number of email messages per organization (i.e. domain name of the email address) using a database with the following schema to maintain the counts.

# In[34]:


###Test
import sqlite3
import re
email = 'femi.oyedokun@antaeus.com'
print(re.findall('@(\w+)',email))


# In[28]:


##Code starts here
import sqlite3
import re
conn = sqlite3.connect('organdb.sqlite') ## connects to sqlite
cur = conn.cursor() ## the handle
cur.execute('DROP TABLE IF EXISTS Counts')

cur.execute('CREATE TABLE Counts (org TEXT, count INTEGER)')
fname = input('Enter file name: ')
if (len(fname) < 1): fname = 'mbox-short.txt'
fh = open(fname)
for line in fh:
    if not line.startswith('From: '): continue
    pieces = line.split()
    email = pieces[1]
    org_unstrp = re.findall('@(.*).*', email)
    for domain in org_unstrp:
        org = domain.strip('')
    cur.execute('SELECT count FROM Counts WHERE org = ? ', (org,))
    row = cur.fetchone()
    if row is None:
        cur.execute('''INSERT INTO Counts (org, count)
                VALUES (?, 1)''', (org,))
    else:
        cur.execute('UPDATE Counts SET count = count + 1 WHERE org = ?',
                    (org,))
    conn.commit()

# https://www.sqlite.org/lang_select.html
sqlstr = 'SELECT org, count FROM Counts ORDER BY count DESC LIMIT 10'

for row in cur.execute(sqlstr):
    print(str(row[0]), row[1])

cur.close()


# In[29]:


print(org_strip)


# ### Activity 16: Multi-Table Database
# #### In this activity I will parse an XML list of albums, artists, and Genres and produce a properly normalized database using a Python program

# In[ ]:


import xml.etree.ElementTree as ET
import sqlite3

conn = sqlite3.connect('trackProdb.sqlite') ##making a database connection
cur = conn.cursor() ##file/database handle

# Make some fresh tables using executescript()
cur.executescript('''
DROP TABLE IF EXISTS Artist;
DROP TABLE IF EXISTS Genre;
DROP TABLE IF EXISTS Album;
DROP TABLE IF EXISTS Track;

CREATE TABLE Artist (
    id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    name    TEXT UNIQUE
);

CREATE TABLE Genre (
    id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    name    TEXT UNIQUE
);

CREATE TABLE Album (
    id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    artist_id  INTEGER,
    title   TEXT UNIQUE
);

CREATE TABLE Track (
    id  INTEGER NOT NULL PRIMARY KEY 
        AUTOINCREMENT UNIQUE,
    title TEXT  UNIQUE,
    album_id  INTEGER,
    genre_id INTEGER,
    len INTEGER, rating INTEGER, count INTEGER
);
''')


fname = input('Enter file name: ')
if ( len(fname) < 1 ) : fname = 'Library.xml'

# <key>Track ID</key><integer>369</integer>
# <key>Name</key><string>Another One Bites The Dust</string>
# <key>Artist</key><string>Queen</string>
### lookup function, to extract the key of a child tag in the xml
def lookup(d, key):
    found = False
    for child in d:
        if found : return child.text
        if child.tag == 'key' and child.text == key :
            found = True
    return None

stuff = ET.parse(fname)
all = stuff.findall('dict/dict/dict')
print('Dict count:', len(all))
for entry in all:
    if ( lookup(entry, 'Track ID') is None ) : continue

    name = lookup(entry, 'Name')
    artist = lookup(entry, 'Artist')
    genre = lookup(entry, 'Genre')
    album = lookup(entry, 'Album')
    count = lookup(entry, 'Play Count')
    rating = lookup(entry, 'Rating')
    length = lookup(entry, 'Total Time')

    if name is None or artist is None or album is None or genre is None :
        continue

    print(name, artist, album, genre, count, rating, length)

    cur.execute('''INSERT OR IGNORE INTO Artist (name) 
        VALUES ( ? )''', ( artist, ) )
    cur.execute('SELECT id FROM Artist WHERE name = ? ', (artist, ))
    artist_id = cur.fetchone()[0]

    cur.execute('''INSERT OR IGNORE INTO Album (title, artist_id) 
        VALUES ( ?, ? )''', ( album, artist_id ) )
    cur.execute('SELECT id FROM Album WHERE title = ? ', (album, ))
    album_id = cur.fetchone()[0]

    cur.execute('''INSERT OR IGNORE INTO Genre (name) 
            VALUES ( ? )''', (genre,))
    cur.execute('SELECT id FROM Genre WHERE name = ? ', (genre,))
    genre_id = cur.fetchone()[0]

    cur.execute('''INSERT OR REPLACE INTO Track
        (title, album_id, genre_id, len, rating, count) 
        VALUES ( ?, ?, ?, ?, ?, ? )''',
        ( name, album_id, genre_id, length, rating, count ) )

    conn.commit()


# ### Activity 17: Multi-Table Database/Many-to-Many Relationship
# #### I will be writing a Python program to build a set of tables using the Many-to-Many approach to store enrollment and role data in a course.
# 
# This application will read roster data in JSON format, parse the file, and then produce an SQLite database that contains a User, Course, and Member table and populate the tables from the data file.

# In[ ]:


import json
import sqlite3

conn = sqlite3.connect('RosterProjdb.sqlite')
cur = conn.cursor()

# Do some setup
cur.executescript('''
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Member;
DROP TABLE IF EXISTS Course;

CREATE TABLE User (
    id     INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    name   TEXT UNIQUE
);

CREATE TABLE Course (
    id     INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    title  TEXT UNIQUE
);

CREATE TABLE Member (
    user_id     INTEGER,
    course_id   INTEGER,
    role        INTEGER,
    PRIMARY KEY (user_id, course_id)
)
''')

fname = input('Enter file name: ')
if len(fname) < 1:
    fname = 'roster_data_sample.json'

# [
#   [ "Charley", "si110", 1 ],
#   [ "Mea", "si110", 0 ],

str_data = open(fname).read()
json_data = json.loads(str_data)

for entry in json_data:

    name = entry[0];
    title = entry[1];
    role = entry[2];

    print((name, title, role))

    cur.execute('''INSERT OR IGNORE INTO User (name)
        VALUES ( ? )''', ( name, ) )
    cur.execute('SELECT id FROM User WHERE name = ? ', (name, ))
    user_id = cur.fetchone()[0]

    cur.execute('''INSERT OR IGNORE INTO Course (title)
        VALUES ( ? )''', ( title, ) )
    cur.execute('SELECT id FROM Course WHERE title = ? ', (title, ))
    course_id = cur.fetchone()[0]

    cur.execute('''INSERT OR REPLACE INTO Member
        (user_id, course_id, role) VALUES ( ?, ?, ? )''',
        ( user_id, course_id, role ) )

    conn.commit()

