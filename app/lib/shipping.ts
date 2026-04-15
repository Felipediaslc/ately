export async function getShipping(cep: string) {
  const cleaned = cep.replace(/\D/g, "");

  if (cleaned.length !== 8) {
    return { error: "CEP inválido" };
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    const data = await res.json();

    if (data.erro) {
      return { error: "CEP não encontrado" };
    }

    const city = data.localidade;
    const cityNormalized = city.toLowerCase();

   const allowedCities = ["joão pessoa", "cabedelo"];

if (allowedCities.includes(cityNormalized)) {
  return {
    available: true,
    price: 12,
    label: "Entrega local",
    city: data.localidade,
    state: data.uf,
    neighborhood: data.bairro,
  };
}

    return { error: "Ainda não entregamos nessa região" };

  } catch {
    return { error: "Erro ao buscar CEP. Tente novamente." };
  }
}