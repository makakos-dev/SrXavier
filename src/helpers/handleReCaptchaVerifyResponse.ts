export const handleReCaptchaVerifyResponse = async (token: string) => {
  const response = await fetch('/api/verify', { method: 'POST', body: JSON.stringify(token) });
  const reCaptchaResponse = await response.json();
  return { isHuman: response.ok, message: String(reCaptchaResponse) };
};
