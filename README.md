# LINHA DO TEMPO DO GOVERNISMO

Esse é o código para a matéria ["Uma história visual do governismo na Câmara"](https://www.estadao.com.br/infograficos/politica,taxa-de-governismo,964329).

## Estrutura do repo:

### code

No diretório `code`, você encontra arquivos usados para coletar e processar os bancos de dados.

`camaraPy.py` é um pacote Python, ainda em estágio inicial de desenvolvimento, que define métodos de conveniência para acessar a API da Câmara dos Deputados.

`makeRequests.py` inicia o processo de coleta, usando os arquivos .csv que estão disponíveis em `data/proposicoes-por-ano`. Tratam-se de listas de todas as proposicões apresentadas no Câmara. Ele retorna um arquivo csv para cada votação.

Como a API ainda está em estágio beta e alguns dados estão faltando, o programa vai gerar um novo diretório `data/scraping-control` que cria arquivos placeholder com os ids das proposições e votações que foram baixadas com sucesso e também as que retornaram algum problema. Esse log permite ter mais confiança na funcionalidade da coleta.

Em `generate-data.ipynb`, os dados são processados para o formato necessário para as visualizações de dados.

Em `analise.ipynb`, "entrevistamos" os registros, tentando encontrar ângulos de interesse.

### data

O diretório contém tanto os arquivos necessários para iniciar a coleta de dados, em `data/proposicoes-por-ano`, quanto o resultado das coletas feitas [por `code/maeRequests.py`, salvos em `data/csvs`.

Além disso, depois da execução de `makeRequests.py`, que inicia a coleta de dados, será criado um novo diretório, `scraping-control`, que serve para registrar que proposições e votações foram acessadas com sucesso e quais falharam.

### viz

O subdiretório `code` contém os arquivos JavaScript que geram os gráficos vistos na matéria, enquanto o subdiretório `data` contém os arquivos csvs usados para elaborar as visualizações.

## Outras notas metodológicas:

Foram feitas consultas para obter os resultados de cada uma das votações nominais que aconteceram na Câmara no período entre os dias 1º de janeiro de 2003 e 31 de dezembro de 2018. Quando o governo não registrou uma orientação ou liberou a bancada, os dados relacionados foram descartados. Depois, os resultados foram agrupados por partido.

Consideramos que um voto a favor do governo é aquele que segue exatamente a orientação da liderança. Por exemplo, caso a indicação seja “sim”, apenas os votos “sim” de um partido serão contados. Todos os demais (“não”, “obstrução” ou “abstenção”) são considerados votos contra o governo – ainda que, em situações específicas, possam ter sido benéficos para as intenções do executivo.

O sistema da Câmara encontra-se atualmente incompleto, então algumas votações importantes não constam do levantamento. Para ilustrar momentos chaves que estavam ausentes do banco de dados, a reportagem adicionou manualmente os resultados para a PEC da CPMF, de 2007, para a abertura do processo de impeachment de Dilma Rousseff e para as duas acusações criminais contra Michel Temer.
