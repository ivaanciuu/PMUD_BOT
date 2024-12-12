const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blockcanal')
		.setDescription('Bloquea el canal actual, impidiendo que los usuarios envíen mensajes.'),
	async execute(interaction) {
		const channel = interaction.channel;

		// Verifica permisos
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply({
				content: 'No tienes permisos para gestionar canales.',
				ephemeral: true,
			});
		}

		try {
			// Actualiza los permisos del canal
			await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
				SendMessages: false,
			});
			await interaction.reply('Este canal ha sido bloqueado. Los usuarios no pueden enviar mensajes.');
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Hubo un error al intentar bloquear el canal.',
				ephemeral: true,
			});
		}
	},
};
