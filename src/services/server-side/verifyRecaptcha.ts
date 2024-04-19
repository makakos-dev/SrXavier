export const verifyReCaptcha = async (token: string, secretKey: string) => {
  const verifyReCaptchaURL = new URL(
    `?secret=${secretKey}&response=${token}`,
    'https://www.google.com/recaptcha/api/siteverify',
  );

  const response = await fetch(verifyReCaptchaURL);
  const reCaptchaResponse = await response.json();

  if (!reCaptchaResponse.success || reCaptchaResponse.score <= 0.5) {
    throw new Error('Houve um problema ao validar sua identidade. Por favor, tente novamente mais tarde.');
  }
};
