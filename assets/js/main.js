const opcionesJuego = ['piedra', 'papel', 'tijera'];
const juego = {
    totalJugador: 0,
    totalPc: 0,
    rondas: 0,
    nombreJugador: 'Jugador1'
}

let records = [];

let music = new Audio();

window.addEventListener('load', function(){
    defaultGame();

});

const btnJugar = document.getElementById('startGame');
console.log({btnJugar});
btnJugar.addEventListener('click', function(){

    const audioStarGame = './app-piedra-papel-tijera/assets/sounds/start-game.wav';
    playMusic( audioStarGame );

    defaultGame();

    const botonesAccion = document.querySelectorAll('.btnAccions');
    botonesAccion.forEach( boton =>{
        boton.removeAttribute('disabled');
    });

    const usuario = document.getElementById('usuario').value;
    const txtJugador = document.querySelector('#jugador .nombre');
    txtJugador.textContent = usuario+':';
    juego.nombreJugador = usuario;

});

const btnPiedra = document.getElementById('btnPiedra');
btnPiedra.addEventListener('click', function(){
    const audio = '../assets/sounds/piedra.wav';
    playMusic( audio );

    const valor = 'piedra';
    procesarRonda( valor );
});

const btnPapel = document.getElementById('btnPapel');
btnPapel.addEventListener('click', function(){
    const audio = '../assets/sounds/papel.wav';
    playMusic( audio );
    const valor = 'papel';
    procesarRonda( valor );
});

const btnTijera = document.getElementById('btnTijera');
btnTijera.addEventListener('click', function(){
    const audio = '../assets/sounds/tijera.wav';
    playMusic( audio );
    const valor = 'tijera';
    procesarRonda( valor );
});

const procesarRonda = ( valor = '' ) =>{
    const resultado = comprobarRespuestas( valor );

    juego.totalJugador += resultado.jugador; 
    juego.totalPc += resultado.pc; 
    juego.rondas++;

    setPuntajeJugador( juego.totalJugador );
    setPuntajePc(  juego.totalPc );

    if( juego.totalJugador === 3 ){
        const audio = '../assets/sounds/winner-game.wav';
        playMusic( audio, true );

        Swal.fire({
            title: 'Winner!',
            text: 'Felicidades '+juego.nombreJugador+' haz ganado!',
            icon: 'success'
        }).then( () =>{
            defaultGame();
        });

        const confetti = document.getElementById('canvas');
        confetti.style.display = 'block';
        bloquearBontonesJuego();

        const datosGanador = {
            nombreJugador: juego.nombreJugador,
            victorias: 1,
            rondas: juego.rondas
        }

        validarJugadorRecord( datosGanador );
        setRecords();
        showRecords( records );

    }else{
        if( juego.totalPc === 3 ){
            const audio = '../assets/sounds/loser-game.wav';
            playMusic( audio, true );
            Swal.fire({
                title: 'Loser!',
                text: 'Intentalo otra vez '+juego.nombreJugador+'!',
                icon: 'error'
            }).then( () =>{
                defaultGame();
            });

            bloquearBontonesJuego();
        }else{
            let title = '';
            let icon = '';
            if( resultado.jugador == 0 && resultado.pc == 0 ){
                title = 'Empatados!';
                icon = 'warning';
            }else{
                if( resultado.jugador == 1 ){
                    title = 'Gana el jugador '+juego.nombreJugador+'!';
                    icon = 'success';
                }else{
                    title = 'Gana la computadora!';
                    icon = 'error';
                }
            }
        
            Swal.fire({
                title,
                text: resultado.message,
                icon,
                timerProgressBar: true,
                timer: 2000
            });
        }
    } 
}

const showRecords = ( records = [] ) =>{

    records = records.sort(((a, b) => b.victorias - a.victorias ));

    let htmlRecord = '';
    records.forEach( ( record, index ) =>{
        htmlRecord += `
            <tr>
                <td>${ (index + 1) }</td>
                <td>${ record.nombreJugador }</td>
                <td>${ record.victorias }</td>
                <td>${ record.rondas }</td>
            </tr>
        `;
    });

    const tableRecords = document.querySelector('#tableRecords tbody');
    tableRecords.innerHTML = htmlRecord;
}

const elegirRespuestaAleatoria = () =>{
    return opcionesJuego[(Math.floor(Math.random() * opcionesJuego.length))];
}

const defaultGame = () =>{
    pauseMusic();
    juego.totalJugador = 0;
    juego.totalPc = 0;
    juego.rondas = 0;

    setPuntajeJugador();
    setPuntajePc();
   
    bloquearBontonesJuego();

    const confetti = document.getElementById('canvas');
    confetti.style.display = 'none';

    records = getRecords();
    showRecords( records );

}

const bloquearBontonesJuego = () =>{
    const botonesAccion = document.querySelectorAll('.btnAccions');
    botonesAccion.forEach( boton =>{
        boton.setAttribute('disabled', true);
    });
}

const setPuntajeJugador = ( puntaje = 0 ) =>{
    const resultadoJugador = document.querySelector('#jugador .resultado');
    resultadoJugador.textContent = puntaje;
}

const setPuntajePc = ( puntaje = 0 ) =>{
    const resultadoPc = document.querySelector('#pc .resultado');
    resultadoPc.textContent = puntaje;
}

const comprobarRespuestas = ( opcionUsuario = '' ) =>{

    const resultado = {
        jugador: 0,
        pc: 0,
        message: ''
    };

    const opcionPC = elegirRespuestaAleatoria();

    //en caso de empate
    if( opcionUsuario === opcionPC ) {
        resultado.message = 'Han empatado! opcion Usuario '+opcionUsuario+' - opcion PC: '+opcionPC;
    }else{
        switch( opcionUsuario ){
            case 'piedra':
                if( opcionPC === 'tijera' ){
                    resultado.message = 'Usuario gana! opcion Usuario '+opcionUsuario+' - opcion PC: '+opcionPC;
                    resultado.jugador = 1;
                }else{
                    resultado.message = 'PC gana! opcion Usuario '+opcionUsuario+' - opcion PC: '+opcionPC;
                    resultado.pc = 1;
                } 
                break;

            case 'tijera':
                if( opcionPC === 'piedra' ){
                    resultado.message = 'PC gana! opcion Usuario '+opcionUsuario+' - opcion PC: '+opcionPC;
                    resultado.pc = 1;
                }else{
                    resultado.message = 'Usuario gana! opcion Usuario '+opcionUsuario+' - opcion PC: '+opcionPC;
                    resultado.jugador = 1;
                }

                break;
            case 'papel':
                if( opcionPC === 'piedra' ){
                    resultado.message ='Usuario gana! opcion Usuario '+opcionUsuario+' - opcion PC: '+opcionPC;
                    resultado.jugador = 1;
                }else{
                    resultado.message ='PC gana! opcion Usuario '+opcionUsuario+' - opcion PC: '+opcionPC;
                    resultado.pc = 1;
                }
                
                break;
            default:
                resultado.message ='Opcion incorrecta (piedra - papel - tijera)';
                break;
            
        }
    }

    return resultado;
}

const setRecords = () =>{
    localStorage.setItem('records', JSON.stringify(records) );
}

const getRecords = () =>{
    return JSON.parse(localStorage.getItem('records')) || [];
}

const validarJugadorRecord = ( datosJugador ) =>{

    const index = records.findIndex( record => (record.nombreJugador).toLowerCase() === (datosJugador.nombreJugador).toLowerCase() );

    if( index >= 0 ){
        records[index].victorias += 1;
        records[index].rondas += datosJugador.rondas;
    }else{
        records.push( datosJugador );
    }
}

const playMusic = ( audio = '', loop = false ) =>{
    pauseMusic();
    music = new Audio( audio );
    music.play();
    music.loop = loop;
}

const pauseMusic = () =>{
    if( music.played.length > 0 ){
        music.pause();
    }
}

const btnReset = document.getElementById('btnReset');
btnReset.addEventListener('click', function(){
    records = [];
    setRecords();
    showRecords();
});