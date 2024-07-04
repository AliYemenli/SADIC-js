const fs = require("fs");
const path = require("path");

// Getting the required Discord.js Library Classes
const {Client, Collection, Events, GatewayIntentBits} = require("discord.js");
// Getting Discord Bot Token from config file
const {token} = require("./config.json");


// Creating a Client instance
const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

// Path to the commands folder
const foldersPath = path.join(__dirname,"commands");
// Reads the specified commands folder directory
const commandsFolder = fs.readdirSync(foldersPath);

for(const folder of foldersPath)  {
    const filepath = path.join(foldersPath,folder);
    
}


// This code block works for only once when Client is ready
client.once(Events.ClientReady, readyClient =>  {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Login process with the token that acquired from config file
// This is how a Instance log into Discord.
client.login(token);


