// ---------- ESTADO ----------
let alunos = []; // array de objetos { id, nome, email }
let idEditando = null;
let proximoId = 1;

const CHAVE = "alunos.json";

// ---------- ABRIR ----------
function carregar() {
  const salvo = localStorage.getItem(CHAVE);
  if (salvo) {
    alunos = JSON.parse(salvo);
    proximoId = alunos.length ? Math.max(...alunos.map((a) => a.id)) + 1 : 1;
  }
  listar();
}

// ---------- PERSISTIR ----------
function persistir() {
  localStorage.setItem(CHAVE, JSON.stringify(alunos));
}

// ---------- READ ----------
function listar() {
  lista.innerHTML = "";
  alunos.forEach((a) => {
    lista.innerHTML += `<tr>
            <td>${a.id}</td>
            <td>${a.nome}</td>
            <td>${a.email}</td>
            <td>${a.idade ?? "-"}</td>
            <td><button disabled>Aguardando Passo 4</button></td></tr>`;
  });
}

// ---------- CREATE / UPDATE ----------
function salvar() {
  if (idEditando) {
    const a = alunos.find((x) => x.id === idEditando);
    a.nome = nome.value;
    a.email = email.value;
    a.idade = idade.value;
    idEditando = null;
  } else {
    alunos.push({
      id: proximoId++,
      nome: nome.value,
      email: email.value,
      idade: idade.value,
    });
  }
  nome.value = email.value = idade.value = "";
  persistir();
  listar();
}

// ---------- EDIT ----------
function editar(id) {
  const a = alunos.find((x) => x.id === id);
  nome.value = a.nome;
  email.value = a.email;
  idade.value = a.idade ||  "";
  idEditando = id;
}

// ---------- DELETE ----------
function excluir(id) {
  if (confirm("Excluir aluno?")) {
    alunos = alunos.filter((a) => a.id !== id);
    persistir();
    listar();
  }
}

// ---------- EXPORTAR ----------
function exportar() {
  const texto = JSON.stringify(alunos, null, 2);
  const blob = new Blob([texto], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "alunos.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

// ---------- IMPORTAR ----------
function importar(evento) {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = () => {
    try {
      const dados = JSON.parse(leitor.result);
      if (!Array.isArray(dados)) throw new Error("O JSON não é uma lista.");

      alunos = dados;
      proximoId = alunos.length ? Math.max(...alunos.map((a) => a.id)) + 1 : 1;

      persistir();
      listar();
      alert("Importado com sucesso!");
    } catch (e) {
      alert("Arquivo inválido: " + e.message);
    }
  };
  leitor.readAsText(arquivo);
}

// ---------- RESETAR ----------
function resetar() {
  if (!confirm("Apagar tudo?")) return;
  localStorage.removeItem(CHAVE);
  alunos = [];
  proximoId = 1;
  listar();
}

// ---------- INICIAR ----------
carregar();
