// warnings.js
const warnings = {};

module.exports = {
	getWarnings: (userId) => warnings[userId] || [],
	addWarning: (userId, warning) => {
		if (!warnings[userId]) warnings[userId] = [];
		warnings[userId].push(warning);
	},
};
