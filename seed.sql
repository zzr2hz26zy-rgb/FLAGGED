-- FLAGGED seed
-- Generated from situations.txt
-- 30 situations

-- Categories
insert into public.categories (name, slug, icon)
values ('Relationships', 'relationships', '❤️')
on conflict (slug) do nothing;

insert into public.categories (name, slug, icon)
values ('Friendship', 'friendship', '👥')
on conflict (slug) do nothing;

insert into public.categories (name, slug, icon)
values ('Social', 'social', '🌍')
on conflict (slug) do nothing;

insert into public.categories (name, slug, icon)
values ('Work', 'work', '💼')
on conflict (slug) do nothing;

insert into public.categories (name, slug, icon)
values ('Everyday', 'everyday', '🏠')
on conflict (slug) do nothing;

-- Questions and options
with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your partner still follows their ex and likes their posts.',
    'Твой партнёр всё ещё подписан на бывшего/бывшую и лайкает его/её посты.',
    'Twój partner nadal obserwuje byłego/byłą i lajkuje jego/jej posty.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'They read your message immediately but reply 10 hours later.',
    'Он/она сразу читает твои сообщения, но отвечает через 10 часов.',
    'Czyta Twoją wiadomość od razu, ale odpowiada dopiero po 10 godzinach.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your partner never posts you, but posts everything else.',
    'Твой партнёр никогда не выкладывает тебя, но постоянно публикует всё остальное.',
    'Twój partner nigdy nie publikuje zdjęć z Tobą, ale publikuje wszystko inne.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'They say they are not ready for a relationship but still want all the benefits of one.',
    'Он/она говорит, что не готов(а) к отношениям, но хочет получать все преимущества отношений.',
    'Mówi, że nie jest gotowy/a na związek, ale chce wszystkich jego korzyści.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'They cancel your plans because their friends invited them somewhere.',
    'Он/она отменяет ваши планы, потому что друзья позвали куда-то.',
    'Odwołuje Wasze plany, bo znajomi zaprosili go/ją gdzie indziej.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your partner knows something bothers you but keeps doing it.',
    'Твой партнёр знает, что тебя что-то раздражает, но продолжает это делать.',
    'Twój partner wie, że coś Ci przeszkadza, ale nadal to robi.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'They regularly check who liked your Instagram posts.',
    'Он/она регулярно проверяет, кто лайкает твои фотографии в Instagram.',
    'Regularnie sprawdza, kto lajkuje Twoje zdjęcia na Instagramie.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'They say they are not jealous but always ask who you were with.',
    'Он/она говорит, что не ревнует, но постоянно спрашивает, с кем ты был(а).',
    'Mówi, że nie jest zazdrosny/a, ale ciągle pyta, z kim byłeś/aś.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'They disappear for hours and simply say they were busy.',
    'Он/она пропадает на несколько часов и просто говорит: «Я был(а) занят(а)».',
    'Znosi się na kilka godzin i mówi tylko: „Byłem/am zajęty/a”.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'They remember tiny details about their ex but forget important things you tell them.',
    'Он/она помнит мелочи о бывшем/бывшей, но забывает важные вещи, которые рассказываешь ты.',
    'Pamięta drobiazgi dotyczące byłego/byłej, ale zapomina ważne rzeczy, które mu/jej mówisz.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'relationships'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your friend only texts you when they need a favor.',
    'Друг пишет тебе только тогда, когда ему что-то нужно.',
    'Twój znajomy pisze do Ciebie tylko wtedy, gdy czegoś potrzebuje.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'friendship'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your friend cancels plans with you but posts photos from a night out with someone else.',
    'Друг отменяет планы с тобой, а потом выкладывает фотографии с другими людьми.',
    'Znajomy odwołuje plany z Tobą, a potem publikuje zdjęcia z innymi.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'friendship'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your friend asks you to be honest but gets offended when you are.',
    'Друг просит быть честным, но обижается, когда ты действительно честен.',
    'Znajomy prosi Cię o szczerość, ale obraża się, kiedy naprawdę jesteś szczery/a.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'friendship'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your friend shares your private story with someone else because they were worried about you.',
    'Друг рассказывает кому-то твою личную историю, потому что якобы переживал за тебя.',
    'Znajomy opowiada komuś Twoją prywatną historię, bo podobno się o Ciebie martwił.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'friendship'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your friend never celebrates your achievements but expects you to celebrate theirs.',
    'Друг никогда не радуется твоим достижениям, но ждёт, что ты будешь радоваться его.',
    'Znajomy nigdy nie cieszy się z Twoich sukcesów, ale oczekuje, że Ty będziesz cieszyć się z jego.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'friendship'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Someone watches every Story you post but never interacts with you.',
    'Кто-то смотрит каждую твою Stories, но никогда никак не реагирует.',
    'Ktoś ogląda każdą Twoją relację, ale nigdy z Tobą nie wchodzi w interakcję.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'social'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your partner follows hundreds of attractive strangers but gets annoyed when you follow someone new.',
    'Твой партнёр подписан на сотни привлекательных незнакомцев, но раздражается, когда ты подписываешься на кого-то нового.',
    'Twój partner obserwuje setki atrakcyjnych nieznajomych, ale złości się, gdy Ty obserwujesz kogoś nowego.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'social'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Someone removes a like from your photo after you don''t like theirs back.',
    'Кто-то убирает лайк с твоей фотографии, потому что ты не лайкнул(а) его фотографию.',
    'Ktoś usuwa lajka z Twojego zdjęcia, bo Ty nie polubiłeś/aś jego zdjęcia.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'social'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Someone posts ''some people are fake'' immediately after an argument with you.',
    'Кто-то сразу после ссоры с тобой выкладывает: «Некоторые люди такие фальшивые».',
    'Ktoś zaraz po kłótni z Tobą publikuje: „Niektórzy ludzie są fałszywi”.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'social'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Someone constantly posts about how happy their relationship is.',
    'Кто-то постоянно публикует посты о том, насколько счастлив(а) в отношениях.',
    'Ktoś ciągle publikuje posty o tym, jak bardzo jest szczęśliwy/a w związku.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'social'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your colleague takes credit for an idea you came up with.',
    'Коллега присваивает себе идею, которую придумал(а) ты.',
    'Twój współpracownik przypisuje sobie pomysł, który był Twój.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'work'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your boss sends ''Can we talk?'' at 11:47 PM.',
    'Начальник пишет: «Можем поговорить?» в 23:47.',
    'Szef pisze „Możemy porozmawiać?” o 23:47.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'work'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'A colleague always asks for your help but never helps you.',
    'Коллега постоянно просит тебя о помощи, но никогда не помогает тебе.',
    'Współpracownik ciągle prosi Cię o pomoc, ale nigdy nie pomaga Tobie.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'work'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your boss says, ''We are like a family here.''',
    'Начальник говорит: «Мы здесь как одна семья».',
    'Szef mówi: „Jesteśmy tutaj jak rodzina”.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'work'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'A colleague complains about everyone to you and then acts like their best friend.',
    'Коллега жалуется тебе на всех, а потом ведёт себя с этими людьми как лучший друг.',
    'Współpracownik narzeka przy Tobie na wszystkich, a potem zachowuje się jak ich najlepszy przyjaciel.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'work'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Someone says ''I''m already on my way'' while they are still in bed.',
    'Человек говорит: «Я уже выезжаю», хотя всё ещё лежит в кровати.',
    'Ktoś mówi „Już jadę”, chociaż nadal leży w łóżku.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'everyday'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Someone opens the fridge five times hoping new food will magically appear.',
    'Человек пять раз открывает холодильник в надежде, что там magically появится новая еда.',
    'Ktoś pięć razy otwiera lodówkę, licząc, że magicznie pojawi się nowe jedzenie.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'everyday'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Someone leaves one sip of a drink in the bottle so they don''t have to throw it away.',
    'Человек оставляет один глоток напитка в бутылке, чтобы не выбрасывать её.',
    'Ktoś zostawia jeden łyk napoju w butelce, żeby nie musieć jej wyrzucać.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'everyday'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Someone sets 12 alarms every morning and still wakes everyone else up.',
    'Человек ставит 12 будильников каждое утро и всё равно будит всех вокруг.',
    'Ktoś ustawia 12 budzików każdego ranka i nadal budzi wszystkich dookoła.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'everyday'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

with q as (
  insert into public.questions
    (category_id, text_en, text_ru, text_pl, is_anonymous, has_personal_experience, status)
  select
    id,
    'Your friend says ''I''ll be there in five minutes'' and arrives 40 minutes later.',
    'Друг говорит: «Буду через пять минут», а приходит через 40.',
    'Znajomy mówi „Będę za pięć minut”, a pojawia się po 40.',
    false,
    false,
    'published'
  from public.categories
  where slug = 'everyday'
  returning id
)
insert into public.options (question_id, text_en, text_ru, text_pl, position)
select id, 'NORMAL', 'НОРМА', 'NORMALNY', 1 from q
union all
select id, 'HMM...', 'ХММ...', 'HMM...', 2 from q
union all
select id, 'RED FLAG', 'КРАСНЫЙ ФЛАГ', 'CZERWONA FLAGA', 3 from q;

