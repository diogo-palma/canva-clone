# Canva Clone: Construindo um Editor de Design com Vue 3, Vite e Fabric.js

## Introdução

Neste artigo, vou compartilhar minha jornada ao construir o **Canva Clone**, um editor de design web leve e poderoso inspirado no Canva. O projeto utiliza Vue 3, Vite, Pinia e Fabric.js para criar uma experiência fluida de edição arrastar-e-soltar.

Se você está interessado em entender como funciona um editor de canvas moderno, gerenciamento de estado escalável ou como refatorar código grande em módulos menores, continue lendo!

<p align="center">
  <img src="https://github.com/diogo-palma/canva-clone/blob/master/image.png?raw=true" alt="Canva Clone Preview" width="900" />
</p>

---

## Por Que Construir um Editor de Design?

Editores de design online como Canva revolucionaram a forma como pessoas não-técnicas criam conteúdo visual. Construir um clone educativo é uma excelente forma de:

- Dominar manipulação de canvas com Fabric.js
- Aprender padrões de estado com Pinia
- Compreender arquitetura de front-end modular
- Experimentar com Vue 3 Composition API e Reactivity

---

## Stack Tecnológico

Aqui está o que escolhi para este projeto:

- **Vue 3** — Framework reativo para UI
- **Vite** — Build tool ultra-rápido
- **Pinia** — Gerenciamento de estado leve
- **Fabric.js** — Manipulação avançada de canvas
- **Element Plus** — Componentes UI prontos
- **jsPDF** — Exportação para PDF

---

## Arquitetura do Projeto

A estrutura é organizada em camadas claras:

```
src/
├── components/          # Componentes Vue reutilizáveis
│   ├── Canvas.vue
│   ├── MenuHeader.vue
│   ├── MenuFooter.vue
│   ├── submenu/         # Submenus (Texto, Formas, etc)
│   ├── tools/           # Ferramentas específicas
│   └── layouts/         # Layouts reutilizáveis
├── store/
│   ├── canvasStore.ts   # Wrapper principal
│   ├── submenuStore.ts  # Estado de submenus
│   └── canvas/          # Módulos decompostos
│       ├── state.ts     # Estado reativo
│       ├── actions.ts   # Lógica de negócio
│       └── getters.ts   # Computed properties
├── composables/         # Lógica reutilizável
├── utils/              # Funções auxiliares
├── styles/             # SCSS global
└── App.vue
```

---

## O Desafio: Um Store Gigante

No início, todo o estado e lógica da aplicação estavam em um **único arquivo `canvasStore.ts` com mais de 2.100 linhas**.

### Problemas:

1. **Difícil manutenção** — encontrar uma ação específica era como procurar uma agulha no palheiro
2. **Falta de separação de responsabilidades** — estado, ações e getters misturados
3. **Difícil testing** — testar uma ação significava importar o arquivo inteiro
4. **Escalabilidade limitada** — adicionar novas features era arriscado

### Exemplo do Caos Original:

```typescript
// Arquivo original (2100+ linhas)
export const useCanvasStore = defineStore('canvasStore', {
  state: () => ({
    // 60+ propriedades de estado aqui...
    fileList: [],
    canvasInstances: [],
    // ...
  }),
  actions: {
    // 100+ métodos aqui...
    async addNewPage() { /* ... */ },
    changeColor() { /* ... */ },
    alignCenter() { /* ... */ },
    // ...
  },
  getters: {
    currentCanvasState: (state) => { /* ... */ },
    // ...
  }
})
```

---

## A Solução: Decomposição em Módulos

Decidi refatorar o store em **3 módulos independentes**:

### 1. **state.ts** — Estado Reativo Puro

Contém apenas as propriedades reativas:

```typescript
// src/store/canvas/state.ts
import { UploadUserFile } from 'element-plus'

export const canvasState = () => ({
  fileList: [] as UploadUserFile[],
  canvasInstances: [] as { canvas: any, activeLayerIndex: number }[],
  pagesCount: [1] as number[],
  canvasHistory: [] as any[],
  canvasHistoryIndex: -1,
  zoomLevel: 100,
  pageWidth: 1300,
  pageHeight: 507,
  // ... mais propriedades
})
```

**Benefício:** Fácil visualizar todas as propriedades reativas em um único lugar.

---

### 2. **actions.ts** — Lógica de Negócio

Todas as funções que modificam o estado:

```typescript
// src/store/canvas/actions.ts
import { fabric } from 'fabric'
import { nextTick, markRaw } from 'vue'

const URL_API = import.meta.env.VITE_API_URL

export const canvasActions = {
  async newCanvas() {
    this.pagesCount = []
    await nextTick()
    this.canvasHistory = []
    this.canvasHistoryIndex = -1
    this.canvasInstances = []
    this.addNewPage()
  },

  changeFont(font: string) {
    const canvas = this.canvasInstances[this.activePageIndex].canvas
    const activeObject = canvas.getActiveObject()
    if (activeObject && (activeObject.type === 'i-text' || activeObject.type === 'text')) {
      activeObject.set('fontFamily', font)
      canvas.renderAll()
      this.saveCanvasState()
    }
  },

  changeColor(color: string) {
    const canvas = this.canvasInstances[this.activePageIndex].canvas
    const activeObjects = canvas.getActiveObjects()

    function changeColorObject(activeObject, color) {
      if (activeObject.type === 'i-text' || activeObject.type === 'text') {
        activeObject.set('fill', color)
      } else if (activeObject.type === 'group') {
        activeObject.forEachObject((obj) => {
          if (obj.set) {
            obj.set('fill', color)
            obj.set('stroke', color)
          }
        })
      } else {
        activeObject.set('fill', color)
        activeObject.set('stroke', color)
      }
    }

    activeObjects.forEach(obj => changeColorObject(obj, color))
    canvas.renderAll()
    this.saveCanvasState()
  },

  undo() {
    if (this.canvasHistoryIndex > 0) {
      this.canvasHistoryIndex--
      this.loadCanvasState(this.canvasHistory[this.canvasHistoryIndex])
    }
  },

  // ... 100+ mais ações
}
```

**Benefício:** Cada ação é clara e testável independentemente.

---

### 3. **getters.ts** — Propriedades Computadas

Estados derivados e queries:

```typescript
// src/store/canvas/getters.ts
export const canvasGetters = {
  currentCanvasState: (state) => state.canvasHistory[state.canvasHistoryIndex],
  canUndo: (state) => state.canvasHistoryIndex > 0,
  canRedo: (state) => state.canvasHistoryIndex < state.canvasHistory.length - 1,
  isThisObjectSelected: (state) => state.isObjectSelected,
}
```

**Benefício:** Getters reativo que permitem computações eficientes.

---

### 4. **canvasStore.ts** — Orquestrador Principal

Agora, o arquivo principal é minúsculo e claro:

```typescript
// src/store/canvasStore.ts
import { defineStore } from 'pinia'
import { canvasState } from './canvas/state'
import { canvasActions } from './canvas/actions'
import { canvasGetters } from './canvas/getters'

export const useCanvasStore = defineStore('canvasStore', {
  state: canvasState,
  actions: canvasActions,
  getters: canvasGetters,
})
```

**Benefício:** Simples, legível e fácil de entender a estrutura em uma olhadinha.

---

## Impacto da Refatoração

**Linhas em um arquivo:** 2.124 → ~15

**Arquivos de store:** 1 → 4

**Tempo para encontrar uma ação:** ~2 min → ~10 seg

**Testabilidade:** Baixa → Alta

---

## Principais Features do Editor

### 1. **Múltiplas Páginas**

Cada projeto pode ter vários designs em abas:

```typescript
// Adicionar nova página
await store.addNewPage()

// Mover entre páginas
store.setActivePage(pageIndex)
```

### 2. **Undo/Redo Completo**

Histórico preservado por página:

```typescript
store.undo()  // Desfazer última ação
store.redo()  // Refazer ação desfeita
```

### 3. **Edição de Texto**

Alterar fonte, tamanho, alinhamento, cor:

```typescript
store.changeFont('Arial')
store.changeFontSize(32)
store.changeTextAlign('center')
store.changeColor('#FF0000')
```

### 4. **Efeitos em Imagens**

Blur, brilho, sépia, escala de cinza:

```typescript
store.changeBlur()        // Ajusta blur
store.changeBrightness()  // Ajusta brilho
store.changeSepia()       // Toggle sépia
store.changeGrayscale()   // Toggle escala de cinza
```

### 5. **Exportação**

Salvar em PNG, JPEG ou PDF:

```typescript
store.saveImage('png')
store.savePdf()
```

---

## Como Usar o Projeto

### Instalação

```bash
git clone https://github.com/diogo-palma/canva-clone.git
cd canva-clone
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação abrirá em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

---

## Dicas de Desenvolvimento

### 1. Adicionar Nova Ação

```typescript
// src/store/canvas/actions.ts
export const canvasActions = {
  // ... ações existentes
  
  minhaNovaMarcacao() {
    const canvas = this.canvasInstances[this.activePageIndex].canvas
    const activeObject = canvas.getActiveObject()
    
    if (activeObject) {
      activeObject.set('opacity', 0.5)
      canvas.renderAll()
      this.saveCanvasState()
    }
  }
}
```

### 2. Usar no Component

```vue
<template>
  <button @click="store.minhaNovaMarcacao">
    Aplicar Opacidade
  </button>
</template>

<script setup>
import { useCanvasStore } from '@/store/canvasStore'
const store = useCanvasStore()
</script>
```

### 3. Aecessar Getters

```vue
<template>
  <div v-if="store.canUndo">
    <button @click="store.undo">Desfazer</button>
  </div>
</template>

<script setup>
import { useCanvasStore } from '@/store/canvasStore'
const store = useCanvasStore()
</script>
```

---

## Desafios Enfrentados

### 1. **Sincronização de Estado com Canvas**

Fabric.js é imperativo, Vue é declarativo. Tive que criar listeners customizados:

```typescript
fabricCanvasObj.on('object:modified', (e) => {
  this.changeBackgroundColor()
  this.changeCornerRadius()
  const activeObject = e.target
  if (activeObject) {
    this.selectedAngle = Math.round(activeObject.angle)
  }
})
```

### 2. **Performance com Múltiplas Páginas**

Cada página é um canvas com potencial para centenas de objetos. Otimizei com:

- `markRaw()` para elementos Fabric (sem reatividade desnecessária)
- Lazy loading de páginas
- Renderização seletiva

### 3. **Undo/Redo com Múltiplas Páginas**

Precisei serializar todo o estado de todas as páginas:

```typescript
saveCanvasState() {
  const allCanvasStates = this.canvasInstances.map((instance) => {
    const json = instance.canvas.toJSON()
    // Processar metadados...
    return json
  })
  
  this.canvasHistory.push({
    states: allCanvasStates,
    pagesCount: [...this.pagesCount]
  })
}
```

---

## O Que Aprendemos

1. **Modularização é Chave** — Dividir código grande em módulos menores melhora drasticamente a manutenibilidade.

2. **Fabric.js é Poderoso** — Manipulação de canvas de baixo nível dá controle total, mas requer cuidado com performance.

3. **Pinia Simplifica Estado** — Comparado ao Vuex, Pinia é mais conciso e intuitivo.

4. **TypeScript Salva Vidas** — Com tipos bem definidos, refatorações em larga escala são seguras.

5. **Testes Importam** — Código modular é infinitamente mais fácil de testar.

---

## Próximos Passos

Possíveis melhorias:

- [ ] Suporte a colaboração em tempo real (WebSockets)
- [ ] Templates pré-prontos
- [ ] Biblioteca de assets curada
- [ ] Editor de animations mais avançado
- [ ] API de plugins para extensões customizadas

---

## Conclusão

O Canva Clone é um projeto excelente para aprender arquitetura de front-end moderno. A refatoração do store em módulos independentes não apenas tornou o código mais mantível, mas também estabeleceu um padrão que pode ser aplicado a outros projetos Vue + Pinia.

Se você está considerando construir um editor visual ou quer melhorar seus skills em Vue 3 e Fabric.js, [confira o repositório](https://github.com/diogo-palma/canva-clone) e contribua!

---

**Compartilhe suas ideias!** O que você gostaria de adicionar a um editor de design? Deixe um comentário abaixo! 👇
