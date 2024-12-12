const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Banea a un usuario del servidor.')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('El usuario que deseas banear')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('razón')
				.setDescription('Razón del baneo')
				.setRequired(false)),
	async execute(interaction) {
		// Comprobamos permisos del ejecutor
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
			return interaction.reply({ content: 'No tienes permisos para banear usuarios.', ephemeral: true });
		}

		// Recogemos el usuario y la razón
		const user = interaction.options.getUser('usuario');
		const reason = interaction.options.getString('razón') || 'No se ha proporcionado una razón.';

		// Intentamos obtener el miembro del servidor
		const member = interaction.guild.members.cache.get(user.id);
		if (!member) {
			return interaction.reply({ content: 'No se pudo encontrar al usuario en el servidor.', ephemeral: true });
		}

		// Evitamos banear administradores o bots importantes
		if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply({ content: 'No puedes banear a este usuario porque es administrador.', ephemeral: true });
		}

		try {
			// Enviar DM al usuario antes del baneo
			await user.send(`🔨 Has sido baneado del servidor **${interaction.guild.name}** durante 5 minutos.\n**Razón:** ${reason}`);

			// Baneamos al usuario sin proporcionar un `reason` para evitar la notificación de Clyde
			await member.ban({ reason: '' });
			
			// Enviar confirmación al canal
			await interaction.reply(`🔨 **${user.tag}** ha sido baneado por 5 minutos.\n**Razón:** ${reason}\nEjecutado por: ${interaction.user.tag}`);

			// Desbaneo programado después de 5 minutos
			setTimeout(async () => {
				try {
					await interaction.guild.members.unban(user.id, 'El tiempo de baneo ha terminado (5 minutos)');
					console.log(`El usuario ${user.tag} ha sido desbaneado automáticamente.`);
				} catch (error) {
					console.error(`Error al intentar desbanear a ${user.tag}:`, error);
				}
			}, 60 * 1000); // 1 minuto en milisegundos
		} catch (error) {
			console.error('Error al intentar banear al usuario:', error);
			await interaction.reply({ content: 'Hubo un problema al intentar banear a este usuario.', ephemeral: true });
		}
	},
};
