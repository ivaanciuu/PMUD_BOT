const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rols')
		.setDescription('Muestra los roles de un usuario.')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('El usuario del que deseas ver los roles.')
				.setRequired(true)),
	async execute(interaction) {
		// Obtén el usuario especificado
		const usuario = interaction.options.getMember('usuario');

		// Verifica si el usuario es válido
		if (!usuario) {
			return interaction.reply({
				content: 'No se pudo encontrar al usuario especificado en este servidor.',
				ephemeral: true,
			});
		}

		// Obtén los roles del usuario
		const roles = usuario.roles.cache
			.filter(role => role.name !== '@everyone') // Excluye el rol predeterminado (@everyone)
			.map(role => role.name) // Obtén los nombres de los roles
			.join(', '); // Combina los nombres en una lista separada por comas

		// Respuesta cuando el usuario no tiene roles
		if (!roles) {
			return interaction.reply({
				content: `${usuario.user.tag} no tiene roles asignados.`,
				ephemeral: true,
			});
		}

		// Envía la lista de roles
		await interaction.reply({
			content: `Roles de ${usuario.user.tag}: ${roles}`,
			ephemeral: false, // Cambia a `true` si quieres que sea privado
		});
	},
};
