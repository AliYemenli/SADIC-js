const {SlashCommandBuilder, isEquatable} = require("discord.js");


//! Examine

/** 

İki aşamalı commandlar böyle yapılıyor. Örnek olarak DC'deki müzik botunda /play girdiğimizde
bizden daha sonra bir şarkı ismi girmemizi istediğinde yaşanan durum alttaki gibi.

Burada ilk olarak bir /reload girdiğimizde daha sonra bizden bir command girmemizi istiyor

/reload command: <commandName>  gibi


**/

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("[WARNING] This command used for development purposes")
        .addStringOption( option  =>
            option
            .setName("command")
            .setDescription("Updates/Reloads the specified command")
            .setRequired(true)
        ),
    async execute(interaction)  {
        const commandName = interaction.options.getString("command",true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if(!command)  {
            interaction.reply(`There is no such a command named ${commandName}`);
        }

        delete require.cache[require.resolve(`./${command.data.name}.js`)]; //! Deleting the currently updated command, because require method stores the old  command in the cache

        try {
            const newCommand = require(`./${command.data.name}.js`);
            interaction.client.commands.set(newCommand.data.name,newCommand);
            await interaction.reply(`Command ${newCommand.data.name} succsessfully reloaded`);
        } catch(error)  {
            console.error(error);
            interaction.reply(`There was an error while reloading the command named ${newCommand.data.name}, \n  ${error.message}`);
        }
    },
};

