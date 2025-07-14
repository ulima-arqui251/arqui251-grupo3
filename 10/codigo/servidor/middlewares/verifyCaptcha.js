const axios = require('axios');

module.exports = async function verifyCaptcha(req, res, next) {
  const captchaToken = req.body.captchaToken;

  if (!captchaToken) {
    return res.status(400).json({ error: 'Captcha requerido.' });
  }

  try {
    // Cloudflare Turnstile API
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET,
        response: captchaToken,
        remoteip: req.ip,
      })
    );

    if (response.data.success) {
      return next();
    } else {
      return res.status(400).json({ error: 'Captcha inválido.' });
    }
  } catch (error) {
    console.error('Error verificando captcha:', error);
    return res.status(500).json({ error: 'Error verificando captcha.' });
  }
};
