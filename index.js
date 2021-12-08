const { Client, Intents, Permissions } = require('discord.js');
const Query = require("minecraft-query");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const config = require('./config.json')

const updateChannel = async () => {
	var q = new Query({host: config.ipAddress, port: config.port, timeout: 7500});
	q.fullStat().then(data => {

		const playersChannelName = `【👥】Oyuncu Sayısı: ${data.online_players}`
		const statusChannelName = `【🔌】Durum: Açık`

		client.channels.cache.get(config.playersChannel).setName(playersChannelName)
		client.channels.cache.get(config.statusChannel).setName(statusChannelName)

		return true
		q.close()
	}).catch(err => {
		const playersChannelName = `【👥】Oyuncu Sayısı: -`
		const statusChannelName = `【🔌】Durum: Kapalı`
		client.channels.cache.get(config.playersChannel).setName(playersChannelName)
		client.channels.cache.get(config.statusChannel).setName(statusChannelName)
	})
}

client.on('ready', () => {
    console.log(`${client.user.tag} hesabına giriş yapıldı.`)
	updateChannel()
    setInterval(() => {
        updateChannel()
    }, config.updateInterval)
})

client.on('messageCreate', async (message) => {
    if(message.content === `${config.prefix}update`){
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return message.channel.send('Sadece yetkililer kullanabilir.')
        }
        const sentMessage = await message.channel.send("Güncelleniyor...")
        await updateChannel()
        sentMessage.edit("Güncellendi.")
    }
})

client.login(config.token)
