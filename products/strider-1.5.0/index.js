module.exports = {
  title: 'Strider-CD 1.5.0',
  description: "continuous integration and deployment platform",
  sourceCodeURL: 'https://github.com/Strider-CD/strider',
  dockerImageURL: 'https://quay.io/repository/keyvanfatehi/strider',
  dockerTag: 'quay.io/keyvanfatehi/strider:1.5.0',
  monthlyPremium: 2500,
  minMemory: 1024,
  configSchema: {
    PLUGIN_GITHUB_APP_ID: {
      label: "Github App Client Id"
    },
    PLUGIN_GITHUB_APP_SECRET: {
      label: "Github App Secret"
    },
    SMTP_HOST: {
      label: "SMTP Host"
    },
    SMTP_USER: {
      label: "SMTP Username"
    },
    SMTP_PASS: {
      label: "SMTP Password",
      type: 'password'
    },
    SMTP_FROM: {
      label: "SMTP From Address"
    }
  }
}