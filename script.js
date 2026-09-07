const translations = {
    en: {
        title: "FLAGGED",
        subtitle: "Red flag or not?",
        question: "What do you think?",
        normal: "🟢 NORMAL",
        hmm: "🟡 HMM...",
        red: "🔴 RED FLAG",
        yourAnswer: "YOUR ANSWER",
        others: "Here's what others think:",
        next: "NEXT FLAG →",
        scoreTitle: "YOUR FLAGGED SCORE",
        agreed: "You agreed with the majority",
        times: "times.",
        playAgain: "PLAY AGAIN ↻",
        majority: "🔥 You're with the majority!",
        minority: "👀 You're in the minority!",
        language: "Language",
        relationships: "RELATIONSHIPS",
        friendship: "FRIENDSHIP",
        social: "SOCIAL MEDIA",
        work: "WORK",
        everyday: "EVERYDAY LIFE",
        titles: {
            high: "🚩 PROFESSIONAL RED FLAG DETECTOR",
            medium: "😈 YOU KNOW WHAT'S GOING ON",
            low: "🧐 MAYBE GIVE PEOPLE A CHANCE",
            veryLow: "😇 TOO TRUSTING"
        }
    },

    ru: {
        title: "FLAGGED",
        subtitle: "Красный флаг или нет?",
        question: "Что думаешь?",
        normal: "🟢 НОРМАЛЬНО",
        hmm: "🟡 ХММ...",
        red: "🔴 КРАСНЫЙ ФЛАГ",
        yourAnswer: "ТВОЙ ОТВЕТ",
        others: "А вот что думают другие:",
        next: "СЛЕДУЮЩИЙ ФЛАГ →",
        scoreTitle: "ТВОЙ РЕЗУЛЬТАТ FLAGGED",
        agreed: "Ты совпал(а) с большинством",
        times: "раз.",
        playAgain: "ИГРАТЬ СНОВА ↻",
        majority: "🔥 Ты заодно с большинством!",
        minority: "👀 Ты в меньшинстве!",
        language: "Язык",
        relationships: "ОТНОШЕНИЯ",
        friendship: "ДРУЖБА",
        social: "СОЦИАЛЬНЫЕ СЕТИ",
        work: "РАБОТА",
        everyday: "ПОВСЕДНЕВНАЯ ЖИЗНЬ",
        titles: {
            high: "🚩 ПРОФЕССИОНАЛЬНЫЙ ОХОТНИК НА RED FLAGS",
            medium: "😈 ТЫ ПОНИМАЕШЬ, ЧТО К ЧЕМУ",
            low: "🧐 МОЖЕТ, ДАДИМ ЛЮДЯМ ШАНС?",
            veryLow: "😇 СЛИШКОМ ДОВЕРЧИВЫЙ"
        }
    },

    pl: {
        title: "FLAGGED",
        subtitle: "Red flag czy nie?",
        question: "Co o tym myślisz?",
        normal: "🟢 NORMALNE",
        hmm: "🟡 HMM...",
        red: "🔴 RED FLAG",
        yourAnswer: "TWOJA ODPOWIEDŹ",
        others: "A oto co myślą inni:",
        next: "NASTĘPNY FLAG →",
        scoreTitle: "TWÓJ WYNIK FLAGGED",
        agreed: "Z większością zgodziłeś/aś się",
        times: "razy.",
        playAgain: "ZAGRAJ PONOWNIE ↻",
        majority: "🔥 Jesteś po stronie większości!",
        minority: "👀 Jesteś w mniejszości!",
        language: "Język",
        relationships: "RELACJE",
        friendship: "PRZYJAŹŃ",
        social: "MEDIA SPOŁECZNOŚCIOWE",
        work: "PRACA",
        everyday: "CODZIENNE ŻYCIE",
        titles: {
            high: "🚩 PROFESJONALNY WYKRYWACZ RED FLAGS",
            medium: "😈 WIESZ, O CO CHODZI",
            low: "🧐 MOŻE DAJMY LUDZIOM SZANSĘ?",
            veryLow: "😇 ZBYT UFNY/A"
        }
    }
};


const situations = [

    {
        category: "relationships",
        text: {
            en: "Your partner still follows their ex and likes their posts.",
            ru: "Твой партнёр всё ещё подписан на бывшего/бывшую и лайкает его/её посты.",
            pl: "Twój partner nadal obserwuje byłego/byłą i lajkuje jego/jej posty."
        },
        votes: { normal: 18, hmm: 30, red: 52 }
    },

    {
        category: "relationships",
        text: {
            en: "They read your message immediately but reply 10 hours later.",
            ru: "Он/она сразу читает твои сообщения, но отвечает через 10 часов.",
            pl: "Czyta Twoją wiadomość od razu, ale odpowiada dopiero po 10 godzinach."
        },
        votes: { normal: 24, hmm: 31, red: 45 }
    },

    {
        category: "relationships",
        text: {
            en: "Your partner never posts you, but posts everything else.",
            ru: "Твой партнёр никогда не выкладывает тебя, но постоянно публикует всё остальное.",
            pl: "Twój partner nigdy nie publikuje zdjęć z Tobą, ale publikuje wszystko inne."
        },
        votes: { normal: 20, hmm: 25, red: 55 }
    },

    {
        category: "relationships",
        text: {
            en: "They say they are not ready for a relationship but still want all the benefits of one.",
            ru: "Он/она говорит, что не готов(а) к отношениям, но хочет получать все преимущества отношений.",
            pl: "Mówi, że nie jest gotowy/a na związek, ale chce wszystkich jego korzyści."
        },
        votes: { normal: 12, hmm: 20, red: 68 }
    },

    {
        category: "relationships",
        text: {
            en: "They cancel your plans because their friends invited them somewhere.",
            ru: "Он/она отменяет ваши планы, потому что друзья позвали куда-то.",
            pl: "Odwołuje Wasze plany, bo znajomi zaprosili go/ją gdzie indziej."
        },
        votes: { normal: 15, hmm: 30, red: 55 }
    },

    {
        category: "relationships",
        text: {
            en: "Your partner knows something bothers you but keeps doing it.",
            ru: "Твой партнёр знает, что тебя что-то раздражает, но продолжает это делать.",
            pl: "Twój partner wie, że coś Ci przeszkadza, ale nadal to robi."
        },
        votes: { normal: 10, hmm: 18, red: 72 }
    },

    {
        category: "relationships",
        text: {
            en: "They regularly check who liked your Instagram posts.",
            ru: "Он/она регулярно проверяет, кто лайкает твои фотографии в Instagram.",
            pl: "Regularnie sprawdza, kto lajkuje Twoje zdjęcia na Instagramie."
        },
        votes: { normal: 30, hmm: 40, red: 30 }
    },

    {
        category: "relationships",
        text: {
            en: "They say they are not jealous but always ask who you were with.",
            ru: "Он/она говорит, что не ревнует, но постоянно спрашивает, с кем ты был(а).",
            pl: "Mówi, że nie jest zazdrosny/a, ale ciągle pyta, z kim byłeś/aś."
        },
        votes: { normal: 28, hmm: 44, red: 28 }
    },

    {
        category: "relationships",
        text: {
            en: "They disappear for hours and simply say they were busy.",
            ru: "Он/она пропадает на несколько часов и просто говорит: «Я был(а) занят(а)».",
            pl: "Znosi się na kilka godzin i mówi tylko: „Byłem/am zajęty/a”."
        },
        votes: { normal: 25, hmm: 45, red: 30 }
    },

    {
        category: "relationships",
        text: {
            en: "They remember tiny details about their ex but forget important things you tell them.",
            ru: "Он/она помнит мелочи о бывшем/бывшей, но забывает важные вещи, которые рассказываешь ты.",
            pl: "Pamięta drobiazgi dotyczące byłego/byłej, ale zapomina ważne rzeczy, które mu/jej mówisz."
        },
        votes: { normal: 15, hmm: 30, red: 55 }
    },


    {
        category: "friendship",
        text: {
            en: "Your friend only texts you when they need a favor.",
            ru: "Друг пишет тебе только тогда, когда ему что-то нужно.",
            pl: "Twój znajomy pisze do Ciebie tylko wtedy, gdy czegoś potrzebuje."
        },
        votes: { normal: 10, hmm: 25, red: 65 }
    },

    {
        category: "friendship",
        text: {
            en: "Your friend cancels plans with you but posts photos from a night out with someone else.",
            ru: "Друг отменяет планы с тобой, а потом выкладывает фотографии с другими людьми.",
            pl: "Znajomy odwołuje plany z Tobą, a potem publikuje zdjęcia z innymi."
        },
        votes: { normal: 12, hmm: 25, red: 63 }
    },

    {
        category: "friendship",
        text: {
            en: "Your friend asks you to be honest but gets offended when you are.",
            ru: "Друг просит быть честным, но обижается, когда ты действительно честен.",
            pl: "Znajomy prosi Cię o szczerość, ale obraża się, kiedy naprawdę jesteś szczery/a."
        },
        votes: { normal: 25, hmm: 45, red: 30 }
    },

    {
        category: "friendship",
        text: {
            en: "Your friend shares your private story with someone else because they were worried about you.",
            ru: "Друг рассказывает кому-то твою личную историю, потому что якобы переживал за тебя.",
            pl: "Znajomy opowiada komuś Twoją prywatną historię, bo podobno się o Ciebie martwił."
        },
        votes: { normal: 12, hmm: 23, red: 65 }
    },

    {
        category: "friendship",
        text: {
            en: "Your friend never celebrates your achievements but expects you to celebrate theirs.",
            ru: "Друг никогда не радуется твоим достижениям, но ждёт, что ты будешь радоваться его.",
            pl: "Znajomy nigdy nie cieszy się z Twoich sukcesów, ale oczekuje, że Ty będziesz cieszyć się z jego."
        },
        votes: { normal: 18, hmm: 27, red: 55 }
    },


    {
        category: "social",
        text: {
            en: "Someone watches every Story you post but never interacts with you.",
            ru: "Кто-то смотрит каждую твою Stories, но никогда никак не реагирует.",
            pl: "Ktoś ogląda każdą Twoją relację, ale nigdy z Tobą nie wchodzi w interakcję."
        },
        votes: { normal: 35, hmm: 45, red: 20 }
    },

    {
        category: "social",
        text: {
            en: "Your partner follows hundreds of attractive strangers but gets annoyed when you follow someone new.",
            ru: "Твой партнёр подписан на сотни привлекательных незнакомцев, но раздражается, когда ты подписываешься на кого-то нового.",
            pl: "Twój partner obserwuje setki atrakcyjnych nieznajomych, ale złości się, gdy Ty obserwujesz kogoś nowego."
        },
        votes: { normal: 8, hmm: 20, red: 72 }
    },

    {
        category: "social",
        text: {
            en: "Someone removes a like from your photo after you don't like theirs back.",
            ru: "Кто-то убирает лайк с твоей фотографии, потому что ты не лайкнул(а) его фотографию.",
            pl: "Ktoś usuwa lajka z Twojego zdjęcia, bo Ty nie polubiłeś/aś jego zdjęcia."
        },
        votes: { normal: 20, hmm: 35, red: 45 }
    },

    {
        category: "social",
        text: {
            en: "Someone posts 'some people are fake' immediately after an argument with you.",
            ru: "Кто-то сразу после ссоры с тобой выкладывает: «Некоторые люди такие фальшивые».",
            pl: "Ktoś zaraz po kłótni z Tobą publikuje: „Niektórzy ludzie są fałszywi”."
        },
        votes: { normal: 15, hmm: 30, red: 55 }
    },

    {
        category: "social",
        text: {
            en: "Someone constantly posts about how happy their relationship is.",
            ru: "Кто-то постоянно публикует посты о том, насколько счастлив(а) в отношениях.",
            pl: "Ktoś ciągle publikuje posty o tym, jak bardzo jest szczęśliwy/a w związku."
        },
        votes: { normal: 45, hmm: 40, red: 15 }
    },


    {
        category: "work",
        text: {
            en: "Your colleague takes credit for an idea you came up with.",
            ru: "Коллега присваивает себе идею, которую придумал(а) ты.",
            pl: "Twój współpracownik przypisuje sobie pomysł, który był Twój."
        },
        votes: { normal: 5, hmm: 10, red: 85 }
    },

    {
        category: "work",
        text: {
            en: "Your boss sends 'Can we talk?' at 11:47 PM.",
            ru: "Начальник пишет: «Можем поговорить?» в 23:47.",
            pl: "Szef pisze „Możemy porozmawiać?” o 23:47."
        },
        votes: { normal: 35, hmm: 45, red: 20 }
    },

    {
        category: "work",
        text: {
            en: "A colleague always asks for your help but never helps you.",
            ru: "Коллега постоянно просит тебя о помощи, но никогда не помогает тебе.",
            pl: "Współpracownik ciągle prosi Cię o pomoc, ale nigdy nie pomaga Tobie."
        },
        votes: { normal: 12, hmm: 25, red: 63 }
    },

    {
        category: "work",
        text: {
            en: "Your boss says, 'We are like a family here.'",
            ru: "Начальник говорит: «Мы здесь как одна семья».",
            pl: "Szef mówi: „Jesteśmy tutaj jak rodzina”."
        },
        votes: { normal: 35, hmm: 45, red: 20 }
    },

    {
        category: "work",
        text: {
            en: "A colleague complains about everyone to you and then acts like their best friend.",
            ru: "Коллега жалуется тебе на всех, а потом ведёт себя с этими людьми как лучший друг.",
            pl: "Współpracownik narzeka przy Tobie na wszystkich, a potem zachowuje się jak ich najlepszy przyjaciel."
        },
        votes: { normal: 20, hmm: 50, red: 30 }
    },


    {
        category: "everyday",
        text: {
            en: "Someone says 'I'm already on my way' while they are still in bed.",
            ru: "Человек говорит: «Я уже выезжаю», хотя всё ещё лежит в кровати.",
            pl: "Ktoś mówi „Już jadę”, chociaż nadal leży w łóżku."
        },
        votes: { normal: 35, hmm: 45, red: 20 }
    },

    {
        category: "everyday",
        text: {
            en: "Someone opens the fridge five times hoping new food will magically appear.",
            ru: "Человек пять раз открывает холодильник в надежде, что там magically появится новая еда.",
            pl: "Ktoś pięć razy otwiera lodówkę, licząc, że magicznie pojawi się nowe jedzenie."
        },
        votes: { normal: 70, hmm: 25, red: 5 }
    },

    {
        category: "everyday",
        text: {
            en: "Someone leaves one sip of a drink in the bottle so they don't have to throw it away.",
            ru: "Человек оставляет один глоток напитка в бутылке, чтобы не выбрасывать её.",
            pl: "Ktoś zostawia jeden łyk napoju w butelce, żeby nie musieć jej wyrzucać."
        },
        votes: { normal: 25, hmm: 35, red: 40 }
    },

    {
        category: "everyday",
        text: {
            en: "Someone sets 12 alarms every morning and still wakes everyone else up.",
            ru: "Человек ставит 12 будильников каждое утро и всё равно будит всех вокруг.",
            pl: "Ktoś ustawia 12 budzików każdego ranka i nadal budzi wszystkich dookoła."
        },
        votes: { normal: 20, hmm: 35, red: 45 }
    },

    {
        category: "everyday",
        text: {
            en: "Your friend says 'I'll be there in five minutes' and arrives 40 minutes later.",
            ru: "Друг говорит: «Буду через пять минут», а приходит через 40.",
            pl: "Znajomy mówi „Będę za pięć minut”, a pojawia się po 40."
        },
        votes: { normal: 25, hmm: 40, red: 35 }
    }
];


let currentIndex = 0;
let score = 0;
let gameStarted = false;
let language = localStorage.getItem("flaggedLanguage") || "en";

const card = document.querySelector(".card");
const app = document.querySelector(".app");


function t() {
    return translations[language];
}


function categoryName(category) {
    const names = {
        relationships: t().relationships,
        friendship: t().friendship,
        social: t().social,
        work: t().work,
        everyday: t().everyday
    };

    return names[category];
}


function createLanguageSelector() {
    const oldSelector = document.querySelector(".language-selector");

    if (oldSelector) {
        oldSelector.remove();
    }

    const selector = document.createElement("div");

    selector.className = "language-selector";

    selector.innerHTML = `
        <span>${t().language}:</span>
        <button data-lang="en">🇬🇧</button>
        <button data-lang="ru">🇷🇺</button>
        <button data-lang="pl">🇵🇱</button>
    `;

    app.prepend(selector);

    selector.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            language = button.dataset.lang;
            localStorage.setItem("flaggedLanguage", language);

            updateHeader();
            showSituation();
        });
    });
}


function updateHeader() {
    const logo = document.querySelector(".logo");
    const title = document.querySelector("h1");
    const subtitle = document.querySelector(".subtitle");
    const hint = document.querySelector(".hint");

    if (title) title.textContent = t().title;
    if (subtitle) subtitle.textContent = t().subtitle;

    if (hint) {
        hint.textContent =
            language === "en"
                ? "You decide. We show what others think."
                : language === "ru"
                ? "Ты решаешь. Мы показываем мнение других."
                : "Ty decydujesz. My pokazujemy opinie innych.";
    }

    if (logo) {
        logo.textContent = "🚩";
    }
}


function showStartScreen() {
    const startTexts = {
        en: {
            intro: "30 situations. One question: would you flag it?",
            play: "PLAY →"
        },
        ru: {
            intro: "30 ситуаций. Один вопрос: это красный флаг или нет?",
            play: "ИГРАТЬ →"
        },
        pl: {
            intro: "30 sytuacji. Jedno pytanie: red flag czy nie?",
            play: "GRAJ →"
        }
    };

    card.innerHTML = `
        <div style="
            font-size: 42px;
            margin-bottom: 20px;
        ">
            🚩
        </div>

        <h2 style="
            font-size: 28px;
            margin-bottom: 18px;
        ">
            ${t().title}
        </h2>

        <p style="
            color: #999;
            font-size: 17px;
            line-height: 1.6;
            margin-bottom: 30px;
        ">
            ${startTexts[language].intro}
        </p>

        <button id="playButton"
            style="
                width: 100%;
                padding: 17px;
                border: none;
                border-radius: 15px;
                background: white;
                color: black;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
            ">
            ${startTexts[language].play}
        </button>
    `;

    document
        .getElementById("playButton")
        .addEventListener("click", () => {
            gameStarted = true;
            currentIndex = 0;
            score = 0;
            showSituation();
        });
}
function addShareButton() {
    const playButton = document.getElementById("playButton");
    if (!playButton || document.getElementById("shareButton")) return;

    const shareButton = document.createElement("button");
    shareButton.id = "shareButton";
    shareButton.textContent =
        language === "ru" ? "↗ ПОДЕЛИТЬСЯ" :
        language === "pl" ? "↗ UDOSTĘPNIJ" :
        "↗ SHARE";

    shareButton.style.cssText = `
        width: 100%;
        padding: 14px;
        margin-top: 12px;
        border: 1px solid #444;
        border-radius: 15px;
        background: transparent;
        color: white;
        font-size: 15px;
        cursor: pointer;
    `;

    shareButton.addEventListener("click", () => {
        const url = "https://zzr2hz26zy-rgb.github.io/FLAGGED/";
        const text = "FLAGGED 🚩 — Red Flag or Not?";

        const menu = document.createElement("div");
        menu.id = "shareMenu";
        menu.style.cssText = `
            margin-top: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        const makeButton = (label, action) => {
            const btn = document.createElement("button");
            btn.textContent = label;
            btn.style.cssText = `
                width: 100%;
                padding: 12px;
                border: 1px solid #444;
                border-radius: 12px;
                background: #222;
                color: white;
                font-size: 14px;
                cursor: pointer;
            `;
            btn.onclick = action;
            menu.appendChild(btn);
        };

        makeButton("🟢 WhatsApp", () => {
            window.open(
                "https://wa.me/?text=" + encodeURIComponent(text + " " + url),
                "_blank"
            );
        });

        makeButton("🔵 Telegram", () => {
            window.open(
                "https://t.me/share/url?url=" + encodeURIComponent(url) +
                "&text=" + encodeURIComponent(text),
                "_blank"
            );
        });

        makeButton("🔵 Facebook", () => {
            window.open(
                "https://www.facebook.com/sharer/sharer.php?u=" +
                encodeURIComponent(url),
                "_blank"
            );
        });

        makeButton("📋 Скопировать ссылку", async () => {
            await navigator.clipboard.writeText(url);
            alert(
                language === "ru" ? "Ссылка скопирована!" :
                language === "pl" ? "Link skopiowany!" :
                "Link copied!"
            );
        });

        if (document.getElementById("shareMenu")) {
            document.getElementById("shareMenu").remove();
        } else {
            shareButton.after(menu);
        }
    });

    playButton.parentNode.insertBefore(
        shareButton,
        playButton.nextSibling
    );
}

function showSituation() {
    const situation = situations[currentIndex];

    card.innerHTML = `
        <div class="category">
            ${categoryName(situation.category)}
        </div>

        <p class="situation">
            ${situation.text[language]}
        </p>

        <p class="question">
            ${t().question}
        </p>

        <div class="buttons">
            <button class="normal">${t().normal}</button>
            <button class="hmm">${t().hmm}</button>
            <button class="red">${t().red}</button>
        </div>

<div class="progress-info">
    <span>${currentIndex + 1} / ${situations.length}</span>
</div>

<div class="progress-bar">
    <div class="progress-fill"
         style="width: ${((currentIndex + 1) / situations.length) * 100}%;">
    </div>
</div>    `;

    const buttons = card.querySelectorAll(".buttons button");

    buttons.forEach(button => {
        button.addEventListener("click", () => handleAnswer(button));
    });
}


const flaggedBrowserId = localStorage.getItem("flaggedBrowserId") || crypto.randomUUID();
localStorage.setItem("flaggedBrowserId", flaggedBrowserId);

async function handleAnswer(button) {
    let answer = "";
    let selected = "";
    let position = 0;

    if (button.classList.contains("normal")) {
        answer = t().normal;
        selected = "normal";
        position = 1;
    }

    if (button.classList.contains("hmm")) {
        answer = t().hmm;
        selected = "hmm";
        position = 2;
    }

    if (button.classList.contains("red")) {
        answer = t().red;
        selected = "red";
        position = 3;
    }

    const questionId = currentIndex + 1;

    try {
        const { data: option, error: optionError } = await supabaseClient
            .from("options")
            .select("id")
            .eq("question_id", questionId)
            .eq("position", position)
            .single();

        if (optionError) {
            console.error("Ошибка поиска варианта:", optionError);
            return;
        }

        const { error: voteError } = await supabaseClient
            .from("votes")
            .insert({
                question_id: questionId,
                option_id: option.id,
                browser_id: flaggedBrowserId,
                has_personal_experience: false
            });

        if (voteError) {
            console.error("Ошибка сохранения голоса:", voteError);
            return;
        }

        console.log("Flagged: голос сохранён", {
            questionId,
            optionId: option.id,
            answer: selected
        });

        const { data: votes, error: votesError } = await supabaseClient
            .from("votes")
            .select("option_id")
            .eq("question_id", questionId);

        if (votesError) {
            console.error("Ошибка загрузки голосов:", votesError);
            return;
        }

        const counts = {
            normal: 0,
            hmm: 0,
            red: 0
        };

        votes.forEach(vote => {
            if (vote.option_id === option.id && selected === "normal") counts.normal++;
        });

        const optionIds = await supabaseClient
            .from("options")
            .select("id, position")
            .eq("question_id", questionId);

        if (!optionIds.error) {
            votes.forEach(vote => {
                const opt = optionIds.data.find(o => o.id === vote.option_id);

                if (opt?.position === 1) counts.normal++;
                if (opt?.position === 2) counts.hmm++;
                if (opt?.position === 3) counts.red++;
            });

            if (selected === "normal" && counts.normal > 0) counts.normal--;
        }

        const totalVotes = counts.normal + counts.hmm + counts.red;

        const percentages = {
            normal: totalVotes ? Math.round((counts.normal / totalVotes) * 100) : 0,
            hmm: totalVotes ? Math.round((counts.hmm / totalVotes) * 100) : 0,
            red: totalVotes ? Math.round((counts.red / totalVotes) * 100) : 0
        };

        const majority = Math.max(
            percentages.normal,
            percentages.hmm,
            percentages.red
        );

        if (percentages[selected] === majority) {
            score++;
        }

        const message =
            percentages[selected] === majority
                ? t().majority
                : t().minority;

        card.innerHTML = `
            <div class="category">
                ${t().yourAnswer}
            </div>

            <div style="font-size: 30px; margin: 25px 0;">
                ${answer}
            </div>

            <div style="margin-bottom: 20px; color: #999;">
                ${t().others}
            </div>

            <div style="text-align: left; line-height: 2;">
                🟢 ${t().normal.replace("🟢 ", "")} — ${percentages.normal}%<br>
                🟡 ${t().hmm.replace("🟡 ", "")} — ${percentages.hmm}%<br>
                🔴 ${t().red.replace("🔴 ", "")} — ${percentages.red}%
            </div>

            <div style="
                margin-top: 20px;
                font-weight: bold;
                font-size: 16px;
            ">
                ${message}
            </div>

            <button id="nextButton"
                style="
                    width: 100%;
                    margin-top: 25px;
                    padding: 16px;
                    border: none;
                    border-radius: 14px;
                    background: white;
                    color: black;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                ">
                ${currentIndex === situations.length - 1
                    ? t().scoreTitle + " →"
                    : t().next}
            </button>
        `;

        document
            .getElementById("nextButton")
            .addEventListener("click", nextStep);

    } catch (error) {
        console.error("Flagged: ошибка:", error);
    }
}

function nextStep() {
    currentIndex++;

    if (currentIndex >= situations.length) {
        showFinalResult();
    } else {
        showSituation();
    }
}


function showFinalResult() {
    const total = situations.length;
    const percentage = Math.round((score / total) * 100);

    let title;

    if (percentage >= 80) {
        title = t().titles.high;
    } else if (percentage >= 50) {
        title = t().titles.medium;
    } else if (percentage >= 30) {
        title = t().titles.low;
    } else {
        title = t().titles.veryLow;
    }

    card.innerHTML = `
        <div class="category">
            ${t().scoreTitle}
        </div>

        <div style="
            font-size: 56px;
            margin: 20px 0;
        ">
            ${percentage}%
        </div>

        <h2 style="margin-bottom: 18px;">
            ${title}
        </h2>

        <p style="
            color: #999;
            line-height: 1.6;
        ">
            ${t().agreed}
            <strong>${score}</strong> / 
            <strong>${total}</strong>
            ${t().times}
        </p>

        <button id="restartButton"
            style="
                width: 100%;
                margin-top: 28px;
                padding: 16px;
                border: none;
                border-radius: 14px;
                background: white;
                color: black;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
            ">
            ${t().playAgain}
        </button>
    `;

    document
        .getElementById("restartButton")
        .addEventListener("click", restartGame);
}


function restartGame() {
    currentIndex = 0;
    score = 0;
    showSituation();
}


createLanguageSelector();
updateHeader();
showStartScreen();
addShareButton();
