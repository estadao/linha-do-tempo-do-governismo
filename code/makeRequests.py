#######################
### makeRequests.py ###
#######################
#           ||
#    (\__/) ||
#    ( O.O) ||
#    / 　  づ

'''
Esse script roda as requisições necessárias para reunir
todos os dados para a matéria e salva em diversos arquivos
no formato .json para serem posteriormente processados.
'''
####################
### DEPENDÊNCIAS ###
####################
#           ||
#    (\__/) ||
#    ( O.O) ||
#    / 　  づ

import time

import traceback

import re

import sys

import glob

import os

import shutil

from camaraPy import *

from multiprocessing import Pool as ThreadPool


#####################
###    CLASSES    ###
### PARA CONTROLE ###
#####################
#           ||
#    (\__/) ||
#    ( O.O) ||
#    / 　  づ


### AINDA A IMPLEMENTAR

####################
###   FUNÇŌES    ###
###  AUXILIARES  ###
####################
#           ||
#    (\__/) ||
#    ( O.O) ||
#    / 　  づ

def find_fpaths(dir_path, pattern):
    
    '''
    >> DESCRIÇÃO
    
    Usa o módulo glob para buscar todos os arquivos
    que correspondam ao padrão passado na variável 
    pattern'. Retorna uma lista de paths no formato 
    string. 
    
    >> PARÂMETROS
    
    dir_path -> uma string com o caminho para o
    diretório onde a busca pelos arquivos será
    realizada.
    
    pattern -> uma string com o padrão de texto
    que deve ser procurado no diretório.
    
    '''
    
    # Caso o dir_path não possua final em "/", adicone
    if dir_path[-1] != '/':
        dir_path += "/"
    
    full_pattern = dir_path + pattern
    files = glob.glob(full_pattern)
    
    return files

def read_and_concat(dir_path, pattern, axis=0, sep=None, quotechar=None, ignore_index=True):
    
    '''
    >> DESCRIÇÃO
    
    Chama a função find_fpaths definida acima
    e funções built-in do pandas para concatenar
    todos os arquivos em formato .csv que estão
    dentro de um diretório. Retorna um dataframe.
    
    >> PARÂMETROS
    
    dir_path -> uma string com o caminho para o
    diretório onde a busca pelos arquivos será
    realizada.
    
    pattern -> uma string com o padrão de texto
    que deve ser procurado no diretório.
    
    axis -> eixo em que vai acontecer a concatenação (default: 0)
    
    sep -> separador dos arquivos .csv em questão (default: ',')
    
    quotechar -> especifica o delimitador que encapsula
    os campos do arquivo (default: None)
    
    ignore_index -> especifica se o índice dos arquivos
    deve ser descartado ao concatenar (default: True)
    '''
    
    # Seleciona os caminhos para os arquivos
    data_ = find_fpaths(dir_path, pattern)
    
    # Lê todos os arquivos em uma lista de dataframes
    data_ = [ pd.read_csv( file, sep = sep, quotechar = quotechar ) for file in data_ ]
    
    # Concatena todos em um único dataframe
    data_ = pd.concat(data_, axis = axis, ignore_index = ignore_index)
    
    # Retorna
    return data_

def save_log(directory, filename, content = None):

  '''
  >> DESCRIÇÃO
  
  Salva um arquivo de texto com base nos parâmetros

  >> PARÂMETROS

  var -> Variável que vai ser serializada

  directory -> Caminho do diretório

  filename -> Nome do arquivo sem o diretório

  '''

  os.makedirs(directory, exist_ok = True)

  filename = directory + filename

  f = open( filename, "w+" )

  if content is not None:
    f.write(content)

  f.close()



####################
###     RODA     ###
###     TUDO     ###
####################
#           ||
#    (\__/) ||
#    ( O.O) ||
#    / 　  づ

def get_data(proposition_id, year):
  '''
  >> DESCRIÇÃO:
  Script que gera diversos csvs com a 'taxa de governismo'
  de cada partido em uma votação específica, fazendo todas
  as requisições e transformações necessárias 
  
  >> PARÂMETROS

  '''

  # Lê os parâmetros de controle

  time.sleep(.2)

  year           = type_check(year, str)
  proposition_id = type_check(proposition_id, str)

  proposition_id_control = find_fpaths("../data/scraping_control/checked_proposition_ids/" + year + "/", '*')
  vote_id_control        = find_fpaths("../data/scraping_control/checked_vote_ids/"  + year + "/", '*')

  # Usa regex para ficar só com o final do caminho
  proposition_id_control = [ re.search('.*/(\d+)', item).group(1) for item in proposition_id_control ]
  vote_id_control        = [ re.search('.*/(\d+)', item).group(1) for item in vote_id_control ]

  unexpected_err_proposition_fps    = find_fpaths('../data/scraping_control/unexpected_errors_proposition_ids/' + year + '/', '*')
  unexpected_err_proposition_ids    = [ re.search('.*/(\d+)', item).group(1) for item in unexpected_err_proposition_fps ]

  unexpected_err_vote_fps    = find_fpaths('../data/scraping_control/unexpected_errors_proposition-ids/' + year + '/', '*')
  unexpected_err_vote_ids    = [ re.search('.*/(\d+)', item).group(1) for item in unexpected_err_vote_fps ]

  # Verifique se este id já foi completamente baixado em uma das variáveis de controle
  if proposition_id in proposition_id_control:

  # Se foi, retorne um valor nulo
    # print("A proposição", proposition_id, "já foi salva, de acordo com os meus registros :)")
    return

  # Se não foi...
  else:

    try:
        vote_ids =  make_proposition_request(
          id_      = proposition_id, 
          req_type = 'votacoes'
        )

        vote_ids = [ str(item['id']) for item in vote_ids['dados'] ]

        for vote_id in vote_ids:

          try:

            if vote_id in vote_id_control:
             # print("Já existe um arquivo para a votação", vote_id, "nos meus registros :)")
              continue

            # Caso não tenha sido salva...
            else:

             # print("Vamos calcular os valores de governismo da votação", vote_id, "referente à proposição", proposition_id)
              vote_object = make_vote_request(
                id_      = vote_id, 
                req_type = 'votos'
              )

              gen_vote_object = make_vote_request(
                id_      = vote_id, 
                req_type = ''
              )

              # A partir do objeto de resultados, recupere os votos de todos os parlamentares
              votes_by_representative = get_all_votes(
                id_       = vote_id, 
                data      = vote_object, 
                return_df = True
              )

              # Com esse objeto, agrupe o resultado por partido
              party_vote_count = get_party_vote_count(
                  id_       = vote_id, 
                  data      = votes_by_representative, 
                  normalize = False
              )

              # Pegue, agora, a orientação dos partidos para essa votação
              party_orientation = get_party_orientation(
                id_       = vote_id, 
                data      = gen_vote_object, 
                return_df = True
              )

              # A partir desse grupo, calcule uma taxa de governismo em números absolutos
              government_support_count = get_government_support_count(
                id_               = vote_id, 
                party_vote_count  = party_vote_count, 
                party_orientation = party_orientation, 
                normalize         = False 
              )

              # Salve o csv
              csv_dir = '../data/csvs/' + year + '/'
              if not os.path.exists(csv_dir):
                 os.makedirs(csv_dir)
              government_support_count.to_csv(csv_dir + vote_id + '.csv', index = False)

              # Adicione o id do voto para o controle
              print("Terminamos a coleta da votação", vote_id)

            # Se ele estiver entre os erros inesperados, remova
            # Isso tira de lá exceções que ocorream por instabilidades temporárias no servidor
            if vote_id in unexpected_err_vote_ids:
              print("Essa proposição retornava um erro que já foi resolvido. Vamos removê-la da lista de exceções.")
              os.remove('../data/scraping_control/unexpected_errors_vote_ids/' + year + '/' + vote_id)

            # Salva o arquivo controle dos votos
            save_log(
              directory = '../data/scraping_control/checked_vote_ids/' + year + '/',
              filename = vote_id
            )

          except KeyboardInterrupt as e:
            raise
          except Exception as e:
            print('Erro não capturado na votação', vote_id, 'referente à proposição', proposition_id + '. x.x Salvamos ela em um log para você debugar depois.')
            error_message = traceback.format_exc()
            save_log(
              directory = '../data/scraping_control/unexpected_errors_vote_ids/' + year + '/',
              filename  = vote_id,
              content   = error_message,
            )

        # Ao fim do processo, adicione o id da proposição para o valor controle
        #print("Terminamos a coleta das votações da proposição", proposition_id)

        # Salva o arquivo no log das proposições terminadas
        save_log(
          directory = '../data/scraping_control/checked_proposition_ids/' + year + '/',
          filename = proposition_id

        )

        # Se ele estiver entre os erros inesperados, remova
        # Isso tira de lá exceções que ocorream por instabilidades temporárias no servidor
        if proposition_id in unexpected_err_proposition_ids:
          #print("Essa proposição retornava um erro que já foi resolvido. Vamos removê-la da lista de exceções.")
          os.remove('../data/scraping_control/unexpected_error_proposition_ids/' + year + '/' + proposition_id)

        # Termine a execução da função
        return

    except KeyboardInterrupt as e:
      raise
    except EmptyRequest as e:
      print("Não houve nenhuma votação para a proposição", proposition_id, ":|")
      # Salva o arquivo da proposição
      save_log(
        directory = '../data/scraping_control/checked_proposition_ids/' + year + '/',
        filename = proposition_id
      )
    except Exception as e:
      print('Erro não capturado na proposição', proposition_id + '. x.x Salvamos ela em um log para você debugar depois.')
      error_message = traceback.format_exc()
      save_log(
        directory = '../data/scraping_control/unexpected_errors_proposition_ids/' + year + '/',
        filename  = proposition_id,
        content   = error_message,
      )


####################
###   EXECUTAR   ###
###    SCRIPT    ###
####################
#           ||
#    (\__/) ||
#    ( O.O) ||
#    / 　  づ


print("Hey! ;)")
print("Vamos começar a coletar os dados das votações da Câmara.\n")
print("Primeiro, você precisa escolher os anos. Se quiser escolher mais de um, escreva todos separados por vírgula\n")

years = [ '' ]
first_try = True
while any( not isinstance(year, int) for year in years) or any( year not in range(1990, 2019) for year in years ):

  if not first_try:
    print("\nAlgo não deu certo. Escreva os anos assim: 2015, 2016, 2017 e lembre que só conseguimos acessar dados entre 1990 e 2018 ;)\n")


  years = input("Digite os anos com os quatro dígitos, separados por vírgula. Eles precisam estar entre 1990 e 2018: ")
  
  try:
    years = years.split(',')
    years = [ year.strip() for year in years ]
    years = [ int(year) for year in years]

    first_try = False

  except:
    first_try = False
    years = [ '' ]


years = [ str(year) for year in years ]

print("\nVocê quer acessar de novo as proposições que já baixamos?")
print("Isso vai deletar os dados já baixados para o(s) ano(s) selecionados.")
print("Se você ainda não tiver pego todos os dados desse ano, é melhor responder 'n'")

answer = ''
while answer not in ['s', 'n']:
  answer = input("Digite 's' ou 'n': ")

if answer == 'n':
  start_over = False

else:
  start_over = True

if start_over:
  print("\nOk, vamos deletar os registros e começar de novo.")
else:
  print("\nOk, vamos seguir de onde você parou.")


print("\nAgora vamos começar, com um ano de cada vez.")

for year in years:

  done_proposition_fps = find_fpaths('../data/scraping_control/checked_proposition_ids/'  + year + "/", '*')
  done_proposition_ids = [ re.search('.*/(\d+)', item).group(1) for item in  done_proposition_fps]
  
  done_vote_fps        = find_fpaths('../data/scraping_control/checked_vote_ids/'  + year + "/", '*')
  done_vote_ids        = [ re.search('.*/(\d+)', item).group(1) for item in done_vote_fps ]

  downloaded_csvs      = find_fpaths('../data/csvs/' + year + '/', '*')

  unexpected_err_proposition_fps    = find_fpaths('../data/scraping_control/unexpected_errors_proposition_ids/' + year + '/', '*')
  unexpected_err_proposition_ids    = [ re.search('.*/(\d+)', item).group(1) for item in unexpected_err_proposition_fps ]

  unexpected_err_vote_fps    = find_fpaths('../data/scraping_control/unexpected_errors_proposition_ids/' + year + '/', '*')
  unexpected_err_vote_ids    = [ re.search('.*/(\d+)', item).group(1) for item in unexpected_err_vote_fps ]

  # Se for para começar tudo de novo, vamos remover todos os registros do ano
  if start_over:

    fp_dir = '../data/scraping_control/checked_proposition_ids/' + year + '/'
    if os.path.isdir(fp_dir):
      shutil.rmtree(fp_dir)

    fp_dir = '../data/scraping_control/checked_vote_ids/' + year + '/'
    if os.path.isdir(fp_dir):
      shutil.rmtree(fp_dir)

    fp_dir = '../data/csvs/' + year + '/'
    if os.path.isdir(fp_dir):
      shutil.rmtree(fp_dir)

    fp_dir = '../data/scraping_control/unexpected_errors_proposition_ids/' + year + '/'
    if os.path.isdir(fp_dir):
      shutil.rmtree(fp_dir)

    fp_dir = '../data/scraping_control/unexpected_errors_vote_ids/' + year + '/'
    if os.path.isdir(fp_dir):
      shutil.rmtree(fp_dir)


  # Dados com todas as proposições
  df = read_and_concat(
    dir_path = '../data/proposicoes_por_ano/', 
    pattern = '*' + year + '.csv', 
    sep = ';', 
    quotechar = '"',
    axis = 0,
    ignore_index = True
  )

  total_entries = df.shape[0]

  # Se não for para começar de novo, vamos remover as proposições prontas da lista de consultas
  if not start_over:
    df = df[ ~df.id.isin(done_proposition_ids) ]

  print("\nVamos pegar os dados do ano", year + ':')

  print("\nNesse ano, já baixamos", len(done_proposition_ids), "proposições completas de um total de", str(total_entries) + '.')
  print("Isso representa", len(done_vote_ids), "votações.\n")

  time.sleep(5)

# Cria tuplas de argumentos que vão ser passados para as threads via pool.starmap
# Arguments fica assim: [ (id1, 2018), (id2, 2018), (id3, 2018) ... (idN, 2018)] onde N = len( df.id.unique() )
  year = [ year ] * len( df.id.unique() )
  arguments =  [ ( a,b ) for a,b in zip (df.id.unique(), year ) ]

  # Inicia multiprocessos
  pool = ThreadPool(10)

  pool.starmap(get_data, arguments)

  pool.terminate()
  pool.join()