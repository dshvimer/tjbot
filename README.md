## This repo contains the app that drives TJBot (FAU Make Hackathon 2018)

### About TJBot

TJBot is a kit developed by IBM. It's basically a raspberry pi with a Node.js runtime that uses Watson to preform intelligent tasks.

### What we built

We built a bot that can process speech intent, using http://wit.ai. The bot will save a friends face upon meeting them for the first time. Afterwards, it is able to recall people using MSFT Face Recognition API. The bot will also add events to GCal when it hears the user making plans. The overall idea was to build a wearable assitant for people on the go.

### Running the app

```$> sudo node app.js```
