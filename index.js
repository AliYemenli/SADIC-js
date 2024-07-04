const fs = require("fs");
const path = require("path");

// Getting the required Discord.js Library Classes
const {Client, Collection, Events, GatewayIntentBits} = require("discord.js");
// Getting Discord Bot Token from config file
const {token} = require("./config.json");


// Creating a Client instance
const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

// *? Handling the command files

// Path to the commands folder
const commandsFolderPath = path.join(__dirname,"commands");  // root/commands
// Reads the specified commands folder directory
const commandsFolderDirectories = fs.readdirSync(commandsFolderPath); //  /utility 

for(const subCommandFolder of commandsFolderDirectories)  {
    const subCommandFilePaths = path.join(commandsFolderPath,subCommandFolder);    //   root/commands/utility
    //files variable holds the path infos of every .js file under command folder.
    const files = fs.readdirSync(subCommandFilePaths).filter(z => z.endsWith(".js"));  //  [ping.js, server.js, user.js]

    for(const modulePath of files)  {
        const filePath = path.join(subCommandFilePaths,modulePath);  //  root/commands/utility/ping.js
        const module = require(filePath);
        

        // For every command file , setting a new item in the collection. Data stored with command's name and its functionality

        if("data" in module && "execute" in module)  {
            client.commands.set(module.data.name,module);
        }  else  {
            console.log(`[WARNING] The command ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}




//? Login process

// This code block works for only once when Client is ready
client.once(Events.ClientReady, readyClient =>  {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Login process with the token that acquired from config file
// This is how a Instance log into Discord.
client.login(token);


//? Handling the command execution

//? Not every interaction is a slash command, (MessageComponent Interactions etc)

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand())   return;    //* If interaction is not came from via chat, return undefined   
    
    const command = interaction.client.commands.get(interaction.commandName);

    //* if there is no such command
    if(!command)  {
        console.error(`${interaction.commandName}: there is no such command`);
        return;
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error);
        if(interaction.replied || interaction.deferred)  {
            await interaction.followUp({content: "There was an error while executing this command!",ephemeral: true});
        } else  {
            await interaction.reply({content: "There was an error while executing this command", ephemeral: true});
        }
    }
});

