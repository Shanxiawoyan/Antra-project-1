// View
const View = (() => {
    const dom = {
        board: document.getElementById("gameBoard"),
        score: document.getElementById("score"),
        timer: document.getElementById("timer"),
        startBtn: document.getElementById("startBtn"),
    };

    const renderBoard = () => {
        dom.board.innerHTML = "";
        for (let i = 0; i < 12; i++) {
            dom.board.innerHTML += `
        <div class="hole" data-id="${i}">
          <img src="./mole.jpg" class="mole" id="mole-${i}" />
          <img src="./Snake.jpg" class="snake" id="snake-${i}" />
        </div>
      `;
        }
    };

    const updateScore = (score) => (dom.score.textContent = score);
    const updateTimer = (time) => (dom.timer.textContent = time);
    const showMole = (id) => document.getElementById(`mole-${id}`).classList.add("visible");
    const hideMole = (id) => document.getElementById(`mole-${id}`).classList.remove("visible");
    const showSnake = (id) => document.getElementById(`snake-${id}`).classList.add("visible");
    const hideSnake = (id) => document.getElementById(`snake-${id}`).classList.remove("visible");
    const showAllSnakes = () => {
        for (let i = 0; i < 12; i++) {
            showSnake(i);
            hideMole(i);
        }
    };

    return {
        dom,
        renderBoard,
        updateScore,
        updateTimer,
        showMole,
        hideMole,
        showSnake,
        hideSnake,
        showAllSnakes,
    };
})();

// Model
const Model = (() => {
    let boardStatus = Array.from({ length: 12 }, (_, i) => ({ id: i, mole: false, snake: false }));
    let score = 0;
    let time = 30;

    return {
        boardStatus,
        getScore: () => score,
        setScore: (val) => (score = val),
        getTime: () => time,
        setTime: (val) => (time = val),
    };
})();

// Controller
const Controller = ((model, view) => {
    let moleInterval, snakeInterval, timerInterval;
    const moleTimers = Array(12).fill(null);

    const setupListeners = () => {
        view.dom.startBtn.addEventListener("click", startGame);
        view.dom.board.addEventListener("click", (e) => {
            const parent = e.target.closest(".hole");
            if (!parent) return;
            const id = +parent.dataset.id;

            if (model.boardStatus[id].mole) {
                model.boardStatus[id].mole = false;
                view.hideMole(id);
                model.setScore(model.getScore() + 1);
                view.updateScore(model.getScore());
            }

            if (model.boardStatus[id].snake) {
                clearInterval(timerInterval);
                clearInterval(moleInterval);
                clearInterval(snakeInterval);
                model.boardStatus.forEach((b, i) => {
                    b.mole = false;
                    b.snake = true;
                    view.hideMole(i);
                    view.showSnake(i);
                });
            }
        });
    };

    const startGame = () => {
        model.setScore(0);
        model.setTime(30);
        model.boardStatus.forEach((b) => {
            b.mole = false;
            b.snake = false;
        });

        view.updateScore(0);
        view.updateTimer(30);
        view.renderBoard();

        clearInterval(moleInterval);
        clearInterval(snakeInterval);
        clearInterval(timerInterval);

        moleInterval = setInterval(spawnMoles, 1000);
        snakeInterval = setInterval(spawnSnake, 2000);
        timerInterval = setInterval(updateTimer, 1000);
    };

    const spawnMoles = () => {
    
        model.boardStatus.forEach((b, i) => {
            b.mole = false;
            view.hideMole(i);
            if (moleTimers[i]) clearTimeout(moleTimers[i]);
        });

        const indices = [];
        while (indices.length < 2) {
            const idx = Math.floor(Math.random() * 12);
            if (!indices.includes(idx)) indices.push(idx);
        }

        indices.forEach((i) => {
            model.boardStatus[i].mole = true;
            view.showMole(i);
            moleTimers[i] = setTimeout(() => {
                model.boardStatus[i].mole = false;
                view.hideMole(i);
            }, 2000);
        });
    };

    const spawnSnake = () => {

        model.boardStatus.forEach((b, i) => {
            b.snake = false;
            view.hideSnake(i);
        });

        const idx = Math.floor(Math.random() * 12);
        model.boardStatus[idx].snake = true;
        view.showSnake(idx);
    };

    const updateTimer = () => {
        let t = model.getTime();
        if (t === 0) {
            clearInterval(timerInterval);
            clearInterval(moleInterval);
            clearInterval(snakeInterval);
            alert("Time is Up !!!");
            return;
        }
        t--;
        model.setTime(t);
        view.updateTimer(t);
    };

    const bootstrap = () => {
        view.renderBoard();
        setupListeners();
    };

    return { bootstrap };
})(Model, View);

Controller.bootstrap();
