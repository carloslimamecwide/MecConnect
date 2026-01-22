# Template Excel para Formulários

## Resumo da Implementação

Foram adicionadas funcionalidades completas de import/export de formulários via Excel, permitindo que os usuários:

1. **Baixem um template Excel** pré-formatado
2. **Preencham as informações do formulário** diretamente no Excel
3. **Façam upload do ficheiro** para importar os dados automaticamente

## Ficheiros Modificados

### 1. [src/services/excelService.ts](src/services/excelService.ts) (NOVO)

Novo serviço que gerencia toda a lógica de Excel:

- **`generateTemplate()`**: Cria um ficheiro Excel com 4 abas:
  - **Informações**: Preencher título, descrição e data de expiração em 3 idiomas (PT, EN, ES)
  - **Instruções**: Guia passo a passo para preenchimento
  - **Grupos e Perguntas**: Tabela para definir grupos, perguntas e tipos
  - **Opções**: Tabela para opções de Dropdowns

- **`downloadTemplate()`**: Gera o download do template Excel
- **`parseExcel(file)`**: Lê e valida ficheiro Excel importado

### 2. [app/(app)/(communication)/forms.tsx](<app/(app)/(communication)/forms.tsx>) (MODIFICADO)

#### Novos Imports

```tsx
import * as DocumentPicker from "expo-document-picker";
import { excelService, type ExcelFormData } from "../../../src/services/excelService";
```

#### Novos Estados

```tsx
const [showImportModal, setShowImportModal] = useState(false);
const [isImporting, setIsImporting] = useState(false);
```

#### Novas Funções

- **`handleDownloadTemplate()`**: Dispara download do template
- **`handleImportExcel()`**: Gerencia o fluxo de importação de ficheiro

#### Novos Botões na UI

Três botões adicionados ao lado do botão "Criar Formulário":

1. **Botão Verde "Template"** - Download do template Excel
2. **Botão Roxo "Importar"** - Upload e importação de ficheiro Excel
3. **Botão Azul "Criar"** - Criação manual de formulário (já existente)

#### Novo Modal

```tsx
<ConfirmModal
  visible={showImportModal}
  title="Importar do Excel"
  message="Selecione um ficheiro Excel preenchido com o template do formulário."
  confirmText="Selecionar"
  cancelText="Cancelar"
  onConfirm={handleImportExcel}
  onCancel={() => setShowImportModal(false)}
  isLoading={isImporting}
/>
```

## Como Usar

### Para o Utilizador

1. **Baixar Template**
   - Clique no botão verde "Template"
   - Ficheiro `template-formulario.xlsx` será descarregado

2. **Preencher no Excel**
   - Abra o ficheiro em Excel ou Sheets
   - Siga as instruções na aba "Instruções"
   - Preencha:
     - Aba "Informações": Título, descrição, data de expiração
     - Aba "Grupos e Perguntas": Estrutura do formulário
     - Aba "Opções": Opções para campos Dropdown (se aplicável)

3. **Importar de Volta**
   - Clique no botão roxo "Importar"
   - Selecione o ficheiro preenchido
   - O formulário será carregado no editor
   - Revise e customize conforme necessário
   - Clique em "Criar Formulário" para finalizar

### Estrutura do Excel

#### Aba "Informações"

| Campo             | PT         | EN      | ES      |
| ----------------- | ---------- | ------- | ------- |
| Título            | (texto)    | (texto) | (texto) |
| Descrição         | (texto)    | (texto) | (texto) |
| Data de Expiração | YYYY-MM-DD |         |         |

#### Aba "Grupos e Perguntas"

| Grupo # | Nome do Grupo (PT)  | Nome do Grupo (EN) | Nome do Grupo (ES) | Pergunta # | Texto (PT)       | Texto (EN)         | Texto (ES)          | Tipo    | Obrigatória |
| ------- | ------------------- | ------------------ | ------------------ | ---------- | ---------------- | ------------------ | ------------------- | ------- | ----------- |
| 1       | Informações Básicas | Basic Information  | Información Básica | 1          | Qual é seu nome? | What is your name? | ¿Cuál es su nombre? | TextBox | Sim         |

#### Aba "Opções" (para Dropdowns)

| Grupo # | Pergunta # | Opção # | Descrição (PT) | Descrição (EN) | Descrição (ES) |
| ------- | ---------- | ------- | -------------- | -------------- | -------------- |
| 1       | 2          | 1       | Excelente      | Excellent      | Excelente      |

## Validações

O serviço valida:

- ✅ Título preenchido em todos os idiomas
- ✅ Descrição preenchida em todos os idiomas
- ✅ Data de expiração válida (formato YYYY-MM-DD)
- ✅ Pelo menos um grupo com perguntas
- ✅ Perguntas preenchidas em todos os idiomas
- ✅ Opções de Dropdown preenchidas em todos os idiomas

## Dependências Adicionadas

```json
{
  "xlsx": "^0.18.x",
  "exceljs": "^4.x.x"
}
```

## Benefícios

- ⏱️ **Economia de Tempo**: Não precisa preencher tudo manualmente
- 📋 **Reutilização**: Pode manter templates salvos e reutilizá-los
- 🌐 **Multilíngue**: Facilita preenchimento em 3 idiomas
- ✅ **Validação**: Erros detectados antes de criar o formulário
- 📊 **Bulk Creation**: Pode criar múltiplos formulários via Excel
