# hpc-bot
Twitch bot for the Harry Potter Clan

# Usage

## Commands
`!sortinghat` - Place the sorting hat on your head and find out what House you belong to
`!rules` - 


# Contributing
## Changing what the bot says (Strings)

You can locate all of the strings the bot uses in `config/strings.json`: https://github.com/bdickason/hpc-bot/blob/master/config/strings.json

You can edit the format here there, just make sure you copy/paste the resulting file here to test it: http://jsonlint.com/

# Setup

## Installation

1. Download NodeJS: https://nodejs.org/en/
1. Install packages: `npm install`
1. Run the bot: `node app.js`

## Config
Create a file in your root project directory named `.env` *(this file will be automagically .gitignore'd)*

Set the following environment variables:
````
HPC_USERNAME
HPC_PASSWORD
HPC_CHANNEL
````

## Running the App

To run the app, execute `npm start` from your project root.


## Running Tests

You can run tests to verify that everything is working with the command `npm test`. This requires **mocha** to be installed with `npm install -g mocha`.

If you plan to submit pull requests, please ensure that the request includes proper test coverage of your feature.


