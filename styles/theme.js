const resolveConfig = require("tailwindcss/resolveConfig")
const tailwindConfig = require("../tailwind.config")

const { theme } = resolveConfig(tailwindConfig)

module.exports = theme
