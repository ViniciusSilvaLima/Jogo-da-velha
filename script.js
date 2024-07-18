// Seleciona elementos do DOM
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const playVsPlayerButton = document.getElementById('playVsPlayer');
const playVsComputerButton = document.getElementById('playVsComputer');
const backToMenuButton = document.getElementById('backToMenu');
const cells = document.querySelectorAll('.cell');
const resultModal = document.getElementById('resultModal');
const resultMessage = document.getElementById('resultMessage');
const playAgainButton = document.getElementById('playAgain');
const closeModal = document.querySelector('.close');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;
let vsComputer = false;

// Adiciona eventos aos botões
playVsPlayerButton.addEventListener('click', () => startGame(false));
playVsComputerButton.addEventListener('click', () => startGame(true));
backToMenuButton.addEventListener('click', goToMenu);
playAgainButton.addEventListener('click', resetGame);
closeModal.addEventListener('click', closeResultModal);

// Função que inicia o jogo
function startGame(computer) {
    vsComputer = computer;
    menu.style.display = 'none';
    game.style.display = 'block';
    resetGame();
}

// Função que volta para o menu
function goToMenu() {
    game.style.display = 'none';
    menu.style.display = 'block';
    resetGame();
}

// Adiciona evento de clique a cada célula do tabuleiro
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

// Função que lida com o clique em uma célula
function handleClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] === '' && !isGameOver) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        animateMove(cell); // Adiciona animação à jogada
        checkWinner();
        if (!isGameOver) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (vsComputer && currentPlayer === 'O') {
                setTimeout(computerMove, 500); // Adiciona um pequeno atraso para a jogada da máquina
            }
        }
    }
}

// Função que realiza a jogada da máquina
function computerMove() {
    disableCellClicks(); // Desabilita cliques enquanto a máquina joga
    const bestMove = findBestMove();
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    animateMove(cells[bestMove]); // Adiciona animação à jogada da máquina
    setTimeout(() => { // Aguarda a animação terminar antes de habilitar os cliques novamente
        checkWinner();
        currentPlayer = 'X';
        enableCellClicks(); // Habilita cliques após a jogada da máquina
    }, 300); // Tempo de espera deve coincidir com a duração da animação
}

// Função que encontra a melhor jogada para a máquina
function findBestMove() {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Função minimax para determinar a melhor jogada
function minimax(newBoard, depth, isMaximizing) {
    const scores = {
        'O': 1,
        'X': -1,
        'tie': 0
    };

    const winner = checkWinnerMinimax(newBoard);
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'O';
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'X';
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Função que verifica se há um vencedor para a função minimax
function checkWinnerMinimax(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes('')) {
        return 'tie';
    }

    return null;
}

// Função que adiciona animação à jogada
function animateMove(cell) {
    cell.style.transition = 'transform 0.3s ease-out'; // Define a transição para a animação
    cell.style.transform = 'scale(0.1)'; // Reduz o tamanho inicialmente
    setTimeout(() => {
        cell.style.transform = 'scale(1)'; // Restaura o tamanho original após um pequeno atraso
    }, 100);
}

// Função que verifica se há um vencedor
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            isGameOver = true;
            showResultModal(`Jogador ${board[a]} venceu!`);
            return;
        }
    }

    if (!board.includes('')) {
        isGameOver = true;
        showResultModal('Empate!');
    }
}

// Função que reinicia o jogo
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
    });
    currentPlayer = 'X';
    isGameOver = false;
    closeResultModal();
}

// Função que mostra o modal de resultado
function showResultModal(message) {
    resultMessage.textContent = message;
    resultModal.style.display = 'block';
}

// Função que fecha o modal de resultado
function closeResultModal() {
    resultModal.style.display = 'none';
}

// Função que desabilita os cliques nas células
function disableCellClicks() {
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

// Função que habilita os cliques nas células
function enableCellClicks() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleClick);
    });
}

// Fecha o modal quando o usuário clica fora dele
window.onclick = function(event) {
    if (event.target === resultModal) {
        resultModal.style.display = 'none';
    }
}
