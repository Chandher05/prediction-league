module.exports = {
  "type": "service_account",
  "project_id": "predictionleague",
  "private_key_id":process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509,
  "client_x509_cert_url": process.env.CLIENT_URL
}
