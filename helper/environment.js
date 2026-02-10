const environment = {};

environment.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: process.env.SECRET_STAGING_KEY || 'dev-only-change-me',
    maxChecks: 5,
    twilio: {
        fromPhone: process.env.TWILIO_FROM_PHONE || "",
        accountSid: process.env.TWILIO_ACCOUNT_SID || "",
        apiKeySid: process.env.TWILIO_API_KEY_SID || "",
        apiKeySecret: process.env.TWILIO_API_KEY_SECRET || ""
    }
}

environment.production = {
    port: 5000,
    envName: 'production',
    secretKey: process.env.SECRET_PRODUCTION_KEY || 'dev-only-change-me',
    maxChecks: 5,
    twilio: {
        fromPhone: process.env.TWILIO_FROM_PHONE || "",
        accountSid: process.env.TWILIO_ACCOUNT_SID || "",
        apiKeySid: process.env.TWILIO_API_KEY_SID || "",
        apiKeySecret: process.env.TWILIO_API_KEY_SECRET || ""
    }
}

const environmentToExport = (typeof process.env.ENV === 'string' && process.env.ENV.trim().length > 0) ? 
                            process.env.ENV : 'staging';

module.exports = environment[environmentToExport];