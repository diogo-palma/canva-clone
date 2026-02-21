# Canvas Clone
- Preview: <https://antdesign-chi.vercel.app/>
Editor de design leve inspirado no Canva, construído com Vue 3, Vite, Pinia e Fabric.js.

<p align="center">
	<img src="https://github.com/diogo-palma/canva-clone/blob/master/image.png?raw=true" alt="Preview" width="900" />
</p>

Principais características
- Edição arrastar & soltar de elementos (texto, imagens, SVGs)
- Histórico de undo/redo por página
- Exportação para PNG / JPEG / PDF
- Ferramentas de alinhamento, efeitos e camadas

Pré-requisitos
- Node.js 16+ recomendado

Instalação
```bash
npm install
```

Desenvolvimento
```bash
npm run dev
```

Build para produção
```bash
npm run build
```

Notas
- Renomeie o `.env.example`  para `.env` e coloque suas credenciais do UNPLASH.
- A imagem de preview exibida acima vem do arquivo `image.png` na raiz do repositório.
- Refatorei o store do canvas em módulos menores: `src/store/canvas/state.ts`, `src/store/canvas/actions.ts` e `src/store/canvas/getters.ts`.

Contribuição
- Abra issues para bugs ou melhorias e crie PRs com pequenas mudanças.

Licença
- MIT

