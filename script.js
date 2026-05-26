/* ==========================================================================
   GAME ENGINE & SYNTHESIZER: «Монтажник Петро»
   ========================================================================== */

// 1. STATE VARIABLES
const gameState = {
    fear: 20,
    respect: 10,
    title: "Звичайний монтажник",
    currentStage: "stage_0",
    choicesLog: ["Прибув на об'єкт (3м)."],
    helmetClicks: 0,
    clickTimer: null,
    isAudioActive: false,
    audioCtx: null
};

// 2. WEB AUDIO SYNTHESIZER
// Generates funny sound effects in real-time without static files
const PigeonAudio = {
    init() {
        if (!gameState.audioCtx) {
            gameState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (gameState.audioCtx.state === 'suspended') {
            gameState.audioCtx.resume();
        }
    },

    // Short standard click sound
    playClick() {
        if (!gameState.isAudioActive) return;
        this.init();
        const ctx = gameState.audioCtx;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    },

    // Funny pigeon coo: "Гу-гу-уу"
    playCoo() {
        if (!gameState.isAudioActive) return;
        this.init();
        const ctx = gameState.audioCtx;
        const now = ctx.currentTime;

        // Two-part coo sound
        const playSubCoo = (delay, duration, pitch) => {
            const osc = ctx.createOscillator();
            const oscMod = ctx.createOscillator();
            const modGain = ctx.createGain();
            const gainNode = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(pitch, now + delay);
            // Gentle slide down
            osc.frequency.exponentialRampToValueAtTime(pitch - 30, now + delay + duration);

            // Frequency modulation for the soft bird warble
            oscMod.type = 'sine';
            oscMod.frequency.setValueAtTime(18, now + delay);
            modGain.gain.setValueAtTime(12, now + delay);

            gainNode.gain.setValueAtTime(0.0, now + delay);
            gainNode.gain.linearRampToValueAtTime(0.25, now + delay + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + duration);

            oscMod.connect(modGain);
            modGain.connect(osc.frequency);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscMod.start(now + delay);
            osc.start(now + delay);

            oscMod.stop(now + delay + duration);
            osc.stop(now + delay + duration);
        };

        playSubCoo(0, 0.22, 290);
        playSubCoo(0.28, 0.45, 270);
    },

    // Screeching electric drill buzz
    playDrill() {
        if (!gameState.isAudioActive) return;
        this.init();
        const ctx = gameState.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const LFO = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        // Buzzing square wave
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        // Pitch rises slightly as drill spins up
        osc.frequency.linearRampToValueAtTime(145, now + 0.2);
        osc.frequency.linearRampToValueAtTime(135, now + 0.6);

        // LFO for heavy vibrations
        LFO.type = 'sine';
        LFO.frequency.setValueAtTime(45, now);
        lfoGain.gain.setValueAtTime(18, now);

        // Filter out harsh highs for motor sound
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);

        gainNode.gain.setValueAtTime(0.0, now);
        gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        LFO.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        LFO.start(now);
        osc.start(now);

        LFO.stop(now + 0.7);
        osc.stop(now + 0.7);
    },

    // Descending dramatic fear siren
    playFearScream() {
        if (!gameState.isAudioActive) return;
        this.init();
        const ctx = gameState.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.8);

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(now + 0.8);
    },

    // Successful metallic "Dzing!"
    playDzing() {
        if (!gameState.isAudioActive) return;
        this.init();
        const ctx = gameState.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(988, now); // B5 note
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318, now); // E6 note

        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc2.start();
        osc.stop(now + 0.6);
        osc2.stop(now + 0.6);
    },

    // Soft impact "Poof" for flowerbed landing
    playSplash() {
        if (!gameState.isAudioActive) return;
        this.init();
        const ctx = gameState.audioCtx;
        const now = ctx.currentTime;

        // Generate white noise for soft impact
        const bufferSize = ctx.sampleRate * 1.0;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, now);
        filter.frequency.exponentialRampToValueAtTime(20, now + 0.8);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noiseNode.start(now);
        noiseNode.stop(now + 0.8);
    },

    // Hero fanfare melody!
    playFanfare() {
        if (!gameState.isAudioActive) return;
        this.init();
        const ctx = gameState.audioCtx;
        const now = ctx.currentTime;

        const notes = [
            { note: 261.63, time: 0, dur: 0.15 }, // C4
            { note: 329.63, time: 0.15, dur: 0.15 }, // E4
            { note: 392.00, time: 0.30, dur: 0.15 }, // G4
            { note: 523.25, time: 0.45, dur: 0.5 }   // C5
        ];

        notes.forEach((item) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(item.note, now + item.time);

            gainNode.gain.setValueAtTime(0.12, now + item.time);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + item.time + item.dur);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(now + item.time);
            osc.stop(now + item.time + item.dur);
        });
    }
};

// 3. STAGES MAP (State Machine definition)
const stages = {
    stage_0: {
        title: "Виклик прийнято. Висота — 3 метри.",
        text: "Петро, 34 роки, монтажник кондиціонерів. Отримав замовлення на 5-й поверх. У руках дриль, у серці — страх, гірший, ніж у голуба, якому наснився пилосос.",
        image: "assets/petro_ground.svg",
        height: "3м",
        motion: "shaking",
        fear: 20,
        respect: 10,
        options: [
            { text: "Піти на драбину 🪜", next: "stage_1A", log: "Вирішив лізти на драбину сам.", sound: "drill" },
            { text: "Викликати голуба-наставника 🐦", next: "stage_1B", log: "Покликав голуба Валєру на допомогу.", sound: "coo" }
        ]
    },
    
    stage_1A: {
        title: "Ноги тремтять. Дриль вібрує в такт.",
        text: "Ви ставите ногу на першу сходинку. Внизу голуби регочуть. Один кричить: «Я на карнизі 9-го поверху сиджу, а ти на табуретку боїшся!»",
        image: "assets/petro_ladder.svg",
        height: "4м",
        motion: "parallax",
        fear: 40,
        respect: 30,
        options: [
            { text: "Зробити вигляд, що перевіряєш інструмент 🛠️", next: "stage_2A", log: "Удав, що лагодить дриль, щоб не лізти.", sound: "drill" },
            { text: "Крикнути: «У тебе крила, а в мене іпотека!» 🏦", next: "stage_2B", log: "Вступив у філософський діалог з голубами.", sound: "fear" }
        ]
    },

    stage_1B: {
        title: "Гуля, поясни за висоту.",
        text: "Прилітає сизий голуб на ім’я Валєра. Каже: «Слухай, синку, висота — це ілюзія. Я сто разів падав, і нічого. Просто розслаб гузно.»",
        image: "assets/petro_pigeon.svg",
        height: "3м",
        motion: "shaking",
        fear: 25,
        respect: 50,
        options: [
            { text: "Повірити Валєрі і полізти 🪜", next: "stage_2A", log: "Натхненний Валєрою, Петро поліз вгору.", sound: "coo" },
            { text: "Запитати про техніку безпеки 📋", next: "stage_2B", log: "Вирішив вивчити пташиний кодекс безпеки.", sound: "click" }
        ]
    },

    stage_2A: {
        title: "Другий поверх. Вище тільки зорі.",
        text: "Ви майже на висоті голубиного польоту. Але раптом повз пролітає муха — і ви усвідомлюєте всю крихкість буття. Голуби навколо жують попкорн у 3D-окулярах.",
        image: "assets/petro_midair.svg",
        height: "6м",
        motion: "wind",
        fear: 75,
        respect: 40,
        options: [
            { text: "Продовжити, стиснувши зуби 🥶", next: "stage_3A", log: "Мужньо продовжив підйом крізь страх.", sound: "fear" },
            { text: "Спуститись і втекти в газон 🏃‍♂️", next: "stage_3B", log: "Зробив тактичний відступ ближче до землі.", sound: "splash" }
        ]
    },

    stage_2B: {
        title: "Правило Валєри: «Цілуй м'яке».",
        text: "Голуб пояснює: страх долається простим правилом — завжди цілься в м’яке при падінні. Петро починає креслити на асфальті параболи і траєкторії.",
        image: "assets/petro_planning.svg",
        height: "3м",
        motion: "shaking",
        fear: 50,
        respect: 65,
        options: [
            { text: "Застосувати метод планування (скинути дриль) ☄️", next: "stage_3A", log: "Скинув дриль для тесту сили тяжіння.", sound: "drill" },
            { text: "Закрити наряд і піти пити чай в офіс ☕", next: "stage_3B", log: "Вирішив, що чай безпечніший за кондиціонери.", sound: "click" }
        ]
    },

    stage_3A: {
        title: "5-й поверх. Кронштейн майже прикручений.",
        text: "Ви на фінішній прямій. Голуби замовкли від поваги. Але раптом вітер доносить запах свіжого хліба з кіоску, Валєра відволікається на хлібчик... а ви зависаєте над прірвою!",
        image: "assets/petro_almost.svg",
        height: "15м",
        motion: "wind",
        fear: 95,
        respect: 50,
        options: [
            { text: "Закрутити останній болт із заплющеними очима 🔩", next: "final_hero", log: "Героїчно прикрутив болт наосліп!", sound: "dzing" },
            { text: "Стрибнути в клумбу (метод Валєри) 🌳", next: "final_flowerbed", log: "Вирішив перевірити теорію м'якої клумби.", sound: "splash" }
        ]
    },

    stage_3B: {
        title: "Земля кличе! Геть висотні муки.",
        text: "Ви розумієте, що життя дорожче за кондиціонер на верхотурі. Душа проситься на надійний асфальт. Валєра супроводжує вас вниз.",
        image: "assets/petro_pigeon.svg",
        height: "3м",
        motion: "shaking",
        fear: 30,
        respect: 20,
        options: [
            { text: "Стрибнути в клумбу для гарантії м'якості 🌸", next: "final_flowerbed", log: "М'яко приземлився в квіти.", sound: "splash" },
            { text: "Створити горизонтальну фірму 🤝", next: "final_flowerbed", log: "Заснував новий безпечний бізнес.", sound: "dzing" }
        ]
    },

    final_hero: {
        title: "Ви це зробили! Кондиціонер встановлено! 🎉",
        text: "Петро відкриває очі. Він на висоті 15 метрів, але йому більше не страшно! Голуби аплодують крилами. Валєра кричить: «Ну ти й відчайдух! Тепер ти справжній монтажник-голуб!» Петро отримує звання «Почесний птах» і відкриває нові вершини!",
        image: "assets/petro_hero.svg",
        height: "15м",
        motion: "wind",
        fear: 10,
        respect: 95,
        options: [],
        sound: "fanfare"
    },

    final_flowerbed: {
        title: "Політ Валєри. Або Петро — горизонтальний геній! 🌺",
        text: "Петро здійснює м'який стрибок у клумбу! Приземлення ідеальне, але дриль розлітається на друзки. Голуби в шоці. Петро відкриває компанію «Монтаж на першому поверсі». Його девіз: «Вище плінтуса — не моє». Клієнти задоволені!",
        image: "assets/petro_flowerbed.svg",
        height: "1м",
        motion: "shaking",
        fear: 0,
        respect: 45,
        options: [],
        sound: "splash"
    },

    secret_pigeonman: {
        title: "Секрет: Голуб всередині Петра прокинувся! 🕊️✨",
        text: "Виявляється, у минулому житті Петро був сизим голубом і літав над цим будинком! Після трьох кліків по касці він згадав своє коріння! У Петра виросли величні сірі крила, він пернатий і більше ніколи не боїться висоти!",
        image: "assets/petro_pigeonman.svg",
        height: "12м",
        motion: "wind",
        fear: 0,
        respect: 100,
        options: [],
        sound: "fanfare"
    }
};

// 4. CORE ENGINE FUNCTIONS

// Update the entire UI based on current stage
function renderStage(stageKey) {
    const stage = stages[stageKey];
    if (!stage) return;

    gameState.currentStage = stageKey;

    // Update Text Elements
    document.getElementById("stage-title").innerText = stage.title;
    document.getElementById("stage-text").innerText = stage.text;
    document.getElementById("current-height").innerText = stage.height;
    
    // Update SVG poster
    const imgEl = document.getElementById("scene-image");
    imgEl.src = stage.image;
    imgEl.alt = stage.title;

    // Update Motion classes on body
    document.body.setAttribute("data-phase", stageKey.includes("final") ? "final" : stageKey.split("_")[1] || "ground");
    document.body.setAttribute("data-motion", stage.motion);

    // Apply Stats changes smoothly
    updateStats(stage.fear, stage.respect);

    // Handle Options Rendering
    const choicesContainer = document.getElementById("choices-container");
    const restartPanel = document.getElementById("restart-panel");

    choicesContainer.innerHTML = "";

    if (stage.options && stage.options.length > 0) {
        // Show choice buttons
        restartPanel.classList.add("hidden");
        choicesContainer.classList.remove("hidden");

        stage.options.forEach((opt) => {
            const btn = document.createElement("button");
            btn.className = "choice-btn";
            btn.innerText = opt.text;
            btn.addEventListener("click", () => makeChoice(opt));
            choicesContainer.appendChild(btn);
        });
    } else {
        // Final screen: hide choices, show restart button
        choicesContainer.classList.add("hidden");
        restartPanel.classList.remove("hidden");

        // Trigger special ending sound effects
        if (stageKey === "final_hero" || stageKey === "secret_pigeonman") {
            PigeonAudio.playFanfare();
            triggerFeatherBlast(40);
        } else if (stageKey === "final_flowerbed") {
            PigeonAudio.playSplash();
        }
    }
}

// Handle choices clicked by user
function makeChoice(option) {
    // Play button click tick
    PigeonAudio.playClick();

    // Set a tiny timeout to play the choice-specific sound effect
    setTimeout(() => {
        if (option.sound === "coo") {
            PigeonAudio.playCoo();
        } else if (option.sound === "drill") {
            PigeonAudio.playDrill();
        } else if (option.sound === "fear") {
            PigeonAudio.playFearScream();
        } else if (option.sound === "dzing") {
            PigeonAudio.playDzing();
        } else if (option.sound === "splash") {
            PigeonAudio.playSplash();
        }
    }, 120);

    // Append to Decision Log
    gameState.choicesLog.push(option.log);
    updateDecisionLog(option.log);

    // Move to next stage
    renderStage(option.next);
}

// Update stats dials smoothly
function updateStats(targetFear, targetRespect) {
    gameState.fear = targetFear;
    gameState.respect = targetRespect;

    // Dom updates
    document.getElementById("fear-percentage").innerText = `${gameState.fear}%`;
    document.getElementById("respect-percentage").innerText = `${gameState.respect}%`;

    const fearBar = document.getElementById("fear-progress");
    const respectBar = document.getElementById("respect-progress");

    fearBar.style.width = `${gameState.fear}%`;
    respectBar.style.width = `${gameState.respect}%`;

    // High fear shakes progress bar
    if (gameState.fear >= 75) {
        fearBar.classList.add("bar-fear-spiked");
        document.body.setAttribute("data-fear-level", gameState.fear >= 90 ? "critical" : "high");
    } else {
        fearBar.classList.remove("bar-fear-spiked");
        document.body.removeAttribute("data-fear-level");
    }

    // Dynamic Title Generation
    generatePetroTitle();
}

// Dynamic rank generation
function generatePetroTitle() {
    let title = "Звичайний монтажник 🛠️";
    
    if (gameState.currentStage === "secret_pigeonman") {
        title = "Людина-Голуб 🕊️👑";
    } else if (gameState.currentStage === "final_hero") {
        title = "Почесний Птах 👑🔩";
    } else if (gameState.currentStage === "final_flowerbed") {
        title = "Горизонтальний Геній 🌸";
    } else if (gameState.respect >= 80 && gameState.fear <= 30) {
        title = "Пташиний Генерал 🎖️";
    } else if (gameState.respect >= 50) {
        title = "Учень Валєри 🎓";
    } else if (gameState.fear >= 85) {
        title = "Тремтяча Драбина 😰";
    } else if (gameState.respect <= 25 && gameState.fear <= 25) {
        title = "Ґрунтовий Майстер 🚜";
    }

    gameState.title = title;
    document.getElementById("petro-title").innerText = title;
}

// Append rows to the decisions log panel
function updateDecisionLog(text) {
    const logBox = document.getElementById("decision-log");
    const newItem = document.createElement("div");
    newItem.className = "log-item choice-item";
    newItem.innerText = text;
    logBox.appendChild(newItem);

    // Auto scroll timeline to bottom
    logBox.scrollTop = logBox.scrollHeight;
}

// Restarts the whole game
function restartGame() {
    PigeonAudio.playClick();
    
    gameState.fear = 20;
    gameState.respect = 10;
    gameState.choicesLog = ["Прибув на об'єкт (3м)."];
    
    // Clear log UI
    const logBox = document.getElementById("decision-log");
    logBox.innerHTML = '<div class="log-item start-item">Прибув на об\'єкт (3м).</div>';

    renderStage("stage_0");
}

// 5. PREMIUM FEATHER PARTICLES SYSTEM
function triggerFeatherBlast(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(spawnFeather, Math.random() * 800);
    }
}

function spawnFeather() {
    const container = document.getElementById("particles-container");
    if (!container) return;

    const feather = document.createElement("div");
    feather.className = "feather-particle";
    
    // Random placement, scale, and color shading
    const startX = Math.random() * window.innerWidth;
    const size = 6 + Math.random() * 12;
    const driftX = -40 + Math.random() * 80;
    const duration = 6 + Math.random() * 6;
    
    feather.style.left = `${startX}px`;
    feather.style.width = `${size}px`;
    feather.style.height = `${size * 1.5}px`;
    
    // Slate blue/grey tones
    const colorChance = Math.random();
    if (colorChance < 0.5) {
        feather.style.backgroundColor = "rgba(113, 128, 147, 0.4)"; // Pigeon grey
    } else if (colorChance < 0.8) {
        feather.style.backgroundColor = "rgba(255, 255, 255, 0.6)"; // White feather
    } else {
        feather.style.backgroundColor = "rgba(142, 68, 173, 0.35)"; // Purple glow
    }

    feather.style.animation = `feather-fall ${duration}s linear forwards`;
    
    container.appendChild(feather);

    // Clean up particles
    setTimeout(() => {
        feather.remove();
    }, duration * 1000);
}

// Start feather rain on victory loops
setInterval(() => {
    if (gameState.currentStage === "final_hero" || gameState.currentStage === "secret_pigeonman") {
        spawnFeather();
    }
}, 800);

// 6. EASTER EGG: HELMET CLICKS TRIGGER
function handleHelmetClick() {
    // Reset click timer
    clearTimeout(gameState.clickTimer);
    
    gameState.helmetClicks++;

    // Synthesize funny sound on each avatar click
    if (gameState.helmetClicks < 3) {
        PigeonAudio.playClick();
        PigeonAudio.playCoo();
        
        // Wobble avatar container
        const avatar = document.getElementById("petro-avatar");
        avatar.style.transform = "scale(0.85) rotate(-10deg)";
        setTimeout(() => {
            avatar.style.transform = "";
        }, 150);
    }

    if (gameState.helmetClicks >= 3) {
        // TRIGGER SECRET EASTER EGG STAGE
        triggerPigeonmanSecret();
    } else {
        // Reset count after 2.5 seconds of inactivity
        gameState.clickTimer = setTimeout(() => {
            gameState.helmetClicks = 0;
        }, 2500);
    }
}

function triggerPigeonmanSecret() {
    gameState.helmetClicks = 0;

    // Dramatic glitch effects
    PigeonAudio.playFearScream();
    setTimeout(() => {
        PigeonAudio.playCoo();
    }, 400);

    // Screen shake flash
    document.body.setAttribute("data-motion", "falling-rapid");
    
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "#fff";
    overlay.style.zIndex = "9999";
    overlay.style.transition = "opacity 0.8s ease";
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => {
            overlay.remove();
        }, 800);
    }, 100);

    // Append to log and render stage
    gameState.choicesLog.push("О ДИВО! Петро згадав минуле життя і випустив голуба всередину!");
    updateDecisionLog("ВІДКРИТО ТАЄМНИЦЮ: Петро згадав крила!");
    
    renderStage("secret_pigeonman");
}

// 7. INITIALIZATION AND EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    // Render start stage
    renderStage("stage_0");

    // Audio Toggle Handler
    const audioBtn = document.getElementById("audio-toggle");
    audioBtn.addEventListener("click", () => {
        gameState.isAudioActive = !gameState.isAudioActive;
        
        if (gameState.isAudioActive) {
            audioBtn.classList.add("active");
            audioBtn.innerHTML = '<span class="audio-icon">🔊</span> Звук увімк.';
            PigeonAudio.init();
            PigeonAudio.playClick();
            PigeonAudio.playCoo();
        } else {
            audioBtn.classList.remove("active");
            audioBtn.innerHTML = '<span class="audio-icon">🔇</span> Без звуку';
        }
    });

    // Helmet click handler for Easter Egg
    const avatar = document.getElementById("petro-avatar");
    avatar.addEventListener("click", handleHelmetClick);

    // Restart button handler
    const restartBtn = document.getElementById("restart-btn");
    restartBtn.addEventListener("click", restartGame);
});
