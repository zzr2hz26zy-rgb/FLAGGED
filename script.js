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
        askQuestion: "ASK A QUESTION",
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
        askQuestion: "ЗАДАТЬ ВОПРОС",
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
        askQuestion: "ZADAJ PYTANIE",
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


let flaggedCategories = [];
let situations = [];


function mixQuestionsByType(items) {
    const situationsItems = items
        .filter(item => item.type === "SITUATION")
        .sort(() => Math.random() - 0.5);

    const questionItems = items
        .filter(item => item.type === "QUESTION")
        .sort(() => Math.random() - 0.5);

    const mixed = [];
    let lastType = null;
    let lastTypeCount = 0;

    while (situationsItems.length > 0 || questionItems.length > 0) {
        const hasSituations = situationsItems.length > 0;
        const hasQuestions = questionItems.length > 0;

        let nextType;

        if (
            lastType &&
            lastTypeCount >= 2 &&
            hasSituations &&
            hasQuestions
        ) {
            nextType = lastType === "SITUATION"
                ? "QUESTION"
                : "SITUATION";
        } else if (hasSituations && hasQuestions) {
            const situationWeight = situationsItems.length;
            const questionWeight = questionItems.length;
            const totalWeight = situationWeight + questionWeight;

            nextType =
                Math.random() * totalWeight < situationWeight
                    ? "SITUATION"
                    : "QUESTION";
        } else if (hasSituations) {
            nextType = "SITUATION";
        } else {
            nextType = "QUESTION";
        }

        const nextItem =
            nextType === "SITUATION"
                ? situationsItems.pop()
                : questionItems.pop();

        mixed.push(nextItem);

        if (lastType === nextType) {
            lastTypeCount++;
        } else {
            lastType = nextType;
            lastTypeCount = 1;
        }
    }

    return mixed;
}

async function loadQuestionsFromSupabase(categorySlug = "all") {
    const { data: categories, error: categoriesError } = await supabaseClient
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (categoriesError) {
        console.error("Flagged: ошибка загрузки категорий:", categoriesError);
        return false;
    }

    flaggedCategories = categories;

  const categoryMap = new Map(
        categories.map(category => [category.id, category.slug])
    );

    let questionsQuery = supabaseClient
        .from("questions")
        .select("*")
        .eq("status", "published")
        .order("id", { ascending: false });

    if (categorySlug !== "all") {
        const selectedCategory = categories.find(
            category => category.slug === categorySlug
        );

        if (!selectedCategory) {
            console.error(
                "Flagged: выбранная категория не найдена:",
                categorySlug
            );
            return false;
        }

        questionsQuery = questionsQuery.eq(
            "category_id",
            selectedCategory.id
        );
    }

    const { data: questions, error: questionsError } =
        await questionsQuery;

    if (questionsError) {
        console.error("Flagged: ошибка загрузки вопросов:", questionsError);
        return false;
    }

    const { data: options, error: optionsError } = await supabaseClient
        .from("options")
        .select("*")
        .order("question_id", { ascending: true })
        .order("position", { ascending: true });

    if (optionsError) {
        console.error("Flagged: ошибка загрузки вариантов:", optionsError);
        return false;
    }

    situations = questions.map(question => ({
        id: question.id,
        type: question.type,
        hasPersonalExperience: question.has_personal_experience,
        category: categoryMap.get(question.category_id) || "other",
        text: {
            en: question.text_en,
            ru: question.text_ru,
            pl: question.text_pl
        },
        options: options
            .filter(option => option.question_id === question.id)
            .map(option => ({
                id: option.id,
                position: option.position,
                en: option.text_en,
                ru: option.text_ru,
                pl: option.text_pl
            })),
        votes: {
            normal: 0,
            hmm: 0,
            red: 0
        }
    }));

    situations = mixQuestionsByType(situations);

    console.log("Flagged: вопросы загружены из Supabase:", situations.length);
    return true;
}

let currentIndex = 0;
let score = 0;
let gameStarted = false;
let selectedCategorySlug = "all";
let language = localStorage.getItem("flaggedLanguage") || "en";

let authReturnAction = () => showStartScreen();

const card = document.querySelector(".card");
const app = document.querySelector(".app");


function t() {
    return translations[language];
}


function categoryName(category) {
  const foundCategory = flaggedCategories.find(
    item => item.slug === category
  );

  if (!foundCategory) {
    return category;
  }

  const localizedName = foundCategory[`name_${language}`];

  return localizedName || foundCategory.name || category;
}


function createLanguageSelector() {
    const oldSelector = document.querySelector(".language-selector");

    if (oldSelector) {
        oldSelector.remove();
    }

    const currentFlag = {
        en: "🇬🇧",
        ru: "🇷🇺",
        pl: "🇵🇱"
    }[language] || "🇬🇧";

    const selector = document.createElement("div");
    selector.className = "language-selector";

    selector.innerHTML = `
        <button
            type="button"
            class="language-toggle"
            aria-label="${t().language}"
            aria-expanded="false"
            title="${t().language}"
        >
            ${currentFlag}
        </button>

        <div class="language-menu">
            <button type="button" data-lang="en">
                🇬🇧 <span>English</span>
            </button>

            <button type="button" data-lang="ru">
                🇷🇺 <span>Русский</span>
            </button>

            <button type="button" data-lang="pl">
                🇵🇱 <span>Polski</span>
            </button>
        </div>
    `;

    app.prepend(selector);

    const toggle = selector.querySelector(".language-toggle");
    const menu = selector.querySelector(".language-menu");

    toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    selector.querySelectorAll(".language-menu button").forEach(button => {
        button.addEventListener("click", async () => {
            language = button.dataset.lang;
            localStorage.setItem("flaggedLanguage", language);

            createLanguageSelector();
            updateHeader();
            await updateAuthButtons();

            if (document.getElementById("authEmail")) {
                const authMode = document.getElementById("authPasswordConfirm")
                    ? "signup"
                    : "signin";

                await showAuthComposer(authMode, true);
            } else if (gameStarted && situations.length > 0) {
                showSituation();
            } else {
                showStartScreen();
            }

            createLanguageSelector();
        });
    });
}


function updateHeader() {
    const logo = document.querySelector(".logo");
    const title = document.querySelector("h1");
    const subtitle = document.querySelector(".subtitle");
    const hint = document.querySelector(".hint");
    const createQuestionButton = document.getElementById("createQuestionButton");

    if (title) title.textContent = t().title;
    if (createQuestionButton) {
        createQuestionButton.textContent = t().askQuestion;
    }
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
        logo.innerHTML = `
            <svg
                class="flag-animation"
                viewBox="0 0 120 120"
                aria-label="FLAGGED"
                role="img"
            >
                <line
                    class="flag-pole"
                    x1="30"
                    y1="12"
                    x2="30"
                    y2="108"
                />

                <path
                    class="flag-cloth"
                    d="M30 18
                       L96 49
                       L30 80
                       Z"
                >
                    <animate
                        attributeName="d"
                        dur="2.8s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keyTimes="0;0.25;0.5;0.75;1"
                        keySplines="
                            0.42 0 0.58 1;
                            0.42 0 0.58 1;
                            0.42 0 0.58 1;
                            0.42 0 0.58 1
                        "
                        values="
                            M30 18 L96 49 L30 80 Z;

                            M30 18
                            C48 17, 70 28, 96 39
                            C82 47, 68 61, 30 80
                            Z;

                            M30 18
                            C49 13, 72 24, 99 48
                            C79 57, 63 68, 30 80
                            Z;

                            M30 18
                            C48 17, 70 28, 96 39
                            C82 47, 68 61, 30 80
                            Z;

                            M30 18 L96 49 L30 80 Z
                        "
                    />
                </path>
            </svg>
        `;
    }
}


async function setHeaderActionsVisible(visible) {
    const actionIds = [
        "createQuestionButton",
        "authButton",
        "registerButton",
        "profileButton",
        "logoutButton",
        "moderationButton"
    ];

    if (!visible) {
        actionIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = "none";
            }
        });

        return;
    }

    const createQuestionButton =
        document.getElementById("createQuestionButton");

    const moderationButton =
        document.getElementById("moderationButton");

    if (createQuestionButton) {
        createQuestionButton.style.display = "block";
    }

    if (moderationButton) {
        moderationButton.style.display = "none";
    }

    await updateAuthButtons();
    await initModerationAccess();
}


async function showStartScreen() {
    await setHeaderActionsVisible(true);

    const startTexts = {
        en: {
            intro: "Real situations. Many questions. What do people think?",
            play: "PLAY →"
        },
        ru: {
            intro: "Реальные ситуации. Много вопросов. Что думают люди?",
            play: "ИГРАТЬ →"
        },
        pl: {
            intro: "Prawdziwe sytuacje. Wiele pytań. Co myślą ludzie?",
            play: "GRAJ →"
        }
    };

    if (!flaggedCategories.length) {
        const loaded = await loadQuestionsFromSupabase("all");

        if (!loaded) {
            card.innerHTML = `
                <div style="
                    text-align:center;
                    color:#999;
                    padding:30px 10px;
                ">
                    ${
                        language === "ru"
                            ? "Не удалось загрузить категории."
                            : language === "pl"
                            ? "Nie udało się załadować kategorii."
                            : "Could not load categories."
                    }
                </div>
            `;
            return;
        }
    }

    card.innerHTML = `
        <p class="home-intro">
            ${startTexts[language].intro}
        </p>

        <button id="playButton" type="button">
            ${startTexts[language].play}
        </button>
    `;

    document
        .getElementById("playButton")
        .addEventListener("click", () => {
            showCategoryScreen();
        });
}


async function showCategoryScreen() {
    await setHeaderActionsVisible(false);

    const categoryTexts = {
        en: {
            choose: "Choose a category",
            all: "All questions",
            play: "PLAY →",
            back: "← Back",
            loading: "Loading categories..."
        },
        ru: {
            choose: "Выберите категорию",
            all: "Все вопросы",
            play: "ИГРАТЬ →",
            back: "← Назад",
            loading: "Загрузка категорий..."
        },
        pl: {
            choose: "Wybierz kategorię",
            all: "Wszystkie pytania",
            play: "GRAJ →",
            back: "← Wróć",
            loading: "Ładowanie kategorii..."
        }
    };

    if (!flaggedCategories.length) {
        card.innerHTML = `
            <div style="
                text-align:center;
                color:#999;
                padding:30px 10px;
            ">
                ${categoryTexts[language].loading}
            </div>
        `;

        const loaded = await loadQuestionsFromSupabase("all");

        if (!loaded) {
            card.innerHTML = `
                <div style="
                    text-align:center;
                    color:#999;
                    padding:30px 10px;
                ">
                    ${
                        language === "ru"
                            ? "Не удалось загрузить категории."
                            : language === "pl"
                            ? "Nie udało się загрузить категории."
                            : "Could not load categories."
                    }
                </div>
            `;
            return;
        }
    }

    const activeCategories = flaggedCategories
        .filter(category => category.is_active)
        .sort((a, b) => a.sort_order - b.sort_order);

    if (
        selectedCategorySlug !== "all" &&
        !activeCategories.some(
            category => category.slug === selectedCategorySlug
        )
    ) {
        selectedCategorySlug = "all";
    }

    card.innerHTML = `
        <h2 style="
            font-size:26px;
            margin-bottom:22px;
        ">
            ${categoryTexts[language].choose}
        </h2>

        <div id="categoryList" style="
            display:flex;
            flex-direction:column;
            gap:8px;
        ">
            ${activeCategories
                .map(category => {
                    const selected =
                        selectedCategorySlug === category.slug;

                    return `
                        <button
                            type="button"
                            class="category-choice"
                            data-category="${category.slug}"
                            style="
                                width:100%;
                                padding:14px 16px;
                                border-radius:12px;
                                border:1px solid ${
                                    selected ? "#ffffff" : "#444"
                                };
                                background:${
                                    selected ? "#ffffff" : "transparent"
                                };
                                color:${
                                    selected ? "#000000" : "#f4f4f7"
                                };
                                font-size:15px;
                                font-weight:600;
                                cursor:pointer;
                                text-align:left;
                            "
                        >
                            ${category[`name_${language}`] || category.name}
                        </button>
                    `;
                })
                .join("")}

            <button
                type="button"
                class="category-choice"
                data-category="all"
                style="
                    width:100%;
                    padding:15px 16px;
                    margin-top:4px;
                    border-radius:12px;
                    border:1px solid ${
                        selectedCategorySlug === "all"
                            ? "#ffffff"
                            : "#444"
                    };
                    background:${
                        selectedCategorySlug === "all"
                            ? "#ffffff"
                            : "transparent"
                    };
                    color:${
                        selectedCategorySlug === "all"
                            ? "#000000"
                            : "#f4f4f7"
                    };
                    font-size:15px;
                    font-weight:600;
                    cursor:pointer;
                    text-align:left;
                "
            >
                ${categoryTexts[language].all}
            </button>
        </div>

        <button id="backToStartButton"
            type="button"
            style="
                width:100%;
                padding:14px 16px;
                margin-top:8px;
                border-radius:12px;
                border:1px solid #444;
                background:transparent;
                color:#f4f4f7;
                font-size:15px;
                font-weight:600;
                cursor:pointer;
            "
        >
            ${categoryTexts[language].back}
        </button>
    `;

    card
        .querySelectorAll(".category-choice")
        .forEach(button => {
            button.addEventListener("click", async () => {
                selectedCategorySlug =
                    button.dataset.category || "all";

                gameStarted = true;
                currentIndex = 0;
                score = 0;

                const questionsLoaded =
                    await loadQuestionsFromSupabase(
                        selectedCategorySlug
                    );

                if (!questionsLoaded) {
                    console.error(
                        "Flagged: не удалось загрузить вопросы из Supabase"
                    );
                    return;
                }

                await loadAnsweredQuestionIds();
                showNextUnansweredQuestion();
            });
        });

    document
        .getElementById("backToStartButton")
        .addEventListener("click", () => {
            showStartScreen();
        });
}


let lastSavedSubmissionId = null;

async function showQuestionComposer(editSubmissionId = null) {
  let questionAnonymousDefault = false;
  let editingSubmissionId = editSubmissionId
    ? Number(editSubmissionId)
    : null;
  let draftState = null;

  if (!editingSubmissionId) {
    lastSavedSubmissionId = null;
  }

  const {
    data: { user: composerUser }
  } = await supabaseClient.auth.getUser();

  if (composerUser) {
    const { data: composerProfile, error: composerProfileError } =
      await supabaseClient
        .from("profiles")
        .select("is_anonymous")
        .eq("id", composerUser.id)
        .maybeSingle();

    if (composerProfileError) {
      console.error(
        "Flagged: ошибка загрузки настройки анонимности:",
        composerProfileError
      );
    } else {
      questionAnonymousDefault =
        composerProfile?.is_anonymous === true;
    }
  }

  if (!flaggedCategories.length) {
    const loaded = await loadQuestionsFromSupabase();

    if (!loaded) {
      alert(
        language === "ru"
          ? "Не удалось загрузить категории."
          : language === "pl"
          ? "Nie udało się załadować kategorii."
          : "Could not load categories."
      );
      return;
    }
  }

  const categoryKeywords = {
    relationships: [
      "парень", "девушк", "парня", "девушку",
      "отношен", "знакомств", "свидан", "встреча",
      "встречаем", "встречаюсь", "бойфренд", "бойфрен",
      "девушка", "мужчина", "женщина",
      "partner", "partnerka", "chłopak", "dziewczyn",
      "relacj", "randk", "spotkan"
    ],

    family: [
      "семь", "семей", "муж", "жена", "супруг", "супруги",
      "брак", "женат", "замуж", "развод", "свекров",
      "свекр", "тещ", "тест", "родствен", "бабушк", "дедушк",
      "семейств",
      "mąż", "żona", "małżeń", "rozwód", "rodzin",
      "teści", "krewn"
    ],

    parenting: [
      "ребен", "ребён", "дет", "малыш", "малышк",
      "сын", "доч", "дочь", "воспитан", "родитель",
      "мам", "пап", "материн", "отцовств",
      "подрост", "подростков",
      "садик", "детсад", "детский сад", "школ", "учеб", "урок",
      "дошколь", "родительств",
      "dziecko", "dzieci", "maluch", "syn", "córk",
      "wychowan", "rodzic", "macierzy", "ojcost",
      "nastolat", "przedszkol", "szkoł", "rodziciel"
    ],

    friendship: [
      "друг", "друга", "друз", "подруг", "дружб",
      "приятел", "приятель",
      "дружеск", "товарищ",
      "przyjac", "przyjaciół", "przyjaź", "koleż",
      "znajom"
    ],

    psychology: [
      "чувств", "эмоци", "страх", "тревог", "пережив",
      "самооцен", "мотивац", "привычк", "психолог",
      "стресс", "самооценк", "уверен", "неуверен",
      "границ", "личные границ", "прокраст", "откладыва",
      "одиночеств", "эмоцион", "самопринят",
      "uczuc", "emocj", "lęk", "stres", "motyw",
      "nawyk", "psycholog", "samoocen", "granic",
      "prokrast", "samotn", "pewnoś"
    ],

    social: [
      "обще", "обществ", "соци", "люд", "незнаком",
      "очеред", "очереди", "транспорт", "автобус", "трамва",
      "метро", "кафе", "ресторан", "магазин", "подъезд",
      "сосед", "улиц", "публич", "общественн", "правил",
      "вежлив", "нормально ли", "мешает", "громк",
      "очередь", "парковк",
      "społ", "ludz", "nieznaj", "kolejk", "transport",
      "autobus", "tramwaj", "metro", "kawiarn", "restaur",
      "sklep", "sąsiad", "ulic", "publicz", "zasad",
      "grzecz", "przeszkadz", "głoś"
    ],

    work: [
      "работ", "работа", "работы", "работать", "началь",
      "коллег", "карьер", "зарплат", "офис", "ваканс",
      "собеседован", "увольн", "нанима", "сотрудник",
      "работодател", "начальств", "отпуск", "сверхуроч",
      "удалённ", "удаленн", "професс", "должност",
      "стажиров", "фриланс",
      "praca", "pracę", "szef", "kierownik", "kolega",
      "karier", "pensj", "wynagrod", "biur", "rekrut",
      "zwoln", "pracownik", "pracodaw", "urlop",
      "nadgodzin", "zdaln", "zawod", "stanowisk", "staż"
    ],

    money: [
      "деньг", "доход", "зарплат", "долг", "расход", "бюджет",
      "сбереж", "накоплен", "финанс", "кредит", "займ",
      "влож", "инвест", "инвести", "капитал", "подушк",
      "бизнес", "прибыл", "убыт", "стоим", "цен",
      "рассроч", "кредитк", "ипотек", "аренд", "эконом",
      "финансов",
      "pienią", "dochód", "dług", "wydatek", "budżet",
      "oszczęd", "finans", "kredyt", "pożycz", "inwest",
      "kapitał", "biznes", "zysk", "strat", "cen", "rat",
      "hipotek", "oszczędnoś"
    ],

    beauty: [
      "волос", "парикмах", "салон", "мастер", "клиент",
      "кератин", "ботокс", "нанопласт", "маникюр", "педикюр",
      "ногт", "косметолог", "бров", "ресниц", "макияж",
      "косметик", "процедур", "услуг", "запис", "предоплат",
      "возврат", "отмен", "опозда", "окошк", "отзыв",
      "фотограф", "фото до", "фото после",
      "włos", "fryzjer", "salon", "stylist", "klient",
      "keratyn", "botox", "nanoplast", "manicure", "pedicure",
      "paznok", "kosmetolog", "brwi", "rzęs", "makija",
      "kosmet", "zabieg", "usług", "rezerw", "zalicz",
      "zwrot", "odwoł", "spóź", "opini", "zdję"
    ],

    health: [
      "здоров", "болезн", "симптом", "врач", "доктор",
      "лечение", "лечен", "лекарств", "таблет", "анализ",
      "обследован", "диагноз", "профилакти", "витамин",
      "привив", "вакцин", "температур", "давлен", "пульс",
      "самочувств", "сон", "питани", "диет", "народн",
      "средств", "медицин", "организм",
      "zdrow", "chorob", "objaw", "lekar", "leczen",
      "lek", "tablet", "badani", "diagnoz", "profilakty",
      "witamin", "szczep", "temperatur", "ciśn", "tętno",
      "samopocz", "sen", "odżyw", "diet", "medycz"
    ],

    technology: [
      "телефон", "айфон", "iphone", "android", "андроид",
      "ios", "компьютер", "ноутбук", "планшет", "гаджет",
      "технолог", "интернет", "приложен", "програм", "сайт",
      "смартфон", "умн", "часы", "подписк", "облак",
      "искусственн", "искусственный интеллект", "ии", "ai",
      "чатгпт", "chatgpt", "нейросет", "генерац",
      "алгоритм", "цифров",
      "telefon", "iphone", "android", "ios", "komputer",
      "laptop", "tablet", "gadżet", "technolog", "internet",
      "aplikac", "program", "smartfon", "zegarek", "chmur",
      "sztuczn", "chatgpt", "ai", "algorytm", "cyfrow"
    ],

    politics: [
      "полит", "выбор", "государ", "президент", "правитель",
      "парламент", "партия", "министр", "закон",
      "polity", "wybory", "państw", "prezydent", "rząd",
      "parlament", "partia", "minister", "ustaw"
    ]
  };


  if (editingSubmissionId) {
    if (!composerUser) {
      alert(
        language === "ru"
          ? "Для редактирования черновика нужен аккаунт."
          : language === "pl"
          ? "Do edycji wersji roboczej potrzebne jest konto."
          : "An account is required to edit a draft."
      );
      return;
    }

    const {
      data: draft,
      error: draftError
    } = await supabaseClient
      .from("question_submissions")
      .select(
        "id, text_ru, text_en, text_pl, type, moderation_status, is_anonymous, has_personal_experience"
      )
      .eq("id", editingSubmissionId)
      .eq("created_by", composerUser.id)
      .eq("moderation_status", "DRAFT")
      .maybeSingle();

    if (draftError || !draft) {
      console.error(
        "Flagged: ошибка загрузки черновика:",
        draftError
      );

      alert(
        language === "ru"
          ? "Не удалось открыть этот черновик."
          : language === "pl"
          ? "Nie udało się otworzyć tej wersji roboczej."
          : "Could not open this draft."
      );
      return;
    }

    const [
      {
        data: draftOptions,
        error: draftOptionsError
      },
      {
        data: draftCategory,
        error: draftCategoryError
      }
    ] = await Promise.all([
      supabaseClient
        .from("question_submission_options")
        .select("position, text_ru, text_en, text_pl")
        .eq("submission_id", editingSubmissionId)
        .order("position"),

      supabaseClient
        .from("submission_categories")
        .select("category_id")
        .eq("submission_id", editingSubmissionId)
        .eq("is_primary", true)
        .maybeSingle()
    ]);

    if (draftOptionsError || draftCategoryError) {
      console.error(
        "Flagged: ошибка загрузки данных черновика:",
        draftOptionsError || draftCategoryError
      );

      alert(
        language === "ru"
          ? "Не удалось загрузить данные черновика."
          : language === "pl"
          ? "Nie udało się załadować danych wersji roboczej."
          : "Could not load the draft data."
      );
      return;
    }

    draftState = {
      text_ru: draft.text_ru || "",
      text_en: draft.text_en || "",
      text_pl: draft.text_pl || "",
      text:
        draft[`text_${language}`] ||
        draft.text_ru ||
        draft.text_en ||
        draft.text_pl ||
        "",
      type: draft.type || "SITUATION",
      isAnonymous: draft.is_anonymous === true,
      hasPersonalExperience:
        draft.has_personal_experience === true,
      categoryId: draftCategory?.category_id || null,
      options: (draftOptions || []).map(option => ({
        position: option.position,
        text_ru: option.text_ru || "",
        text_en: option.text_en || "",
        text_pl: option.text_pl || "",
        text:
          option[`text_${language}`] ||
          option.text_ru ||
          option.text_en ||
          option.text_pl ||
          ""
      }))
    };

    questionAnonymousDefault = draftState.isAnonymous;
    lastSavedSubmissionId = editingSubmissionId;
  }

  const getCategorySuggestions = (questionText) => {
    const normalizedText = questionText.toLowerCase();

    const scored = flaggedCategories.map(category => {
      const keywords = categoryKeywords[category.slug] || [];

      const score = keywords.reduce(
        (total, keyword) =>
          total + (normalizedText.includes(keyword.toLowerCase()) ? 1 : 0),
        0
      );

      return {
        ...category,
        score
      };
    });

    const matches = scored
      .filter(category => category.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (matches.length === 0) {
      return flaggedCategories.slice(0, 3).map(category => ({
        ...category,
        score: 0
      }));
    }

    return matches;
  };

  const renderComposerFields = (type, anonymousByDefault = false, currentDraft = null) => {
    const optionsBlock =
      type === "QUESTION"
        ? `
          <div id="questionOptionsBlock" style="margin-top:18px;">
            <p style="margin-bottom:8px;">
              ${
                language === "ru"
                  ? "Варианты ответа"
                  : language === "pl"
                  ? "Opcje odpowiedzi"
                  : "Answer options"
              }
            </p>

            ${[1, 2, 3, 4, 5]
              .map(
                position => `
                  <input
                    id="submissionOption${position}"
                    type="text"
                    placeholder="${
                      language === "ru"
                        ? `Вариант ${position}`
                        : language === "pl"
                        ? `Opcja ${position}`
                        : `Option ${position}`
                    }"
                    value="${escapeProfileHtml(
                      currentDraft?.options?.find(
                        option => option.position === position
                      )?.text || ""
                    )}"
                    style="width:100%; box-sizing:border-box; margin-top:8px; padding:12px; border-radius:10px;"
                  >
                `
              )
              .join("")}
          </div>
        `
        : "";

    const experienceBlock =
      type === "SITUATION"
        ? `
          <label
            style="
              display:flex;
              align-items:center;
              gap:10px;
              margin-top:16px;
              line-height:1.4;
            "
          >
            <input id="submissionPersonalExperience" type="checkbox" ${currentDraft?.hasPersonalExperience ? "checked" : ""}>
            <span>
              ${
                language === "ru"
                  ? "У этой ситуации может быть личный опыт"
                  : language === "pl"
                  ? "Ta sytuacja może dotyczyć osobistego doświadczenia"
                  : "This situation can include personal experience"
              }
            </span>
          </label>
        `
        : "";

    const categorySuggestions = getCategorySuggestions(
      document.getElementById("userQuestionText")?.value || ""
    );

    const recommendedCategory =
      categorySuggestions.length > 0
        ? categorySuggestions[0].id
        : "";

    const selectedCategoryId =
      currentDraft?.categoryId || recommendedCategory;

    const categoryBlock = `
      <div
        id="categorySuggestionBlock"
        style="
          margin-top:18px;
          padding:14px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,0.12);
        "
      >
        <p style="margin:0 0 10px 0;">
          ${
            language === "ru"
              ? "Категория"
              : language === "pl"
              ? "Kategoria"
              : "Category"
          }
        </p>

        <select
          id="submissionPrimaryCategory"
          style="
            width:100%;
            padding:12px;
            border-radius:10px;
            box-sizing:border-box;
          "
        >
          <option value="">
            ${
              language === "ru"
                ? "Выберите категорию"
                : language === "pl"
                ? "Wybierz kategorię"
                : "Choose a category"
            }
          </option>

          ${flaggedCategories
            .map(
              category => `
                <option
                  value="${category.id}"
                  ${category.id === selectedCategoryId ? "selected" : ""}
                >
                  ${category.icon || ""} ${
                    category[`name_${language}`] || category.name
                  }
                </option>
              `
            )
            .join("")}
        </select>
      </div>
    `;

    return `
      <div class="category">FLAGGED</div>

      <h2 style="text-align:center;">
        ${
          language === "ru"
            ? "Создай свой вопрос"
            : language === "pl"
            ? "Stwórz własne pytanie"
            : "Create your own question"
        }
      </h2>

      <textarea
        id="userQuestionText"
        rows="6"
        placeholder="${
          language === "ru"
            ? "Напиши вопрос или ситуацию..."
            : language === "pl"
            ? "Napisz pytanie lub sytuację..."
            : "Write a question or situation..."
        }"
        style="
          width:100%;
          box-sizing:border-box;
          margin-top:12px;
          padding:14px;
          border-radius:10px;
          resize:vertical;
        "
      >${escapeProfileHtml(currentDraft?.text || "")}</textarea>
      <select
        id="userQuestionType"
        style="
          width:100%;
          margin-top:12px;
          padding:14px;
          border-radius:10px;
        "
      >
        <option value="SITUATION" ${type === "SITUATION" ? "selected" : ""}>SITUATION</option>
        <option value="QUESTION" ${type === "QUESTION" ? "selected" : ""}>QUESTION</option>
      </select>

      <div id="dynamicSubmissionFields">
        ${optionsBlock}
        ${experienceBlock}
      </div>

      <label
        style="
          display:flex;
          align-items:flex-start;
          gap:10px;
          margin-top:16px;
          line-height:1.45;
          cursor:pointer;
        "
      >
        <input
          id="submissionAnonymous"
          type="checkbox"
          ${currentDraft ? (currentDraft.isAnonymous ? "checked" : "") : (anonymousByDefault ? "checked" : "")}
          style="margin-top:3px;"
        >
        <span>
          ${
            language === "ru"
              ? "Опубликовать анонимно"
              : language === "pl"
              ? "Opublikuj anonimowo"
              : "Post anonymously"
          }
        </span>
      </label>

      ${categoryBlock}

      <button
        id="submitQuestionButton"
        type="button"
        style="
          width:100%;
          margin-top:18px;
          padding:14px;
          border:none;
          border-radius:10px;
          cursor:pointer;
          opacity:1;
        "
      >
        ${
          language === "ru"
            ? "Отправить на модерацию"
            : language === "pl"
            ? "Wyślij do moderacji"
            : "Submit for moderation"
        }
      </button>

      <button
        id="saveDraftButton"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          padding:14px;
          border:none;
          border-radius:10px;
          cursor:pointer;
        "
      >
        ${
          editingSubmissionId
            ? language === "ru"
              ? "Сохранить изменения"
              : language === "pl"
              ? "Zapisz zmiany"
              : "Save changes"
            : language === "ru"
            ? "Сохранить как черновик"
            : language === "pl"
            ? "Zapisz jako wersję roboczą"
            : "Save as draft"
        }
      </button>

      <button
        id="backToGameButton"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          padding:12px;
          border:none;
          border-radius:10px;
          cursor:pointer;
        "
      >
        ${
          language === "ru"
            ? "Назад"
            : language === "pl"
            ? "Wróć"
            : "Back"
        }
      </button>
    `;
  };

  const render = (type = "SITUATION") => {
    card.innerHTML = renderComposerFields(type, questionAnonymousDefault, draftState);

    document
      .getElementById("userQuestionType")
      .addEventListener("change", event => {
        const anonymousCheckbox =
          document.getElementById("submissionAnonymous");

        if (anonymousCheckbox) {
          questionAnonymousDefault = anonymousCheckbox.checked;
        }

        render(event.target.value);
      });

    let categoryWasChangedByUser = false;

    document
      .getElementById("submissionPrimaryCategory")
      .addEventListener("change", () => {
        categoryWasChangedByUser = true;
      });

    document
      .getElementById("userQuestionText")
      .addEventListener("input", event => {
        if (categoryWasChangedByUser) return;

        const suggestions = getCategorySuggestions(event.target.value);

        if (suggestions.length > 0) {
          document.getElementById("submissionPrimaryCategory").value =
            suggestions[0].id;
        }
      });



    document
      .getElementById("backToGameButton")
      .addEventListener("click", () => {
        if (editingSubmissionId) {
          showProfileDashboard();
        } else if (gameStarted && situations.length > 0) {
          showSituation();
        } else {
          showStartScreen();
        }
      });

    document
      .getElementById("submitQuestionButton")
      .addEventListener("click", async () => {
        const savedSuccessfully = await saveCurrentQuestion(true);

        if (!savedSuccessfully || !lastSavedSubmissionId) {
          return;
        }

        const { error } = await supabaseClient.rpc(
          "submit_question_submission",
          {
            p_submission_id: lastSavedSubmissionId
          }
        );

        if (error) {
          console.error("Ошибка отправки на модерацию:", error);

          alert(
            language === "ru"
              ? "Не удалось отправить вопрос на модерацию."
              : language === "pl"
              ? "Nie udało się wysłać pytania do moderacji."
              : "The question could not be submitted for moderation."
          );

          return;
        }

        alert(
          language === "ru"
            ? "Вопрос отправлен на модерацию."
            : language === "pl"
            ? "Pytanie zostało wysłane do moderacji."
            : "The question has been submitted for moderation."
        );

        lastSavedSubmissionId = null;
        showNextUnansweredQuestion();
      });

    const saveCurrentQuestion = async (silent = false) => {
        const text = document
          .getElementById("userQuestionText")
          .value
          .trim();

        const selectedType = document.getElementById("userQuestionType").value;

        const selectedCategoryId = Number(
          document.getElementById("submissionPrimaryCategory").value
        );

        if (!text) {
          alert(
            language === "ru"
              ? "Сначала напиши вопрос."
              : language === "pl"
              ? "Najpierw napisz pytanie."
              : "Write a question first."
          );
          return;
        }

        const {
          data: { user },
          error: userError
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
          if (userError && userError.name !== "AuthSessionMissingError") {
            console.error("Ошибка проверки пользователя:", userError);
          }

          alert(
            language === "ru"
              ? "Для создания собственного вопроса понадобится аккаунт."
              : language === "pl"
              ? "Do tworzenia własnych pytań potrzebne będzie konto."
              : "An account will be required to create your own question."
          );
          return;
        }

        const options =
          selectedType === "SITUATION"
            ? [
                {
                  position: 1,
                  text:
                    language === "ru"
                      ? "Нормально"
                      : language === "pl"
                      ? "Normalne"
                      : "Normal"
                },
                {
                  position: 2,
                  text:
                    language === "ru"
                      ? "Сомнительно"
                      : language === "pl"
                      ? "Wątpliwe"
                      : "Hmm"
                },
                {
                  position: 3,
                  text:
                    language === "ru"
                      ? "Красный флаг"
                      : language === "pl"
                      ? "Czerwona flaga"
                      : "Red flag"
                }
              ]
            : [1, 2, 3, 4, 5]
                .map(position => ({
                  position,
                  text: document
                    .getElementById("submissionOption" + position)
                    ?.value
                    .trim()
                }))
                .filter(option => option.text);

        const hasPersonalExperience =
          selectedType === "SITUATION"
            ? document.getElementById("submissionPersonalExperience")?.checked ??
              false
            : false;

        const isAnonymous =
          document.getElementById("submissionAnonymous")?.checked ??
          questionAnonymousDefault;

        const submissionPayload = {
          created_by: user.id,
          original_language: language,
          text_ru: language === "ru" ? text : null,
          text_en: language === "en" ? text : null,
          text_pl: language === "pl" ? text : null,
          type: selectedType,
          is_anonymous: isAnonymous,
          has_personal_experience: hasPersonalExperience,
          moderation_status: "DRAFT"
        };

        if (!selectedCategoryId) {
          alert(
            language === "ru"
              ? "Выберите категорию."
              : language === "pl"
              ? "Wybierz kategorię."
              : "Choose a category."
          );
          return;
        }

        const optionsForUpdate = options.map(option => {
          const previousOption =
            draftState?.options?.find(
              item => item.position === option.position
            ) || {};

          return {
            position: option.position,
            text_ru:
              language === "ru"
                ? option.text
                : previousOption.text_ru || null,
            text_en:
              language === "en"
                ? option.text
                : previousOption.text_en || null,
            text_pl:
              language === "pl"
                ? option.text
                : previousOption.text_pl || null
          };
        });

        if (editingSubmissionId) {
          const { error: updateError } =
            await supabaseClient.rpc(
              "update_question_submission_draft",
              {
                p_submission_id: editingSubmissionId,
                p_text_ru:
                  language === "ru"
                    ? text
                    : draftState?.text_ru || null,
                p_text_en:
                  language === "en"
                    ? text
                    : draftState?.text_en || null,
                p_text_pl:
                  language === "pl"
                    ? text
                    : draftState?.text_pl || null,
                p_type: selectedType,
                p_is_anonymous: isAnonymous,
                p_has_personal_experience:
                  hasPersonalExperience,
                p_category_id: selectedCategoryId,
                p_options: optionsForUpdate
              }
            );

          if (updateError) {
            console.error(
              "Flagged: ошибка обновления черновика:",
              updateError
            );

            alert(
              language === "ru"
                ? "Не удалось сохранить изменения."
                : language === "pl"
                ? "Nie udało się zapisać zmian."
                : "The changes could not be saved."
            );
            return;
          }

          draftState = {
            ...(draftState || {}),
            text,
            text_ru:
              language === "ru"
                ? text
                : draftState?.text_ru || "",
            text_en:
              language === "en"
                ? text
                : draftState?.text_en || "",
            text_pl:
              language === "pl"
                ? text
                : draftState?.text_pl || "",
            type: selectedType,
            isAnonymous,
            hasPersonalExperience,
            categoryId: selectedCategoryId,
            options: optionsForUpdate.map(option => ({
              ...option,
              text:
                option[`text_${language}`] ||
                option.text_ru ||
                option.text_en ||
                option.text_pl ||
                ""
            }))
          };

          lastSavedSubmissionId = editingSubmissionId;

          if (!silent) {
            alert(
              language === "ru"
                ? "Изменения сохранены."
                : language === "pl"
                ? "Zmiany zostały zapisane."
                : "Changes saved."
            );
          }

          return true;
        }

        const {
          data: submission,
          error: submissionError
        } = await supabaseClient
          .from("question_submissions")
          .insert(submissionPayload)
          .select("id")
          .single();

        if (submissionError) {
          console.error("Ошибка сохранения черновика:", submissionError);
          alert(
            language === "ru"
              ? "Не удалось сохранить черновик."
              : language === "pl"
              ? "Nie udało się zapisać wersji roboczej."
              : "The draft could not be saved."
          );
          return;
        }

        const { error: categoryError } = await supabaseClient
          .from("submission_categories")
          .insert({
            submission_id: submission.id,
            category_id: selectedCategoryId,
            is_primary: true
          });

        if (categoryError) {
          console.error(
            "Ошибка сохранения категории черновика:",
            categoryError
          );

          await supabaseClient
            .from("question_submissions")
            .delete()
            .eq("id", submission.id);

          alert(
            language === "ru"
              ? "Не удалось сохранить категорию."
              : language === "pl"
              ? "Nie udało się zapisać kategorii."
              : "The category could not be saved."
          );
          return;
        }

        if (options.length > 0) {
          const optionRows = options.map(option => ({
            submission_id: submission.id,
            position: option.position,
            text_ru: language === "ru" ? option.text : null,
            text_en: language === "en" ? option.text : null,
            text_pl: language === "pl" ? option.text : null
          }));

          const { error: optionsError } = await supabaseClient
            .from("question_submission_options")
            .insert(optionRows);

          if (optionsError) {
            console.error(
              "Ошибка сохранения вариантов черновика:",
              optionsError
            );

            await supabaseClient
              .from("question_submissions")
              .delete()
              .eq("id", submission.id);

            alert(
              language === "ru"
                ? "Не удалось сохранить варианты ответа."
                : language === "pl"
                ? "Nie udało się zapisać opcji odpowiedzi."
                : "The answer options could not be saved."
            );
            return;
          }
        }

        lastSavedSubmissionId = submission.id;

        const submitQuestionButton = document.getElementById(
          "submitQuestionButton"
        );

        if (submitQuestionButton) {
          submitQuestionButton.disabled = false;
          submitQuestionButton.style.opacity = "1";
          submitQuestionButton.style.cursor = "pointer";
        }

        console.log("Flagged: черновик сохранён", {
          submissionId: submission.id,
          createdBy: user.id,
          type: selectedType,
          options,
          hasPersonalExperience
        });

        if (!silent) {
          alert(
            language === "ru"
              ? "Черновик сохранён."
              : language === "pl"
              ? "Wersja robocza została zapisana."
              : "Draft saved."
          );
        }

        return true;
    };

    document
      .getElementById("saveDraftButton")
      .addEventListener("click", async () => {
        await saveCurrentQuestion(false);
      });

  };

  render(draftState?.type || "SITUATION");
}


document
  .getElementById("createQuestionButton")
  ?.addEventListener("click", showQuestionComposer);



async function showProfileSetup(fromSettings = false) {
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert(
            language === "ru"
                ? "Не удалось определить пользователя."
                : language === "pl"
                ? "Nie udało się ustalić użytkownika."
                : "Could not identify the user."
        );
        return;
    }

    const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("display_name, username, is_anonymous")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
        console.error(
            "Flagged: ошибка загрузки профиля:",
            profileError
        );
    }

    const currentDisplayName =
        profile?.display_name?.trim() ||
        profile?.username?.trim() ||
        "";

    const currentAnonymous = profile?.is_anonymous === true;

    card.innerHTML = `
        <div class="category">FLAGGED</div>

        <h2 style="text-align:center;">
            ${
                fromSettings
                    ? language === "ru"
                        ? "Настройки профиля"
                        : language === "pl"
                        ? "Ustawienia profilu"
                        : "Profile settings"
                    : language === "ru"
                    ? "Настрой профиль"
                    : language === "pl"
                    ? "Ustaw swój profil"
                    : "Set up your profile"
            }
        </h2>

        <p style="
            color:#999;
            line-height:1.5;
            text-align:center;
            margin:12px 0 20px;
        ">
            ${
                language === "ru"
                    ? "Как вы будете отображаться другим пользователям"
                    : language === "pl"
                    ? "Jak będziesz wyświetlany innym użytkownikom"
                    : "How other users will see you"
            }
        </p>

        <input
            id="profileDisplayName"
            type="text"
            maxlength="40"
            autocomplete="nickname"
            value="${String(currentDisplayName).replace(/"/g, "&quot;")}"
            placeholder="${
                language === "ru"
                    ? "Имя или псевдоним"
                    : language === "pl"
                    ? "Imię lub pseudonim"
                    : "Name or nickname"
            }"
            style="
                width:100%;
                box-sizing:border-box;
                padding:14px;
                border-radius:10px;
                border:1px solid #444;
                background:#18181b;
                color:#f4f4f7;
                font-size:15px;
            "
        >

        <label style="
            display:flex;
            align-items:flex-start;
            gap:10px;
            margin-top:16px;
            color:#ddd;
            line-height:1.45;
            cursor:pointer;
        ">
            <input
                id="profileAnonymous"
                type="checkbox"
                ${currentAnonymous ? "checked" : ""}
                style="margin-top:3px;"
            >
            <span>
                ${
                    language === "ru"
                        ? "Использовать анонимность по умолчанию"
                        : language === "pl"
                        ? "Domyślnie korzystaj z anonimowości"
                        : "Use anonymity by default"
                }
            </span>
        </label>

        <p style="
            color:#777;
            font-size:13px;
            line-height:1.5;
            margin-top:8px;
        ">
            ${
                language === "ru"
                    ? "Это настройка профиля. Она будет использоваться в новых публикациях и комментариях после подключения этой настройки к соответствующим формам."
                    : language === "pl"
                    ? "To ustawienie profilu. Będzie używane w nowych publikacjach i komentarzach po podłączeniu tej opcji do odpowiednich formularzy."
                    : "This is a profile setting. It will be used for new posts and comments after this option is connected to the corresponding forms."
            }
        </p>

        <button
            id="saveProfileButton"
            type="button"
            style="
                width:100%;
                margin-top:18px;
                padding:14px;
                border:none;
                border-radius:10px;
                background:white;
                color:black;
                cursor:pointer;
                font-weight:600;
            "
        >
            ${
                language === "ru"
                    ? "Сохранить"
                    : language === "pl"
                    ? "Zapisz"
                    : "Save"
            }
        </button>

        ${
            fromSettings
                ? `
                    <button
                        id="backToProfileButton"
                        type="button"
                        style="
                            width:100%;
                            margin-top:8px;
                            padding:12px;
                            border:1px solid #444;
                            border-radius:10px;
                            background:transparent;
                            color:#fff;
                            cursor:pointer;
                        "
                    >
                        ${
                            language === "ru"
                                ? "Назад в профиль"
                                : language === "pl"
                                ? "Wróć do profilu"
                                : "Back to profile"
                        }
                    </button>
                `
                : ""
        }
    `;

    document
        .getElementById("saveProfileButton")
        ?.addEventListener("click", async () => {
            const input = document.getElementById("profileDisplayName");
            const displayName = input?.value.trim();
            const anonymous =
                document.getElementById("profileAnonymous")?.checked === true;

            if (!displayName) {
                alert(
                    language === "ru"
                        ? "Введите имя или псевдоним."
                        : language === "pl"
                        ? "Wpisz imię lub pseudonim."
                        : "Enter a name or nickname."
                );
                return;
            }

            const button = document.getElementById("saveProfileButton");

            if (button) {
                button.disabled = true;
                button.textContent =
                    language === "ru"
                        ? "Сохраняем..."
                        : language === "pl"
                        ? "Zapisywanie..."
                        : "Saving...";
            }

            const { error } = await supabaseClient
                .from("profiles")
                .update({
                    username: displayName,
                    display_name: displayName,
                    is_anonymous: anonymous
                })
                .eq("id", user.id);

            if (error) {
                console.error(
                    "Flagged: ошибка сохранения профиля:",
                    error
                );

                if (button) {
                    button.disabled = false;
                    button.textContent =
                        language === "ru"
                            ? "Сохранить"
                            : language === "pl"
                            ? "Zapisz"
                            : "Save";
                }

                alert(
                    language === "ru"
                        ? "Не удалось сохранить профиль."
                        : language === "pl"
                        ? "Nie udało się zapisać profilu."
                        : "Could not save the profile."
                );

                return;
            }

            if (fromSettings) {
                await showProfileDashboard();
            } else {
                showNextUnansweredQuestion();
            }
        });

    document
        .getElementById("backToProfileButton")
        ?.addEventListener("click", () => {
            showProfileDashboard();
        });
}


function formatProfileDate(dateValue) {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(
        language === "ru"
            ? "ru-RU"
            : language === "pl"
            ? "pl-PL"
            : "en-GB",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


function getProfileLocalizedText(item) {
    if (!item) return "";

    return (
        item[
            language === "ru"
                ? "text_ru"
                : language === "pl"
                ? "text_pl"
                : "text_en"
        ] ||
        item.text_ru ||
        item.text_en ||
        item.text_pl ||
        ""
    );
}


function getProfileStatusLabel(status) {
    const labels = {
        ru: {
            DRAFT: "Черновик",
            PENDING: "На модерации",
            APPROVED: "Одобрен",
            REJECTED: "Отклонён"
        },
        pl: {
            DRAFT: "Wersja robocza",
            PENDING: "W moderacji",
            APPROVED: "Zatwierdzony",
            REJECTED: "Odrzucony"
        },
        en: {
            DRAFT: "Draft",
            PENDING: "Pending moderation",
            APPROVED: "Approved",
            REJECTED: "Rejected"
        }
    };

    return labels[language]?.[status] || status || "—";
}


function escapeProfileHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


async function showProfileDashboard() {
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        await showStartScreen();
        return;
    }

    card.innerHTML = `
        <div style="text-align:center; padding:30px 10px;">
            <div style="font-size:36px;">🚩</div>
            <p style="margin-top:14px; color:#999;">
                ${
                    language === "ru"
                        ? "Загружаем профиль..."
                        : language === "pl"
                        ? "Ładowanie profilu..."
                        : "Loading profile..."
                }
            </p>
        </div>
    `;

    const [
        profileResult,
        votesResult,
        questionAnswersResult,
        submissionsResult,
        publishedQuestionsResult,
        commentsResult
    ] = await Promise.all([
        supabaseClient
            .from("profiles")
            .select("display_name, username, avatar_url, bio, is_anonymous, created_at")
            .eq("id", user.id)
            .maybeSingle(),

        supabaseClient
            .from("votes")
            .select("id, question_id, option_id, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),

        supabaseClient
            .from("question_answers")
            .select("id, question_id, answer_text, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),

        supabaseClient
            .from("question_submissions")
            .select(
                "id, text_ru, text_en, text_pl, type, moderation_status, moderator_note, created_at, is_anonymous, has_personal_experience"
            )
            .eq("created_by", user.id)
            .order("created_at", { ascending: false }),

        supabaseClient
            .from("questions")
            .select("id")
            .eq("created_by", user.id)
            .eq("status", "published"),

        supabaseClient
            .from("comments")
            .select(
                "id, question_id, body, created_at, is_anonymous, is_deleted"
            )
            .eq("created_by", user.id)
            .eq("is_deleted", false)
            .order("created_at", { ascending: false })
    ]);

    if (profileResult.error) {
        console.error(
            "Flagged: ошибка загрузки профиля:",
            profileResult.error
        );
    }

    if (votesResult.error) {
        console.error(
            "Flagged: ошибка загрузки ответов:",
            votesResult.error
        );
    }

    if (questionAnswersResult.error) {
        console.error(
            "Flagged: ошибка загрузки текстовых ответов:",
            questionAnswersResult.error
        );
    }

    if (submissionsResult.error) {
        console.error(
            "Flagged: ошибка загрузки вопросов пользователя:",
            submissionsResult.error
        );
    }

    if (publishedQuestionsResult.error) {
        console.error(
            "Flagged: ошибка подсчёта опубликованных вопросов:",
            publishedQuestionsResult.error
        );
    }

    if (commentsResult.error) {
        console.error(
            "Flagged: ошибка загрузки комментариев пользователя:",
            commentsResult.error
        );
    }

    const profile = profileResult.data || {};
    const votes = votesResult.data || [];
    const questionAnswers = questionAnswersResult.data || [];
    const submissions = submissionsResult.data || [];
    const publishedQuestions = publishedQuestionsResult.data || [];
    const comments = commentsResult.data || [];

    const questionIdsFromVotes = [
        ...new Set(
            votes
                .map(vote => vote.question_id)
                .filter(Boolean)
        )
    ];

    const questionIdsFromTextAnswers = [
        ...new Set(
            questionAnswers
                .map(answer => answer.question_id)
                .filter(Boolean)
        )
    ];

    const optionIdsFromVotes = [
        ...new Set(
            votes
                .map(vote => vote.option_id)
                .filter(Boolean)
        )
    ];

    const questionIdsFromComments = [
        ...new Set(
            comments
                .map(comment => comment.question_id)
                .filter(Boolean)
        )
    ];

    const allReferencedQuestionIds = [
        ...new Set([
            ...questionIdsFromVotes,
            ...questionIdsFromTextAnswers,
            ...questionIdsFromComments
        ])
    ];

    let referencedQuestions = [];
    let referencedOptions = [];

    if (allReferencedQuestionIds.length > 0) {
        const { data, error } = await supabaseClient
            .from("questions")
            .select("id, text_ru, text_en, text_pl, type")
            .in("id", allReferencedQuestionIds);

        if (error) {
            console.error(
                "Flagged: ошибка загрузки вопросов профиля:",
                error
            );
        } else {
            referencedQuestions = data || [];
        }
    }

    if (optionIdsFromVotes.length > 0) {
        const { data, error } = await supabaseClient
            .from("options")
            .select("id, question_id, text_ru, text_en, text_pl, position")
            .in("id", optionIdsFromVotes);

        if (error) {
            console.error(
                "Flagged: ошибка загрузки вариантов ответов профиля:",
                error
            );
        } else {
            referencedOptions = data || [];
        }
    }

    const questionMap = new Map(
        referencedQuestions.map(question => [question.id, question])
    );

    const optionMap = new Map(
        referencedOptions.map(option => [option.id, option])
    );

    const displayName =
        profile.display_name?.trim() ||
        profile.username?.trim() ||
        (
            language === "ru"
                ? "Аноним"
                : language === "pl"
                ? "Anonim"
                : "Anonymous"
        );

    const registeredText = formatProfileDate(profile.created_at);

    const stats = [
        {
            value: votes.length + questionAnswers.length,
            label:
                language === "ru"
                    ? "Ответов"
                    : language === "pl"
                    ? "Odpowiedzi"
                    : "Answers"
        },
        {
            value: submissions.length,
            label:
                language === "ru"
                    ? "Вопросов задано"
                    : language === "pl"
                    ? "Dodanych pytań"
                    : "Questions asked"
        },
        {
            value: publishedQuestions.length,
            label:
                language === "ru"
                    ? "Опубликовано"
                    : language === "pl"
                    ? "Opublikowanych"
                    : "Published"
        },
        {
            value: new Set(
                comments
                    .map(comment => Number(comment.question_id))
                    .filter(Boolean)
            ).size,
            label:
                language === "ru"
                    ? "Обсуждений"
                    : language === "pl"
                    ? "Dyskusji"
                    : "Discussions"
        }
    ];

    const statKeys = [
        "answers",
        "questions",
        "published",
        "comments"
    ];

    const statHtml = stats
        .map(
            (stat, index) => `
                <button
                    type="button"
                    class="profile-stat-button"
                    data-profile-section="${statKeys[index]}"
                    style="
                        flex:1;
                        min-width:130px;
                        padding:14px;
                        border:1px solid #333;
                        border-radius:14px;
                        background:#171719;
                        color:#f4f4f7;
                        text-align:center;
                        cursor:pointer;
                    "
                >
                    <div style="
                        font-size:24px;
                        font-weight:700;
                    ">${stat.value}</div>

                    <div style="
                        margin-top:6px;
                        color:#999;
                        font-size:13px;
                    ">
                        ${stat.label}
                    </div>
                </button>
            `
        )
        .join("");

    const myQuestionsHtml =
        submissions.length === 0
            ? `
                <div style="
                    color:#777;
                    text-align:center;
                    padding:18px 10px;
                ">
                    ${
                        language === "ru"
                            ? "Вы ещё не задавали вопросов."
                            : language === "pl"
                            ? "Nie dodałeś jeszcze żadnych pytań."
                            : "You have not asked any questions yet."
                    }
                </div>
            `
            : submissions
                .map(submission => {
                    const questionText = escapeProfileHtml(
                        getProfileLocalizedText(submission)
                    );

                    return `
                        <div style="
                            padding:14px;
                            border:1px solid #333;
                            border-radius:12px;
                            background:#171719;
                            margin-top:10px;
                        ">
                            <div style="
                                line-height:1.5;
                                color:#f4f4f7;
                            ">
                                ${questionText}
                            </div>

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                gap:10px;
                                align-items:center;
                                margin-top:10px;
                                flex-wrap:wrap;
                            ">
                                <span style="
                                    color:#999;
                                    font-size:12px;
                                ">
                                    ${formatProfileDate(submission.created_at)}
                                </span>

                                <span style="
                                    font-size:12px;
                                    padding:5px 8px;
                                    border:1px solid #444;
                                    border-radius:999px;
                                    color:#ddd;
                                ">
                                    ${escapeProfileHtml(
                                        getProfileStatusLabel(
                                            submission.moderation_status
                                        )
                                    )}
                                </span>
                            </div>

                            ${
                                submission.moderation_status === "DRAFT"
                                    ? `
                                        <button
                                            type="button"
                                            class="edit-draft-button"
                                            data-submission-id="${submission.id}"
                                            style="
                                                width:100%;
                                                margin-top:10px;
                                                padding:10px;
                                                border:1px solid #444;
                                                border-radius:10px;
                                                background:transparent;
                                                color:#f4f4f7;
                                                cursor:pointer;
                                                font-size:13px;
                                            "
                                        >
                                            ${
                                                language === "ru"
                                                    ? "Продолжить редактирование"
                                                    : language === "pl"
                                                    ? "Kontynuuj edycję"
                                                    : "Continue editing"
                                            }
                                        </button>
                                    `
                                    : ""
                            }

                            ${
                                submission.moderation_status === "REJECTED" &&
                                submission.moderator_note
                                    ? `
                                        <div style="
                                            margin-top:10px;
                                            padding:10px 12px;
                                            border:1px solid #444;
                                            border-radius:10px;
                                            color:#ddd;
                                            font-size:13px;
                                            line-height:1.45;
                                        ">
                                            <strong>
                                                ${
                                                    language === "ru"
                                                        ? "Причина отклонения:"
                                                        : language === "pl"
                                                        ? "Powód odrzucenia:"
                                                        : "Rejection reason:"
                                                }
                                            </strong>
                                            <div style="margin-top:5px;">
                                                ${escapeProfileHtml(
                                                    submission.moderator_note
                                                )}
                                            </div>
                                        </div>
                                    `
                                    : ""
                            }
                        </div>
                    `;
                })
                .join("");

    const allProfileAnswers = [
        ...votes.map(vote => ({
            kind: "vote",
            question_id: vote.question_id,
            option_id: vote.option_id,
            answer_text: null,
            created_at: vote.created_at
        })),
        ...questionAnswers.map(answer => ({
            kind: "text",
            question_id: answer.question_id,
            option_id: null,
            answer_text: answer.answer_text,
            created_at: answer.created_at
        }))
    ].sort(
        (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
    );

    const myAnswersHtml =
        allProfileAnswers.length === 0
            ? `
                <div style="
                    color:#777;
                    text-align:center;
                    padding:18px 10px;
                ">
                    ${
                        language === "ru"
                            ? "Вы ещё не отвечали на вопросы."
                            : language === "pl"
                            ? "Nie odpowiedziałeś jeszcze na żadne pytanie."
                            : "You have not answered any questions yet."
                    }
                </div>
            `
            : allProfileAnswers
                .slice(0, 50)
                .map(answer => {
                    const question = questionMap.get(answer.question_id);

                    let answerText = "—";

                    if (answer.kind === "text") {
                        answerText = answer.answer_text || "—";
                    } else {
                        const option = optionMap.get(answer.option_id);

                        answerText =
                            getProfileLocalizedText(option) || "—";
                    }

                    return `
                        <div style="
                            padding:14px;
                            border:1px solid #333;
                            border-radius:12px;
                            background:#171719;
                            margin-top:10px;
                        ">
                            <div style="
                                line-height:1.5;
                                color:#f4f4f7;
                            ">
                                ${escapeProfileHtml(
                                    getProfileLocalizedText(question)
                                )}
                            </div>

                            <div style="
                                margin-top:8px;
                                color:#aaa;
                                font-size:13px;
                            ">
                                <strong style="color:#ddd;">
                                    ${
                                        language === "ru"
                                            ? "Ответ:"
                                            : language === "pl"
                                            ? "Odpowiedź:"
                                            : "Answer:"
                                    }
                                </strong>
                                ${escapeProfileHtml(answerText)}
                            </div>

                            <div style="
                                margin-top:8px;
                                color:#777;
                                font-size:12px;
                            ">
                                ${formatProfileDate(answer.created_at)}
                            </div>
                        </div>
                    `;
                })
                .join("");

    const discussionMap = new Map();

    comments.forEach(comment => {
        const questionId = Number(comment.question_id);

        if (!questionId) return;

        if (!discussionMap.has(questionId)) {
            discussionMap.set(questionId, []);
        }

        discussionMap.get(questionId).push(comment);
    });

    const discussions = [...discussionMap.entries()];

    const myCommentsHtml =
        discussions.length === 0
            ? `
                <div style="
                    color:#777;
                    text-align:center;
                    padding:18px 10px;
                ">
                    ${
                        language === "ru"
                            ? "Вы ещё не участвовали в обсуждениях."
                            : language === "pl"
                            ? "Nie brałeś jeszcze udziału w żadnych dyskusjach."
                            : "You have not participated in any discussions yet."
                    }
                </div>
            `
            : discussions
                .slice(0, 50)
                .map(([questionId, discussionComments]) => {
                    const question = questionMap.get(questionId);
                    const latestComment = discussionComments[0];
                    const commentCount = discussionComments.length;

                    const commentsLabel =
                        language === "ru"
                            ? commentCount === 1
                                ? "1 комментарий"
                                : commentCount < 5
                                ? `${commentCount} комментария`
                                : `${commentCount} комментариев`
                            : language === "pl"
                            ? commentCount === 1
                                ? "1 komentarz"
                                : "Komentarzy: " + commentCount
                            : commentCount === 1
                            ? "1 comment"
                            : `${commentCount} comments`;

                    return `
                        <div
                            data-discussion-question-id="${questionId}"
                            style="
                                padding:14px;
                                border:1px solid #333;
                                border-radius:12px;
                                background:#171719;
                                margin-top:10px;
                                cursor:pointer;
                            "
                        >
                            <div style="
                                color:#777;
                                font-size:12px;
                            ">
                                ${
                                    language === "ru"
                                        ? "Обсуждение"
                                        : language === "pl"
                                        ? "Dyskusja"
                                        : "Discussion"
                                }
                            </div>

                            <div style="
                                margin-top:5px;
                                color:#f4f4f7;
                                line-height:1.45;
                            ">
                                ${escapeProfileHtml(
                                    getProfileLocalizedText(question)
                                )}
                            </div>

                            <div style="
                                margin-top:10px;
                                color:#aaa;
                                font-size:13px;
                            ">
                                ${commentsLabel}
                            </div>

                            <div style="
                                margin-top:8px;
                                color:#888;
                                line-height:1.45;
                            ">
                                ${escapeProfileHtml(latestComment.body)}
                            </div>

                            <div style="
                                margin-top:8px;
                                color:#666;
                                font-size:12px;
                            ">
                                ${formatProfileDate(latestComment.created_at)}
                            </div>
                        </div>
                    `;
                })
                .join("");

    card.innerHTML = `
        <div id="profileDashboardMain">
        <div class="category">FLAGGED</div>

        <div style="text-align:center;">
            <div style="
                width:70px;
                height:70px;
                margin:0 auto 14px;
                border:1px solid #444;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:30px;
                background:#171719;
            ">
                🚩
            </div>

            <h2 style="
                margin:0;
                font-size:26px;
            ">
                ${escapeProfileHtml(displayName)}
            </h2>

            <p style="
                margin:8px 0 0;
                color:#777;
                font-size:13px;
            ">
                ${
                    language === "ru"
                        ? "В Flagged с"
                        : language === "pl"
                        ? "W Flagged od"
                        : "On Flagged since"
                }
                ${registeredText}
            </p>
        </div>

        <div style="
            display:flex;
            flex-wrap:wrap;
            gap:10px;
            margin-top:22px;
        ">
            ${statHtml}
        </div>

        <div style="
            display:flex;
            gap:8px;
            margin-top:18px;
        ">
            <button
                id="profileSettingsButton"
                type="button"
                style="
                    flex:1;
                    padding:13px;
                    border:1px solid #444;
                    border-radius:10px;
                    background:transparent;
                    color:white;
                    cursor:pointer;
                "
            >
                ${
                    language === "ru"
                        ? "Настройки"
                        : language === "pl"
                        ? "Ustawienia"
                        : "Settings"
                }
            </button>

            <button
                id="profileBackButton"
                type="button"
                style="
                    flex:1;
                    padding:13px;
                    border:1px solid #444;
                    border-radius:10px;
                    background:transparent;
                    color:white;
                    cursor:pointer;
                "
            >
                ${
                    language === "ru"
                        ? "Назад"
                        : language === "pl"
                        ? "Wróć"
                        : "Back"
                }
            </button>
        </div>
        </div>

        <div
            id="profileDetailScreen"
            style="display:none; margin-top:26px;"
        >
            <div class="category">FLAGGED</div>

            <h2
                id="profileDetailTitle"
                style="text-align:center;"
            ></h2>

            <div id="profileDetailContent"></div>

            <button
                id="profileDetailBackButton"
                type="button"
                style="
                    width:100%;
                    margin-top:18px;
                    padding:13px;
                    border:1px solid #444;
                    border-radius:10px;
                    background:transparent;
                    color:white;
                    cursor:pointer;
                "
            >
                ${
                    language === "ru"
                        ? "Назад в профиль"
                        : language === "pl"
                        ? "Wróć do profilu"
                        : "Back to profile"
                }
            </button>
        </div>

    `;

    const profileSectionTitles = {
        answers:
            language === "ru"
                ? "Мои ответы"
                : language === "pl"
                ? "Moje odpowiedzi"
                : "My answers",

        questions:
            language === "ru"
                ? "Мои вопросы"
                : language === "pl"
                ? "Moje pytania"
                : "My questions",

        published:
            language === "ru"
                ? "Опубликованные вопросы"
                : language === "pl"
                ? "Opublikowane pytania"
                : "Published questions",

        comments:
            language === "ru"
                ? "Мои обсуждения"
                : language === "pl"
                ? "Moje dyskusje"
                : "My discussions"
    };

    const openProfileSection = async sectionKey => {
        const detailScreen =
            document.getElementById("profileDetailScreen");

        const detailTitle =
            document.getElementById("profileDetailTitle");

        const detailContent =
            document.getElementById("profileDetailContent");

        if (!detailScreen || !detailTitle || !detailContent) {
            return;
        }

        detailTitle.textContent =
            profileSectionTitles[sectionKey] || "";

        detailScreen.style.display = "block";

        document
            .getElementById("profileDashboardMain")
            ?.style.setProperty("display", "none");

        detailContent.innerHTML = `
            <div style="
                text-align:center;
                color:#777;
                padding:24px 10px;
            ">
                ${
                    language === "ru"
                        ? "Загружаем..."
                        : language === "pl"
                        ? "Ładowanie..."
                        : "Loading..."
                }
            </div>
        `;

        if (sectionKey === "answers") {
            detailContent.innerHTML = myAnswersHtml;
            return;
        }

        if (sectionKey === "questions") {
            detailContent.innerHTML = myQuestionsHtml;
            return;
        }

        if (sectionKey === "comments") {
            detailContent.innerHTML = myCommentsHtml;
            return;
        }

        if (sectionKey === "published") {
            const { data, error } = await supabaseClient
                .from("questions")
                .select(
                    "id, text_ru, text_en, text_pl, type, published_at, created_at"
                )
                .eq("created_by", user.id)
                .eq("status", "published")
                .order("published_at", {
                    ascending: false
                });

            if (error) {
                console.error(
                    "Flagged: ошибка загрузки опубликованных вопросов:",
                    error
                );

                detailContent.innerHTML = `
                    <div style="
                        text-align:center;
                        color:#777;
                        padding:24px 10px;
                    ">
                        ${
                            language === "ru"
                                ? "Не удалось загрузить вопросы."
                                : language === "pl"
                                ? "Nie udało się załadować pytań."
                                : "Could not load questions."
                        }
                    </div>
                `;

                return;
            }

            if (!data || data.length === 0) {
                detailContent.innerHTML = `
                    <div style="
                        text-align:center;
                        color:#777;
                        padding:24px 10px;
                    ">
                        ${
                            language === "ru"
                                ? "У вас пока нет опубликованных вопросов."
                                : language === "pl"
                                ? "Nie masz jeszcze opublikowanych pytań."
                                : "You do not have any published questions yet."
                        }
                    </div>
                `;

                return;
            }

            detailContent.innerHTML = data
                .map(question => `
                    <div style="
                        padding:14px;
                        border:1px solid #333;
                        border-radius:12px;
                        background:#171719;
                        margin-top:10px;
                    ">
                        <div style="
                            line-height:1.5;
                            color:#f4f4f7;
                        ">
                            ${escapeProfileHtml(
                                getProfileLocalizedText(question)
                            )}
                        </div>

                        <div style="
                            margin-top:8px;
                            color:#777;
                            font-size:12px;
                        ">
                            ${formatProfileDate(
                                question.published_at ||
                                question.created_at
                            )}
                        </div>
                    </div>
                `)
                .join("");
        }
    };

    document
        .querySelectorAll(".profile-stat-button")
        .forEach(button => {
            button.addEventListener("click", () => {
                openProfileSection(
                    button.dataset.profileSection
                );
            });
        });

    document
        .getElementById("profileDetailBackButton")
        ?.addEventListener("click", () => {
            document.getElementById("profileDetailScreen").style.display =
                "none";

            document
                .getElementById("profileDashboardMain")
                ?.style.setProperty("display", "block");
        });

    document
        .getElementById("profileDetailScreen")
        ?.addEventListener("click", event => {
            const card = event.target.closest(
                "[data-discussion-question-id]"
            );

            if (!card) return;

            const questionId = Number(
                card.dataset.discussionQuestionId
            );

            if (!questionId) return;

            window.history.pushState(
                {},
                "",
                `?question=${questionId}&discussion=1&from=discussions`
            );

            document.getElementById("profileDetailScreen").style.display =
                "none";

            document
                .getElementById("profileDashboardMain")
                ?.style.setProperty("display", "none");

            gameStarted = true;
            openQuestionFromUrl();
        });

    document
        .getElementById("profileSettingsButton")
        ?.addEventListener("click", () => {
            showProfileSetup(true);
        });

    document
        .getElementById("profileBackButton")
        ?.addEventListener("click", () => {
            if (gameStarted && situations.length > 0) {
                showSituation();
            } else {
                showStartScreen();
            }
        });

    document
        .querySelectorAll(".edit-draft-button")
        .forEach(button => {
            button.addEventListener("click", () => {
                const submissionId = Number(
                    button.dataset.submissionId
                );

                if (submissionId) {
                    showQuestionComposer(submissionId);
                }
            });
        });
}


async function continueAfterAuth() {
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("Flagged: не удалось получить пользователя:", userError);
        return;
    }

    // Обновляем кнопки сразу после успешной авторизации.
    await updateAuthButtons();

    const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
        console.error(
            "Flagged: ошибка проверки профиля:",
            profileError
        );
        return;
    }

    const displayName =
        profile?.display_name?.trim() ||
        profile?.username?.trim() ||
        "";

    if (!displayName) {
        await showProfileSetup();
        return;
    }

    // После входа заново загружаем актуальный список вопросов
    // и актуальную историю ответов.
    currentIndex = 0;

    const questionsLoaded = await loadQuestionsFromSupabase();

    if (!questionsLoaded) {
        console.error(
            "Flagged: не удалось загрузить вопросы после авторизации"
        );
        return;
    }

    await loadAnsweredQuestionIds();

    showNextUnansweredQuestion();
}


async function showAuthComposer(mode = "signin", preserveReturn = false) {

  if (!preserveReturn) {
    const isVisible = (id) => {
      const el = document.getElementById(id);
      return !!el && el.offsetParent !== null;
    };

    if (isVisible("backToProfileButton")) {
      authReturnAction = () => showProfileDashboard();
    } else if (isVisible("profileBackButton")) {
      authReturnAction = () => showProfileDashboard();
    } else if (isVisible("backFromModerationButton") ||
               isVisible("moderationList")) {
      authReturnAction = () => showModerationPanel();
    } else if (isVisible("backToGameButton")) {
      authReturnAction = () => showNextUnansweredQuestion();
    } else if (isVisible("backToStartButton")) {
      authReturnAction = () => showCategoryScreen();
    } else if (gameStarted && situations.length > 0) {
      authReturnAction = () => showSituation();
    } else {
      authReturnAction = () => showStartScreen();
    }
  }

  const renderAuth = (mode = "signin") => {
    const isSignUp = mode === "signup";

    card.innerHTML = `
      <div class="category">FLAGGED</div>

      <h2 style="text-align:center;">
        ${
          isSignUp
            ? language === "ru"
              ? "Создать аккаунт"
              : language === "pl"
              ? "Utwórz konto"
              : "Create account"
            : language === "ru"
            ? "Войти в Flagged"
            : language === "pl"
            ? "Zaloguj się do Flagged"
            : "Sign in to Flagged"
        }
      </h2>

      <input
        id="authEmail"
        type="email"
        autocomplete="email"
        placeholder="Email"
        style="
          width:100%;
          box-sizing:border-box;
          margin-top:12px;
          padding:14px;
          border-radius:10px;
        "
      >

      <input
        id="authPassword"
        type="password"
        autocomplete="${isSignUp ? "new-password" : "current-password"}"
        placeholder="${
          language === "ru"
            ? "Пароль"
            : language === "pl"
            ? "Hasło"
            : "Password"
        }"
        style="
          width:100%;
          box-sizing:border-box;
          margin-top:10px;
          padding:14px;
          border-radius:10px;
        "
      >

      ${
        isSignUp
          ? `
            <input
              id="authPasswordConfirm"
              type="password"
              autocomplete="new-password"
              placeholder="${
                language === "ru"
                  ? "Подтвердите пароль"
                  : language === "pl"
                  ? "Potwierdź hasło"
                  : "Confirm password"
              }"
              style="
                width:100%;
                box-sizing:border-box;
                margin-top:10px;
                padding:14px;
                border-radius:10px;
              "
            >
          `
          : ""
      }

      <button
        id="${isSignUp ? "signUpButton" : "signInButton"}"
        type="button"
        style="
          width:100%;
          margin-top:16px;
          padding:14px;
          border:none;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
        "
      >
        ${
          isSignUp
            ? language === "ru"
              ? "Создать аккаунт"
              : language === "pl"
              ? "Utwórz konto"
              : "Create account"
            : language === "ru"
            ? "Войти"
            : language === "pl"
            ? "Zaloguj się"
            : "Sign in"
        }
      </button>

      <button
        id="authModeSwitchButton"
        type="button"
        style="
          width:100%;
          margin-top:10px;
          padding:12px;
          border:1px solid #444;
          border-radius:10px;
          background:transparent;
          color:inherit;
          cursor:pointer;
        "
      >
        ${
          isSignUp
            ? language === "ru"
              ? "Уже есть аккаунт? Войти"
              : language === "pl"
              ? "Masz już konto? Zaloguj się"
              : "Already have an account? Sign in"
            : language === "ru"
            ? "Нет аккаунта? Создать аккаунт"
            : language === "pl"
            ? "Nie masz konta? Utwórz konto"
            : "Don't have an account? Create one"
        }
      </button>

      <button
        id="backFromAuthButton"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          padding:12px;
          border:none;
          border-radius:10px;
          cursor:pointer;
        "
      >
        ${
          language === "ru"
            ? "Назад"
            : language === "pl"
            ? "Wróć"
            : "Back"
        }
      </button>
    `;

    const getCredentials = () => {
      const email = document.getElementById("authEmail").value.trim();
      const password = document.getElementById("authPassword").value;

      if (!email || !password) {
        alert(
          language === "ru"
            ? "Введите email и пароль."
            : language === "pl"
            ? "Wpisz email i hasło."
            : "Enter your email and password."
        );
        return null;
      }

      return { email, password };
    };

    document
      .getElementById("authModeSwitchButton")
      .addEventListener("click", () => {
        renderAuth(isSignUp ? "signin" : "signup");
      });

    document
      .getElementById("backFromAuthButton")
      .addEventListener("click", () => {
        authReturnAction();
      });

    if (isSignUp) {
      document
        .getElementById("signUpButton")
        .addEventListener("click", async () => {
          const credentials = getCredentials();
          if (!credentials) return;

          const passwordConfirm = document
            .getElementById("authPasswordConfirm")
            .value;

          if (!passwordConfirm) {
            alert(
              language === "ru"
                ? "Подтвердите пароль."
                : language === "pl"
                ? "Potwierdź hasło."
                : "Confirm your password."
            );
            return;
          }

          if (credentials.password !== passwordConfirm) {
            alert(
              language === "ru"
                ? "Пароли не совпадают."
                : language === "pl"
                ? "Hasła nie są takie same."
                : "Passwords do not match."
            );
            return;
          }

          const { data, error } = await supabaseClient.auth.signUp(
            credentials
          );

          if (error) {
            console.error("Ошибка регистрации:", error);

            alert(
              language === "ru"
                ? error.message
                : language === "pl"
                ? "Nie udało się utworzyć konta."
                : "Could not create the account."
            );
            return;
          }

          if (!data.session) {
            alert(
              language === "ru"
                ? "Аккаунт создан. Проверь email для подтверждения."
                : language === "pl"
                ? "Konto zostało utworzone. Sprawdź email, aby je potwierdzić."
                : "Account created. Check your email for confirmation."
            );
          } else {
            alert(
              language === "ru"
                ? "Аккаунт создан. Вы вошли в Flagged."
                : language === "pl"
                ? "Konto utworzone. Zalogowano do Flagged."
                : "Account created. You are now signed in."
            );

            await continueAfterAuth();
          }
        });
    } else {
      document
        .getElementById("signInButton")
        .addEventListener("click", async () => {
          const credentials = getCredentials();
          if (!credentials) return;

          const { error } = await supabaseClient.auth.signInWithPassword(
            credentials
          );

          if (error) {
            console.error("Ошибка входа:", error);

            alert(
              language === "ru"
                ? "Не удалось войти. Проверь email и пароль."
                : language === "pl"
                ? "Nie udało się zalogować. Sprawdź email i hasło."
                : "Sign in failed. Check your email and password."
            );
            return;
          }

          alert(
            language === "ru"
              ? "Вы вошли в Flagged."
              : language === "pl"
              ? "Zalogowano do Flagged."
              : "You are now signed in to Flagged."
          );

          await continueAfterAuth();
        });
    }
  };

  renderAuth(mode);
}


async function updateAuthButtons() {
  const authButton = document.getElementById("authButton");
  const registerButton = document.getElementById("registerButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");

  if (!authButton || !registerButton || !profileButton || !logoutButton) return;

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (user) {
    authButton.style.display = "none";
    registerButton.style.display = "none";
    profileButton.style.display = "block";
    logoutButton.style.display = "block";

    profileButton.textContent =
      language === "ru"
        ? "Профиль"
        : language === "pl"
        ? "Profil"
        : "Profile";

    logoutButton.textContent =
      language === "ru"
        ? "Выйти"
        : language === "pl"
        ? "Wyloguj"
        : "Sign out";
  } else {
    authButton.style.display = "block";
    registerButton.style.display = "block";
    profileButton.style.display = "none";
    logoutButton.style.display = "none";

    authButton.textContent =
      language === "ru"
        ? "Войти"
        : language === "pl"
        ? "Zaloguj się"
        : "Sign in";

    registerButton.textContent =
      language === "ru"
        ? "Создать аккаунт"
        : language === "pl"
        ? "Utwórz konto"
        : "Create account";
  }
}

document
  .getElementById("authButton")
  ?.addEventListener("click", showAuthComposer);

document
  .getElementById("registerButton")
  ?.addEventListener("click", () => showAuthComposer("signup"));

document
  .getElementById("profileButton")
  ?.addEventListener("click", () => showProfileDashboard());

document
  .getElementById("logoutButton")
  ?.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Flagged: ошибка выхода:", error);

      alert(
        language === "ru"
          ? "Не удалось выйти из аккаунта."
          : language === "pl"
          ? "Nie udało się wylogować."
          : "Could not sign out."
      );

      return;
    }

    await updateAuthButtons();

    currentIndex = 0;
    gameStarted = false;

    showStartScreen();
  });

document
  .getElementById("moderationButton")
  ?.addEventListener("click", showModerationPanel);

initModerationAccess();


async function initModerationAccess() {
  const moderationButton =
    document.getElementById("moderationButton");

  if (!moderationButton) return;

  const { data, error } =
    await supabaseClient.rpc("is_moderator_or_admin");

  if (error) {
    console.error("Ошибка проверки прав модератора:", error);
    return;
  }

  if (data === true) {
    moderationButton.style.display = "block";
  }
}


async function showModerationPanel() {
  const [
    { data: submissionsData, error: submissionsError },
    { data: reportsData, error: reportsError }
  ] = await Promise.all([
    supabaseClient.rpc("get_pending_question_submissions"),
    supabaseClient.rpc("get_question_answer_reports")
  ]);

  if (submissionsError) {
    console.error("Ошибка загрузки очереди модерации:", submissionsError);

    alert(
      language === "ru"
        ? "Не удалось загрузить очередь модерации."
        : language === "pl"
        ? "Nie udało się załadować kolejki moderacji."
        : "Could not load the moderation queue."
    );
    return;
  }

  if (reportsError) {
    console.error("Ошибка загрузки жалоб на ответы:", reportsError);
  }

  const submissions = Array.isArray(submissionsData) ? submissionsData : [];
  const reports = Array.isArray(reportsData) ? reportsData : [];

  console.log("Flagged: жалоб на ответы:", reports.length);

  const renderReports = () => {
    const reportList = document.getElementById("questionAnswerReportsList");
    if (!reportList) return;

    if (reports.length === 0) {
      reportList.innerHTML = `
        <p style="opacity:0.7; text-align:center;">
          ${
            language === "ru"
              ? "Жалоб пока нет."
              : language === "pl"
              ? "Brak zgłoszeń."
              : "No reports yet."
          }
        </p>
      `;
      return;
    }

    const reasonLabels = {
      ru: {
        spam: "Спам",
        offensive: "Оскорбление",
        harassment: "Преследование",
        hate: "Ненависть",
        sexual: "Сексуальный контент",
        other: "Другое"
      },
      pl: {
        spam: "Spam",
        offensive: "Obraźliwe treści",
        harassment: "Nękanie",
        hate: "Nienawiść",
        sexual: "Treści seksualne",
        other: "Inne"
      },
      en: {
        spam: "Spam",
        offensive: "Offensive content",
        harassment: "Harassment",
        hate: "Hate",
        sexual: "Sexual content",
        other: "Other"
      }
    };

    const labels = reasonLabels[language] || reasonLabels.en;

    reportList.innerHTML = reports
      .map(report => {
        const createdAt = report.created_at
          ? new Date(report.created_at).toLocaleString(
              language === "ru"
                ? "ru-RU"
                : language === "pl"
                ? "pl-PL"
                : "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }
            )
          : "—";

        return `
          <div class="question-answer-report-card">
            <div class="question-answer-report-meta">
              <span class="moderation-badge">
                🚩 ${
                  labels[report.reason] ||
                  report.reason ||
                  "—"
              }
              </span>

              <span class="moderation-badge">
                #${report.answer_id}
              </span>

              <span class="moderation-badge">
                ${
                  report.question_id
                    ? `Question #${report.question_id}`
                    : "—"
                }
              </span>

              <span class="moderation-badge">
                ${createdAt}
              </span>
            </div>

            <div class="question-answer-report-label">
              ${
                language === "ru"
                  ? "Ответ:"
                  : language === "pl"
                  ? "Odpowiedź:"
                  : "Answer:"
              }
            </div>

            <div class="question-answer-report-text">
              ${escapeProfileHtml(report.answer_text || "")}
            </div>

            <div class="question-answer-report-actions">
              ${
                report.question_id
                  ? `
                    <button
                      type="button"
                      class="open-question-from-report-button"
                      data-question-id="${report.question_id}"
                    >
                      ${
                        language === "ru"
                          ? "Открыть вопрос →"
                          : language === "pl"
                          ? "Otwórz pytanie →"
                          : "Open question →"
                      }
                    </button>
                  `
                  : ""
              }

              <button
                type="button"
                class="hide-question-answer-report-button"
                data-report-id="${report.id}"
              >
                ${
                  language === "ru"
                    ? "🚫 Скрыть ответ"
                    : language === "pl"
                    ? "🚫 Ukryj odpowiedź"
                    : "🚫 Hide answer"
                }
              </button>

              <button
                type="button"
                class="dismiss-question-answer-report-button"
                data-report-id="${report.id}"
              >
                ${
                  language === "ru"
                    ? "✓ Отклонить жалобу"
                    : language === "pl"
                    ? "✓ Odrzuć zgłoszenie"
                    : "✓ Dismiss report"
                }
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  };

  if (submissions.length === 0 && reports.length === 0) {
    card.innerHTML = `
      <div class="category">FLAGGED</div>

      <h2 style="text-align:center;">
        ${
          language === "ru"
            ? "Модерация"
            : language === "pl"
            ? "Moderacja"
            : "Moderation"
        }
      </h2>

      <p class="situation" style="text-align:center;">
        ${
          language === "ru"
            ? "Новых заявок нет."
            : language === "pl"
            ? "Brak nowych zgłoszeń."
            : "No pending submissions."
        }
      </p>

      <section style="margin-top:24px;">
        <h3 style="margin-bottom:12px;">
          ${
            language === "ru"
              ? `Жалобы на ответы · ${reports.length}`
              : language === "pl"
              ? `Zgłoszenia odpowiedzi · ${reports.length}`
              : `Answer reports · ${reports.length}`
          }
        </h3>

        <div id="questionAnswerReportsList"></div>
      </section>

      <button
        id="backFromModerationButton"
        type="button"
        style="
          width:100%;
          margin-top:18px;
          padding:14px;
          border:none;
          border-radius:10px;
          cursor:pointer;
        "
      >
        ${
          language === "ru"
            ? "Назад"
            : language === "pl"
            ? "Wróć"
            : "Back"
        }
      </button>
    `;

    renderReports();

    document
      .getElementById("questionAnswerReportsList")
      ?.addEventListener("click", async event => {
        const openButton = event.target.closest(
          ".open-question-from-report-button"
        );

        if (openButton) {
          const questionId = Number(openButton.dataset.questionId);

          if (!questionId) return;

          const questionUrl =
            `${window.location.origin}${window.location.pathname}?question=${questionId}`;

          window.open(questionUrl, "_blank", "noopener,noreferrer");
          return;
        }

        const hideButton = event.target.closest(
          ".hide-question-answer-report-button"
        );

        const dismissButton = event.target.closest(
          ".dismiss-question-answer-report-button"
        );

        if (!hideButton && !dismissButton) return;

        const actionButton = hideButton || dismissButton;
        const reportId = Number(actionButton.dataset.reportId);

        if (!reportId) return;

        const originalText = actionButton.textContent;
        actionButton.disabled = true;
        actionButton.textContent =
          language === "ru"
            ? "Обработка..."
            : language === "pl"
            ? "Przetwarzanie..."
            : "Processing...";

        const rpcName = hideButton
          ? "hide_question_answer_report"
          : "dismiss_question_answer_report";

        const { data, error } = await supabaseClient.rpc(
          rpcName,
          {
            p_report_id: reportId
          }
        );

        if (error) {
          console.error("Ошибка обработки жалобы:", error);

          actionButton.disabled = false;
          actionButton.textContent = originalText;

          alert(
            language === "ru"
              ? "Не удалось обработать жалобу."
              : language === "pl"
              ? "Nie udało się rozpatrzyć zgłoszenia."
              : "Could not resolve the report."
          );

          return;
        }

        if (!data) {
          actionButton.disabled = false;
          actionButton.textContent = originalText;

          alert(
            language === "ru"
              ? "Жалоба уже была обработана или не найдена."
              : language === "pl"
              ? "Zgłoszenie zostało już rozpatrzone lub nie zostało znalezione."
              : "The report was already resolved or was not found."
          );

          return;
        }

        showModerationPanel();
      });

    document
      .getElementById("backFromModerationButton")
      .addEventListener("click", () => {
        showNextUnansweredQuestion();
      });

    return;
  }

  card.innerHTML = `
    <div class="category">FLAGGED</div>

    <h2 style="text-align:center;">
      ${
        language === "ru"
          ? "Модерация"
          : language === "pl"
          ? "Moderacja"
          : "Moderation"
      }
    </h2>

    <p style="opacity:0.75; text-align:center;">
      ${
        language === "ru"
          ? `Новых заявок: ${submissions.length}`
          : language === "pl"
          ? `Nowych zgłoszeń: ${submissions.length}`
          : `Pending submissions: ${submissions.length}`
      }
    </p>

    <div id="moderationList"></div>

    <section style="margin-top:24px;">
      <h3 style="margin-bottom:12px;">
        ${
          language === "ru"
            ? `Жалобы на ответы · ${reports.length}`
            : language === "pl"
            ? `Zgłoszenia odpowiedzi · ${reports.length}`
            : `Answer reports · ${reports.length}`
        }
      </h3>

      <div id="questionAnswerReportsList"></div>
    </section>

    <button
      id="backFromModerationButton"
      type="button"
      style="
        width:100%;
        margin-top:16px;
        padding:14px;
        border:none;
        border-radius:10px;
        cursor:pointer;
      "
    >
      ${
        language === "ru"
          ? "Назад"
          : language === "pl"
          ? "Wróć"
          : "Back"
      }
    </button>
  `;

  const list = document.getElementById("moderationList");

  renderReports();

  document
    .getElementById("questionAnswerReportsList")
    ?.addEventListener("click", async event => {
      const openButton = event.target.closest(
        ".open-question-from-report-button"
      );

      if (openButton) {
        const questionId = Number(openButton.dataset.questionId);

        if (!questionId) return;

        const questionUrl =
          `${window.location.origin}${window.location.pathname}?question=${questionId}`;

        window.open(questionUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const hideButton = event.target.closest(
        ".hide-question-answer-report-button"
      );

      const dismissButton = event.target.closest(
        ".dismiss-question-answer-report-button"
      );

      if (!hideButton && !dismissButton) return;

      const actionButton = hideButton || dismissButton;
      const reportId = Number(actionButton.dataset.reportId);

      if (!reportId) return;

      const originalText = actionButton.textContent;

      actionButton.disabled = true;
      actionButton.textContent =
        language === "ru"
          ? "Обработка..."
          : language === "pl"
          ? "Przetwarzanie..."
          : "Processing...";

      const rpcName = hideButton
        ? "hide_question_answer_report"
        : "dismiss_question_answer_report";

      const { data, error } = await supabaseClient.rpc(
        rpcName,
        {
          p_report_id: reportId
        }
      );

      if (error) {
        console.error("Ошибка обработки жалобы:", error);

        actionButton.disabled = false;
        actionButton.textContent = originalText;

        alert(
          language === "ru"
            ? "Не удалось обработать жалобу."
            : language === "pl"
            ? "Nie udało się rozpatrzyć zgłoszenia."
            : "Could not resolve the report."
        );

        return;
      }

      if (!data) {
        actionButton.disabled = false;
        actionButton.textContent = originalText;

        alert(
          language === "ru"
            ? "Жалоба уже была обработана или не найдена."
            : language === "pl"
            ? "Zgłoszenie zostało już rozpatrzone lub nie zostało znalezione."
            : "The report was already resolved or was not found."
        );

        return;
      }

      showModerationPanel();
    });

  list.innerHTML = submissions
    .map(submission => {
      const text =
        submission.text_ru ||
        submission.text_en ||
        submission.text_pl ||
        "";

      const categoryName = submission.category
        ? submission.category[`name_${language}`] ||
          submission.category.name_ru ||
          submission.category.name_en ||
          ""
        : "";

      const createdAt = submission.created_at
        ? new Date(submission.created_at).toLocaleString(
            language === "ru"
              ? "ru-RU"
              : language === "pl"
              ? "pl-PL"
              : "en-GB",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }
          )
        : "";

      const authorLabel =
        submission.is_anonymous
          ? language === "ru"
            ? "Аноним"
            : language === "pl"
            ? "Anonim"
            : "Anonymous"
          : submission.author?.display_name ||
            submission.author?.username ||
            (language === "ru"
              ? "Пользователь"
              : language === "pl"
              ? "Użytkownik"
              : "User");

      const statusLabel =
        language === "ru"
          ? "На проверке"
          : language === "pl"
          ? "Do sprawdzenia"
          : "Pending review";

      const typeLabel =
        submission.type === "SITUATION"
          ? language === "ru"
            ? "Ситуация"
            : language === "pl"
            ? "Sytuacja"
            : "Situation"
          : language === "ru"
          ? "Вопрос"
          : language === "pl"
          ? "Pytanie"
          : "Question";

      const openLabel =
        language === "ru"
          ? "Открыть заявку →"
          : language === "pl"
          ? "Otwórz zgłoszenie →"
          : "Open submission →";

      return `
        <button
          type="button"
          class="moderation-submission"
          data-submission-id="${submission.id}"
        >
          <strong>#${submission.id}</strong>

          <div class="moderation-meta">
            <span class="moderation-badge">
              ${
                submission.moderation_status === "PENDING"
                  ? language === "ru"
                    ? "На проверке"
                    : language === "pl"
                    ? "Do sprawdzenia"
                    : "Pending review"
                  : submission.moderation_status || "—"
              }
            </span>

            <span class="moderation-badge">
              ${typeLabel}
            </span>

            ${
              categoryName
                ? `
                  <span class="moderation-badge">
                    ${submission.category?.icon || ""} ${categoryName}
                  </span>
                `
                : ""
            }

            <span class="moderation-badge">
              👤 ${escapeProfileHtml(authorLabel)}
            </span>

            <span class="moderation-badge">
              ${
                submission.created_at
                  ? new Date(submission.created_at).toLocaleString(
                      language === "ru"
                        ? "ru-RU"
                        : language === "pl"
                        ? "pl-PL"
                        : "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )
                  : "—"
              }
            </span>
          </div>

          <div class="moderation-preview">
            ${text}
          </div>

          <div class="moderation-action">
            ${openLabel}
          </div>
        </button>
      `;
    })
    .join("");

  document
    .getElementById("backFromModerationButton")
    .addEventListener("click", () => {
      showNextUnansweredQuestion();
    });

  document
    .getElementById("moderationList")
    .addEventListener("click", event => {
      const button = event.target.closest(".moderation-submission");

      if (!button) return;

      const submissionId = Number(button.dataset.submissionId);
      const submission = submissions.find(item => item.id === submissionId);

      if (!submission) return;

      showModerationSubmission(submission);
    });
}

function showModerationSubmission(submission) {
  const options = Array.isArray(submission.options)
    ? submission.options
    : [];

  card.innerHTML = `
    <div class="category">FLAGGED</div>

    <h2 style="text-align:center;">
      ${
        language === "ru"
          ? "Проверка заявки"
          : language === "pl"
          ? "Sprawdzanie zgłoszenia"
          : "Review submission"
      }
    </h2>

    <p style="opacity:0.65;">
      #${submission.id} · ${submission.type}
    </p>

    <p style="margin-top:10px;">
      <strong>
        ${
          language === "ru"
            ? "Автор:"
            : language === "pl"
            ? "Autor:"
            : "Author:"
        }
      </strong>
      ${
        submission.is_anonymous
          ? language === "ru"
            ? "Аноним"
            : language === "pl"
            ? "Anonim"
            : "Anonymous"
          : escapeProfileHtml(
              submission.author?.display_name ||
              submission.author?.username ||
              (language === "ru"
                ? "Пользователь"
                : language === "pl"
                ? "Użytkownik"
                : "User")
            )
      }
    </p>

    <div
      style="
        margin-top:16px;
        padding:16px;
        border:1px solid rgba(255,255,255,0.12);
        border-radius:12px;
      "
    >
      <p style="font-size:20px; line-height:1.45; margin:0;">
        ${
          submission.text_ru ||
          submission.text_en ||
          submission.text_pl ||
          ""
        }
      </p>
    </div>

    <p style="margin-top:16px;">
      <strong>
        ${
          language === "ru"
            ? "Категория:"
            : language === "pl"
            ? "Kategoria:"
            : "Category:"
        }
      </strong>
      ${
        submission.category
          ? `${submission.category.icon || ""} ${
              submission.category[`name_${language}`] ||
              submission.category.name_ru ||
              ""
            }`
          : "—"
      }
    </p>

    ${
      options.length > 0
        ? `
          <p style="margin-top:16px;">
            <strong>
              ${
                language === "ru"
                  ? "Варианты ответа:"
                  : language === "pl"
                  ? "Opcje odpowiedzi:"
                  : "Answer options:"
              }
            </strong>
          </p>

          <div>
            ${options
              .map(
                option => `
                  <div
                    style="
                      margin-top:8px;
                      padding:10px 12px;
                      border:1px solid rgba(255,255,255,0.1);
                      border-radius:10px;
                    "
                  >
                    ${option.position}. ${
                      option[`text_${language}`] ||
                      option.text_ru ||
                      option.text_en ||
                      ""
                    }
                  </div>
                `
              )
              .join("")}
          </div>
        `
        : ""
    }

    ${
      submission.has_personal_experience
        ? `
          <p style="margin-top:16px;">
            ${
              language === "ru"
                ? "✓ Может содержать личный опыт"
                : language === "pl"
                ? "✓ Może zawierać osobiste doświadczenie"
                : "✓ May contain personal experience"
            }
          </p>
        `
        : ""
    }

    <textarea
      id="moderatorNote"
      rows="4"
      placeholder="${
        language === "ru"
          ? "Комментарий модератора..."
          : language === "pl"
          ? "Komentarz moderatora..."
          : "Moderator note..."
      }"
      style="
        width:100%;
        box-sizing:border-box;
        margin-top:16px;
        padding:12px;
        border-radius:10px;
        resize:vertical;
      "
    ></textarea>

    <button
      id="approveSubmissionButton"
      type="button"
      style="
        width:100%;
        margin-top:14px;
        padding:14px;
        border:none;
        border-radius:10px;
        cursor:pointer;
        font-weight:600;
      "
    >
      ${
        language === "ru"
          ? "Одобрить"
          : language === "pl"
          ? "Zatwierdź"
          : "Approve"
      }
    </button>

    <button
      id="rejectSubmissionButton"
      type="button"
      style="
        width:100%;
        margin-top:8px;
        padding:14px;
        border:1px solid #444;
        border-radius:10px;
        background:transparent;
        color:inherit;
        cursor:pointer;
      "
    >
      ${
        language === "ru"
          ? "Отклонить"
          : language === "pl"
          ? "Odrzuć"
          : "Reject"
      }
    </button>

    <button
      id="backToModerationListButton"
      type="button"
      style="
        width:100%;
        margin-top:8px;
        padding:12px;
        border:none;
        border-radius:10px;
        cursor:pointer;
      "
    >
      ${
        language === "ru"
          ? "Назад к списку"
          : language === "pl"
          ? "Wróć do listy"
          : "Back to list"
      }
    </button>
  `;

  document
    .getElementById("approveSubmissionButton")
    .addEventListener("click", () => {
      moderateSubmissionDecision(submission.id, "APPROVED");
    });

  document
    .getElementById("rejectSubmissionButton")
    .addEventListener("click", () => {
      moderateSubmissionDecision(submission.id, "REJECTED");
    });

  document
    .getElementById("backToModerationListButton")
    .addEventListener("click", () => {
      showModerationPanel();
    });
}

async function moderateSubmissionDecision(submissionId, decision) {
  const note =
    document.getElementById("moderatorNote")?.value.trim() || null;

  const { data, error } = await supabaseClient.rpc(
    "moderate_question_submission",
    {
      p_submission_id: submissionId,
      p_decision: decision,
      p_moderator_note: note
    }
  );

  if (error) {
    console.error("Ошибка модерации:", error);

    alert(
      language === "ru"
        ? error.message || "Не удалось обработать заявку."
        : language === "pl"
        ? "Nie udało się przetworzyć zgłoszenia."
        : "Could not process the submission."
    );
    return;
  }

  console.log("Flagged: решение модератора", {
    submissionId,
    decision,
    result: data
  });

  if (decision === "APPROVED") {
    const questionId = Number(data);

    if (!questionId) {
      console.error(
        "Flagged: после одобрения не получен ID вопроса:",
        data
      );

      alert(
        language === "ru"
          ? "Заявка одобрена, но ID нового вопроса не получен."
          : language === "pl"
          ? "Zgłoszenie zatwierdzone, ale nie otrzymano ID pytania."
          : "Submission approved, but the new question ID was not returned."
      );

      showModerationPanel();
      return;
    }

    const {
      data: translationData,
      error: translationError
    } = await supabaseClient.functions.invoke(
      "translate-approved-question",
      {
        body: {
          question_id: questionId
        }
      }
    );

    if (translationError) {
      console.error(
        "Flagged: ошибка автоматического перевода:",
        translationError
      );

      alert(
        language === "ru"
          ? "Заявка одобрена, но автоматический перевод не завершился."
          : language === "pl"
          ? "Zgłoszenie zatwierdzone, ale automatyczne tłumaczenie nie zostało ukończone."
          : "Submission approved, but automatic translation did not complete."
      );
    } else {
      console.log(
        "Flagged: автоматический перевод завершён:",
        translationData
      );

      alert(
        language === "ru"
          ? "Заявка одобрена и переведена."
          : language === "pl"
          ? "Zgłoszenie zatwierdzone i przetłumaczone."
          : "Submission approved and translated."
      );
    }
  } else {
    alert(
      language === "ru"
        ? "Заявка отклонена."
        : language === "pl"
        ? "Zgłoszenie odrzucone."
        : "Submission rejected."
    );
  }

  showModerationPanel();
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
        <button
            id="backToCategoriesFromQuestion"
            type="button"
            style="
                width:100%;
                padding:10px 12px;
                margin-bottom:14px;
                border:1px solid #444;
                border-radius:10px;
                background:transparent;
                color:#999;
                font-size:13px;
                cursor:pointer;
            "
        >
            ${
                language === "ru"
                    ? "← К категориям"
                    : language === "pl"
                    ? "← Do kategorii"
                    : "← Back to categories"
            }
        </button>

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
        ${
          situation.options && situation.options.length > 0
            ? situation.options
                .map(
                  option =>
                    `<button class="answer-option" data-option-id="${option.id}">${option[language]}</button>`
                )
                .join("")
            : situation.type === "SITUATION"
            ? `
              <button class="normal">${t().normal}</button>
              <button class="hmm">${t().hmm}</button>
              <button class="red">${t().red}</button>
            `
            : `
              <div style="width:100%;">
                <textarea
                  id="questionAnswerText"
                  rows="5"
                  maxlength="3000"
                  placeholder="${
                    language === "ru"
                      ? "Напиши своё мнение..."
                      : language === "pl"
                      ? "Napisz swoją opinię..."
                      : "Write your opinion..."
                  }"
                  style="
                    width:100%;
                    box-sizing:border-box;
                    padding:14px;
                    border:1px solid #444;
                    border-radius:12px;
                    background:#171719;
                    color:white;
                    resize:vertical;
                    font-family:inherit;
                    font-size:15px;
                    line-height:1.5;
                  "
                ></textarea>

                <label
                  style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    margin-top:10px;
                    font-size:13px;
                    cursor:pointer;
                  "
                >
                  <input
                    type="checkbox"
                    id="questionAnswerAnonymous"
                  >
                  ${
                    language === "ru"
                      ? "Отвечать анонимно"
                      : language === "pl"
                      ? "Odpowiedz anonimowo"
                      : "Answer anonymously"
                  }
                </label>

                ${
                  situation.hasPersonalExperience
                    ? `
                      <div style="margin-top:16px;">
                        <div style="font-size:14px; margin-bottom:8px;">
                          ${
                            language === "ru"
                              ? "У вас есть личный опыт?"
                              : language === "pl"
                              ? "Czy masz osobiste doświadczenie?"
                              : "Do you have personal experience?"
                          }
                        </div>

                        <div
                          id="questionPersonalExperience"
                          style="
                            display:flex;
                            gap:8px;
                            flex-wrap:wrap;
                          "
                        >
                          <button
                            type="button"
                            class="personal-experience-option"
                            data-value="true"
                            style="
                              padding:10px 14px;
                              border:1px solid #444;
                              border-radius:10px;
                              background:#171719;
                              color:white;
                              cursor:pointer;
                            "
                          >
                            ${
                              language === "ru"
                                ? "Да"
                                : language === "pl"
                                ? "Tak"
                                : "Yes"
                            }
                          </button>

                          <button
                            type="button"
                            class="personal-experience-option"
                            data-value="false"
                            style="
                              padding:10px 14px;
                              border:1px solid #444;
                              border-radius:10px;
                              background:#171719;
                              color:white;
                              cursor:pointer;
                            "
                          >
                            ${
                              language === "ru"
                                ? "Нет, это моё мнение"
                                : language === "pl"
                                ? "Nie, to tylko moja opinia"
                                : "No, this is just my opinion"
                            }
                          </button>
                        </div>
                      </div>
                    `
                    : ""
                }

                <button
                  id="submitQuestionAnswerButton"
                  type="button"
                  style="
                    width:100%;
                    margin-top:10px;
                    padding:14px;
                    border:none;
                    border-radius:12px;
                    background:#fff;
                    color:#111;
                    font-weight:700;
                    cursor:pointer;
                  "
                >
                  ${
                    language === "ru"
                      ? "Ответить"
                      : language === "pl"
                      ? "Odpowiedz"
                      : "Answer"
                  }
                </button>
              </div>
            `
        }
      </div>

        ${
          situation.type === "QUESTION" &&
          situation.options &&
          situation.options.length > 0 &&
          situation.hasPersonalExperience
            ? `
              <div style="margin-top:16px;">
                <div style="font-size:14px; margin-bottom:8px;">
                  ${
                    language === "ru"
                      ? "У вас есть личный опыт?"
                      : language === "pl"
                      ? "Czy masz osobiste doświadczenie?"
                      : "Do you have personal experience?"
                  }
                </div>

                <div
                  id="questionPersonalExperience"
                  style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                  "
                >
                  <button
                    type="button"
                    class="personal-experience-option"
                    data-value="true"
                    style="
                      padding:10px 14px;
                      border:1px solid #444;
                      border-radius:10px;
                      background:#171719;
                      color:white;
                      cursor:pointer;
                    "
                  >
                    ${
                      language === "ru"
                        ? "Да"
                        : language === "pl"
                        ? "Tak"
                        : "Yes"
                    }
                  </button>

                  <button
                    type="button"
                    class="personal-experience-option"
                    data-value="false"
                    style="
                      padding:10px 14px;
                      border:1px solid #444;
                      border-radius:10px;
                      background:#171719;
                      color:white;
                      cursor:pointer;
                    "
                  >
                    ${
                      language === "ru"
                        ? "Нет, это моё мнение"
                        : language === "pl"
                        ? "Nie, to tylko moja opinia"
                        : "No, this is just my opinion"
                    }
                  </button>
                </div>
              </div>
            `
            : ""
        }

<div class="progress-info">
    <span>${
        (() => {
            const unansweredSituations = situations.filter(
                item => !answeredQuestionIds.has(item.id)
            );

            const currentUnansweredIndex =
                unansweredSituations.findIndex(
                    item => item.id === situation.id
                );

            return `${currentUnansweredIndex + 1} / ${unansweredSituations.length}`;
        })()
    }</span>
</div>

<div class="progress-bar">
    <div class="progress-fill"
         style="${
             (() => {
                 const unansweredSituations = situations.filter(
                     item => !answeredQuestionIds.has(item.id)
                 );

                 const currentUnansweredIndex =
                     unansweredSituations.findIndex(
                         item => item.id === situation.id
                     );

                 const totalUnanswered =
                     unansweredSituations.length;

                 const progress =
                     totalUnanswered > 0
                         ? ((currentUnansweredIndex + 1) / totalUnanswered) * 100
                         : 0;

                 return `width: ${progress}%;`;
             })()
         }">
    </div>
</div>

<div id="questionAnswersSection" style="margin-top:28px;"></div>

<div id="commentsSection" class="comments-section"></div>
    `;

    document
        .getElementById("backToCategoriesFromQuestion")
        ?.addEventListener("click", async () => {
            pendingAnswer = null;
            pendingPersonalExperience = null;
            pendingAnswerSelection = null;
            currentIndex = 0;
            gameStarted = false;

            const params = new URLSearchParams(window.location.search);

            if (params.get("from") === "discussions") {
                window.history.pushState({}, "", "?");
                await showProfileDashboard();
                return;
            }

            showCategoryScreen();
        });

    if (
        situation.type === "QUESTION" &&
        (!situation.options || situation.options.length === 0)
    ) {
        document
            .getElementById("submitQuestionAnswerButton")
            ?.addEventListener("click", handleQuestionAnswer);

    } else {
        const buttons = card.querySelectorAll(".buttons button");

        buttons.forEach(button => {
            button.addEventListener("click", () => handleAnswer(button));
        });
    }

    const personalExperienceButtons = card.querySelectorAll(
        ".personal-experience-option"
    );

    personalExperienceButtons.forEach(button => {
        button.addEventListener("click", () => {
            personalExperienceButtons.forEach(item => {
                item.removeAttribute("data-selected");
                item.style.background = "#171719";
                item.style.color = "white";
            });

            button.setAttribute("data-selected", "true");
            button.style.background = "#fff";
            button.style.color = "#111";
        });
    });

    if (situation.type === "QUESTION") {
        renderQuestionAnswers(situation.id);
    }

    renderComments(situation.id);
}


const flaggedBrowserId = localStorage.getItem("flaggedBrowserId") || crypto.randomUUID();
localStorage.setItem("flaggedBrowserId", flaggedBrowserId);

let answeredQuestionIds = new Set();
let pendingAnswer = null;
let pendingPersonalExperience = null;
let pendingAnswerSelection = null;

async function loadAnsweredQuestionIds() {
    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    let votes = [];
    let textAnswers = [];

    if (user) {
        // Для авторизованного пользователя учитываем:
        // 1. ответы этого аккаунта
        // 2. старые ответы этого браузера
        const { data: userVotes, error: userVotesError } = await supabaseClient
            .from("votes")
            .select("question_id")
            .eq("user_id", user.id);

        if (userVotesError) {
            console.error(
                "Flagged: ошибка загрузки ответов пользователя:",
                userVotesError
            );
            answeredQuestionIds = new Set();
            return;
        }

        const { data: browserVotes, error: browserVotesError } =
            await supabaseClient
                .from("votes")
                .select("question_id")
                .eq("browser_id", flaggedBrowserId);

        if (browserVotesError) {
            console.error(
                "Flagged: ошибка загрузки ответов браузера:",
                browserVotesError
            );
            answeredQuestionIds = new Set();
            return;
        }

        votes = [
            ...(userVotes || []),
            ...(browserVotes || [])
        ];

        const { data: userTextAnswers, error: userTextAnswersError } =
            await supabaseClient
                .from("question_answers")
                .select("question_id")
                .eq("user_id", user.id);

        if (userTextAnswersError) {
            console.error(
                "Flagged: ошибка загрузки текстовых ответов пользователя:",
                userTextAnswersError
            );
        } else {
            textAnswers.push(...(userTextAnswers || []));
        }

        const {
            data: browserTextAnswers,
            error: browserTextAnswersError
        } = await supabaseClient
            .from("question_answers")
            .select("question_id")
            .eq("browser_id", flaggedBrowserId);

        if (browserTextAnswersError) {
            console.error(
                "Flagged: ошибка загрузки текстовых ответов браузера:",
                browserTextAnswersError
            );
        } else {
            textAnswers.push(...(browserTextAnswers || []));
        }
    } else {
        // Для гостя история остаётся привязанной к браузеру.
        const { data, error } = await supabaseClient
            .from("votes")
            .select("question_id")
            .eq("browser_id", flaggedBrowserId);

        if (error) {
            console.error(
                "Flagged: ошибка загрузки отвеченных вопросов:",
                error
            );
            answeredQuestionIds = new Set();
            return;
        }

        votes = data || [];

        const {
            data: browserTextAnswers,
            error: browserTextAnswersError
        } = await supabaseClient
            .from("question_answers")
            .select("question_id")
            .eq("browser_id", flaggedBrowserId);

        if (browserTextAnswersError) {
            console.error(
                "Flagged: ошибка загрузки текстовых ответов браузера:",
                browserTextAnswersError
            );
        } else {
            textAnswers = browserTextAnswers || [];
        }
    }

    answeredQuestionIds = new Set([
        ...votes.map(vote => Number(vote.question_id)),
        ...textAnswers.map(answer => Number(answer.question_id))
    ]);

    console.log(
        "Flagged: уже отвеченные вопросы:",
        [...answeredQuestionIds]
    );
}

function showNextUnansweredQuestion() {
    while (
        currentIndex < situations.length &&
        answeredQuestionIds.has(situations[currentIndex].id)
    ) {
        currentIndex++;
    }

    if (currentIndex >= situations.length) {
        showAllQuestionsCompleted();
    } else {
        showSituation();
    }
}

let questionAnswersSort = "newest";


function showReportReasonModal() {
    return new Promise(resolve => {
        const labels = {
            ru: {
                title: "Пожаловаться на ответ",
                subtitle: "Выберите причину жалобы",
                reasons: {
                    spam: "Спам",
                    offensive: "Оскорбление",
                    harassment: "Преследование",
                    hate: "Ненависть",
                    sexual: "Сексуальный контент",
                    other: "Другое"
                },
                cancel: "Отмена",
                report: "Пожаловаться"
            },
            pl: {
                title: "Zgłoś odpowiedź",
                subtitle: "Wybierz powód zgłoszenia",
                reasons: {
                    spam: "Spam",
                    offensive: "Obraźliwe treści",
                    harassment: "Nękanie",
                    hate: "Nienawiść",
                    sexual: "Treści seksualne",
                    other: "Inne"
                },
                cancel: "Anuluj",
                report: "Zgłoś"
            },
            en: {
                title: "Report answer",
                subtitle: "Choose a reason",
                reasons: {
                    spam: "Spam",
                    offensive: "Offensive content",
                    harassment: "Harassment",
                    hate: "Hate",
                    sexual: "Sexual content",
                    other: "Other"
                },
                cancel: "Cancel",
                report: "Report"
            }
        };

        const text = labels[language] || labels.en;

        const overlay = document.createElement("div");
        overlay.className = "report-modal-overlay";

        overlay.innerHTML = `
            <div
                class="report-modal"
                role="dialog"
                aria-modal="true"
            >
                <div class="report-modal-title">
                    ${text.title}
                </div>

                <div class="report-modal-subtitle">
                    ${text.subtitle}
                </div>

                <div class="report-modal-reasons">
                    ${Object.entries(text.reasons)
                        .map(
                            ([value, label]) => `
                                <label class="report-modal-option">
                                    <input
                                        type="radio"
                                        name="reportReason"
                                        value="${value}"
                                    >
                                    <span>${label}</span>
                                </label>
                            `
                        )
                        .join("")}
                </div>

                <div class="report-modal-actions">
                    <button
                        type="button"
                        class="report-modal-cancel"
                    >
                        ${text.cancel}
                    </button>

                    <button
                        type="button"
                        class="report-modal-submit"
                        disabled
                    >
                        ${text.report}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const modal = overlay.querySelector(".report-modal");
        const submitButton = overlay.querySelector(".report-modal-submit");
        const cancelButton = overlay.querySelector(".report-modal-cancel");
        const radios = overlay.querySelectorAll(
            'input[name="reportReason"]'
        );

        const close = value => {
            overlay.remove();
            document.removeEventListener("keydown", handleKeydown);
            resolve(value);
        };

        const handleKeydown = event => {
            if (event.key === "Escape") {
                close(null);
            }
        };

        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                submitButton.disabled = false;
            });
        });

        submitButton.addEventListener("click", () => {
            const selected = overlay.querySelector(
                'input[name="reportReason"]:checked'
            );

            close(selected ? selected.value : null);
        });

        cancelButton.addEventListener("click", () => {
            close(null);
        });

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                close(null);
            }
        });

        document.addEventListener("keydown", handleKeydown);

        overlay.classList.add("is-visible");
    });
}

async function renderQuestionAnswers(questionId) {
    const section = document.getElementById("questionAnswersSection");

    if (!section) return;

    const currentQuestion = situations.find(
        question => Number(question.id) === Number(questionId)
    );

    const situationHasPersonalExperience =
        currentQuestion?.hasPersonalExperience === true;

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    section.innerHTML = `
        <div style="margin-top:28px;">
            <button
                id="questionAnswersToggle"
                type="button"
                style="
                    width:100%;
                    text-align:left;
                    background:#171719;
                    border:1px solid #333;
                    border-radius:12px;
                    padding:14px 16px;
                    color:inherit;
                    font-size:16px;
                    cursor:pointer;
                "
            >
                <span id="questionAnswersTitle">
                    ${
                        language === "ru"
                            ? "Ответы пользователей"
                            : language === "pl"
                            ? "Odpowiedzi użytkowników"
                            : "Users' answers"
                    }
                </span>
            </button>

            <div id="questionAnswersContent" style="display:none; margin-top:14px;">
                <div class="question-answers-sort">
                    <label for="questionAnswersSort">
                        ${
                            language === "ru"
                                ? "Сортировка:"
                                : language === "pl"
                                ? "Sortowanie:"
                                : "Sort:"
                        }
                    </label>

                    <select id="questionAnswersSort">
                        <option value="newest">
                            ${
                                language === "ru"
                                    ? "Новые"
                                    : language === "pl"
                                    ? "Najnowsze"
                                    : "Newest"
                            }
                        </option>
                        <option value="oldest">
                            ${
                                language === "ru"
                                    ? "Старые"
                                    : language === "pl"
                                    ? "Najstarsze"
                                    : "Oldest"
                            }
                        </option>
                    </select>
                </div>

                <div id="questionAnswersList" style="display:flex; flex-direction:column; gap:10px;">
                    ${
                        language === "ru"
                            ? "Загрузка ответов..."
                            : language === "pl"
                            ? "Ładowanie odpowiedzi..."
                            : "Loading answers..."
                    }
                </div>
            </div>
        </div>
    `;

    const { data, error } = await supabaseClient
        .from("question_answers")
        .select("id, answer_text, user_id, is_anonymous, original_language, has_personal_experience, created_at")
        .eq("question_id", questionId)
        .eq("moderation_status", "VISIBLE")
        .order("created_at", { ascending: false });

    const list = document.getElementById("questionAnswersList");

    if (!list) return;

    if (error) {
        console.error(
            "Flagged: ошибка загрузки ответов QUESTION:",
            error
        );

        list.innerHTML = `
            <div style="opacity:0.6;">
                ${
                    language === "ru"
                        ? "Не удалось загрузить ответы."
                        : language === "pl"
                        ? "Nie udało się załadować odpowiedzi."
                        : "Could not load answers."
                }
            </div>
        `;

        return;
    }

    const answers = data || [];

    const answersToggle = document.getElementById("questionAnswersToggle");
    const answersContent = document.getElementById("questionAnswersContent");

    if (answersToggle && answersContent) {
        answersToggle.addEventListener("click", () => {
            const isOpen = answersContent.style.display !== "none";

            answersContent.style.display = isOpen ? "none" : "block";

            const title = document.getElementById("questionAnswersTitle");

            if (title) {
                title.textContent =
                    language === "ru"
                        ? `Ответы пользователей · ${answers.length} ${isOpen ? "▶" : "▼"}`
                        : language === "pl"
                        ? `Odpowiedzi użytkowników · ${answers.length} ${isOpen ? "▶" : "▼"}`
                        : `Users' answers · ${answers.length} ${isOpen ? "▶" : "▼"}`;
            }
        });
    }

    const sortSelect = document.getElementById("questionAnswersSort");

    if (sortSelect) {
        sortSelect.value = questionAnswersSort;

        sortSelect.addEventListener("change", event => {
            questionAnswersSort = event.target.value;
            renderQuestionAnswers(questionId);
        });
    }

    const selectedSort = questionAnswersSort;

    const sortedAnswers = [...answers].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();

        return selectedSort === "oldest"
            ? dateA - dateB
            : dateB - dateA;
    });

    const title = document.getElementById("questionAnswersTitle");

    if (title) {
        title.textContent =
            language === "ru"
                ? `Ответы пользователей · ${answers.length} ▶`
                : language === "pl"
                ? `Odpowiedzi użytkowników · ${answers.length} ▶`
                : `Users' answers · ${answers.length} ▶`;
    }

    if (answers.length === 0) {
        list.innerHTML = `
            <div style="opacity:0.6;">
                ${
                    language === "ru"
                        ? "Пока нет ответов."
                        : language === "pl"
                        ? "Brak odpowiedzi."
                        : "No answers yet."
                }
            </div>
        `;

        return;
    }

    const userIds = [
        ...new Set(
            answers
                .map(answer => answer.user_id)
                .filter(Boolean)
        )
    ];

    let profilesMap = new Map();

    if (userIds.length > 0) {
        const { data: profiles, error: profilesError } =
            await supabaseClient
                .from("profiles")
                .select("id, display_name, username")
                .in("id", userIds);

        if (profilesError) {
            console.error(
                "Flagged: ошибка загрузки профилей ответов QUESTION:",
                profilesError
            );
        } else {
            profilesMap = new Map(
                (profiles || []).map(profile => [
                    String(profile.id),
                    profile
                ])
            );
        }
    }

    const escapeHtml = value =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const anonymousLabel =
        language === "ru"
            ? "Аноним"
            : language === "pl"
            ? "Anonim"
            : "Anonymous";

    const guestLabel =
        language === "ru"
            ? "Гость"
            : language === "pl"
            ? "Gość"
            : "Guest";

    const visibleAnswersCount = 3;

    list.innerHTML = sortedAnswers
        .map((answer, index) => {
            let authorName = guestLabel;

            if (answer.is_anonymous) {
                authorName = anonymousLabel;
            } else if (answer.user_id) {
                const profile = profilesMap.get(String(answer.user_id));

                authorName =
                    profile?.display_name?.trim() ||
                    profile?.username?.trim() ||
                    anonymousLabel;
            }

            const hiddenClass =
                index >= visibleAnswersCount
                    ? " question-answer-hidden"
                    : "";

            const personalExperienceLabel =
                situationHasPersonalExperience &&
                answer.has_personal_experience !== null
                    ? answer.has_personal_experience
                        ? (
                            language === "ru"
                                ? "✓ Личный опыт"
                                : language === "pl"
                                ? "✓ Osobiste doświadczenie"
                                : "✓ Personal experience"
                          )
                        : (
                            language === "ru"
                                ? "Моё мнение"
                                : language === "pl"
                                ? "Moja opinia"
                                : "My opinion"
                          )
                    : "";

            return `
                <div class="question-answer-card${hiddenClass}">
                    <div class="question-answer-author">
                        ${escapeHtml(authorName)}
                    </div>

                    ${
                        personalExperienceLabel
                            ? `
                                <div
                                    style="
                                        margin-top:4px;
                                        margin-bottom:8px;
                                        font-size:12px;
                                        opacity:0.75;
                                    "
                                >
                                    ${personalExperienceLabel}
                                </div>
                            `
                            : ""
                    }

                    <div
                        class="question-answer-text"
                        data-question-answer-text
                    >
                        ${escapeHtml(answer.answer_text)}
                    </div>

                    <div class="question-answer-actions">
                        <button
                            type="button"
                            class="translate-question-answer-button"
                            data-answer-id="${answer.id}"
                        >
                            ${
                                language === "ru"
                                    ? "Перевести"
                                    : language === "pl"
                                    ? "Przetłumacz"
                                    : "Translate"
                            }
                        </button>

                        ${
                            user && answer.user_id === user.id
                                ? `
                                    <button
                                        type="button"
                                        class="delete-question-answer-button"
                                        data-answer-id="${answer.id}"
                                    >
                                        ${
                                            language === "ru"
                                                ? "Удалить"
                                                : language === "pl"
                                                ? "Usuń"
                                                : "Delete"
                                        }
                                    </button>
                                `
                                : user
                                ? `
                                    <button
                                        type="button"
                                        class="report-question-answer-button"
                                        data-answer-id="${answer.id}"
                                    >
                                        ${
                                            language === "ru"
                                                ? "Пожаловаться"
                                                : language === "pl"
                                                ? "Zgłoś"
                                                : "Report"
                                        }
                                    </button>
                                `
                                : ""
                        }
                    </div>
                </div>
            `;
        })
        .join("");

    if (answers.length > visibleAnswersCount) {
        const showMoreButton = document.createElement("button");

        showMoreButton.type = "button";
        showMoreButton.className = "question-answers-show-more";
        showMoreButton.textContent =
            language === "ru"
                ? "Показать ещё"
                : language === "pl"
                ? "Pokaż więcej"
                : "Show more";

        showMoreButton.addEventListener("click", () => {
            list
                .querySelectorAll(".question-answer-hidden")
                .forEach(card => {
                    card.classList.remove("question-answer-hidden");
                });

            showMoreButton.remove();
        });

        list.appendChild(showMoreButton);
    }

    list.addEventListener("click", async event => {
        const deleteButton = event.target.closest(
            ".delete-question-answer-button"
        );

        if (deleteButton) {
            const answerId = Number(deleteButton.dataset.answerId);

            const answer = answers.find(
                item => Number(item.id) === answerId
            );

            if (!answer || !user || answer.user_id !== user.id) {
                return;
            }

            const confirmed = confirm(
                language === "ru"
                    ? "Удалить этот ответ?"
                    : language === "pl"
                    ? "Usunąć tę odpowiedź?"
                    : "Delete this answer?"
            );

            if (!confirmed) return;

            deleteButton.disabled = true;

            const { error: deleteError } = await supabaseClient
                .from("question_answers")
                .delete()
                .eq("id", answerId)
                .eq("user_id", user.id);

            if (deleteError) {
                console.error(
                    "Flagged: ошибка удаления ответа QUESTION:",
                    deleteError
                );

                deleteButton.disabled = false;

                alert(
                    language === "ru"
                        ? "Не удалось удалить ответ."
                        : language === "pl"
                        ? "Nie udało się usunąć odpowiedzi."
                        : "Could not delete the answer."
                );

                return;
            }

            await renderQuestionAnswers(questionId);
            return;
        }

        const reportButton = event.target.closest(
            ".report-question-answer-button"
        );

        if (reportButton) {
            const answerId = Number(reportButton.dataset.answerId);

            const answer = answers.find(
                item => Number(item.id) === answerId
            );

            if (!answer || !user || answer.user_id === user.id) {
                return;
            }

            const reason = await showReportReasonModal();

            if (!reason) return;

            reportButton.disabled = true;

            const { error: reportError } = await supabaseClient
                .from("question_answer_reports")
                .insert({
                    answer_id: answerId,
                    reporter_user_id: user.id,
                    reason: reason
                });

            if (reportError) {
                console.error(
                    "Flagged: ошибка отправки жалобы:",
                    reportError
                );

                reportButton.disabled = false;

                if (reportError.code === "23505") {
                    alert(
                        language === "ru"
                            ? "Вы уже пожаловались на этот ответ."
                            : language === "pl"
                            ? "Już zgłosiłeś tę odpowiedź."
                            : "You have already reported this answer."
                    );
                } else {
                    alert(
                        language === "ru"
                            ? "Не удалось отправить жалобу."
                            : language === "pl"
                            ? "Nie udało się wysłać zgłoszenia."
                            : "Could not submit the report."
                    );
                }

                return;
            }

            alert(
                language === "ru"
                    ? "Жалоба отправлена. Спасибо."
                    : language === "pl"
                    ? "Zgłoszenie zostało wysłane. Dziękujemy."
                    : "Report submitted. Thank you."
            );

            return;
        }

        const button = event.target.closest(
            ".translate-question-answer-button"
        );

        if (!button) return;

        const answerId = Number(button.dataset.answerId);

        const answer = answers.find(
            item => Number(item.id) === answerId
        );

        if (!answer) return;

        translateQuestionAnswer(answer, button);
    });
}


async function translateQuestionAnswer(answer, button) {
    if (!answer?.answer_text) return;

    const targetLanguage = language;
    const sourceLanguage = answer.original_language || "en";

    if (sourceLanguage === targetLanguage) {
        alert(
            language === "ru"
                ? "Ответ уже написан на вашем языке."
                : language === "pl"
                ? "Odpowiedź jest już napisana w Twoim języku."
                : "The answer is already in your language."
        );
        return;
    }

    const card = button.closest(".question-answer-card");

    if (!card) return;

    const textElement = card.querySelector(
        "[data-question-answer-text]"
    );

    if (!textElement) return;

    if (button.dataset.translated === "true") {
        textElement.textContent = answer.answer_text;

        button.dataset.translated = "false";

        button.textContent =
            language === "ru"
                ? "Перевести"
                : language === "pl"
                ? "Przetłumacz"
                : "Translate";

        return;
    }

    const originalLabel = button.textContent;

    button.disabled = true;

    button.textContent =
        language === "ru"
            ? "Перевод..."
            : language === "pl"
            ? "Tłumaczenie..."
            : "Translating...";

    try {
        const { data, error } =
            await supabaseClient.functions.invoke(
                "translate-question",
                {
                    body: {
                        text: answer.answer_text,
                        source_language: sourceLanguage,
                        target_language: targetLanguage
                    }
                }
            );

        if (error) throw error;

        if (!data?.translated_text) {
            throw new Error("Translation was not returned");
        }

        textElement.textContent =
            data.translated_text;

        button.dataset.translated = "true";

        button.textContent =
            language === "ru"
                ? "Показать оригинал"
                : language === "pl"
                ? "Pokaż oryginał"
                : "Show original";
    } catch (error) {
        console.error(
            "Flagged: ошибка перевода ответа QUESTION:",
            error
        );

        button.textContent = originalLabel;

        alert(
            language === "ru"
                ? "Не удалось перевести ответ."
                : language === "pl"
                ? "Nie udało się przetłumaczyć odpowiedzi."
                : "Could not translate the answer."
        );
    } finally {
        button.disabled = false;
    }
}


async function handleQuestionAnswer() {
    const question = situations[currentIndex];

    if (!question) {
        console.error("Flagged: текущий QUESTION не найден.");
        return;
    }

    const questionId = question.id;
    const answerInput = document.getElementById("questionAnswerText");
    const answerText = answerInput?.value.trim();

    if (!answerText) {
        alert(
            language === "ru"
                ? "Напиши ответ перед отправкой."
                : language === "pl"
                ? "Napisz odpowiedź przed wysłaniem."
                : "Write an answer before submitting."
        );
        answerInput?.focus();
        return;
    }

    try {
        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        let existingAnswer = null;

        const {
            data: browserAnswer,
            error: browserAnswerError
        } = await supabaseClient
            .from("question_answers")
            .select("id")
            .eq("question_id", questionId)
            .eq("browser_id", flaggedBrowserId)
            .maybeSingle();

        if (browserAnswerError) {
            console.error(
                "Flagged: ошибка проверки ответа QUESTION по browser_id:",
                browserAnswerError
            );
            return;
        }

        existingAnswer = browserAnswer;

        if (!existingAnswer && user) {
            const {
                data: userAnswer,
                error: userAnswerError
            } = await supabaseClient
                .from("question_answers")
                .select("id")
                .eq("question_id", questionId)
                .eq("user_id", user.id)
                .maybeSingle();

            if (userAnswerError) {
                console.error(
                    "Flagged: ошибка проверки ответа QUESTION по user_id:",
                    userAnswerError
                );
                return;
            }

            existingAnswer = userAnswer;
        }

        if (existingAnswer) {
            answeredQuestionIds.add(questionId);

            card.innerHTML = `
                <div style="font-size:20px; text-align:center; padding:40px 20px;">
                    ❤️ ${
                        language === "ru"
                            ? "Ты уже отвечал(а) на этот вопрос."
                            : language === "pl"
                            ? "Już odpowiadałeś/aś na to pytanie."
                            : "You have already answered this question."
                    }
                </div>
            `;

            setTimeout(() => {
                currentIndex++;

                if (currentIndex >= situations.length) {
                    showAllQuestionsCompleted();
                } else {
                    showSituation();
                }
            }, 700);

            return;
        }

        const detectedLanguage =
            (await detectCommentLanguage(answerText)) || language;

        const anonymousCheckbox =
            document.getElementById("questionAnswerAnonymous");

        const isAnonymous =
            anonymousCheckbox?.checked ?? false;

        const personalExperienceButton =
            document.querySelector(
                ".personal-experience-option[data-selected='true']"
            );

        let hasPersonalExperience = false;

        if (question.hasPersonalExperience) {
            if (!personalExperienceButton) {
                alert(
                    language === "ru"
                        ? "Выбери, есть ли у тебя личный опыт."
                        : language === "pl"
                        ? "Wybierz, czy masz osobiste doświadczenie."
                        : "Choose whether you have personal experience."
                );
                return;
            }

            hasPersonalExperience =
                personalExperienceButton.dataset.value === "true";
        }

        const answerPayload = {
            question_id: questionId,
            browser_id: flaggedBrowserId,
            answer_text: answerText,
            original_language: detectedLanguage,
            is_anonymous: isAnonymous,
            has_personal_experience: hasPersonalExperience
        };

        if (user) {
            answerPayload.user_id = user.id;
        }

        const { error: insertError } = await supabaseClient
            .from("question_answers")
            .insert(answerPayload);

        if (insertError) {
            if (insertError.code === "23505") {
                answeredQuestionIds.add(questionId);

                card.innerHTML = `
                    <div style="font-size:20px; text-align:center; padding:40px 20px;">
                        ❤️ ${
                            language === "ru"
                                ? "Ты уже отвечал(а) на этот вопрос."
                                : language === "pl"
                                ? "Już odpowiadałeś/aś na to pytanie."
                                : "You have already answered this question."
                        }
                    </div>
                `;

                setTimeout(() => {
                    currentIndex++;

                    if (currentIndex >= situations.length) {
                        showAllQuestionsCompleted();
                    } else {
                        showSituation();
                    }
                }, 700);

                return;
            }

            console.error(
                "Flagged: ошибка сохранения текстового ответа:",
                insertError
            );

            alert(
                language === "ru"
                    ? "Не удалось сохранить ответ."
                    : language === "pl"
                    ? "Nie udało się zapisać odpowiedzi."
                    : "The answer could not be saved."
            );

            return;
        }

        answeredQuestionIds.add(questionId);

        card.innerHTML = `
            <div style="font-size:20px; text-align:center; padding:30px 20px 10px;">
                ❤️ ${
                    language === "ru"
                        ? "Ответ сохранён!"
                        : language === "pl"
                        ? "Odpowiedź została zapisana!"
                        : "Answer saved!"
                }
            </div>

            <div id="questionAnswersSection" style="margin-top:28px;"></div>

            <div id="commentsSection" class="comments-section"></div>

            <button class="next-button" style="margin-top:28px;">
                ${
                    language === "ru"
                        ? "Дальше"
                        : language === "pl"
                        ? "Dalej"
                        : "Next"
                }
            </button>
        `;

        await renderQuestionAnswers(questionId);
        await renderComments(questionId);

        const nextButton = card.querySelector(".next-button");

        nextButton.addEventListener("click", () => {
            currentIndex++;

            if (currentIndex >= situations.length) {
                showAllQuestionsCompleted();
            } else {
                showSituation();
            }
        });
    } catch (error) {
        console.error(
            "Flagged: неожиданная ошибка сохранения QUESTION:",
            error
        );
    }
}

async function handleAnswer(button) {
    const situation = situations[currentIndex];

    if (!situation) {
        console.error("Flagged: текущий вопрос не найден.");
        return;
    }

    const questionId = situation.id;

    // Ответ выбирается через option_id.
    const optionId = Number(button?.dataset?.optionId);

    if (!optionId) {
        console.error("Flagged: не найден option_id выбранного ответа.", {
            questionId,
            button
        });
        return;
    }

    const selectedOption = situation.options?.find(
        option => Number(option.id) === optionId
    );

    if (!selectedOption) {
        console.error("Flagged: выбранный вариант не найден среди options.", {
            questionId,
            optionId
        });
        return;
    }

    // -----------------------------------------------------
    // Личный опыт для SITUATION
    // -----------------------------------------------------

    if (
        (
            situation.type === "SITUATION" ||
            (
                situation.type === "QUESTION" &&
                situation.options &&
                situation.options.length > 0
            )
        ) &&
        situation.hasPersonalExperience &&
        pendingPersonalExperience === null
    ) {
        pendingAnswerSelection = optionId;

        card.innerHTML += `
          <div style="text-align:center; margin-top:20px;">
            <div style="margin-bottom:12px; font-weight:bold;">
              ${
                situation.type === "QUESTION"
                  ? language === "ru"
                    ? "У вас есть личный опыт?"
                    : language === "pl"
                    ? "Czy masz osobiste doświadczenie?"
                    : "Do you have personal experience?"
                  : language === "ru"
                  ? "У тебя был личный опыт этой ситуации?"
                  : language === "pl"
                  ? "Czy masz osobiste doświadczenie w tej sytuacji?"
                  : "Have you personally experienced this situation?"
              }
            </div>

            <button id="personalExperienceYes"
              style="width:100%; padding:14px; margin-top:6px; border:none; border-radius:10px; background:#237a3b; color:white; font-weight:bold; cursor:pointer;">
              ${
                language === "ru"
                  ? "ДА, БЫЛ ОПЫТ"
                  : language === "pl"
                  ? "TAK, MAM TAKIE DOŚWIADCZENIE"
                  : "YES, I HAVE"
              }
            </button>

            <button id="personalExperienceNo"
              style="width:100%; padding:14px; margin-top:8px; border:none; border-radius:10px; background:#555; color:white; font-weight:bold; cursor:pointer;">
              ${
                language === "ru"
                  ? "НЕТ, ТОЛЬКО МОЁ МНЕНИЕ"
                  : language === "pl"
                  ? "NIE, TO TYLKO MOJA OPINIA"
                  : "NO, JUST MY OPINION"
              }
            </button>
          </div>
        `;

        const continueAnswer = (experience) => {
            pendingPersonalExperience = experience;

            const selectedId = pendingAnswerSelection;

            handleAnswer({
                dataset: {
                    optionId: String(selectedId)
                }
            });
        };

        document
            .getElementById("personalExperienceYes")
            .addEventListener("click", () => continueAnswer(true));

        document
            .getElementById("personalExperienceNo")
            .addEventListener("click", () => continueAnswer(false));

        return;
    }

    // -----------------------------------------------------
    // Личный опыт используется только для SITUATION.
    // Для QUESTION значение всегда false.
    // -----------------------------------------------------

    const experienceValue =
        pendingPersonalExperience ?? false;

    try {
        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        // Для авторизованного пользователя защита идёт по user_id.
        // Для гостя — по browser_id.
        let existingVoteQuery = supabaseClient
            .from("votes")
            .select("id")
            .eq("question_id", questionId);

        if (user) {
            existingVoteQuery = existingVoteQuery.eq("user_id", user.id);
        } else {
            existingVoteQuery = existingVoteQuery.eq(
                "browser_id",
                flaggedBrowserId
            );
        }

        const { data: existingVote, error: existingVoteError } =
            await existingVoteQuery.maybeSingle();

        if (existingVoteError) {
            console.error(
                "Flagged: ошибка проверки существующего голоса:",
                existingVoteError
            );
            return;
        }

        if (!existingVote) {
            const voteData = {
                question_id: questionId,
                option_id: optionId,
                browser_id: flaggedBrowserId,
                has_personal_experience: experienceValue
            };

            if (user) {
                voteData.user_id = user.id;
            }

            const { error: voteError } = await supabaseClient
                .from("votes")
                .insert(voteData);

            if (voteError) {
                if (voteError.code === "23505") {
                    console.log(
                        "Flagged: этот браузер уже голосовал за этот вопрос."
                    );

                    answeredQuestionIds.add(questionId);

                    card.innerHTML = `
                        <div style="font-size:20px; text-align:center; padding:40px 20px;">
                            ❤️ ${
                                language === "ru"
                                    ? "Вы уже отвечали на этот вопрос."
                                    : language === "pl"
                                    ? "Już odpowiadałeś na to pytanie."
                                    : "You have already answered this question."
                            }
                        </div>
                    `;

                    setTimeout(() => {
                        nextStep();
                    }, 700);

                    return;
                }

                console.error(
                    "Flagged: ошибка сохранения голоса:",
                    voteError
                );
                return;
            }

            console.log("Flagged: голос сохранён", {
                questionId,
                optionId,
                answer: selectedOption[language],
                hasPersonalExperience: experienceValue
            });
        } else {
            console.log(
                "Flagged: вопрос уже был отвечен — показываем результаты."
            );
        }

        answeredQuestionIds.add(questionId);

        // -------------------------------------------------
        // Загружаем все голоса и считаем каждый option отдельно.
        // -------------------------------------------------

        const { data: votes, error: votesError } =
            await supabaseClient
                .from("votes")
                .select("option_id, has_personal_experience")
                .eq("question_id", questionId);

        if (votesError) {
            console.error(
                "Flagged: ошибка загрузки результатов:",
                votesError
            );
            return;
        }

        const counts = {};

        situation.options.forEach(option => {
            counts[option.id] = 0;
        });

        votes.forEach(vote => {
            if (counts[vote.option_id] !== undefined) {
                counts[vote.option_id]++;
            }
        });

        const totalVotes = votes.length;

        const experienceVotes = votes.filter(
            vote => vote.has_personal_experience === true
        ).length;

        const opinionVotes = votes.filter(
            vote => vote.has_personal_experience === false
        ).length;

        const experiencePercentage = totalVotes
            ? Math.round((experienceVotes / totalVotes) * 100)
            : 0;

        const opinionPercentage = totalVotes
            ? Math.round((opinionVotes / totalVotes) * 100)
            : 0;

        // -------------------------------------------------
        // Универсальные результаты для QUESTION и SITUATION.
        // -------------------------------------------------

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

          <div class="answer-results">
            ${situation.options
                .map(option => {
                    const count = counts[option.id] || 0;
                    const percentage = totalVotes
                        ? Math.round((count / totalVotes) * 100)
                        : 0;

                    return `
                      <div style="margin:14px 0;">
                        <div style="display:flex; justify-content:space-between; gap:10px; margin-bottom:6px;">
                          <span>${option[language]}</span>
                          <strong>${percentage}%</strong>
                        </div>

                        <div style="width:100%; height:10px; background:rgba(255,255,255,0.12); border-radius:6px; overflow:hidden;">
                          <div style="width:${percentage}%; height:100%; background:#fff; border-radius:6px;"></div>
                        </div>
                      </div>
                    `;
                })
                .join("")}
          </div>

          ${
            situation.type === "SITUATION" &&
            situation.hasPersonalExperience &&
            totalVotes > 0
              ? `
                <div
                  style="
                    margin-top:24px;
                    padding-top:18px;
                    border-top:1px solid rgba(255,255,255,0.12);
                  "
                >
                  <div
                    style="
                      font-weight:bold;
                      margin-bottom:12px;
                    "
                  >
                    ${
                      language === "ru"
                        ? "Личный опыт и мнение"
                        : language === "pl"
                        ? "Osobiste doświadczenie i opinia"
                        : "Personal experience and opinion"
                    }
                  </div>

                  <div
                    style="
                      display:flex;
                      justify-content:space-between;
                      gap:12px;
                      margin-bottom:8px;
                    "
                  >
                    <span>
                      ${
                        language === "ru"
                          ? "Личный опыт"
                          : language === "pl"
                          ? "Osobiste doświadczenie"
                          : "Personal experience"
                      }
                    </span>

                    <strong>${experiencePercentage}%</strong>
                  </div>

                  <div
                    style="
                      width:100%;
                      height:8px;
                      background:rgba(255,255,255,0.12);
                      border-radius:5px;
                      overflow:hidden;
                      margin-bottom:14px;
                    "
                  >
                    <div
                      style="
                        width:${experiencePercentage}%;
                        height:100%;
                        background:#ffffff;
                        border-radius:5px;
                      "
                    ></div>
                  </div>

                  <div
                    style="
                      display:flex;
                      justify-content:space-between;
                      gap:12px;
                      margin-bottom:8px;
                    "
                  >
                    <span>
                      ${
                        language === "ru"
                          ? "Мнение"
                          : language === "pl"
                          ? "Opinia"
                          : "Opinion"
                      }
                    </span>

                    <strong>${opinionPercentage}%</strong>
                  </div>

                  <div
                    style="
                      width:100%;
                      height:8px;
                      background:rgba(255,255,255,0.12);
                      border-radius:5px;
                      overflow:hidden;
                    "
                  >
                    <div
                      style="
                        width:${opinionPercentage}%;
                        height:100%;
                        background:#ffffff;
                        border-radius:5px;
                      "
                    ></div>
                  </div>
                </div>
              `
              : ""
          }

          <button class="next-button" style="margin-top:20px;">
            ${
                language === "ru"
                    ? "Дальше"
                    : language === "pl"
                    ? "Dalej"
                    : "Next"
            }
          </button>

          <div id="commentsSection" class="comments-section"></div>
        `;

        await renderComments(questionId);

        const nextButton = card.querySelector(".next-button");

        nextButton.addEventListener("click", () => {
            pendingAnswerSelection = null;
            pendingPersonalExperience = null;
            nextStep();
        });

    } catch (error) {
        console.error("Flagged: ошибка:", error);
    }
}
function nextStep() {
    currentIndex++;
    showNextUnansweredQuestion();
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


function showAllQuestionsCompleted() {
    const noQuestions = situations.length === 0;

    const messages = noQuestions
        ? {
            ru: {
                title: selectedCategorySlug === "all"
                    ? "Пока нет опубликованных вопросов"
                    : "В этой категории пока нет вопросов",
                text: selectedCategorySlug === "all"
                    ? "Новые вопросы появятся здесь позже."
                    : "Попробуйте выбрать другую категорию.",
                back: "Выбрать другую категорию"
            },
            pl: {
                title: selectedCategorySlug === "all"
                    ? "Brak opublikowanych pytań"
                    : "W tej kategorii nie ma jeszcze pytań",
                text: selectedCategorySlug === "all"
                    ? "Nowe pytania pojawią się tutaj później."
                    : "Spróbuj wybrać inną kategorię.",
                back: "Wybierz inną kategorię"
            },
            en: {
                title: selectedCategorySlug === "all"
                    ? "No published questions yet"
                    : "There are no questions in this category yet",
                text: selectedCategorySlug === "all"
                    ? "New questions will appear here later."
                    : "Try choosing another category.",
                back: "Choose another category"
            }
        }
        : {
            ru: {
                title: "Все доступные вопросы пройдены",
                text: "Ты уже ответил(а) на все доступные вопросы. Новые вопросы появятся здесь позже.",
                back: "Выбрать другую категорию"
            },
            pl: {
                title: "Wszystkie dostępne pytania zostały ukończone",
                text: "Odpowiedziałeś już na wszystkie dostępne pytania. Nowe pytania pojawią się tutaj później.",
                back: "Wybierz inną kategorię"
            },
            en: {
                title: "All available questions completed",
                text: "You have already answered all available questions. New questions will appear here later.",
                back: "Choose another category"
            }
        };

    const message = (messages[language] || messages.en);

    card.innerHTML = `
        <div class="category">🚩 FLAGGED</div>

        <div style="font-size: 32px; margin: 25px 0;">
            ${message.title}
        </div>

        <div style="font-size: 18px; line-height: 1.6; color: #999; margin-bottom: 25px;">
            ${message.text}
        </div>

        <button id="backToCategoriesButton"
            type="button"
            style="
                width:100%;
                padding:14px 16px;
                margin-top:6px;
                border-radius:12px;
                border:1px solid #444;
                background:transparent;
                color:#f4f4f7;
                font-size:15px;
                font-weight:600;
                cursor:pointer;
            "
        >
            ${message.back}
        </button>
    `;

    document
        .getElementById("backToCategoriesButton")
        .addEventListener("click", showCategoryScreen);
}

async function restartGame() {
    currentIndex = 0;
    score = 0;

    await loadAnsweredQuestionIds();

    if (answeredQuestionIds.size >= situations.length) {
        showAllQuestionsCompleted();
    } else {
        showNextUnansweredQuestion();
    }
}


createLanguageSelector();
updateHeader();
showStartScreen();
updateAuthButtons();
addShareButton();


async function loadComments(questionId) {
    const { data, error } = await supabaseClient
        .from("comments")
        .select("id, question_id, parent_comment_id, created_by, body, original_language, created_at, is_anonymous")
        .eq("question_id", questionId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Flagged: ошибка загрузки комментариев:", error);
        return [];
    }

    const comments = data || [];

    if (comments.length === 0) {
        return [];
    }

    const userIds = [
        ...new Set(
            comments
                .map(comment => comment.created_by)
                .filter(Boolean)
        )
    ];

    if (userIds.length === 0) {
        return comments;
    }

    const { data: profiles, error: profilesError } = await supabaseClient
        .from("profiles")
        .select("id, username, display_name, avatar_url, is_anonymous")
        .in("id", userIds);

    if (profilesError) {
        console.error(
            "Flagged: ошибка загрузки профилей комментариев:",
            profilesError
        );
        return comments;
    }

    const profilesMap = new Map(
        (profiles || []).map(profile => [
            String(profile.id),
            profile
        ])
    );

    return comments.map(comment => ({
        ...comment,
        profile: profilesMap.get(String(comment.created_by)) || null
    }));
}

async function renderComments(questionId) {
    const section = document.getElementById("commentsSection");

    if (!section) return;

    let commentAnonymousDefault = false;

    const {
        data: { user: commentUser }
    } = await supabaseClient.auth.getUser();

    if (commentUser) {
        const { data: commentProfile, error: commentProfileError } =
            await supabaseClient
                .from("profiles")
                .select("is_anonymous")
                .eq("id", commentUser.id)
                .maybeSingle();

        if (commentProfileError) {
            console.error(
                "Flagged: ошибка загрузки настройки анонимности комментария:",
                commentProfileError
            );
        } else {
            commentAnonymousDefault =
                commentProfile?.is_anonymous === true;
        }
    }

    section.innerHTML = `
        <div style="margin-top:28px;">
            <button
                id="commentsToggle"
                type="button"
                style="
                    width:100%;
                    text-align:left;
                    background:#171719;
                    border:1px solid #333;
                    border-radius:12px;
                    padding:14px 16px;
                    color:inherit;
                    font-size:16px;
                    cursor:pointer;
                "
            >
                <span id="commentsTitle">
                    ${
                        language === "ru"
                            ? "Обсуждение"
                            : language === "pl"
                            ? "Dyskusja"
                            : "Discussion"
                    }
                </span>
            </button>

            <div id="commentsContent" style="display:none; margin-top:14px;">

            <textarea
                id="newCommentText"
                placeholder="${
                    language === "ru"
                        ? "Напишите свой комментарий..."
                        : language === "pl"
                        ? "Napisz komentarz..."
                        : "Write a comment..."
                }"
                style="
                    width:100%;
                    min-height:90px;
                    padding:12px;
                    border-radius:10px;
                    border:1px solid #444;
                    background:#18181b;
                    color:#f4f4f7;
                    resize:vertical;
                    box-sizing:border-box;
                "
            ></textarea>

            <label
                style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    margin-top:10px;
                    font-size:13px;
                    cursor:pointer;
                "
            >
                <input
                    type="checkbox"
                    id="newCommentAnonymous"
                    ${commentAnonymousDefault ? "checked" : ""}
                >
                ${
                    language === "ru"
                        ? "Написать анонимно"
                        : language === "pl"
                        ? "Napisz anonimowo"
                        : "Post anonymously"
                }
            </label>

            <button
                id="addCommentButton"
                type="button"
                style="
                    width:100%;
                    margin-top:10px;
                    padding:12px;
                    border:none;
                    border-radius:10px;
                    background:#f4f4f7;
                    color:#111;
                    cursor:pointer;
                    font-weight:600;
                "
            >
                ${
                    language === "ru"
                        ? "Добавить комментарий"
                        : language === "pl"
                        ? "Dodaj komentarz"
                        : "Add comment"
                }
            </button>

            <div id="commentsList" style="margin-top:18px;">
                ${
                    language === "ru"
                        ? "Загрузка комментариев..."
                        : language === "pl"
                        ? "Ładowanie komentarzy..."
                        : "Loading comments..."
                }
            </div>

            </div>
        </div>
    `;

    const comments = await loadComments(questionId);

    const commentsToggle = document.getElementById("commentsToggle");
    const commentsContent = document.getElementById("commentsContent");
    const commentsTitle = document.getElementById("commentsTitle");

    if (commentsTitle) {
        commentsTitle.textContent =
            language === "ru"
                ? `Обсуждение · ${comments.length} ▶`
                : language === "pl"
                ? `Dyskusja · ${comments.length} ▶`
                : `Discussion · ${comments.length} ▶`;
    }

    if (commentsToggle && commentsContent) {
        commentsToggle.addEventListener("click", () => {
            const isOpen = commentsContent.style.display !== "none";

            commentsContent.style.display = isOpen ? "none" : "block";

            if (commentsTitle) {
                commentsTitle.textContent =
                    language === "ru"
                        ? `Обсуждение · ${comments.length} ${isOpen ? "▶" : "▼"}`
                        : language === "pl"
                        ? `Dyskusja · ${comments.length} ${isOpen ? "▶" : "▼"}`
                        : `Discussion · ${comments.length} ${isOpen ? "▶" : "▼"}`;
            }

            if (!isOpen) {
                setTimeout(() => {
                    commentsContent.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }, 50);
            }
        });
    }

    const list = document.getElementById("commentsList");

    if (!list) return;

    if (comments.length === 0) {
        list.innerHTML = `
            <div style="opacity:0.6;">
                ${
                    language === "ru"
                        ? "Пока нет комментариев."
                        : language === "pl"
                        ? "Brak komentarzy."
                        : "No comments yet."
                }
            </div>
        `;
    } else {
        const renderComment = (comment, depth = 0) => {
            const children = comments.filter(
                item =>
                    Number(item.parent_comment_id) === Number(comment.id)
            );

            return `
                <div
                    class="comment-card"
                    data-comment-id="${comment.id}"
                    style="
                        margin-top:12px;
                        margin-left:${depth * 24}px;
                        padding:14px;
                        border:1px solid #333;
                        border-radius:12px;
                        background:#18181b;
                    "
                >
                    <div
                        style="
                            font-size:13px;
                            font-weight:600;
                            margin-bottom:6px;
                        "
                    >
                        ${
                            comment.is_anonymous
                                ? (
                                    language === "ru"
                                        ? "Аноним"
                                        : language === "pl"
                                        ? "Anonim"
                                        : "Anonymous"
                                )
                                : (
                                    comment.profile?.display_name ||
                                    comment.profile?.username ||
                                    (
                                        language === "ru"
                                            ? "Аноним"
                                            : language === "pl"
                                            ? "Anonim"
                                            : "Anonymous"
                                    )
                                )
                        }
                    </div>

                    <div
                        data-comment-text
                        style="
                            font-size:14px;
                            line-height:1.5;
                        "
                    >
                        ${comment.body}
                    </div>

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;
                            flex-wrap:wrap;
                            margin-top:10px;
                        "
                    >
                        <button
                            type="button"
                            class="reply-comment-button"
                            data-comment-id="${comment.id}"
                            style="
                                padding:6px 10px;
                                border:1px solid #444;
                                border-radius:8px;
                                background:transparent;
                                color:#f4f4f7;
                                cursor:pointer;
                                font-size:12px;
                            "
                        >
                            ${
                                language === "ru"
                                    ? "Ответить"
                                    : language === "pl"
                                    ? "Odpowiedz"
                                    : "Reply"
                            }
                        </button>

                        <div
                            style="
                                font-size:12px;
                                opacity:0.55;
                            "
                        >
                            ${new Date(comment.created_at).toLocaleString(
                                language === "ru"
                                    ? "ru-RU"
                                    : language === "pl"
                                    ? "pl-PL"
                                    : "en-GB"
                            )}
                        </div>

                        <button
                            type="button"
                            class="translate-comment-button"
                            data-comment-id="${comment.id}"
                            style="
                                margin-left:auto;
                                padding:6px 10px;
                                border:1px solid #444;
                                border-radius:8px;
                                background:transparent;
                                color:#f4f4f7;
                                cursor:pointer;
                                font-size:12px;
                            "
                        >
                            ${
                                language === "ru"
                                    ? "Перевести"
                                    : language === "pl"
                                    ? "Przetłumacz"
                                    : "Translate"
                            }
                        </button>
                    </div>

                    ${
                        children.length
                            ? children
                                  .map(child =>
                                      renderComment(
                                          child,
                                          depth + 1
                                      )
                                  )
                                  .join("")
                            : ""
                    }
                </div>
            `;
        };

        const topLevelComments = comments.filter(
            comment => !comment.parent_comment_id
        );

        list.innerHTML = topLevelComments
            .map(comment => renderComment(comment))
            .join("");
    }

    document
        .getElementById("addCommentButton")
        ?.addEventListener("click", () => {
            const anonymousCheckbox =
                document.getElementById("newCommentAnonymous");

            const isAnonymous = anonymousCheckbox?.checked === true;

            addComment(
                questionId,
                null,
                null,
                isAnonymous
            );
        });

    document
        .getElementById("commentsList")
        ?.addEventListener("click", event => {
            const translateButton = event.target.closest(
                ".translate-comment-button"
            );

            if (translateButton) {
                const commentId = Number(
                    translateButton.dataset.commentId
                );

                const comment = comments.find(
                    item => Number(item.id) === commentId
                );

                if (!comment) return;

                translateComment(comment, translateButton);
                return;
            }

            const replyButton = event.target.closest(
                ".reply-comment-button"
            );

            if (replyButton) {
                const commentId = Number(
                    replyButton.dataset.commentId
                );

                showReplyForm(questionId, commentId);
            }
        });

    const discussionParams = new URLSearchParams(
        window.location.search
    );

    if (discussionParams.get("discussion") === "1") {
        setTimeout(() => {
            document
                .getElementById("commentsSection")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }, 100);
    }
}

async function addComment(
    questionId,
    parentCommentId = null,
    commentBody = null,
    isAnonymous = false
) {
    const textarea = document.getElementById("newCommentText");

    const body = (
        commentBody !== null
            ? commentBody
            : textarea?.value || ""
    ).trim();

    if (!body) {
        alert(
            language === "ru"
                ? "Напиши комментарий."
                : language === "pl"
                ? "Napisz komentarz."
                : "Write a comment."
        );
        return;
    }

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert(
            language === "ru"
                ? "Чтобы написать комментарий, нужно войти в аккаунт."
                : language === "pl"
                ? "Aby dodać komentarz, musisz się zalogować."
                : "You need to sign in to add a comment."
        );
        return;
    }

    const detectedLanguage = (await detectCommentLanguage(body)) || language;

    const { error } = await supabaseClient
        .from("comments")
        .insert({
            question_id: questionId,
            parent_comment_id: parentCommentId,
            created_by: user.id,
            body,
            original_language: detectedLanguage,
            is_anonymous: isAnonymous
        });

    if (error) {
        console.error("Flagged: ошибка добавления комментария:", error);

        alert(
            language === "ru"
                ? "Не удалось добавить комментарий."
                : language === "pl"
                ? "Nie udało się dodać komentarza."
                : "The comment could not be added."
        );

        return;
    }

    if (commentBody === null && textarea) {
        textarea.value = "";
    }

    await renderComments(questionId);

    document.getElementById("commentsToggle")?.click();
}

async function showReplyForm(questionId, parentCommentId) {
    const commentCard = document.querySelector(
        `.comment-card[data-comment-id="${parentCommentId}"]`
    );

    if (!commentCard) return;

    if (commentCard.querySelector(".reply-comment-form")) {
        return;
    }

    let replyAnonymousDefault = false;

    const {
        data: { user: replyUser }
    } = await supabaseClient.auth.getUser();

    if (replyUser) {
        const { data: replyProfile, error: replyProfileError } =
            await supabaseClient
                .from("profiles")
                .select("is_anonymous")
                .eq("id", replyUser.id)
                .maybeSingle();

        if (replyProfileError) {
            console.error(
                "Flagged: ошибка загрузки настройки анонимности ответа:",
                replyProfileError
            );
        } else {
            replyAnonymousDefault =
                replyProfile?.is_anonymous === true;
        }
    }

    const form = document.createElement("div");

    form.className = "reply-comment-form";

    form.style.marginTop = "12px";

    form.innerHTML = `
        <textarea
            class="reply-comment-text"
            placeholder="${
                language === "ru"
                    ? "Напишите ответ..."
                    : language === "pl"
                    ? "Napisz odpowiedź..."
                    : "Write a reply..."
            }"
            style="
                width:100%;
                min-height:70px;
                padding:10px;
                border-radius:10px;
                border:1px solid #444;
                background:#18181b;
                color:#f4f4f7;
                resize:vertical;
                box-sizing:border-box;
            "
        ></textarea>

        <label
            style="
                display:flex;
                align-items:center;
                gap:8px;
                margin-top:8px;
                font-size:13px;
                cursor:pointer;
            "
        >
            <input
                type="checkbox"
                class="reply-comment-anonymous"
                ${replyAnonymousDefault ? "checked" : ""}
            >
            ${
                language === "ru"
                    ? "Ответить анонимно"
                    : language === "pl"
                    ? "Odpowiedz anonimowo"
                    : "Reply anonymously"
            }
        </label>

        <div
            style="
                display:flex;
                gap:8px;
                margin-top:8px;
            "
        >
            <button
                type="button"
                class="submit-reply-button"
                style="
                    flex:1;
                    padding:10px;
                    border:none;
                    border-radius:8px;
                    background:#f4f4f7;
                    color:#111;
                    cursor:pointer;
                    font-weight:600;
                "
            >
                ${
                    language === "ru"
                        ? "Отправить"
                        : language === "pl"
                        ? "Wyślij"
                        : "Send"
                }
            </button>

            <button
                type="button"
                class="cancel-reply-button"
                style="
                    padding:10px 14px;
                    border:1px solid #444;
                    border-radius:8px;
                    background:transparent;
                    color:#f4f4f7;
                    cursor:pointer;
                "
            >
                ${
                    language === "ru"
                        ? "Отмена"
                        : language === "pl"
                        ? "Anuluj"
                        : "Cancel"
                }
            </button>
        </div>
    `;

    commentCard.appendChild(form);

    form
        .querySelector(".cancel-reply-button")
        ?.addEventListener("click", () => {
            form.remove();
        });

    form
        .querySelector(".submit-reply-button")
        ?.addEventListener("click", async () => {
            const replyText = form
                .querySelector(".reply-comment-text")
                ?.value
                .trim();

            if (!replyText) return;

            const replyAnonymous =
                form
                    .querySelector(".reply-comment-anonymous")
                    ?.checked ?? false;

            await addComment(
                questionId,
                parentCommentId,
                replyText,
                replyAnonymous
            );
        });
}

async function translateComment(comment, button) {
    if (!comment?.body) return;

    const targetLanguage = language;
    const sourceLanguage = comment.original_language || "en";

    if (sourceLanguage === targetLanguage) {
        alert(
            language === "ru"
                ? "Комментарий уже написан на вашем языке."
                : language === "pl"
                ? "Komentarz jest już napisany w Twoim języku."
                : "The comment is already in your language."
        );
        return;
    }

    const card = button.closest(".comment-card");

    if (!card) return;

    const textElement = card.querySelector(
        "[data-comment-text]"
    );

    if (!textElement) return;

    // Если перевод уже показан — возвращаем оригинал.
    if (button.dataset.translated === "true") {
        textElement.textContent = comment.body;

        button.dataset.translated = "false";

        button.textContent =
            language === "ru"
                ? "Перевести"
                : language === "pl"
                ? "Przetłumacz"
                : "Translate";

        return;
    }

    const originalLabel = button.textContent;

    button.disabled = true;

    button.textContent =
        language === "ru"
            ? "Перевод..."
            : language === "pl"
            ? "Tłumaczenie..."
            : "Translating...";

    try {
        const { data, error } =
            await supabaseClient.functions.invoke(
                "translate-question",
                {
                    body: {
                        text: comment.body,
                        source_language: sourceLanguage,
                        target_language: targetLanguage
                    }
                }
            );

        if (error) throw error;

        if (!data?.translated_text) {
            throw new Error("Translation was not returned");
        }

        textElement.textContent =
            data.translated_text;

        button.dataset.translated = "true";

        button.textContent =
            language === "ru"
                ? "Показать оригинал"
                : language === "pl"
                ? "Pokaż oryginał"
                : "Show original";

    } catch (error) {
        console.error(
            "Flagged: ошибка перевода комментария:",
            error
        );

        button.textContent = originalLabel;

        alert(
            language === "ru"
                ? "Не удалось перевести комментарий."
                : language === "pl"
                ? "Nie udało się przetłumaczyć komentarza."
                : "Could not translate the comment."
        );
    } finally {
        button.disabled = false;
    }
}

async function detectCommentLanguage(text) {
    const normalizedText = String(text || "").trim();

    if (normalizedText.length < 15) {
        return null;
    }

    try {
        const { franc } = await import("https://esm.sh/franc-min@6.2.0");

        const detected = franc(normalizedText);

        const languageMap = {
            rus: "ru",
            pol: "pl",
            ukr: "uk",
            eng: "en",
            cmn: "zh-CN",
            deu: "de",
            spa: "es",
            fra: "fr",
            ita: "it"
        };

        return languageMap[detected] || null;
    } catch (error) {
        console.error(
            "Flagged: ошибка определения языка комментария:",
            error
        );

        return null;
    }
}


async function openQuestionFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const questionId = Number(params.get("question"));

    if (!questionId) return;

    await loadQuestionsFromSupabase("all");
    await loadAnsweredQuestionIds();

    const questionIndex = situations.findIndex(
        question => Number(question.id) === questionId
    );

    if (questionIndex < 0) {
        console.warn(
            "Flagged: вопрос из URL не найден:",
            questionId
        );
        return;
    }

    gameStarted = true;
    currentIndex = questionIndex;
    showSituation();
}


setTimeout(() => {
    openQuestionFromUrl();
}, 100);
