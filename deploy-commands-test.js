const {REST, Routes} = require("discord.js");
const {clientID,guildID,token} = require("./config.json");
const {GetCommandFiles} = require("./utils/handle-commands.js");

const commands = GetCommandFiles(__dirname);

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