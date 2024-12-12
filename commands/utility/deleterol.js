const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deleterol')
		.setDescription('Elimina un rol del servidor.')
		.addRoleOption(option =>
			option.setName('rol')
				.setDescription('El rol que deseas borrar.')
				.setRequired(true)),
	async execute(interaction) {
		// Verifica si el usuario tiene permisos para gestionar roles
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply({
				content: 'No tienes permisos para borrar roles.',
				ephemeral: true,
			});
		}

		// Obtén el rol especificado
		const rol = interaction.options.getRole('rol');

		// Verifica si el bot puede gestionar el rol
		if (rol.position >= interaction.guild.members.me.roles.highest.position) {
			return interaction.reply({
				content: 'No puedo eliminar este rol porque está por encima de mi posición en la jerarquía.',
				ephemeral: true,
			});
		}

		try {
			// Elimina el rol
			await rol.delete(`Eliminado por ${interaction.user.tag}`);
			await interaction.reply(`El rol **${rol.name}** ha sido eliminado exitosamente.`);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Hubo un error al intentar borrar el rol.',
				ephemeral: true,
			});
		}
	},
};
