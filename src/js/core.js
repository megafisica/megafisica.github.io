function carregaFooter() {
    $('#dataJogo').text("2014 - " + (new Date()).getFullYear());
}

function carregaPagina() {
    /* Liga o plugin JavaScript responsável pela navegação da página */
    $('#fullpage').fullpage({
        autoScrolling: true,
        controlArrows: true,
        verticalCentered: true,
        slidesNavigation: true
    });

    /* Mostra a data no rodapé */
    carregaFooter();
}

function gameOver(hasVencido, numeroDesafio) {
    var mensagem = "";
    $("#tempo").css('display', 'none');
    $("#botao").css('display', 'none');
    $('#exibePalavra').css('display', 'none');
    
    if(hasVencido) {
        mensagem = `
            <p>Vocês venceram!</p>
            <p class="pb-5"><span class="far fa-grin-beam h1"></span></p>
        `;
    } else {
        mensagem = `
            <p>Vocês perderam!</p>
            <p class="pb-5"><span class="far fa-dizzy h1"></span></p>
        `;
    }
    var link = (numeroDesafio==1) ? ("primeiro.html") : ((numeroDesafio==2) ? ("segundo.html") : ("terceiro.html"));
    mensagem += `
        <p>
            <a class="btn btn-light btn-lg" role="button" href='${link}'><span class="far fa-play-circle"></span> Jogar novamente</a>
        </p>
    `;

    $('#mensagemPalavra').html(mensagem);

    /*
     * retorna falso porque a variável responsável por ver se o jogo ainda está
     * acontecendo é quem chama essa função; como esta função indica o fim de
     * jogo, a variável responsável por ver se o jogo ainda está acontecendo
     * deve ser tornada falsa, ou seja, deve ser inativada.
     */
    return false;
}

/*
 * Este é o trecho do código responsável por operar o tempo, e de
 * verificar se este não se esgotou, o que fará com que os
 * jogadores percam.
 */
function operaRelogio(informacoes) {
    /* Se o jogo não começou, não faz sentido mostrar o tempo. */
    console.log(informacoes.iniciouJogo);
    if(informacoes.iniciouJogo) {
        $("#tempo").css('display', 'inline');
        informacoes.temporizador--;
        var tempoRestante = "Restam: " + informacoes.temporizador + "s";
        $("#tempo").html(tempoRestante);
        if(informacoes.temporizador==0) {
            /* carrega mensagens de derrota quando zera o tempo */
            informacoes.iniciouJogo = gameOver(false, informacoes.desafio);
        }
    }
}

/*
 * Este é o trecho do código responsável por passar de palavra à
 * palavra, e, consequentemente, também de nível a nível.
 */
function operaNiveis(informacoes) {
    
    /*
     * Se o jogo ainda não iniciou, então, ao clicar neste botão, o
     * o jogo é iniciado.
     */

    if(!informacoes.iniciouJogo) {
        informacoes.iniciouJogo = true;
        $("#botao").html(`
            <span class="fas fa-fast-forward"></span> Próxima Palavra
        `);
    }
    
    /*
     * Se o nível passa a ser igual a 4, é sinal de que os usuários
     * venceram os 3 níveis e, por conseguinte, o jogo.
     * 
     * Senão, ele irá chamar as palavras daquele desafio, naquele
     * nível.
     */

    if(informacoes.nivel==4) {
        informacoes.iniciouJogo = gameOver(true, informacoes.desafio);
    } else {
        var mensagem = "Nível " + informacoes.nivel + ", " + informacoes.numero + "a. palavra secreta:";
        $("#mensagemPalavra").text(mensagem);

        /*
         * Esta linha carrega as palavras ou expressoes secretas e
         * a função processaJogo é a responsavél por operar estas
         * palavras na tela, e por verificar se o usuário ganhou
         * ou não.
         */
        $.getJSON("src/senhas.json", function(dados) {
            processaJogo(dados, informacoes)   
        });
    }
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

function processaJogo(dados, informacoes) {
    var palavras = new Array();

    /*
     * Este for irá pegar somente as palavras cujo índice
     * seja igual ao do desafio corrente. Como o desafio
     * começa do 1, e o índice do 0, teve-se de decrementar
     * em 1 o desafio.
     */
    for(i=0;i<=informacoes.desafio-1;i++) {
        palavras.push(dados[i]);
    }

    /* pega as palavras relativas ao nivel em que se está */
    var palavrasNivel = palavras[informacoes.desafio-1][informacoes.nivel-1];

    /*
     * Se o desafio não for o primeiro, e se o nível for o
     * primeiro, deve-se pegar as palavras tanto do nível 1
     * do desafio atual, quanto de todos os níveis dos
     * desafios anteriores.
     */
    if(informacoes.desafio!=1 && informacoes.nivel==1) {
        /*
         * DesafioTmp é uma variável temporária, que será
         * usada para pegar o índice dos desafios
         * anteriores; por isso ela é desafio-2; pois, caso
         * se esteja no desafio 2, ela pegará o índice (0)
         * do primeiro desafio.
         */
        var desafioTmp = informacoes.desafio-2;

        /*
         * Insere palavras de desafios anteriores às
         * palavras desse nível.
         */
        while(desafioTmp>=0) {
            var tam1 = palavras[desafioTmp][0].length;
            var tam2 = palavras[desafioTmp][1].length;
            var tam3 = palavras[desafioTmp][2].length;

            for(i=0;i<tam1;i++) {
                palavrasNivel.push(palavras[desafioTmp][0][i]);
            }
            for(i=0;i<tam2;i++) {
                palavrasNivel.push(palavras[desafioTmp][1][i]);
            }
            for(i=0;i<tam3;i++) {
                palavrasNivel.push(palavras[desafioTmp][2][i]);
            }
            desafioTmp--;
        }
    }
    
    /*
     * Sorteia a ordem das palavras. Depois, remove, dentre
     * elas, aquelas que já foram usadas previamente. Aí,
     * ele adiciona a palavra da vez na lista de palavras
     * já utilizadas. Depois, mostra a palavra da vez na
     * tela.
     */

    palavrasNivel = randomizer(palavrasNivel);
    palavrasNivel = palavrasNivel.filter(palavra => !informacoes.palavrasUsadas.includes(palavra));
    informacoes.palavrasUsadas.push(palavrasNivel[0]);

    $("#exibePalavra").text(palavrasNivel[0] + ".");

    /*
     * Avança à próxima palavra e, se passar da terceira,
     * reinicia para a primeira palavra do próximo nível.
     */
    informacoes.numero++;
    if(informacoes.numero==4) {
        informacoes.temporizador = 91;
        var tempoRestante = "Restam: " + informacoes.temporizador + "s";
        $("#tempo").html(tempoRestante);
        informacoes.numero=1;
        informacoes.nivel++;
    }
}
