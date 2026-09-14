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


let flaggedCategories = [];
let situations = [];

async function loadQuestionsFromSupabase() {
    const { data: categories, error: categoriesError } = await supabaseClient
        .from("categories")
        .select("*");

    if (categoriesError) {
        console.error("Flagged: ошибка загрузки категорий:", categoriesError);
        return false;
    }

    flaggedCategories = categories;

  const categoryMap = new Map(
        categories.map(category => [category.id, category.slug])
    );

    const { data: questions, error: questionsError } = await supabaseClient
        .from("questions")
        .select("*")
        .eq("status", "published")
    .order("id", { ascending: true });

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

    console.log("Flagged: вопросы загружены из Supabase:", situations.length);
    return true;
}

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
  .addEventListener("click", async () => {
    gameStarted = true;
    currentIndex = 0;
    score = 0;

    const questionsLoaded = await loadQuestionsFromSupabase();

    if (!questionsLoaded) {
      console.error("Flagged: не удалось загрузить вопросы из Supabase");
      return;
    }

    await loadAnsweredQuestionIds();
    showNextUnansweredQuestion();
  });
}


async function showQuestionComposer() {

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
      "партнер", "партнёр", "муж", "жена", "отношен", "пар", "partner",
      "mąż", "żona", "relacj"
    ],
    family: [
      "семь", "родител", "ребен", "ребён", "сын", "дочь", "доч", "мам", "пап",
      "rodzin", "dziecko", "rodzic"
    ],
    friendship: [
      "друг", "подруг", "дружб", "приетел", "при́ятель",
      "przyjac", "przyjaź"
    ],
    psychology: [
      "чувств", "страх", "тревог", "пережив", "самооцен", "психолог", "эмоци",
      "uczuc", "lęk", "emocj", "psycholog"
    ],
    money: [
      "деньг", "доход", "зарплат", "долг", "деньги", "расход", "бюджет",
      "pienią", "dochód", "dług", "budżet"
    ],
    work: [
      "работ", "началь", "коллег", "зарплат", "карьер", "офис",
      "praca", "szef", "kolega", "karier"
    ],
    social: [
      "обще", "люд", "соци", "толп", "обществен",
      "społ", "ludz", "towarz"
    ],
    politics: [
      "полит", "выбор", "государ", "президент", "правитель",
      "polity", "wybory", "rząd", "prezydent"
    ],
    travel: [
      "путешеств", "поездк", "отпуск", "самолёт", "самолет", "отел",
      "podró", "wakac", "hotel", "lot"
    ],
    education: [
      "учёб", "учеб", "университет", "школ", "образован", "экзамен",
      "nauk", "szkoł", "stud", "egzamin"
    ],
    beauty: [
      "волос", "красот", "макияж", "кож", "маникюр", "внешност",
      "włos", "urod", "makija", "skór", "manikiur"
    ],
    sport: [
      "спорт", "трениров", "фитнес", "зал", "бег", "йог",
      "sport", "trening", "fitness", "biegan"
    ],
    entertainment: [
      "фильм", "сериал", "музык", "игр", "кино", "развлеч",
      "film", "serial", "muzyk", "gra", "rozryw"
    ],
    technology: [
      "телефон", "компьютер", "технолог", "интернет", "приложен", "ai",
      "telefon", "komputer", "technolog", "internet", "aplikac"
    ],
    health: [
      "здоров", "болезн", "врач", "лечение", "самочувств",
      "zdrow", "chorob", "lekar", "leczen", "samopocz"
    ],
    everyday: [
      "быт", "дом", "магазин", "сосед", "повседнев", "уборк",
      "dom", "zakup", "sąsiad", "codzien"
    ]
  };

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

  const renderComposerFields = (type) => {
    const optionsBlock =
      type === "QUESTION"
        ? ""
        : `
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
                    style="width:100%; box-sizing:border-box; margin-top:8px; padding:12px; border-radius:10px;"
                  >
                `
              )
              .join("")}
          </div>
        `;

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
            <input id="submissionPersonalExperience" type="checkbox">
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
                  ${category.id === recommendedCategory ? "selected" : ""}
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
      ></textarea>

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
        <option value="POLL" ${type === "POLL" ? "selected" : ""}>POLL</option>
        <option value="QUESTION" ${type === "QUESTION" ? "selected" : ""}>QUESTION</option>
      </select>

      <div id="dynamicSubmissionFields">
        ${optionsBlock}
        ${experienceBlock}
      </div>

      ${categoryBlock}

      <button
        id="saveDraftButton"
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
    card.innerHTML = renderComposerFields(type);

    document
      .getElementById("userQuestionType")
      .addEventListener("change", event => {
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
        showNextUnansweredQuestion();
      });

    document
      .getElementById("saveDraftButton")
      .addEventListener("click", async () => {
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
          selectedType === "QUESTION"
            ? []
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

        const submissionPayload = {
          created_by: user.id,
          text_ru: language === "ru" ? text : null,
          text_en: language === "en" ? text : null,
          text_pl: language === "pl" ? text : null,
          type: selectedType,
          is_anonymous: false,
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

        console.log("Flagged: черновик сохранён", {
          submissionId: submission.id,
          createdBy: user.id,
          type: selectedType,
          options,
          hasPersonalExperience
        });

        alert(
          language === "ru"
            ? "Черновик сохранён."
            : language === "pl"
            ? "Wersja robocza została zapisana."
            : "Draft saved."
        );
      });
  };

  render("SITUATION");
}


document
  .getElementById("createQuestionButton")
  ?.addEventListener("click", showQuestionComposer);


async function showAuthComposer() {
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
        showNextUnansweredQuestion();
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

            showNextUnansweredQuestion();
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

          showNextUnansweredQuestion();
        });
    }
  };

  renderAuth("signin");
}


document
  .getElementById("authButton")
  ?.addEventListener("click", showAuthComposer);

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
  const { data, error } = await supabaseClient.rpc(
    "get_pending_question_submissions"
  );

  if (error) {
    console.error("Ошибка загрузки очереди модерации:", error);

    alert(
      language === "ru"
        ? "Не удалось загрузить очередь модерации."
        : language === "pl"
        ? "Nie udało się załadować kolejki moderacji."
        : "Could not load the moderation queue."
    );
    return;
  }

  const submissions = Array.isArray(data) ? data : [];

  if (submissions.length === 0) {
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

  list.innerHTML = submissions
    .map(
      submission => `
        <button
          type="button"
          class="moderation-submission"
          data-submission-id="${submission.id}"
          style="
            width:100%;
            margin-top:10px;
            padding:14px;
            border:1px solid rgba(255,255,255,0.12);
            border-radius:12px;
            background:transparent;
            color:inherit;
            text-align:left;
            cursor:pointer;
          "
        >
          <strong>
            #${submission.id}
          </strong>

          <div style="margin-top:7px;">
            ${
              submission.text_ru ||
              submission.text_en ||
              submission.text_pl ||
              ""
            }
          </div>

          <div style="margin-top:8px; opacity:0.7;">
            ${submission.type}
            ${
              submission.category
                ? ` · ${submission.category.icon || ""} ${
                    submission.category[`name_${language}`] ||
                    submission.category.name_ru ||
                    ""
                  }`
                : ""
            }
          </div>
        </button>
      `
    )
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

  alert(
    decision === "APPROVED"
      ? language === "ru"
        ? "Заявка одобрена."
        : language === "pl"
        ? "Zgłoszenie zatwierdzone."
        : "Submission approved."
      : language === "ru"
      ? "Заявка отклонена."
      : language === "pl"
      ? "Zgłoszenie odrzucone."
      : "Submission rejected."
  );

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
                    `<button class="poll-option" data-option-id="${option.id}">${option[language]}</button>`
                )
                .join("")
            : `
              <button class="normal">${t().normal}</button>
              <button class="hmm">${t().hmm}</button>
              <button class="red">${t().red}</button>
            `
        }
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

let answeredQuestionIds = new Set();
let pendingAnswer = null;
let pendingPersonalExperience = null;
let pendingAnswerSelection = null;

async function loadAnsweredQuestionIds() {
    const { data, error } = await supabaseClient
        .from("votes")
        .select("question_id")
        .eq("browser_id", flaggedBrowserId);

    if (error) {
        console.error("Flagged: ошибка загрузки отвеченных вопросов:", error);
        answeredQuestionIds = new Set();
        return;
    }

    answeredQuestionIds = new Set(
        (data || []).map(vote => Number(vote.question_id))
    );

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

async function handleAnswer(button) {
    const situation = situations[currentIndex];

    if (!situation) {
        console.error("Flagged: текущий вопрос не найден.");
        return;
    }

    const questionId = situation.id;

    // В новых SITUATION/POLL ответ выбирается через option_id.
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
        situation.type === "SITUATION" &&
        situation.hasPersonalExperience &&
        pendingPersonalExperience === null
    ) {
        pendingAnswerSelection = optionId;

        card.innerHTML += `
          <div style="text-align:center; margin-top:20px;">
            <div style="margin-bottom:12px; font-weight:bold;">
              ${
                language === "ru"
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
    // Для POLL личный опыт не используется.
    // Для SITUATION сохраняем выбранный опыт.
    // -----------------------------------------------------

    const experienceValue =
        situation.type === "POLL"
            ? false
            : (pendingPersonalExperience ?? false);

    try {
        // Защита от повторного голосования.
        const { data: existingVote, error: existingVoteError } =
            await supabaseClient
                .from("votes")
                .select("id")
                .eq("question_id", questionId)
                .eq("browser_id", flaggedBrowserId)
                .maybeSingle();

        if (existingVoteError) {
            console.error(
                "Flagged: ошибка проверки существующего голоса:",
                existingVoteError
            );
            return;
        }

        if (!existingVote) {
            const { error: voteError } = await supabaseClient
                .from("votes")
                .insert({
                    question_id: questionId,
                    option_id: optionId,
                    browser_id: flaggedBrowserId,
                    has_personal_experience: experienceValue
                });

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
                .select("option_id")
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

        // -------------------------------------------------
        // Универсальные результаты для POLL и SITUATION.
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

          <div class="poll-results">
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

          <button class="next-button" style="margin-top:20px;">
            ${
                language === "ru"
                    ? "Дальше"
                    : language === "pl"
                    ? "Dalej"
                    : "Next"
            }
          </button>
        `;

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
    const messages = {
        ru: {
            title: "Все доступные вопросы пройдены",
            text: "Ты уже ответил(а) на все доступные вопросы. Новые вопросы появятся здесь позже."
        },
        pl: {
            title: "Wszystkie dostępne pytania zostały ukończone",
            text: "Odpowiedziałeś już na wszystkie dostępne pytania. Nowe pytania pojawią się tutaj później."
        },
        en: {
            title: "All available questions completed",
            text: "You have already answered all available questions. New questions will appear here later."
        }
    };

    const message = messages[language] || messages.en;

    card.innerHTML = `
        <div class="category">🚩 FLAGGED</div>

        <div style="font-size: 32px; margin: 25px 0;">
            ${message.title}
        </div>

        <div style="font-size: 18px; line-height: 1.6; color: #999;">
            ${message.text}
        </div>
    `;
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
addShareButton();

