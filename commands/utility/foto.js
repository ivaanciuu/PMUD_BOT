const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('foto')
		.setDescription('Muestra el avatar de un usuario.')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('El usuario cuyo avatar quieres ver')
		),
	async execute(interaction) {
		const user = interaction.options.getUser('usuario') || interaction.user;
		await interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true, size: 512 })}`);
	},
};
