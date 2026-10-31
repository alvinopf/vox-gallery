# Vox Gallery 📸🎙️

Aplicativo móvel de galeria inteligente focado na indexação, organização e recuperação ágil de imagens através de etiquetas (*tags*) atribuídas via comandos rápidos de voz e texto manual.

---

## 👥 Equipe do Projeto
* **Alvino Pedrosa Ferreira**
* **Daniela Carvalho Melo**

* **Instituição:** UNIESP – Centro Universitário
* **Curso:** Sistemas para Internet (5º Período - 2026.2)
* **Unidade Curricular:** Programação Para Dispositivos Móveis e Projeto Extensionista IV
* **Professor:** Álekiss Manço de Mélo

---

## 💡 Sobre o Projeto

O **Vox Gallery** nasceu para solucionar uma dor real validada com a comunidade: a frustração e o tempo excessivo desperdiçado procurando fotos antigas em rolos de câmera desorganizados.

### Principais Pilares:
1. **Comandos Rápidos de Voz:** Tagueamento dinâmico individual ou em lote por voz, reduzindo o atrito da digitação manual.
2. **Privacidade e Modo 100% Offline:** Os metadados e tags ficam armazenados no próprio dispositivo, sem envio forçado de arquivos pessoais para servidores em nuvem.
3. **Impacto Social (Bem-Estar Digital):** Resgate de memórias afetivas sem perda de tempo e redução da ansiedade na gestão de dados móveis.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
* **Linguagem:** TypeScript
* **Navegação:** [React Navigation](https://reactnavigation.org/) (Stack Navigation + Bottom Tabs)
* **Consumo de API:** Axios (Padrão Service com tratamento de `loading`, `success` e `error`)
* **Componentes Nativos:** `View`, `Text`, `Image`, `ScrollView`, `Pressable`, `StyleSheet`

---

## 🔀 Fluxo de Trabalho Git (GitFlow)

O desenvolvimento segue um fluxo GitFlow simplificado e organizado em equipe:

* **`main`**: Versão estável de produção pronta para build e geração do APK.
* **`develop`**: Linha central de integração contínua do desenvolvimento.
* **`feature/*`**: Branches de tarefas individuais:
  * `feature/setup-e-rotas` (Alvino)
  * `feature/componentes-e-tags` (Daniela)
  * `feature/servico-api-e-pastas` (Alvino)
  * `feature/swipe-e-filtros` (Daniela)

---

## 📂 Estrutura de Pastas

```text
vox-gallery/
├── assets/             # Imagens e ícones estáticos
├── src/
│   ├── components/     # Componentes reutilizáveis (CardFolder, TagBadge, etc.)
│   ├── routes/         # Configurações de rotas (Stack e Tabs)
│   ├── screens/        # Telas da aplicação (Pastas, Swipe, Tags, Busca)
│   ├── services/       # Camada de comunicação de APIs (Padrão Service com Axios)
│   └── types/          # Tipagens TypeScript (rotas e entidades)
├── App.tsx             # Ponto de entrada da aplicação
└── package.json        # Dependências e scripts
```

---

## 🚀 Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/alvinopf/vox-gallery.git
   cd vox-gallery
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor Expo:
   ```bash
   npx expo start
   ```

4. Abra no aplicativo **Expo Go** no celular físico (escaneando o QR Code ou conectando via USB com modo depuração).
