
async function buscarRanking() {
  const termo = document.getElementById("termoBusca").value.trim();
  const resultadoDiv = document.getElementById("resultadoRanking");
  resultadoDiv.innerHTML = "Carregando anúncios...";

  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}&limit=50`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      resultadoDiv.innerHTML = "Nenhum anúncio encontrado.";
      return;
    }

    const html = data.results.map((item, index) => {
      return `
        <div style="border:1px solid #ddd; padding:10px; margin:10px 0; border-radius:5px;">
          <strong>#${index + 1} - ${item.title}</strong><br>
          <img src="${item.thumbnail}" style="width:120px;"><br>
          Preço: R$${item.price.toFixed(2)}<br>
          Vendedor: ${item.seller.nickname}<br>
          Tipo de anúncio: ${item.listing_type_id}<br>
          Entrega: ${item.shipping.logistic_type === "fulfillment" ? "FULL" : "Normal"}<br>
          Catálogo: ${item.catalog_listing ? "Sim" : "Não"}<br>
          <a href="${item.permalink}" target="_blank">Ver anúncio</a>
        </div>
      `;
    }).join("");

    resultadoDiv.innerHTML = html;
  } catch (error) {
    resultadoDiv.innerHTML = "Erro ao buscar anúncios.";
    console.error(error);
  }
}

async function buscarPosicao() {
  const link = document.getElementById("linkAnuncio").value.trim();
  const resultadoDiv = document.getElementById("resultadoPosicao");
  resultadoDiv.innerHTML = "Verificando posição...";

  if (!link) {
    resultadoDiv.innerHTML = "Cole o link do anúncio.";
    return;
  }

  const idMatch = link.match(/MLB\d+/);
  const idProduto = idMatch ? idMatch[0] : null;

  if (!idProduto) {
    resultadoDiv.innerHTML = "ID do anúncio não encontrado no link.";
    return;
  }

  const termo = document.getElementById("termoBusca").value.trim();

  if (!termo) {
    resultadoDiv.innerHTML = "Digite o nome do produto para busca.";
    return;
  }

  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}&limit=200`;
    const res = await fetch(url);
    const data = await res.json();

    const posicao = data.results.findIndex(item => item.id === idProduto);
    resultadoDiv.innerHTML = posicao >= 0
      ? `Seu anúncio está na posição: ${posicao + 1}`
      : "Seu anúncio não está entre os 200 primeiros.";
  } catch (error) {
    resultadoDiv.innerHTML = "Erro ao verificar posição.";
    console.error(error);
  }
}
