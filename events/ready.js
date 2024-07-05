const {Events} = require("discord.js");


//* This module only works for once, it indicates the login event

module.exports  = {
    name: Events.InteractionCreate,
    once: true,
    execute(client)  {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};

