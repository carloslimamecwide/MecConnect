import * as XLSX from "xlsx";
import type { I18nText, Language, QuestionDescType } from "./eventsService";

export interface ExcelFormData {
  title: I18nText;
  description: I18nText;
  dateExpiration: string;
  groups: Array<{
    groupName: I18nText;
    questions: Array<{
      text: I18nText;
      descType: QuestionDescType;
      required: boolean;
      options: Array<{
        description: I18nText;
      }>;
    }>;
  }>;
}

const LANGUAGES: Language[] = ["PT", "EN", "ES"];

export const excelService = {
  /**
   * Gera um template Excel para preenchimento de formulário
   */
  generateTemplate(): void {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Instruções
    const instructionsSheet = XLSX.utils.aoa_to_sheet([
      ["INSTRUÇÕES PARA PREENCHIMENTO", "", "", ""],
      ["", "", "", ""],
      ["1. Na aba 'Informações', preencha:"],
      ["   - Título do formulário em PT, EN, ES"],
      ["   - Descrição em PT, EN, ES"],
      ["   - Data de expiração no formato YYYY-MM-DD (só em PT)"],
      ["", "", "", ""],
      ["2. Na aba 'Grupos e Perguntas', preencha:"],
      ["   - Coluna A: Número do grupo (ex: 1, 1, 1, 2, 2...)"],
      ["   - Coluna B: Nome do grupo em PT"],
      ["   - Coluna C: Nome do grupo em EN"],
      ["   - Coluna D: Nome do grupo em ES"],
      ["   - Coluna E: Número da pergunta dentro do grupo"],
      ["   - Coluna F: Texto da pergunta em PT"],
      ["   - Coluna G: Texto da pergunta em EN"],
      ["   - Coluna H: Texto da pergunta em ES"],
      ["   - Coluna I: Tipo (TextBox, Dropdown, Rating)"],
      ["   - Coluna J: Obrigatória (Sim/Não)"],
      ["   - Coluna K: Exemplo? (Sim/Não) — marque 'Sim' para manter apenas como exemplo"],
      ["   - Comece a preencher a partir da linha abaixo dos exemplos (linhas 8 em diante)"],
      ["", "", "", ""],
      ["3. Se tipo for 'Dropdown', na aba 'Opções':"],
      ["   - Coluna A: Número do grupo"],
      ["   - Coluna B: Número da pergunta"],
      ["   - Coluna C: Número da opção"],
      ["   - Coluna D: Descrição em PT"],
      ["   - Coluna E: Descrição em EN"],
      ["   - Coluna F: Descrição em ES"],
      ["   - Coluna G: Exemplo? (Sim/Não) — marque 'Sim' para ignorar na importação"],
      ["   - Comece a preencher a partir da linha abaixo dos exemplos (linhas 8 em diante)"],
    ]);
    instructionsSheet["!cols"] = [{ wch: 80 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];

    // Sheet 2: Informações gerais
    const infoSheet = XLSX.utils.aoa_to_sheet([
      ["INFORMAÇÕES DO FORMULÁRIO", "", "", ""],
      ["", "", "", ""],
      ["Campo", "PT", "EN", "ES"],
      ["Título", "", "", ""],
      ["Descrição", "", "", ""],
      ["Data de Expiração (YYYY-MM-DD)", "", "", ""],
    ]);
    infoSheet["!cols"] = [{ wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }];

    // Sheet 3: Grupos e Perguntas
    const groupsSheet = XLSX.utils.aoa_to_sheet([
      [
        "Grupo #",
        "Nome do Grupo (PT)",
        "Nome do Grupo (EN)",
        "Nome do Grupo (ES)",
        "Pergunta #",
        "Texto (PT)",
        "Texto (EN)",
        "Texto (ES)",
        "Tipo",
        "Obrigatória",
        "Exemplo? (Sim/Não)",
      ],
      [
        "1",
        "Informações Básicas",
        "Basic Information",
        "Información Básica",
        "1",
        "Qual é seu nome?",
        "What is your name?",
        "¿Cuál es su nombre?",
        "TextBox",
        "Sim",
        "Sim",
      ],
      [
        "1",
        "Informações Básicas",
        "Basic Information",
        "Información Básica",
        "2",
        "Como avalia a experiência?",
        "How do you rate the experience?",
        "¿Cómo evalúa la experiencia?",
        "Rating",
        "Sim",
        "Sim",
      ],
      [
        "1",
        "Informações Básicas",
        "Basic Information",
        "Información Básica",
        "3",
        "Escolha a versão usada",
        "Choose the version used",
        "Elija la versión usada",
        "Dropdown",
        "Sim",
        "Sim",
      ],
      [
        "2",
        "Feedback do Produto",
        "Product Feedback",
        "Feedback del Producto",
        "1",
        "Qual é seu cargo?",
        "What is your role?",
        "¿Cuál es su rol?",
        "TextBox",
        "Sim",
        "Sim",
      ],
      [
        "2",
        "Feedback do Produto",
        "Product Feedback",
        "Feedback del Producto",
        "2",
        "Avalie a estabilidade",
        "Rate the stability",
        "Evalúe la estabilidad",
        "Rating",
        "Sim",
        "Sim",
      ],
      [
        "2",
        "Feedback do Produto",
        "Product Feedback",
        "Feedback del Producto",
        "3",
        "Qual plataforma usa?",
        "Which platform do you use?",
        "¿Qué plataforma usa?",
        "Dropdown",
        "Sim",
        "Sim",
      ],
    ]);
    groupsSheet["!cols"] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 12 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    // Sheet 4: Opções (para Dropdown)
    const optionsSheet = XLSX.utils.aoa_to_sheet([
      ["Grupo #", "Pergunta #", "Opção #", "Descrição (PT)", "Descrição (EN)", "Descrição (ES)", "Exemplo? (Sim/Não)"],
      ["1", "3", "1", "Versão Lite", "Lite version", "Versión Lite", "Sim"],
      ["1", "3", "2", "Versão Pro", "Pro version", "Versión Pro", "Sim"],
      ["1", "3", "3", "Versão Enterprise", "Enterprise version", "Versión Enterprise", "Sim"],
      ["2", "3", "1", "Mobile", "Mobile", "Móvil", "Sim"],
      ["2", "3", "2", "Desktop", "Desktop", "Escritorio", "Sim"],
      ["2", "3", "3", "Web", "Web", "Web", "Sim"],
    ]);
    optionsSheet["!cols"] = [{ wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 18 }];

    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instruções");
    XLSX.utils.book_append_sheet(workbook, infoSheet, "Informações");
    XLSX.utils.book_append_sheet(workbook, groupsSheet, "Grupos e Perguntas");
    XLSX.utils.book_append_sheet(workbook, optionsSheet, "Opções");

    XLSX.writeFile(workbook, "template-formulario.xlsx");
  },

  /**
   * Faz download do template Excel
   */
  downloadTemplate(): void {
    this.generateTemplate();
  },

  /**
   * Parse ficheiro Excel e extrai dados
   */
  parseExcel(file: File): Promise<ExcelFormData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });

          // Ler sheet de informações
          const infoSheet = workbook.Sheets["Informações"];
          const infoData = XLSX.utils.sheet_to_json(infoSheet, { header: 1 }) as any[];

          // Ler sheet de grupos e perguntas
          const groupsSheet = workbook.Sheets["Grupos e Perguntas"];
          const groupsData = XLSX.utils.sheet_to_json(groupsSheet) as any[];

          // Ler sheet de opções
          const optionsSheet = workbook.Sheets["Opções"];
          const optionsData = XLSX.utils.sheet_to_json(optionsSheet) as any[];

          // Extrair informações gerais
          const title: I18nText = {
            PT: String(infoData[3]?.[1] || "").trim(),
            EN: String(infoData[3]?.[2] || "").trim(),
            ES: String(infoData[3]?.[3] || "").trim(),
          };

          const description: I18nText = {
            PT: String(infoData[4]?.[1] || "").trim(),
            EN: String(infoData[4]?.[2] || "").trim(),
            ES: String(infoData[4]?.[3] || "").trim(),
          };

          let dateExpiration = new Date().toISOString().split("T")[0];
          const rawDateCell = infoData[5]?.[1];

          const pad = (num: number) => String(num).padStart(2, "0");
          const parseExcelDate = (value: any): string | null => {
            if (value instanceof Date && !isNaN(value.getTime())) {
              return value.toISOString().split("T")[0];
            }

            if (typeof value === "number") {
              const parsed = XLSX.SSF.parse_date_code(value);
              if (parsed && parsed.y && parsed.m && parsed.d) {
                return `${parsed.y}-${pad(parsed.m)}-${pad(parsed.d)}`;
              }
            }

            if (typeof value === "string") {
              const trimmed = value.trim();
              if (!trimmed) return null;
              if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
              const parsedDate = new Date(trimmed);
              if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString().split("T")[0];
              }
            }

            return null;
          };

          const parsedDate = parseExcelDate(rawDateCell);
          if (parsedDate) {
            dateExpiration = parsedDate;
          }

          // Validações básicas
          if (!title.PT || !title.EN || !title.ES) {
            throw new Error("Título deve ser preenchido em todos os idiomas");
          }
          if (!description.PT || !description.EN || !description.ES) {
            throw new Error("Descrição deve ser preenchida em todos os idiomas");
          }

          // Processar grupos e perguntas
          const groupsMap = new Map<number, (typeof groupsData)[0][]>();
          groupsData.forEach((row) => {
            const isExample = String(row["Exemplo? (Sim/Não)"] || "").toLowerCase() === "sim";
            const groupNum = Number(row["Grupo #"]);
            const questionNum = Number(row["Pergunta #"]);

            if (isExample || isNaN(groupNum) || isNaN(questionNum)) {
              return;
            }

            if (!groupsMap.has(groupNum)) {
              groupsMap.set(groupNum, []);
            }
            groupsMap.get(groupNum)!.push(row);
          });

          const groups: ExcelFormData["groups"] = [];
          groupsMap.forEach((groupRows) => {
            if (!groupRows.length) return;

            const firstRow = groupRows[0];
            const groupName: I18nText = {
              PT: String(firstRow["Nome do Grupo (PT)"] || "").trim(),
              EN: String(firstRow["Nome do Grupo (EN)"] || "").trim(),
              ES: String(firstRow["Nome do Grupo (ES)"] || "").trim(),
            };

            const questions = groupRows.map((row) => {
              const questionText: I18nText = {
                PT: String(row["Texto (PT)"] || "").trim(),
                EN: String(row["Texto (EN)"] || "").trim(),
                ES: String(row["Texto (ES)"] || "").trim(),
              };

              const descType = (String(row["Tipo"] || "TextBox").trim() as QuestionDescType) || "TextBox";
              const required = String(row["Obrigatória"] || "Sim").toLowerCase() === "sim";

              // Procurar opções para este dropdown
              const questionOptions: Array<{ description: I18nText }> = [];
              if (descType === "Dropdown") {
                const groupNum = Number(firstRow["Grupo #"]);
                const questionNum = Number(row["Pergunta #"]);
                const matchingOptions = optionsData
                  .filter((opt) => {
                    const isExample = String(opt["Exemplo? (Sim/Não)"] || "").toLowerCase() === "sim";
                    const optGroupNum = Number(opt["Grupo #"]);
                    const optQuestionNum = Number(opt["Pergunta #"]);
                    const optOptionNum = Number(opt["Opção #"]);
                    return (
                      !isExample &&
                      !isNaN(optGroupNum) &&
                      !isNaN(optQuestionNum) &&
                      !isNaN(optOptionNum) &&
                      optGroupNum === groupNum &&
                      optQuestionNum === questionNum
                    );
                  })
                  .sort((a, b) => Number(a["Opção #"]) - Number(b["Opção #"]));

                matchingOptions.forEach((opt) => {
                  questionOptions.push({
                    description: {
                      PT: String(opt["Descrição (PT)"] || "").trim(),
                      EN: String(opt["Descrição (EN)"] || "").trim(),
                      ES: String(opt["Descrição (ES)"] || "").trim(),
                    },
                  });
                });
              }

              return {
                text: questionText,
                descType,
                required,
                options: questionOptions,
              };
            });

            groups.push({
              groupName,
              questions,
            });
          });

          if (!groups.length) {
            throw new Error("Nenhum grupo encontrado na planilha");
          }

          resolve({
            title,
            description,
            dateExpiration,
            groups,
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Erro ao ler o ficheiro"));
      reader.readAsArrayBuffer(file);
    });
  },
};
