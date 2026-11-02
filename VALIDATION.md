# PersonFit — validação

Verificações executadas em 1 de novembro de 2026 (horário do Brasil).

## Testes automatizados

`npm test`: 14 testes aprovados. `npm run build`: arquivos, catálogo e mídias presentes, com alternativas válidas.

- Duas divisões geram exercícios diferentes e respeitam quantidades manuais de 3, 4 e 5 na matriz testada.
- Frequências de 1 a 6 dias têm a quantidade correta de sessões na janela de 28 dias. A divisão por grupos cobre os seis grupos principais.
- Divisão personalizada com grupos principais repetidos em dias consecutivos é bloqueada, oferecendo redistribuição editável.
- Equipamentos insuficientes, grupos ausentes, quantidade indisponível e tempo insuficiente produzem erro explicativo.
- Objetivos mudam séries, repetições e descanso sem criar cargas fictícias; iniciantes não recebem os exercícios classificados como complexidade 2.
- Vírgula e ponto aceitos; campo vazio diferente de zero; valores inválidos rejeitados.
- Novas sessões têm cargas vazias e exercícios pendentes. Alterar o template não muda a cópia do registro anterior.
- Reiniciar o plano remove sessões não finalizadas e preserva histórico concluído, com opção de manter ou remover perfil.
- Backup válido faz ida e volta; versões desconhecidas, cargas inválidas, identificadores malformados e sessões órfãs são rejeitados.
- Datas locais atravessam mudanças de mês e ano.
- Todos os 30 exercícios têm vídeo MP4 e miniatura locais, fonte e licença. Alternativas compartilham o mesmo padrão de movimento.
- Service worker testado em ambiente isolado com cache e rede simulados: shell em `/PersonFit/`, navegação sem rede, mídia completa e respostas parciais de vídeo (206, sufixos e 416).
- A instalação não baixa a biblioteca de vídeos inteira.

A simulação do service worker não substitui um ensaio offline em um aparelho real.

## Navegador

Inspeção e interação em Chrome remoto pela prévia de desenvolvimento:

- Configuração completa em cinco etapas, objetivo com explicação, resumo editável e criação do plano.
- Geração de seis exercícios por sessão na opção recomendada, com calendário de treino e descanso.
- Início de sessão, entrada de `12,5` kg, check de conclusão e persistência após recarregar.
- Reprodução do vídeo ampliado do supino: `readyState=4`, duração 15,83 s, sem erro de mídia. Miniaturas visíveis reproduzem; fora da tela não recebem arquivo de vídeo até serem necessárias.
- Confirmação de sessão parcial e presença no histórico.
- Nova data começa com 0/6 e carga vazia; última carga 12,5 kg aparece apenas como referência.
- Tema escuro escolhido nos ajustes e mantido após navegação/recarregamento.
- Editor de plano em 320 px: modal sem overflow interno; alteração de três para duas séries salva e refletida na sessão futura.
- Layout renderizado em iframe com viewports de 320, 360, 390 e 430 px: sem overflow horizontal do documento. O seletor de datas tem sua própria rolagem horizontal, deliberadamente.
- Inspeção visual em 320 e 390 px. Ações de treino foram retiradas da posição sobreposta e ficam no fluxo, acima e abaixo da lista. Navegação inferior tem espaço reservado no conteúdo.

A prévia HTTP usada não é um contexto seguro: service worker não fica disponível nela. O fluxo de download/verificação dos vídeos foi implementado, mas a preparação offline completa no navegador e a instalação ainda precisam de ensaio em HTTPS/aparelho.

A tentativa de verificar o download de backup pela automação do navegador excedeu o tempo de espera da ferramenta. A exportação está implementada; a validação e a restauração de estrutura foram verificadas por teste automatizado, sem afirmar uma importação/exportação completa pelo navegador.

## Não verificado em aparelho real

- Safari no iPhone, Chrome no Android, teclado decimal nativo aberto, recortes de tela e áreas seguras reais.
- Instalação PWA, retomada pelo ícone e reprodução de todas as mídias no Safari.
- Alternância de aparência do sistema e movimento reduzido em um aparelho. As consultas de mídia e listeners estão implementados.
- Offline ponta a ponta após cortar a conexão real e comportamento com pouco armazenamento.
- Publicação efetiva em uma conta GitHub do usuário. Há workflow pronto e caminhos relativos; o service worker foi testado com subdiretório em simulação.

## Limitações conhecidas

- Os vídeos têm cenário de academia, não fundo neutro. Foram usadas mídias reais com licença identificada, sem inventar GIFs.
- Biblioteca de 30 exercícios. Poucas opções de costas e ausência de uma rotina completa apenas com peso corporal. Algumas combinações de equipamentos/quantidade são bloqueadas com explicação.
- Conferência visual de exercício/equipamento não equivale a revisão profissional da técnica nem das regras de prescrição.
- Plano de quatro semanas a partir da criação, não renovado automaticamente nem necessariamente alinhado ao primeiro/último dia do mês.
- Os dias da semana são distribuídos automaticamente; a configuração pede quantidade de dias, não uma escolha de segundas/terças específicas.
- Anotações de restrições não são interpretadas automaticamente. O usuário precisa marcar exclusões e revisar o plano.
- Ao editar um template, sessões já criadas mantêm sua versão. Isso preserva registros, inclusive rascunhos ainda não iniciados.
- Substituições que não estavam no plano preparado precisam de internet para buscar seu vídeo. Prepare novamente após mudanças.
- O cronômetro não envia notificações em segundo plano. Dados não sincronizam entre dispositivos.

## Publicação de prévia

A publicação privada no Sites concluiu com sucesso. A URL de prévia abre a proteção de acesso do ChatGPT; esse login pertence à hospedagem de prévia. O código estático entregue não inclui login, e o workflow do GitHub Pages não cria essa proteção. A barreira da prévia impediu o teste de service worker em HTTPS pelo navegador remoto.
