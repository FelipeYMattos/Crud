const form = document.getElementById("pedidoForm");
const tabela = document.getElementById("tabelaPedidos");
const msg = document.getElementById("mensagem");

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let editandoIndex = null;

function calcularValor(tipo, quantidade, restricoes) {
  let base = quantidade * 25;
  if (tipo === "Vegetariana") base *= 0.9;
  if (restricoes.length > 0) base += quantidade * 5;
  return base;
}

function salvarPedidos() {
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  renderizarTabela();
}

function renderizarTabela() {
  tabela.innerHTML = "";
  pedidos.forEach((pedido, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pedido.cliente}</td>
      <td>${pedido.tipo}</td>
      <td>${pedido.quantidade}</td>
      <td>${pedido.restricoes.join(", ")}</td>
      <td>R$${pedido.valor.toFixed(2)}</td>
      <td>
        <button onclick="editarPedido(${index})">Editar</button>
        <button onclick="excluirPedido(${index})">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const cliente = document.getElementById("cliente").value;
  const tipo = document.getElementById("tipo").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const restricoes = Array.from(document.querySelectorAll(".restricao:checked")).map(cb => cb.value);
  const valor = calcularValor(tipo, quantidade, restricoes);

  const novoPedido = { cliente, tipo, quantidade, restricoes, valor };

  if (editandoIndex !== null) {
    pedidos[editandoIndex] = novoPedido;
    editandoIndex = null;
    msg.textContent = "Pedido atualizado com sucesso!";
  } else {
    pedidos.push(novoPedido);
    msg.textContent = "Pedido salvo com sucesso!";
  }

  salvarPedidos();
  form.reset();
});

function editarPedido(index) {
  const p = pedidos[index];
  document.getElementById("cliente").value = p.cliente;
  document.getElementById("tipo").value = p.tipo;
  document.getElementById("quantidade").value = p.quantidade;

  document.querySelectorAll(".restricao").forEach(cb => {
    cb.checked = p.restricoes.includes(cb.value);
  });

  editandoIndex = index;
}

function excluirPedido(index) {
  pedidos.splice(index, 1);
  salvarPedidos();
  msg.textContent = "Pedido excluído com sucesso!";
}

renderizarTabela();
