arq = open('listaPalavras', 'r')
linhas = []
for linha in arq:
    linhas.append(linha)
i = 0
for linha in linhas:
    linhas[i] = linha.rstrip()
    i+=1
arqJson = open("palavras.json", "w")
arqJson.write("[")
for linha in linhas:
    fmt = '\n\t{\n\t\t"nível": "' + linha[-2:-1] + '",\n\t\t"desafio": "' + linha[-34:-1][1:9] + '",\n\t\t"tema": "' + linha.replace(linha[-35:], '') + '"\n\t},'
    arqJson.write(fmt)
arqJson.write("]")
arqJson.close()