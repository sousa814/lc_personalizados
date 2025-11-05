import React, { useMemo, useState } from "react";

/**
 * Loja de Papelaria & Festas Personalizadas — Página Única (React + Tailwind)
 *
 * ✔ Busca, filtro por categoria e ordenação
 * ✔ Cards de produto com avaliação
 * ✔ Modal de Personalização (nome, tema, cores, data, observações)
 * ✔ Carrinho com subtotal, ajuste de quantidades e remoção
 * ✔ Link de checkout via WhatsApp com resumo do pedido
 * ✔ Layout responsivo e visual suave (pastéis)
 *
 * Dica: publique no Vercel/Netlify ou integre em frameworks (Next.js). 
 */

const PRODUTOS = [
  {
    id: "kit-festa-unicornio",
    nome: "Kit Festa Personalizado — Tema Unicórnio",
    preco: 159.9,
    categoria: "Festas Personalizadas",
    popularidade: 98,
    avaliacao: 4.8,
    imagem:
      "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=1200&auto=format&fit=crop",
    tags: ["kit", "festa", "unicórnio", "personalizado"],
    descricao:
      "Kit com toppers, caixinhas e adesivos coordenados. Perfeito para encantar sua festa!",
  },
  {
    id: "caderno-a5",
    nome: "Caderno A5 Capa Dura — Personalizado",
    preco: 39.9,
    categoria: "Papelaria",
    popularidade: 86,
    avaliacao: 4.6,
    imagem:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1200&auto=format&fit=crop",
    tags: ["caderno", "papelaria", "escolar"],
    descricao:
      "Caderno A5 com 96 folhas. Personalize com nome, curso e ilustração preferida.",
  },
  {
    id: "convite-digital",
    nome: "Convite Digital — WhatsApp/Impressão",
    preco: 29.9,
    categoria: "Convites",
    popularidade: 75,
    avaliacao: 4.7,
    imagem:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    tags: ["convite", "digital", "arte"],
    descricao:
      "Arte digital personalizada para você enviar por WhatsApp ou imprimir.",
  },
  {
    id: "caixa-surpresa",
    nome: "Caixa Surpresa — Personalizada",
    preco: 12.5,
    categoria: "Embalagens",
    popularidade: 62,
    avaliacao: 4.4,
    imagem:
      "https://images.unsplash.com/photo-1516542076529-1ea3854896e1?q=80&w=1200&auto=format&fit=crop",
    tags: ["caixa", "lembrancinha"],
    descricao:
      "Caixa surpresa para lembrancinhas. Personalize com o tema do evento.",
  },
  {
    id: "baloes-metalizados",
    nome: "Balões Metalizados 10un",
    preco: 24.9,
    categoria: "Balões",
    popularidade: 71,
    avaliacao: 4.3,
    imagem:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop",
    tags: ["balões", "festa"],
    descricao:
      "Pacote com 10 balões metalizados sortidos. Ideal para dar brilho à decoração.",
  },
  {
    id: "adesivos-redondos",
    nome: "Adesivos Redondos 100un — Personalizados",
    preco: 35.0,
    categoria: "Adesivos",
    popularidade: 64,
    avaliacao: 4.5,
    imagem:
      "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=1200&auto=format&fit=crop",
    tags: ["adesivo", "etiqueta", "personalizado"],
    descricao:
      "Adesivos vinílicos resistentes. Envie seu logo, nome e cores.",
  },
];

const CATEGORIAS = [
  "Todos",
  "Festas Personalizadas",
  "Papelaria",
  "Convites",
  "Embalagens",
  "Balões",
  "Adesivos",
];

function BRL(v) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(v || 0);
  } catch {
    return `R$ ${Number(v || 0).toFixed(2)}`;
  }
}

function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

export default function PapelariaFestasStore() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [ordenar, setOrdenar] = useState("Mais vendidos");
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [personalizarDe, setPersonalizarDe] = useState(null); // produto
  const [carrinho, setCarrinho] = useState([]); // {id, nome, preco, qty, pers: {nome, tema, cores, data, obs}}
  const [cep, setCep] = useState("");

  const produtosFiltrados = useMemo(() => {
    let lista = [...PRODUTOS];
    if (categoria !== "Todos") {
      lista = lista.filter((p) => p.categoria === categoria);
    }
    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nome.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.descricao.toLowerCase().includes(q)
      );
    }
    if (ordenar === "Mais vendidos") {
      lista.sort((a, b) => b.popularidade - a.popularidade);
    } else if (ordenar === "Menor preço") {
      lista.sort((a, b) => a.preco - b.preco);
    } else if (ordenar === "Maior preço") {
      lista.sort((a, b) => b.preco - a.preco);
    } else if (ordenar === "Melhor avaliação") {
      lista.sort((a, b) => b.avaliacao - a.avaliacao);
    }
    return lista;
  }, [busca, categoria, ordenar]);

  const subtotal = useMemo(
    () => carrinho.reduce((s, i) => s + i.preco * i.qty, 0),
    [carrinho]
  );

  function adicionarAoCarrinho(produto, pers = null) {
    const key = produto.id + (pers ? JSON.stringify(pers) : "");
    setCarrinho((c) => {
      const idx = c.findIndex((x) => x.key === key);
      if (idx >= 0) {
        const novo = [...c];
        novo[idx] = { ...novo[idx], qty: novo[idx].qty + 1 };
        return novo;
      }
      return [
        ...c,
        {
          key,
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          qty: 1,
          pers,
        },
      ];
    });
  }

  function alterarQtd(itemKey, delta) {
    setCarrinho((c) =>
      c
        .map((it) =>
          it.key === itemKey ? { ...it, qty: Math.max(1, it.qty + delta) } : it
        )
        .filter((it) => it.qty > 0)
    );
  }

  function removerItem(itemKey) {
    setCarrinho((c) => c.filter((it) => it.key !== itemKey));
  }

  function textoPedidoWhatsApp() {
    const linhas = carrinho.map((it) => {
      const base = `• ${it.nome} x${it.qty} — ${BRL(it.preco * it.qty)}`;
      if (it.pers) {
        const { nome, tema, cores, data, obs } = it.pers;
        const detal = [
          nome && `Nome: ${nome}`,
          tema && `Tema: ${tema}`,
          cores && `Cores: ${cores}`,
          data && `Data: ${data}`,
          obs && `Obs: ${obs}`,
        ]
          .filter(Boolean)
          .join(" | ");
        return detal ? `${base}\n   ↳ Personalização: ${detal}` : base;
      }
      return base;
    });
    const frete = cep ? `\nCEP para cálculo de frete: ${cep}` : "";
    return (
      `Olá! Gostaria de fechar meu pedido:` +
      `\n\n${linhas.join("\n")}` +
      `\n\nSubtotal: ${BRL(subtotal)}` +
      frete +
      `\n\nComo prossigo?`
    );
  }

  const linkWhats = useMemo(() => {
    const phone = "5599999999999"; // substitua pelo número da loja (c/ DDI 55)
    const txt = encodeURIComponent(textoPedidoWhatsApp());
    return `https://wa.me/${phone}?text=${txt}`;
  }, [carrinho, subtotal, cep]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-rose-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/90 text-white font-bold shadow-sm">PF</span>
            <div>
              <h1 className="text-lg font-extrabold leading-5">Papelaria & Festas</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Personalizados com carinho</p>
            </div>
          </div>

          {/* Busca */}
          <div className="ml-auto hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Busque por produto, tema, cor..."
                className="w-[380px] rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-300"
              />
              <span className="pointer-events-none absolute right-3 top-2.5 text-slate-400">🔎</span>
            </div>
            <button
              onClick={() => setCarrinhoAberto(true)}
              className="relative rounded-xl border border-rose-200 bg-rose-500/90 px-3 py-2 text-white text-sm shadow-sm hover:bg-rose-500"
            >
              🛒 Carrinho
              {carrinho.length > 0 && (
                <span className="ml-2 rounded-full bg-white/90 px-2 py-0.5 text-rose-600 text-xs font-bold">
                  {carrinho.reduce((s, i) => s + i.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categorias */}
        <div className="mx-auto max-w-7xl px-4 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={classNames(
                  "px-3 py-1.5 rounded-full text-sm border shadow-xs whitespace-nowrap",
                  categoria === cat
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-white/80 border-slate-200 hover:bg-white"
                )}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs text-slate-500">Ordenar:</label>
              <select
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 text-sm"
              >
                {[
                  "Mais vendidos",
                  "Melhor avaliação",
                  "Menor preço",
                  "Maior preço",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-8">
        <div className="rounded-3xl bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 p-6 md:p-10 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
                Deixe sua festa inesquecível ✨
              </h2>
              <p className="mt-2 text-slate-700">
                Personalizamos convites, kits festa, adesivos e papelaria com o seu
                tema, cores e nome. Produção ágil e atendimento próximo.
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="#produtos"
                  className="rounded-xl bg-white/90 px-4 py-2 text-slate-800 border border-white/70 shadow hover:bg-white"
                >
                  Ver produtos
                </a>
                <a
                  href="https://wa.me/5599999999999"
                  target="_blank"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700"
                  rel="noreferrer"
                >
                  Fale no WhatsApp
                </a>
              </div>
            </div>
            <div className="h-48 md:h-56 rounded-2xl bg-white/60 border border-white/70 shadow-inner grid place-items-center text-center p-4">
              <p className="text-sm text-slate-600">
                Espaço para banner/slider com fotos das suas artes 🧁🎈📝
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-4 flex md:hidden items-center gap-2">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
          />
          <button
            onClick={() => setCarrinhoAberto(true)}
            className="rounded-xl border border-rose-200 bg-rose-500/90 px-3 py-2 text-white text-sm"
          >
            🛒 ({carrinho.reduce((s, i) => s + i.qty, 0)})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {produtosFiltrados.map((p) => (
            <article
              key={p.id}
              className="group rounded-3xl bg-white border border-rose-100 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={p.imagem}
                  alt={p.nome}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold leading-snug line-clamp-2 min-h-[3.2rem]">{p.nome}</h3>
                <p className="mt-1 text-xs text-slate-500">{p.categoria}</p>
                <div className="mt-2 flex items-center gap-1 text-amber-500" aria-label={`Avaliação ${p.avaliacao}`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < Math.round(p.avaliacao) ? "★" : "☆"}</span>
                  ))}
                  <span className="ml-1 text-xs text-slate-500">{p.avaliacao.toFixed(1)}</span>
                </div>
                <div className="mt-3 text-lg font-bold">{BRL(p.preco)}</div>

                <div className="mt-4 flex gap-2 mt-auto">
                  <button
                    onClick={() => setPersonalizarDe(p)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    Personalizar
                  </button>
                  <button
                    onClick={() => adicionarAoCarrinho(p)}
                    className="flex-1 rounded-xl bg-rose-500 text-white px-3 py-2 text-sm shadow hover:bg-rose-600"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Seção institucional curta */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="rounded-3xl bg-white/70 border border-rose-100 p-6">
          <h4 className="text-lg font-bold">Como funciona a personalização</h4>
          <ol className="mt-2 list-decimal pl-5 text-sm text-slate-700 space-y-1">
            <li>Escolha o produto e clique em <b>Personalizar</b>.</li>
            <li>Informe nome, tema, cores e data do evento.</li>
            <li>Adicione ao carrinho e finalize pelo WhatsApp.</li>
            <li>Enviamos a prova digital para sua aprovação antes da produção.</li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rose-100 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-6 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h5 className="font-semibold">Papelaria & Festas</h5>
            <p className="text-slate-600 mt-1">
              Produtos personalizados para tornar cada momento único.
            </p>
          </div>
          <div>
            <h6 className="font-semibold">Atendimento</h6>
            <p className="text-slate-600 mt-1">Seg–Sex, 9h às 18h</p>
            <a
              className="text-emerald-700 underline"
              href="https://wa.me/5599999999999"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp da Loja
            </a>
          </div>
          <div>
            <h6 className="font-semibold">Informações</h6>
            <ul className="mt-1 text-slate-600 space-y-1">
              <li>Prazos de produção: 2–5 dias úteis</li>
              <li>Envios para todo o Brasil</li>
              <li>Pagamentos: Pix, Cartão, Boleto</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 pb-6">© {new Date().getFullYear()} Papelaria & Festas — Todos os direitos reservados.</div>
      </footer>

      {/* Carrinho (Drawer) */}
      {carrinhoAberto && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCarrinhoAberto(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[440px] bg-white shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Seu carrinho</h3>
              <button
                onClick={() => setCarrinhoAberto(false)}
                className="rounded-lg border px-2 py-1 text-sm"
              >
                Fechar ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto divide-y">
              {carrinho.length === 0 && (
                <div className="p-6 text-slate-600 text-sm">Seu carrinho está vazio.</div>
              )}
              {carrinho.map((it) => (
                <div key={it.key} className="p-4 flex gap-3 items-start">
                  <div className="h-16 w-16 rounded-lg bg-slate-100 grid place-items-center text-xs text-slate-500">
                    IMG
                  </div>
                  <div className="flex-1">
                    <div className="font-medium leading-snug">{it.nome}</div>
                    {it.pers && (
                      <div className="mt-1 text-xs text-slate-600">
                        {(it.pers.nome || it.pers.tema || it.pers.cores || it.pers.data || it.pers.obs) && (
                          <>
                            <div className="font-semibold text-slate-700">Personalização</div>
                            <div className="space-y-0.5">
                              {it.pers.nome && <div>Nome: {it.pers.nome}</div>}
                              {it.pers.tema && <div>Tema: {it.pers.tema}</div>}
                              {it.pers.cores && <div>Cores: {it.pers.cores}</div>}
                              {it.pers.data && <div>Data: {it.pers.data}</div>}
                              {it.pers.obs && <div>Obs: {it.pers.obs}</div>}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <div className="mt-2 text-sm font-semibold">{BRL(it.preco)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        className="rounded-md border px-2"
                        onClick={() => alterarQtd(it.key, -1)}
                      >
                        −
                      </button>
                      <span className="min-w-[2ch] text-center">{it.qty}</span>
                      <button
                        className="rounded-md border px-2"
                        onClick={() => alterarQtd(it.key, +1)}
                      >
                        +
                      </button>
                      <button
                        className="ml-3 text-rose-600 text-sm underline"
                        onClick={() => removerItem(it.key)}
                      >
                        remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">{BRL(subtotal)}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  maxLength={9}
                  placeholder="CEP para calcular frete"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <span className="text-xs text-slate-500">Estimativa no WhatsApp</span>
              </div>
              <a
                href={linkWhats}
                target="_blank"
                rel="noreferrer"
                className={classNames(
                  "block text-center rounded-xl px-4 py-3 text-white font-semibold shadow",
                  carrinho.length === 0
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
                onClick={(e) => {
                  if (carrinho.length === 0) e.preventDefault();
                }}
              >
                Finalizar pelo WhatsApp
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* Modal de Personalização */}
      {personalizarDe && (
        <PersonalizacaoModal
          produto={personalizarDe}
          onClose={() => setPersonalizarDe(null)}
          onAdd={(pers) => {
            adicionarAoCarrinho(personalizarDe, pers);
            setPersonalizarDe(null);
            setCarrinhoAberto(true);
          }}
        />)
      }
    </div>
  );
}

function PersonalizacaoModal({ produto, onClose, onAdd }) {
  const [nome, setNome] = useState("");
  const [tema, setTema] = useState("");
  const [cores, setCores] = useState("");
  const [data, setData] = useState("");
  const [obs, setObs] = useState("");

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl border border-rose-100">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-semibold">Personalizar: {produto.nome}</h3>
          <button onClick={onClose} className="rounded-lg border px-2 py-1 text-sm">
            Fechar ✕
          </button>
        </div>
        <div className="p-5 grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span>Nome</span>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Maria Clara"
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Tema</span>
              <input
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ex.: Unicórnio, Safari, Barbie..."
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span>Cores</span>
              <input
                value={cores}
                onChange={(e) => setCores(e.target.value)}
                placeholder="Ex.: Rosa, dourado"
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Data do Evento</span>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            <span>Observações</span>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Detalhes, tamanho, fonte, link de referência..."
              className="rounded-lg border border-slate-200 px-3 py-2 min-h-[90px]"
            />
          </label>
          <div className="text-xs text-slate-500">
            Após concluir o pedido, enviaremos uma prova digital para sua aprovação.
          </div>
        </div>
        <div className="p-5 border-t flex gap-3 justify-end">
          <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm">
            Cancelar
          </button>
          <button
            onClick={() => onAdd({ nome, tema, cores, data, obs })}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white shadow hover:bg-rose-700"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
