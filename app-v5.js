const users = [
  { username: "admin", password: "Admin@123", role: "admin", displayName: "Administrador" },
  { username: "operador1", password: "Operador@123", role: "operador", displayName: "Operador 01" }
];

const BASE_VALUE = 4223;
const FACTORS = {
  instalador: { d: 3.5123, e: 6.5212 },
  painel: { d: 31.123, e: 7.421 },
  pc: { d: 2.3234, e: 3.112 },
  master: { d: 12.1245, e: 11.5321 },
  tatico: { d: 15.321, e: 19.123 }
};

const clientes = {
  "1234": { nome: "Cliente Alfa", endereco: "Rua das Flores, 120", celular: "(11) 91234-5678" },
  "4321": { nome: "Cliente Beta", endereco: "Av. Central, 450", celular: "(21) 99876-5432" },
  "2026": { nome: "Cliente Gama", endereco: "Rua Projetada, 88", celular: "(31) 98765-4321" }
};

const state = { user: null };

const el = {
  loginSection: document.getElementById("login-section"),
  appSection: document.getElementById("app-section"),
  loginForm: document.getElementById("login-form"),
  username: document.getElementById("username"),
  password: document.getElementById("password"),
  loginError: document.getElementById("login-error"),
  userBadge: document.getElementById("user-badge"),
  logoutBtn: document.getElementById("logout-btn"),
  consultForm: document.getElementById("consult-form"),
  clientCode: document.getElementById("client-code"),
  consultResult: document.getElementById("consult-result")
};

function parseCode(code) {
  const clean = String(code || "").replace(/\D/g, "");
  if (!/^\d{4}$/.test(clean)) throw new Error("Informe um codigo com 4 digitos.");
  return clean.split("").map(Number);
}

function calc(sumLast, sumFirst, factor) {
  return sumLast * factor.d + sumFirst * factor.e + BASE_VALUE;
}

function generatePasswords(code) {
  const [b15, c15, d15, e15] = parseCode(code);
  const sumFirst = b15 + c15;
  const sumLast = d15 + e15;
  return {
    instalador: Math.round(calc(sumLast, sumFirst, FACTORS.instalador)),
    painel: Math.round(calc(sumLast, sumFirst, FACTORS.painel)),
    pc: Math.round(calc(sumLast, sumFirst, FACTORS.pc)),
    master: Math.round(calc(sumLast, sumFirst, FACTORS.master)),
    tatico: Math.round(calc(sumLast, sumFirst, FACTORS.tatico))
  };
}

function buscarCliente(code) {
  return clientes[code] || {
    nome: `Cliente ${code}`,
    endereco: `Rua Ficticia, ${code}`,
    celular: `(11) 9${code}-0000`
  };
}

function doLogin(event) {
  event.preventDefault();
  const username = el.username.value.trim().toLowerCase();
  const password = el.password.value;
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    el.loginError.textContent = "Usuario ou senha invalidos.";
    el.loginError.classList.remove("hidden");
    return;
  }
  state.user = user;
  el.loginError.classList.add("hidden");
  el.userBadge.textContent = `${user.displayName} (${user.role})`;
  el.loginSection.classList.add("hidden");
  el.appSection.classList.remove("hidden");
}

function doLogout() {
  state.user = null;
  el.loginForm.reset();
  el.consultForm.reset();
  el.consultResult.innerHTML = "";
  el.appSection.classList.add("hidden");
  el.loginSection.classList.remove("hidden");
}

function onConsult(event) {
  event.preventDefault();
  try {
    const code = el.clientCode.value.replace(/\D/g, "");
    const p = generatePasswords(code);
    const cliente = buscarCliente(code);
    el.consultResult.innerHTML = `
      <strong>Codigo:</strong> ${code}<br>
      <strong>Cliente:</strong> ${cliente.nome}<br>
      <strong>Endereco:</strong> ${cliente.endereco}<br>
      <strong>Celular:</strong> ${cliente.celular}<br><br>
      <strong>Senha Tecnica (Tatico):</strong> ${p.tatico}<br><br>
      Instalador: <strong>${p.instalador}</strong><br>
      Painel: <strong>${p.painel}</strong><br>
      PC: <strong>${p.pc}</strong><br>
      Master: <strong>${p.master}</strong><br>
      Tatico: <strong>${p.tatico}</strong>
    `;
  } catch (error) {
    el.consultResult.textContent = error.message;
  }
}

el.loginForm.addEventListener("submit", doLogin);
el.logoutBtn.addEventListener("click", doLogout);
el.consultForm.addEventListener("submit", onConsult);
