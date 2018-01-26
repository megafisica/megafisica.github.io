function randomizer(array) {

    // Este é o algoritmo de Durstenfeld para deixar os elementos de um vetor
    // em ordem aleatória.

    for(i=array.length - 1; i > 0 ; i--) {
        var j = Math.floor(Math.random() * (i+1));
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}

function carregaFooter() {
    var data = new Date();
    var ano = data.getFullYear();
    $('#ano').html("2014 - " + ano);
}

function carregaArquivo() {
    var arquivo = $.ajax({
        dataType: 'json',
        url: 'palavras.json',
        async: false,
        success: function(data) {
            return data;
        }
    });

    var palavras = new Array();
    var quantidadePalavras = arquivo.responseJSON.length;
    for(i=0;i<quantidadePalavras;i++) {
        palavras.push(arquivo.responseJSON[i]);
    }

    return palavras;
}

function sorteiaPalavras(desafio, nivel) {
    var todasPalavras = carregaArquivo();
    var quantidadeTotalPalavras = todasPalavras.length;
    var palavrasContexto = new Array();

    for(i=0;i<quantidadeTotalPalavras;i++) {

        if(desafio==3 && nivel==1) {
            if((todasPalavras[i].desafio==desafio && todasPalavras[i].nivel==nivel) || (todasPalavras[i].desafio==(desafio-1)) || (todasPalavras[i].desafio==(desafio-2))) {
                palavrasContexto.push(todasPalavras[i].tema);
            }
        }
        else if(desafio==2 && nivel==1) {
                if((todasPalavras[i].desafio==desafio && todasPalavras[i].nivel==nivel) || (todasPalavras[i].desafio==(desafio-1))) {
                    palavrasContexto.push(todasPalavras[i].tema);
                }
        }
        else {
            if(todasPalavras[i].desafio==desafio && todasPalavras[i].nivel==nivel) {
                palavrasContexto.push(todasPalavras[i].tema);
            }
        }
    }

    randomizer(palavrasContexto);
    var palavrasSelecionadas = new Array(palavrasContexto[0], palavrasContexto[1], palavrasContexto[2]);
    return palavrasSelecionadas;
}