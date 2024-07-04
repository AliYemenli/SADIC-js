const {REST, Routes} = require("discord.js");
const {clientID,guildID,token} = require("./config.json");

const fs = require("fs");
const path = require("path");

const commands = [];





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
        const moduless = require(filePath);
        

        // For every command file , setting a new item in the collection. Data stored with command's name and its functionality

        if("data" in moduless && "execute" in moduless)  {
            commands.push(moduless.data.toJSON());
        }  else  {
            console.log(`[WARNING] The command ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


//* Instance of the REST module derived from discord.js

const rest = new REST().setToken(token);

//* DEPLOYMENT OF THE COMMANDS

(
    async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            
            //? rest.put() method is used to refresh all commands in the server with the current set 
            const data = await rest.put(
                Routes.applicationGuildCommands(clientID,guildID),
                {body: commands},
            );
            
            console.log(`Succcessfully reloaded ${data.length} application (/) commands.`);
        } catch(error)  {
            console.error(error);
        }
    }
)();