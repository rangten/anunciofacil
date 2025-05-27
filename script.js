async function buscarRanking() {
  const termo = document.getElementById("termo").value.trim();
  const tabela = document.getElementById("tabela");
  const carregando = document.getElementById("carregando");
  carregando.textContent = "Carregando anúncios...";

  tabela.innerHTML = "";

  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}&limit=50`);
    const data = await response.json();

    if (!data.results.length) {
      carregando.textContent = "Nenhum anúncio encontrado.";
      return;
    }

    let html = "<tr><th>Posição</th><th>Título</th><th>Preço</th><th>Link</th></tr>";
    data.results.forEach((item, index) => {
      html += `<tr><td>${index + 1}</td><td>${item.title}</td><td>R$ ${item.price}</td><td><a href="${item.permalink}" target="_blank">Ver</a></td></tr>`;
    });

    tabela.innerHTML = html;
    carregando.textContent = "";
  } catch (error) {
    carregando.textContent = "Erro ao buscar anúncios.";
  }
}

async function verPosicao() {
  const link = document.getElementById("link").value.trim();
  const resultado = document.getElementById("resultado");
  resultado.textContent = "";

  const idMatch = link.match(/MLB-(\d+)/);
  if (!idMatch) {
    resultado.textContent = "Link inválido.";
    return;
  }
  const id = idMatch[1];
  const termo = document.getElementById("termo").value.trim();

  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}&limit=50`);
    const data = await response.json();

    const index = data.results.findIndex(item => item.id === "MLB" + id);
    if (index !== -1) {
      resultado.textContent = `Seu anúncio está na posição ${index + 1}.`;
    } else {
      resultado.textContent = "Seu anúncio não está entre os 50 primeiros resultados.";
    }
  } catch (error) {
    resultado.textContent = "Erro ao verificar posição.";
  }
}