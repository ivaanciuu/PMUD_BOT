const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unblockcanal')
		.setDescription('Desbloquea el canal actual, permitiendo que los usuarios envíen mensajes.'),
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
				SendMessages: true,
			});
			await interaction.reply('Este canal ha sido desbloqueado. Los usuarios pueden enviar mensajes nuevamente.');
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Hubo un error al intentar desbloquear el canal.',
				ephemeral: true,
			});
		}
	},
};
