function carregaFooter() {
    $('#dataJogo').text("2014 - " + (new Date()).getFullYear());
}

/*
 * Esta é uma implementação do algoritmo Fisher-Yates para sortear um vetor
 * com valores aleatórios.
 */
function randomizer(vetor) {
    var m = vetor.length;
    var t = 0;
    var i = 0;
    while(m) {
        i = Math.floor(Math.random() * m--);
        t = vetor[m];
        vetor[m] = vetor[i];
        vetor[i] = t;
    }
    return vetor;
}

function carregaPalavras() {
    var palavras = new Array();
    $.ajax({
        type: "GET",
        async: false,
        url: "src/senhas.json",
        success: function(dados) {
           $.each(dados, function(chave, valor) {
                palavras.push(valor);
           });
        }
    });
}