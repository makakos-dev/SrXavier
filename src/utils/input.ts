export const formatCPF = (input: string) => {
  const CPF = input.replace(/\D/g, '');
  let formattedCPF = '';

  if (CPF.length > 0) formattedCPF = CPF;
  if (CPF.length > 3) formattedCPF = `${CPF.slice(0, 3)}.${CPF.slice(3)}`;
  if (CPF.length > 6) formattedCPF = `${CPF.slice(0, 3)}.${CPF.slice(3, 6)}.${CPF.slice(6)}`;
  if (CPF.length > 9)
    formattedCPF = `${CPF.slice(0, 3)}.${CPF.slice(3, 6)}.${CPF.slice(6, 9)}-${CPF.slice(9)}`;

  return formattedCPF;
};

export const formatPhoneNumber = (input: string) => {
  const phone = input.replace(/\D/g, '');
  let formattedPhone = '';

  if (phone.length > 0) formattedPhone = `(${phone}`;
  if (phone.length > 2) formattedPhone = `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  if (phone.length > 7) formattedPhone = `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;

  return formattedPhone;
};

export const formatFloatNumber = (input: string) => {
  return input.replace(/[^\d.]/g, '');
};
