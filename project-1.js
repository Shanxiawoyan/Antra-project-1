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
        </div>
      `;
        }
    };

    const updateScore = (score) => (dom.score.textContent = score);
    const updateTimer = (time) => (dom.timer.textContent = time);
    const showMole = (id) => document.getElementById(`mole-${id}`).classList.add("visible");
    const hideMole = (id) => document.getElementById(`mole-${id}`).classList.remove("visible");

    return {
        dom,
        renderBoard,
        updateScore,
        updateTimer,
        showMole,
        hideMole,
    };
})();



// Model
const Model = (() => {
    let boardStatus = Array.from({ length: 12 }, (_, i) => ({ id: i, active: false }));
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
    let moleInterval, timerInterval;

    const setupListeners = () => {
        view.dom.startBtn.addEventListener("click", startGame);
        view.dom.board.addEventListener("click", (e) => {
            const parent = e.target.closest(".hole");
            if (!parent) return;
            const id = +parent.dataset.id;
            if (model.boardStatus[id].active) {
                model.boardStatus[id].active = false;
                view.hideMole(id);
                model.setScore(model.getScore() + 1);
                view.updateScore(model.getScore());
            }
        });
    };

    const startGame = () => {
        model.setScore(0);
        model.setTime(30);
        model.boardStatus.forEach((b) => (b.active = false));
        view.updateScore(0);
        view.updateTimer(30);
        view.renderBoard();

        clearInterval(moleInterval);
        clearInterval(timerInterval);

        moleInterval = setInterval(showRandomMoles, 1000);
        timerInterval = setInterval(updateTimer, 1000);
    };

    const showRandomMoles = () => {
        model.boardStatus.forEach((b, i) => {
            b.active = false;
            view.hideMole(i);
        });

        const indices = [];
        while (indices.length < 3) {
            const idx = Math.floor(Math.random() * 12);
            if (!indices.includes(idx)) indices.push(idx);
        }

        indices.forEach((i) => {
            model.boardStatus[i].active = true;
            view.showMole(i);
        });
    };

    const updateTimer = () => {
        let t = model.getTime();
        if (t === 0) {
            clearInterval(timerInterval);
            clearInterval(moleInterval);
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
