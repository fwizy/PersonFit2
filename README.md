# PersonFit

Aplicativo de treino com prioridade para o celular. Cria um plano local de quatro semanas, exibe demonstrações em vídeo e registra exercícios, séries e cargas. Funciona como site estático, sem conta no aplicativo, sem API de IA, chave secreta ou banco remoto.

## Como usar

1. Escolha sua prioridade: ganhar massa muscular, ganhar força ou melhorar o condicionamento.
2. Informe sua experiência, dias disponíveis, tempo e quantidade de exercícios principais. “Recomendado para mim” calcula uma quantidade compatível com tempo e catálogo.
3. Escolha divisão por movimento ou grupos musculares. Com menos dias, combine grupos; o resumo não permite omitir silenciosamente os seis grupos principais.
4. Selecione equipamentos. Para restrições, anote e marque explicitamente os exercícios a excluir. A anotação não é interpretada como avaliação clínica nem gera exclusões automáticas.
5. Revise o resumo e crie seu plano. Se a quantidade não couber no tempo ou no catálogo, ajuste antes de continuar.

O plano começa na data local da criação e dura 28 dias. Os dias de treino são distribuídos automaticamente nessa janela; o calendário mostra as datas exatas e os descansos. Não é gerado outro plano na virada do mês. Os exercícios permanecem estáveis para permitir comparação de cargas. O plano é uma sugestão e pode ser revisado por um profissional.

### Durante o treino

Abra Treino, selecione a data e toque em **Iniciar treino**. Digite a carga em kg, com vírgula ou ponto. Vazio é “não registrado”; zero é um valor registrado. Em halteres, o valor é por halter. As opções expansíveis permitem registrar peso corporal e cargas por série. Quando há cargas por série, elas prevalecem na exibição do histórico.

A última carga aparece apenas como referência. **Usar anterior** confirma sua reutilização na sessão atual. Nunca há aumento automático de carga. O check marca somente o exercício tocado e pode ser desfeito antes de finalizar. Cada nova data começa com os exercícios pendentes e cargas vazias.

Toque na miniatura para ampliar a demonstração. O vídeo tem controles de reprodução e orientações curtas. Miniaturas fora da tela são pausadas; com movimento reduzido, só reproduzem por ação do usuário. O descanso pode ser iniciado manualmente com 45 a 180 segundos. O cronômetro considera o horário transcorrido, inclusive ao trocar de aplicativo, mas não emite notificação em segundo plano.

**Finalizar treino** pede confirmação e permite salvar uma sessão parcial, mantendo os exercícios pendentes identificados. Um treino iniciado e não finalizado é retomado após recarregar. Dados são salvos no IndexedDB do navegador a cada alteração.

### Edição e substituição

**Editar este treino** altera ordem, exercícios, quantidade (3 a 10, conforme disponibilidade), séries, repetições e descanso. A edição verifica tempo e cobertura muscular. Vale para próximas sessões ainda sem registro; uma sessão já criada preserva sua cópia. Histórico concluído não é reescrito. Para alterar tempo global, frequência, objetivo ou divisão, recrie o plano e reutilize o perfil quando desejar.

Quando o equipamento está ocupado, expanda as opções do exercício e toque em **Substituir exercício**. Só aparecem variações do mesmo padrão de movimento, com seus equipamentos e exclusões. Se não existir uma alternativa adequada, o aplicativo informa isso. A substituição zera carga e conclusão daquele exercício na sessão para evitar atribuir registros ao movimento errado.

### Histórico

Consulte as sessões salvas e abra o registro com séries, repetições, descansos e cargas. O seletor de exercício mostra a evolução em uma lista por data, sem estimativas de força máxima ou métricas inventadas. Exercícios não concluídos ficam identificados.

### Tema

Em **Ajustes → Aparência**, escolha Sistema, Claro ou Escuro. Sistema segue alterações do aparelho; a escolha manual persiste. A preferência é lida antes da folha de estilos para evitar abertura com o tema errado.

### Reiniciar

**Apagar plano e começar de novo** pede confirmação, informa se há progresso não finalizado e permite reutilizar ou refazer o perfil. Preserva o histórico concluído e remove sessões não finalizadas do plano apagado.

**Apagar todos os dados** é separado: exige confirmação adicional de que o histórico também será removido. Exclui perfil, plano, sessões e preferências locais. Os arquivos estáticos e vídeos em cache não contêm registros pessoais; podem permanecer no cache do navegador.

### Backup

Em Ajustes, exporte um JSON e guarde em um lugar seguro. Importar valida versão, estrutura, exercícios e cargas antes de oferecer a substituição. Um arquivo inválido não altera os dados atuais. A importação requer confirmação e substitui os dados; não faz mesclagem. O limite é 10 MB por arquivo.

Os registros ficam apenas naquele navegador e dispositivo. A instalação como PWA, a troca de navegador ou o modo privado podem ter armazenamentos separados, conforme o sistema. Para transferir seus registros, use o backup.

## Offline e instalação

Com internet, abra **Ajustes → Preparar plano offline**. O aplicativo baixa os vídeos e miniaturas usados pelo plano e pelas sessões não finalizadas e verifica o shell do aplicativo. Mostra progresso e quantidade de falhas. Só apresenta **Pronto para usar offline** depois de verificar todos os arquivos necessários em cache. Se falhar, tente preparar novamente.

Após o preparo, o shell, plano, demonstrações já baixadas e registro de treino funcionam sem internet. Substituições que não faziam parte do conteúdo preparado precisam de internet para baixar o vídeo. Depois de editar ou recriar o plano, prepare o conteúdo novamente. O navegador ainda pode remover caches por falta de espaço.

- **iPhone:** abra no Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.
- **Android:** abra no Chrome, menu → Instalar aplicativo. Quando suportado, o botão Instalar também aparece nos ajustes.

Instalação e service worker exigem HTTPS ou localhost. Servir os arquivos em HTTP comum permite usar o aplicativo, mas não oferece offline/PWA. Atualizações aguardam ativação manual, e o aplicativo impede ativá-las durante uma sessão iniciada.

## Executar no computador

Requer Node.js 22+ apenas para testes/verificação. Não há instalação de dependências.

```sh
npm test
npm run build
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000`. Não abra `index.html` diretamente pelo protocolo `file://`: os módulos, o catálogo e o service worker precisam de um servidor HTTP.

## Publicar no GitHub Pages

1. Crie um repositório e envie **todo o conteúdo deste projeto**, incluindo `.github/workflows/pages.yml`, `dist/media`, `dist/library.json` e os arquivos da raiz. Não envie backups pessoais.
2. Use a branch `main` ou ajuste o workflow se a sua branch tiver outro nome.
3. No GitHub, acesse **Settings → Pages → Source → GitHub Actions**.
4. Envie uma alteração para `main` ou execute **Actions → Publicar PersonFit → Run workflow**.
5. Aguarde a etapa Publicar terminar. Abra a URL informada pelo GitHub.

O workflow executa os testes e a checagem dos arquivos e publica `dist/`. O comando `build` apenas verifica a integridade; os arquivos já estão prontos. Caminhos são relativos, incluindo manifest, vídeos e service worker, então o projeto pode ficar em `https://usuario.github.io/PersonFit/`. Não há rotas de servidor: toda a navegação usa a mesma página, evitando 404 ao atualizar.

### Atualizar

Edite os arquivos, execute os testes e envie para `main`. Para uma nova versão do shell, atualize em conjunto o nome do cache do shell no `sw.js` e na checagem offline do `app.js`. O cache de mídia pode manter seu nome enquanto os arquivos não mudarem. Não altere a origem, o caminho da instalação nem os identificadores estáveis dos exercícios para preservar os dados e a comparação histórica. Mudanças de schema precisam de uma migração explícita do IndexedDB e do importador.

Não use `skipWaiting()` automático: a atualização fica disponível em Ajustes e só deve ser ativada fora de uma sessão em andamento. Esta versão não remove caches antigos automaticamente; versões futuras podem fazê-lo após a ativação segura.

## Estrutura

```text
dist/                 Site publicável
  app.js              Interface e persistência
  core.js             Regras, datas, sessões e validação de backup
  library.json        30 exercícios curados
  media/              MP4 H.264 e miniaturas locais
  sw.js               Shell offline e suporte a requisições parciais de vídeo
  manifest.webmanifest
  ATTRIBUTIONS.md     Origem e licenças por exercício
scripts/check.mjs     Verificação da entrega
scripts/wger-source.json  Snapshot de metadados da fonte
tests/                Testes de regras e service worker
.github/workflows/    Publicação no GitHub Pages
VALIDATION.md         Verificações executadas e limites
```

## Fontes e limites

O código original é MIT. Dados e mídias têm licenças próprias, detalhadas em [ATTRIBUTIONS.md](dist/ATTRIBUTIONS.md), incluindo autoria, URL original, licença e alterações. Os vídeos são de Goulart, via wger, CC BY-SA 4.0. O código do wger (AGPL) não foi incorporado. Repositórios com permissão ambígua para redistribuição de GIFs foram pesquisados e descartados.

A biblioteca é deliberadamente limitada a 30 vídeos disponíveis e conferidos. A cobertura de costas e de treino apenas com peso corporal é pequena; algumas combinações de equipamentos, divisões e quantidades não podem ser geradas. O aplicativo explica essas incompatibilidades. Os vídeos mostram uma academia real, **não um fundo neutro**. Não são animações produzidas especificamente para o PersonFit. A correspondência visual foi conferida; isso não equivale a revisão técnica por um profissional de educação física.

Consulte [VALIDATION.md](VALIDATION.md) para distinguir testes automatizados, verificações no navegador e verificações pendentes em aparelhos reais.
