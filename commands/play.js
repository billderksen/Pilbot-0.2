const { createAudioPlayer, joinVoiceChannel, NoSubscriberBehavior, createAudioResource, StreamType, AudioPlayerStatus, VoiceConnectionStatus, AudioPlayer } = require('@discordjs/voice');
const { join } = require('node:path');
const { createReadStream } = require('node:fs');

module.exports = {
    name: 'play',
    description: 'Speelt een soundfile af',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guildId,
            adapterCreator: message.guild.voiceAdapterCreator,
        });
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            }
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('The connection has entered the Ready state - ready to play audio!');
        });

        // Controleert op permissions
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("SPEAK"))
            return message.channel.send("You dont have the correct permissions");


        const resource = createAudioResource(join('./files/', 'test.mp3'));

        connection.subscribe(player);

        player.play(resource);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Speler is begonnen met spelen')
        })

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        })

        console.log(`${this.name} command uitgevoerd door ${message.author.username}`);
    }
}