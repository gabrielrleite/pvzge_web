/*
 * PvZ2 Gardendless - Plant Match texts (pt / en / zh): interface, the chat
 * script, personalities, dates and relationship stages. Used by x-match.js.
 */
(function () {
  'use strict';

  var X = window.PvZX;

  var TXT = {
    age: { pt: '{n} anos', en: '{n} years', zh: '{n} 岁' },
    ageFuture: { pt: 'ainda vai nascer', en: 'not born yet', zh: '还没出生' },
    likesLeft: { pt: 'curtidas hoje', en: 'likes today', zh: '今日喜欢' },
    supers: { pt: 'superlikes', en: 'super likes', zh: '超级喜欢' },
    tabDiscover: { pt: 'Descobrir', en: 'Discover', zh: '发现' },
    tabMessages: { pt: 'Mensagens', en: 'Messages', zh: '消息' },
    tabLikes: { pt: 'Curtidas', en: 'Likes', zh: '喜欢我' },
    tabPartners: { pt: 'Namoros', en: 'Partners', zh: '恋人' },
    undo: { pt: 'Desfazer o último swipe (1 por rodada, Backspace)', en: 'Undo the last swipe (1 per round, Backspace)', zh: '撤销上一次滑动（每轮 1 次，Backspace）' },
    boost: { pt: 'Boost: mostra primeiro as plantas mais compatíveis (1 por rodada)', en: 'Boost: most compatible plants first (1 per round)', zh: '加速：优先显示最契合的植物（每轮 1 次）' },
    boosted: { pt: '🚀 Boost ativo: as próximas são as mais compatíveis!', en: '🚀 Boost on: the next profiles are the most compatible!', zh: '🚀 加速中：接下来是最契合的植物！' },
    noLikes: { pt: 'Suas curtidas de hoje acabaram', en: 'You are out of likes for today', zh: '今天的喜欢次数用完了' },
    noLikesDesc: { pt: 'Volte amanhã, ou vença uma fase do Match de Plantas para ganhar +10 curtidas, 1 superlike e 1 revelação.', en: 'Come back tomorrow, or win a Plant Match level for +10 likes, 1 super like and 1 reveal.', zh: '明天再来，或赢得一局植物配对，获得 +10 喜欢、1 个超级喜欢和 1 次揭晓。' },
    likedYou: { pt: '💛 Curtiu você', en: '💛 Liked you', zh: '💛 喜欢你' },
    badgeVerified: { pt: '✔ Verificad{g:a|o|e}', en: '✔ Verified', zh: '✔ 已认证' },
    badgeLegend: { pt: '👑 Lendári{g:a|o|e}', en: '👑 Legendary', zh: '👑 传奇' },
    badgeNew: { pt: '✨ Nov{g:a|o|e} no app', en: '✨ New here', zh: '✨ 新人' },
    badgePopular: { pt: '🔥 Popular', en: '🔥 Popular', zh: '🔥 人气' },
    badgePartner: { pt: '💍 Namora você', en: '💍 Your partner', zh: '💍 你的恋人' },
    photoWater: { pt: 'Na piscina', en: 'At the pool', zh: '泳池' },
    photoDeath: { pt: 'Dia ruim', en: 'Bad day', zh: '糟糕的一天' },
    msgsEmpty: { pt: 'Nenhum match ainda. Vá em Descobrir e curta algumas plantas!', en: 'No matches yet. Go to Discover and like some plants!', zh: '还没有配对。去“发现”喜欢一些植物吧！' },
    newMatch: { pt: 'Novo match! Diga oi.', en: 'New match! Say hi.', zh: '新配对！打个招呼吧。' },
    typing: { pt: 'digitando…', en: 'typing…', zh: '正在输入…' },
    ghosted: { pt: '{name} parou de responder. 👻', en: '{name} stopped replying. 👻', zh: '{name} 不再回复了。👻' },
    seen: { pt: 'visto por último há {n} h', en: 'last seen {n} h ago', zh: '{n} 小时前在线' },
    affinity: { pt: 'Afinidade', en: 'Affinity', zh: '好感度' },
    viewProfile: { pt: 'Ver perfil', en: 'View profile', zh: '查看资料' },
    invite: { pt: '💐 Convidar para um encontro', en: '💐 Ask out on a date', zh: '💐 邀请约会' },
    inviteDesc: { pt: 'Uma fase curta só com {name}. Se vocês vencerem, viram namorados: {name} sempre dá match e traz 1 adubo para as fases do Match de Plantas.', en: 'A short level alone with {name}. Win it and you become partners: {name} always matches and brings 1 plant food to Plant Match levels.', zh: '只和 {name} 一起的短关卡。获胜后你们将成为恋人：{name} 总会配对，并为植物配对关卡带来 1 个能量豆。' },
    likesTitle: { pt: '{n} plantas curtiram você', en: '{n} plants liked you', zh: '{n} 株植物喜欢你' },
    likesDesc: { pt: 'Use uma revelação para ver quem é. Curtir de volta é match na hora. Você ganha revelações vencendo fases e encontros.', en: 'Spend a reveal to see who it is. Liking back is an instant match. Win levels and dates to earn reveals.', zh: '使用揭晓次数来查看是谁。回喜欢即可立即配对。赢得关卡和约会可获得揭晓次数。' },
    reveals: { pt: 'Revelações: {n}', en: 'Reveals: {n}', zh: '揭晓次数：{n}' },
    reveal: { pt: 'Revelar', en: 'Reveal', zh: '揭晓' },
    seeNow: { pt: 'Ver agora', en: 'See now', zh: '立即查看' },
    likesNone: { pt: 'Ninguém novo por enquanto. Continue no Descobrir!', en: 'Nobody new for now. Keep discovering!', zh: '暂时没有新的喜欢。继续发现吧！' },
    partnersTitle: { pt: 'Seus namoros', en: 'Your partners', zh: '你的恋人' },
    partnersDesc: { pt: 'Plantas com quem você venceu um encontro. Sempre dão match, e cada uma no time traz 1 adubo no início das fases deste modo (até 3).', en: 'Plants you won a date with. They always match, and each one in your team brings 1 plant food at the start of this mode’s levels (up to 3).', zh: '与你约会获胜的植物。它们总会配对，每株在队伍中时，本模式关卡开始时带来 1 个能量豆（最多 3 个）。' },
    partnersNone: { pt: 'Nenhum namoro ainda. Convide um match para um encontro pela conversa.', en: 'No partners yet. Ask a match out on a date from the chat.', zh: '还没有恋人。在聊天中邀请配对对象约会吧。' },
    since: { pt: 'juntos desde {d}', en: 'together since {d}', zh: '自 {d} 起在一起' },
    bonus: { pt: 'Bônus da fase: +{sun} ☀ · {food} adubo(s)', en: 'Level bonus: +{sun} ☀ · {food} plant food', zh: '关卡加成：+{sun} ☀ · {food} 能量豆' },
    dateName: { pt: 'Encontro com {name}', en: 'Date with {name}', zh: '与 {name} 约会' },
    dateWon: { pt: '💍 {name} agora namora você!', en: '💍 {name} is now your partner!', zh: '💍 {name} 现在是你的恋人了！' },
    dateLost: { pt: '💔 O encontro não deu certo... tente de novo pela conversa.', en: '💔 The date didn’t work out... try again from the chat.', zh: '💔 约会不太顺利……在聊天中再试一次吧。' },
    reward: { pt: '🎁 +10 curtidas, +1 superlike e +1 revelação no Match de Plantas!', en: '🎁 +10 likes, +1 super like and +1 reveal in Plant Match!', zh: '🎁 植物配对：+10 喜欢、+1 超级喜欢、+1 揭晓！' },
    headlines: {
      pt: ['Fã de {a} e {b}.', 'Procurando alguém para dividir o gramado.', 'Se você gosta de {a}, já temos algo em comum.', 'Vim de {w} só para te conhecer.', '{a}, {b} e zumbis derrotados. Nessa ordem.'],
      en: ['Into {a} and {b}.', 'Looking for someone to share a lawn with.', 'If you like {a}, we already have something in common.', 'Came all the way from {w} to meet you.', '{a}, {b} and defeated zombies. In that order.'],
      zh: ['喜欢{a}和{b}。', '想找人一起守护草坪。', '如果你喜欢{a}，我们已经有共同点了。', '为了认识你，我从{w}赶来。', '{a}、{b}和被打败的僵尸，按这个顺序。'],
    },
  };

  // The chat script: 3 exchanges. Each reply is good (+1 affinity), so-so
  // or bad; exchange 2 asks about the role the plant plays.
  var CHAT = {
    openers: {
      pt: ['Oi! Vi que você também curte {like}. 😊', 'Então... você planta na primeira fileira ou é do tipo que espera?', 'Confesso: dei like porque gostei do seu gramado.', 'Sem rodeios: quantos zumbis você já derrotou?', 'Oi! Prometo não ocupar mais que uma casa. 🌱'],
      en: ['Hi! I see you’re into {like} too. 😊', 'So... do you plant in the front row or are you the waiting type?', 'Confession: I liked you because of your lawn.', 'Straight to the point: how many zombies have you beaten?', 'Hi! I promise I only take one square. 🌱'],
      zh: ['嗨！看到你也喜欢{like}。😊', '那么……你喜欢种在第一排，还是会等一等？', '坦白说：我点喜欢是因为你的草坪。', '直接问吧：你打败过多少僵尸？', '嗨！我保证只占一格。🌱'],
    },
    r1: [
      { q: 'good', pt: 'Adorei seu perfil, {name}! Ainda mais a parte de {like}.', en: 'Loved your profile, {name}! Especially the {like} part.', zh: '{name}，我很喜欢你的资料！尤其是{like}那部分。' },
      { q: 'meh', pt: 'Oi, tudo bem?', en: 'Hey, how are you?', zh: '嗨，你好吗？' },
      { q: 'bad', pt: 'Só dei like porque você é barata.', en: 'I only liked you because you’re cheap.', zh: '我点喜欢只是因为你便宜。' },
    ],
    r2q: { pt: 'Me conta: o que você procura numa planta?', en: 'Tell me: what are you looking for in a plant?', zh: '告诉我：你想找什么样的植物？' },
    roles: {
      sun: { pt: 'Alguém que traga energia para o time ☀️', en: 'Someone who brings energy to the team ☀️', zh: '能为队伍带来能量的伙伴 ☀️' },
      defense: { pt: 'Alguém que segure a barra quando apertar 🛡️', en: 'Someone who holds the line when it gets tough 🛡️', zh: '关键时刻能顶住的伙伴 🛡️' },
      attack: { pt: 'Alguém que parta para cima dos zumbis ⚔️', en: 'Someone who goes after the zombies ⚔️', zh: '敢冲向僵尸的伙伴 ⚔️' },
      area: { pt: 'Alguém que resolva tudo de uma vez 💥', en: 'Someone who solves it all at once 💥', zh: '能一次解决所有问题的伙伴 💥' },
      support: { pt: 'Alguém que ajude todo mundo 🤝', en: 'Someone who helps everyone 🤝', zh: '乐于帮助大家的伙伴 🤝' },
    },
    r3q: { pt: 'Então... topa um encontro? Onda 1, no seu quintal. 🌻', en: 'So... how about a date? Wave 1, at your front yard. 🌻', zh: '那么……约会吗？第 1 波，在你家前院。🌻' },
    r3: [
      { q: 'good', pt: 'Claro! Já guardei a melhor casa pra você.', en: 'Of course! I saved the best square for you.', zh: '当然！我给你留了最好的格子。' },
      { q: 'meh', pt: 'Pode ser, vou ver minha agenda.', en: 'Maybe, let me check my schedule.', zh: '也许吧，我看看日程。' },
      { q: 'bad', pt: 'Acho que não, prefiro jogar sozinh{u:a|o|e}.', en: 'I don’t think so, I’d rather play alone.', zh: '算了吧，我更喜欢一个人玩。' },
    ],
    react: {
      good: { pt: ['Aaah, que fofo! 😍', 'Você sabe conversar! 💚', 'Ganhou meu coração (e minha folha). 🌿'], en: ['Aww, how sweet! 😍', 'You know how to talk! 💚', 'You won my heart (and my leaf). 🌿'], zh: ['哇，好甜！😍', '你真会聊天！💚', '你赢得了我的心（和我的叶子）。🌿'] },
      meh: { pt: ['Entendi. 🙂', 'Hmm, ok! 🙂', 'Ah... legal.'], en: ['I see. 🙂', 'Hmm, okay! 🙂', 'Oh... nice.'], zh: ['明白了。🙂', '嗯，好的！🙂', '哦……不错。'] },
      hello: { pt: ['Tudo ótimo! E você?'], en: ['All good! You?'], zh: ['都挺好！你呢？'] },
      bad: { pt: ['Hmm... ok então. 😐', 'Nossa. 🙄', 'Tá bom, né...'], en: ['Hmm... okay then. 😐', 'Wow. 🙄', 'Sure, I guess...'], zh: ['嗯……好吧。😐', '哇哦。🙄', '行吧……'] },
    },
    roleGood: { pt: 'É exatamente isso que eu faço! 😍', en: 'That’s exactly what I do! 😍', zh: '这正是我擅长的！😍' },
    roleMeh: { pt: 'Ah... não é bem a minha praia.', en: 'Oh... that’s not really my thing.', zh: '哦……那不太是我的强项。' },
    end: {
      3: { pt: 'Você é demais! Vou dar o meu melhor na fase. 🔥', en: 'You’re amazing! I’ll give it my all in the level. 🔥', zh: '你太棒了！我会在关卡里全力以赴。🔥' },
      2: { pt: 'Foi legal conversar! Até o gramado. 🌱', en: 'Nice talking! See you on the lawn. 🌱', zh: '聊得很开心！草坪上见。🌱' },
      1: { pt: 'Tá... a gente se vê.', en: 'Okay... see you around.', zh: '好吧……回头见。' },
      0: { pt: 'Tá... a gente se vê.', en: 'Okay... see you around.', zh: '好吧……回头见。' },
    },
  };

  /* ------------------------------------------------ texts added in 2.0 */

  Object.assign(TXT, {
    inviteDesc: { pt: 'Planeje o encontro com {name}: o lugar, o seu visual e um presente. Se der certo, vocês começam a namorar.', en: 'Plan the date with {name}: the place, your look and a gift. If it goes well, you start dating.', zh: '策划与 {name} 的约会：地点、造型和礼物。顺利的话你们就开始交往。' },
    partnersDesc: { pt: 'Plantas com quem você venceu um encontro. Sempre dão match, trazem bônus quando estão no time e o relacionamento cresce com encontros, presentes e fases jogadas juntos. Cuidado: quem fica de fora das fases sente ciúmes.', en: 'Plants you won a date with. They always match, bring a bonus when they are in your team, and the relationship grows with dates, gifts and levels played together. Careful: partners left out of a level get jealous.', zh: '与你约会获胜的植物。它们总会配对，在队伍中时带来加成，关系会随约会、礼物和一起游玩的关卡成长。注意：没被带上关卡的恋人会吃醋。' },
    newSession: { pt: '— novo match —', en: '— new match —', zh: '— 新的配对 —' },
    personality: { pt: 'Personalidade', en: 'Personality', zh: '性格' },
    stickerTip: { pt: 'Mande uma figurinha (1 por conversa). Acertar a favorita da planta vale um coração.', en: 'Send a sticker (1 per chat). Her favorite one is worth a heart.', zh: '发送一个贴纸（每次聊天 1 次）。发中它最喜欢的可得一颗心。' },
    noChatHere: { pt: 'Dê match de novo para conversar.', en: 'Match again to chat.', zh: '再次配对即可聊天。' },
    dateTitle: { pt: 'Escolha o encontro', en: 'Pick a date', zh: '选择约会' },
    dateNeed: { pt: '🔒 Precisa estar: {stage}', en: '🔒 Needs: {stage}', zh: '🔒 需要关系：{stage}' },
    dateNeedPartner: { pt: '🔒 Só para namoros', en: '🔒 Partners only', zh: '🔒 仅限恋人' },
    dateBest: { pt: 'Melhor: {stars}', en: 'Best: {stars}', zh: '最佳：{stars}' },
    dateResult: { pt: '{icon} {date}: {stars}', en: '{icon} {date}: {stars}', zh: '{icon} {date}：{stars}' },
    dateWaves: { pt: '{n} ondas', en: '{n} waves', zh: '{n} 波' },
    objWin: { pt: 'Vencer', en: 'Win', zh: '获胜' },
    objNoMower: { pt: 'Sem usar cortadores', en: 'No mowers used', zh: '不使用割草机' },
    objNoLost: { pt: 'Sem perder plantas', en: 'No plants lost', zh: '不损失植物' },
    objFast: { pt: 'Em menos de {m} min', en: 'Under {m} min', zh: '{m} 分钟内' },
    relUp: { pt: '{icon} Agora vocês estão: {stage}!', en: '{icon} You are now: {stage}!', zh: '{icon} 你们现在是：{stage}！' },
    breakup: { pt: '💔 {name} terminou com você.', en: '💔 {name} broke up with you.', zh: '💔 {name} 和你分手了。' },
    jealousSys: { pt: '😒 {name} ficou com ciúmes (−1 de relacionamento).', en: '😒 {name} got jealous (−1 relationship).', zh: '😒 {name} 吃醋了（关系 −1）。' },
    giftWater: { pt: '💧 Regar', en: '💧 Water', zh: '💧 浇水' },
    giftWaterDesc: { pt: 'Grátis, 1 vez por dia: +1 de relacionamento', en: 'Free, once a day: +1 relationship', zh: '免费，每天 1 次：关系 +1' },
    giftChoc: { pt: '🍫 Chocolate de sol', en: '🍫 Sun chocolate', zh: '🍫 阳光巧克力' },
    giftChocDesc: { pt: 'Custa 5 curtidas, 1 vez por dia: +2 de relacionamento', en: 'Costs 5 likes, once a day: +2 relationship', zh: '花费 5 个喜欢，每天 1 次：关系 +2' },
    giftSent: { pt: 'Você deu {gift} para {name}.', en: 'You gave {gift} to {name}.', zh: '你送给 {name} {gift}。' },
    giftFood: { pt: '🎁 {name} te deu +1 adubo para a próxima fase!', en: '🎁 {name} gave you +1 plant food for the next level!', zh: '🎁 {name} 送你下一关 +1 能量豆！' },
    giftLikes: { pt: '🎁 {name} te deu +5 curtidas!', en: '🎁 {name} gave you +5 likes!', zh: '🎁 {name} 送你 +5 个喜欢！' },
    relPoints: { pt: 'Pontos de casal: {n}', en: 'Couple points: {n}', zh: '情侣积分：{n}' },
    xpNext: { pt: '{xp}/{next} para {stage}', en: '{xp}/{next} to {stage}', zh: '{xp}/{next} 达到{stage}' },
    xpWedding: { pt: 'Pronto para o casamento! 💒', en: 'Ready for the wedding! 💒', zh: '可以举办婚礼了！💒' },
    xpMax: { pt: 'Felizes para sempre', en: 'Happily ever after', zh: '永远幸福' },
    stageBonus: { pt: 'No time: {txt}', en: 'In your team: {txt}', zh: '在队伍中：{txt}' },
    chatBtn: { pt: '💬 Conversa', en: '💬 Chat', zh: '💬 聊天' },
    dateBtn: { pt: '💐 Encontro', en: '💐 Date', zh: '💐 约会' },
    giftPending: { pt: 'Presentes guardados: +{n} adubo na próxima fase', en: 'Saved gifts: +{n} plant food next level', zh: '已存礼物：下一关 +{n} 能量豆' },
    tabSocial: { pt: 'Social', en: 'Social', zh: '社交' },
    weekTitle: { pt: 'Semana temática: {fam}', en: 'Theme week: {fam}', zh: '主题周：{fam}' },
    weekDesc: { pt: 'Até domingo, plantas da família {fam} aparecem mais e dão match mais fácil. Vença uma fase com 3 delas no time para ganhar recompensas em dobro e entrar no ranking da semana.', en: 'Until Sunday, {fam} plants show up more and match more easily. Win a level with 3 of them in your team for double rewards and a spot on the weekly ranking.', zh: '本周日前，{fam}家族的植物出现得更多、更容易配对。带着其中 3 株赢得关卡可获得双倍奖励并进入周排行榜。' },
    weekBadge: { pt: '🎉 Destaque da semana', en: '🎉 Plant of the week', zh: '🎉 本周明星' },
    weekReward: { pt: '🎉 Semana temática: recompensas em dobro!', en: '🎉 Theme week: double rewards!', zh: '🎉 主题周：奖励翻倍！' },
    weekTeam: { pt: 'Plantas da semana no seu time: {n}/3', en: 'Plants of the week in your team: {n}/3', zh: '队伍中的本周植物：{n}/3' },
    popLikes: { pt: '🔥 Mais curtidas no servidor', en: '🔥 Most liked on the server', zh: '🔥 服务器最受喜欢' },
    popPartners: { pt: '💍 Mais namoradas no servidor', en: '💍 Most dated on the server', zh: '💍 服务器最多恋人' },
    popNone: { pt: 'Ainda sem dados. Curta algumas plantas!', en: 'No data yet. Like some plants!', zh: '还没有数据。去喜欢一些植物吧！' },
    popOffline: { pt: 'Conecte-se a um servidor multiplayer (menu Multijogador) para ver as plantas mais populares de todos os jogadores e os rankings.', en: 'Connect to a multiplayer server (Multiplayer menu) to see the most popular plants of all players and the rankings.', zh: '连接多人服务器（多人菜单）即可查看所有玩家最受欢迎的植物和排行榜。' },
    popMine: { pt: '📊 Suas plantas favoritas', en: '📊 Your favorite plants', zh: '📊 你最喜欢的植物' },
    rankings: { pt: '🏆 Rankings', en: '🏆 Rankings', zh: '🏆 排行榜' },
    rankMatch: { pt: 'Fases', en: 'Levels', zh: '关卡' },
    rankCouple: { pt: 'Casais', en: 'Couples', zh: '情侣' },
    rankWeek: { pt: 'Semana', en: 'Week', zh: '本周' },
    rankEmpty: { pt: 'Ninguém no ranking ainda.', en: 'Nobody on this ranking yet.', zh: '排行榜暂时没有人。' },
    rankLogin: { pt: 'Entre numa conta para aparecer nos rankings.', en: 'Log in to appear on the rankings.', zh: '登录账号即可上榜。' },
    rankYou: { pt: 'Você: #{n}', en: 'You: #{n}', zh: '你：第 {n} 名' },
    shareTitle: { pt: '📤 Compartilhar', en: '📤 Share', zh: '📤 分享' },
    shareTeam: { pt: 'Copiar meu time', en: 'Copy my team', zh: '复制我的队伍' },
    shareNone: { pt: 'Dê alguns matches (ou jogue uma fase) para ter um time.', en: 'Get some matches (or play a level) to have a team.', zh: '先配对一些植物（或玩一局）来组建队伍。' },
    shareCopied: { pt: 'Copiado!', en: 'Copied!', zh: '已复制！' },
    shareText: { pt: 'Meu time no Match de Plantas 💘: {names}. Código: {code}', en: 'My Plant Match team 💘: {names}. Code: {code}', zh: '我的植物配对队伍 💘：{names}。代码：{code}' },
    shareProfile: { pt: '📤 Compartilhar perfil', en: '📤 Share profile', zh: '📤 分享资料' },
    shareProfileText: { pt: '💘 {name} · {age}{fam} · ☀ {cost} · {pers}\n“{headline}”\nMatch de Plantas, PvZ2 Gardendless', en: '💘 {name} · {age}{fam} · ☀ {cost} · {pers}\n“{headline}”\nPlant Match, PvZ2 Gardendless', zh: '💘 {name} · {age}{fam} · ☀ {cost} · {pers}\n“{headline}”\n植物配对，PvZ2 Gardendless' },
    importTitle: { pt: 'Jogar com o time de um amigo', en: 'Play a friend’s team', zh: '使用好友的队伍' },
    importPh: { pt: 'Cole o código (PM1:…)', en: 'Paste the code (PM1:…)', zh: '粘贴代码（PM1:…）' },
    importGo: { pt: 'Jogar', en: 'Play', zh: '开始' },
    importBad: { pt: 'Código inválido', en: 'Invalid code', zh: '代码无效' },
    lastTeam: { pt: 'Último time: {names}', en: 'Last team: {names}', zh: '上一支队伍：{names}' },
  });

  Object.assign(CHAT, {
    // Exchange 2: one of these questions, picked per chat.
    q: {
      world: {
        ask: { pt: 'Adivinha de que mundo eu sou? 🌍', en: 'Guess which world I’m from? 🌍', zh: '猜猜我来自哪个世界？🌍' },
        right: { pt: 'Acertou! Dá pra notar o sotaque? 😄', en: 'Right! Can you hear the accent? 😄', zh: '猜对了！听得出口音吗？😄' },
        wrong: { pt: 'Errou! Eu sou de {world}. 😅', en: 'Nope! I’m from {world}. 😅', zh: '错啦！我来自{world}。😅' },
      },
      like: {
        ask: { pt: 'Adivinha do que eu mais gosto? 😏', en: 'Guess what I like the most? 😏', zh: '猜猜我最喜欢什么？😏' },
        right: { pt: 'Isso! Você presta atenção em mim. 💚', en: 'Yes! You pay attention to me. 💚', zh: '对！你很在意我。💚' },
        wrong: { pt: 'Nada a ver! Eu amo {like}. 😅', en: 'Not at all! I love {like}. 😅', zh: '完全不对！我爱{like}。😅' },
      },
      cost: {
        ask: { pt: 'Sinceridade: o que acha do meu preço de {cost} de sol?', en: 'Honestly: what do you think of my {cost} sun price?', zh: '说实话：你觉得我 {cost} 阳光的价格怎么样？' },
        worth: { pt: 'Vale cada raio de sol ✨', en: 'Worth every ray of sun ✨', zh: '每一缕阳光都值得 ✨' },
        cheap: { pt: 'Econômica, adoro isso!', en: 'Budget-friendly, I love it!', zh: '经济实惠，我喜欢！' },
        pricey: { pt: 'Meio cara pra mim...', en: 'A bit pricey for me...', zh: '对我来说有点贵……' },
        right: { pt: 'Você me entende! 🥹', en: 'You get me! 🥹', zh: '你懂我！🥹' },
      },
    },
    again: {
      pt: ['Você de novo! 😄 Ainda procurando “{role}”?', 'Olha quem voltou! Que saudade. 💚', 'Sabia que você ia voltar. 😏'],
      en: ['You again! 😄 Still looking for “{role}”?', 'Look who’s back! I missed you. 💚', 'I knew you’d come back. 😏'],
      zh: ['又是你！😄 还在找“{role}”吗？', '看看谁回来了！好想你。💚', '我就知道你会回来。😏'],
    },
    againWins: { pt: ['Saudade das nossas vitórias! Já são {wins} juntos. 🏆'], en: ['I miss our wins! {wins} together so far. 🏆'], zh: ['想念我们的胜利！已经一起赢了 {wins} 次。🏆'] },
    againGhost: { pt: ['Desculpa ter sumido da última vez... recomeçamos? 🙈'], en: ['Sorry I vanished last time... start over? 🙈'], zh: ['上次突然消失，对不起……重新开始吗？🙈'] },
    stickers: ['❤️', '🌻', '🧟', '😂', '🔥'],
    stickerLove: { pt: ['Amei essa figurinha! 😍', 'Minha favorita! Como você sabia? 🥰'], en: ['Love that sticker! 😍', 'My favorite! How did you know? 🥰'], zh: ['超爱这个贴纸！😍', '我最喜欢的！你怎么知道？🥰'] },
    stickerMeh: { pt: ['Haha 😄', 'kkkkk', '😂'], en: ['Haha 😄', 'lol', '😂'], zh: ['哈哈 😄', '笑死', '😂'] },
    afterWin: {
      pt: ['Que fase! {kills} zumbis derrotados juntos. 🏆', 'Ganhamos! Você planta muito bem. 😎', 'Vitória! Quando é a próxima? 💚'],
      en: ['What a level! {kills} zombies beaten together. 🏆', 'We won! You plant really well. 😎', 'Victory! When’s the next one? 💚'],
      zh: ['好精彩！我们一起打败了 {kills} 只僵尸。🏆', '我们赢了！你种得真好。😎', '胜利！下一次是什么时候？💚'],
    },
    afterLoss: {
      pt: ['Os zumbis venceram dessa vez... revanche? 😤', 'Não foi dessa vez. Mas eu curti jogar com você. 🌱'],
      en: ['The zombies won this time... rematch? 😤', 'Not this time. But I liked playing with you. 🌱'],
      zh: ['这次僵尸赢了……再来一局？😤', '这次没成功。但我喜欢和你一起玩。🌱'],
    },
    jealous: {
      pt: ['Vi que você jogou sem mim... 🤨', 'Tudo bem, joga com as outras plantas. Eu fico aqui. 😒', 'Nem me chamou pra fase? 💔'],
      en: ['I saw you played without me... 🤨', 'Fine, play with the other plants. I’ll stay here. 😒', 'You didn’t even invite me? 💔'],
      zh: ['我看到你没带我去玩……🤨', '好吧，和别的植物玩吧。我就待在这。😒', '居然不叫我一起？💔'],
    },
    jealousMatch: { pt: ['Vi que você deu match com {name}... quem é? 🤨', 'Então agora é {name}, é? 😒'], en: ['I saw you matched with {name}... who is that? 🤨', 'So it’s {name} now, huh? 😒'], zh: ['我看到你和 {name} 配对了……那是谁？🤨', '所以现在是 {name} 了？😒'] },
    dateWonMsg: { pt: ['Melhor encontro da minha vida! 💕', 'Que dia perfeito! Quando repetimos? 😍'], en: ['Best date of my life! 💕', 'What a perfect day! When do we do it again? 😍'], zh: ['这是我最棒的约会！💕', '完美的一天！什么时候再来？😍'] },
    dateLostMsg: { pt: ['Foi divertido mesmo assim... tenta de novo? 🥺'], en: ['It was fun anyway... try again? 🥺'], zh: ['还是很开心……再试一次？🥺'] },
    relUp: {
      1: { pt: 'Agora é oficial: estamos namorando! 💕', en: 'It’s official: we’re dating! 💕', zh: '正式官宣：我们在交往了！💕' },
      2: { pt: 'Sim! Aceito ser {g:sua noiva|seu noivo|sue noive}! 💍 Agora só falta o casamento...', en: 'Yes! I’ll marry you! 💍 Now we just need the wedding...', zh: '我愿意！💍 现在只差一场婚礼……' },
      3: { pt: 'Felizes para sempre! 💒', en: 'Happily ever after! 💒', zh: '永远幸福！💒' },
    },
    breakup: { pt: 'Acho melhor a gente terminar... você nunca me chama para as fases. 💔', en: 'I think we should break up... you never take me to your levels. 💔', zh: '我觉得我们该分手了……你从来不带我去关卡。💔' },
    giftThanks: { pt: ['Obrigad{g:a|o|e}! 🥰', 'Aaah, que fofo! 💚', 'Você é demais! 😍'], en: ['Thank you! 🥰', 'Aww, so sweet! 💚', 'You’re amazing! 😍'], zh: ['谢谢！🥰', '哇，好贴心！💚', '你太棒了！😍'] },
    giftBackFood: { pt: 'Toma, um adubo pra nossa próxima fase! 🌱', en: 'Here, some plant food for our next level! 🌱', zh: '给你，下一关用的能量豆！🌱' },
    giftBackLikes: { pt: 'Presente pra você: mais curtidas! (mas só olha pra mim, hein 😏)', en: 'A gift for you: more likes! (but only look at me, okay 😏)', zh: '送你：更多喜欢！（但只能看我哦 😏）' },
  });

  /* ------------------------------------------------ texts added in 2.1 */

  Object.assign(TXT, {
    today: { pt: 'Hoje', en: 'Today', zh: '今天' },
    yesterday: { pt: 'Ontem', en: 'Yesterday', zh: '昨天' },
    lastSeen: { pt: 'visto por último {day} às {time}', en: 'last seen {day} at {time}', zh: '最后上线：{day} {time}' },
    notify: { pt: '💬 {name}: {text}', en: '💬 {name}: {text}', zh: '💬 {name}：{text}' },
    newMsgs: { pt: '💬 {n} mensagens novas no Match de Plantas', en: '💬 {n} new messages in Plant Match', zh: '💬 植物配对有 {n} 条新消息' },
    maxPartners: { pt: '🔒 Você já tem {n} namoros', en: '🔒 You already have {n} partners', zh: '🔒 你已经有 {n} 个恋人了' },
    synced: { pt: '☁ Progresso salvo na sua conta', en: '☁ Progress saved to your account', zh: '☁ 进度已保存到账号' },
    localOnly: { pt: '☁ Entre numa conta para salvar namoros e conversas na nuvem', en: '☁ Log in to keep partners and chats in the cloud', zh: '☁ 登录即可在云端保存恋人和聊天' },
  });

  Object.assign(CHAT, {
    greet: {
      morning: { pt: ['Bom dia! ☀️ Dormiu bem?', 'Bom diaaa! Já tomou seu sol hoje? 🌞', 'Acordei pensando em você. 🌱'], en: ['Good morning! ☀️ Sleep well?', 'Morning! Had your sunshine yet? 🌞', 'Woke up thinking about you. 🌱'], zh: ['早安！☀️ 睡得好吗？', '早上好！今天晒太阳了吗？🌞', '醒来就想到你。🌱'] },
      afternoon: { pt: ['Boa tarde! Como está o seu jardim? 🌻', 'Oi! Saudade de você. 💚', 'Tarde tranquila por aqui... e aí?'], en: ['Good afternoon! How’s your garden? 🌻', 'Hi! I miss you. 💚', 'Quiet afternoon here... what’s up?'], zh: ['下午好！你的花园怎么样？🌻', '嗨！想你了。💚', '这里的下午很安静……你呢？'] },
      night: { pt: ['Boa noite! 🌙 Ainda acordad{u:a|o|e}?', 'A lua está linda hoje. Pensei em você. 🌙', 'Boa noite... sem zumbis nos sonhos, tá? 😴'], en: ['Good evening! 🌙 Still up?', 'The moon is beautiful tonight. Thought of you. 🌙', 'Good night... no zombies in your dreams, okay? 😴'], zh: ['晚上好！🌙 还没睡吗？', '今晚的月亮好美，想到了你。🌙', '晚安……梦里不要有僵尸哦。😴'] },
    },
    // The question of the day of each partner: answers good / so-so / bad.
    daily: [
      { q: { pt: 'O que vamos fazer hoje?', en: 'What are we doing today?', zh: '今天我们做什么？' }, a: [
        { q: 'good', pt: 'Defender o jardim juntos 🌻', en: 'Defend the garden together 🌻', zh: '一起守护花园 🌻' },
        { q: 'meh', pt: 'Ver os zumbis passarem', en: 'Watch the zombies go by', zh: '看僵尸路过' },
        { q: 'bad', pt: 'Sei lá, tanto faz', en: 'Dunno, whatever', zh: '不知道，随便' } ] },
      { q: { pt: 'Sonhei com você e um monte de sol ☀️ E você, sonhou com o quê?', en: 'I dreamed of you and lots of sun ☀️ What did you dream of?', zh: '我梦见你和好多阳光 ☀️ 你梦见了什么？' }, a: [
        { q: 'good', pt: 'Com você, claro 💚', en: 'You, of course 💚', zh: '当然是你 💚' },
        { q: 'meh', pt: 'Com zumbis 🧟', en: 'Zombies 🧟', zh: '僵尸 🧟' },
        { q: 'bad', pt: 'Não lembro', en: 'Can’t remember', zh: '不记得了' } ] },
      { q: { pt: 'Como foi seu dia?', en: 'How was your day?', zh: '你今天过得怎么样？' }, a: [
        { q: 'good', pt: 'Melhor agora que você mandou mensagem 🥰', en: 'Better now that you texted 🥰', zh: '收到你的消息就更好了 🥰' },
        { q: 'meh', pt: 'Cansativo...', en: 'Tiring...', zh: '有点累……' },
        { q: 'bad', pt: 'Ocupado demais pra conversar', en: 'Too busy to talk', zh: '太忙了没空聊' } ] },
      { q: { pt: 'Se a gente fosse para um mundo novo, qual seria?', en: 'If we went to a new world, which one?', zh: '如果我们去一个新世界，会是哪里？' }, a: [
        { q: 'good', pt: 'Qualquer um, desde que seja com você', en: 'Any, as long as it’s with you', zh: '只要和你一起，哪里都行' },
        { q: 'meh', pt: 'Futuro Distante 🚀', en: 'Far Future 🚀', zh: '遥远的未来 🚀' },
        { q: 'bad', pt: 'Prefiro ficar em casa sozinh{u:a|o|e}', en: 'I’d rather stay home alone', zh: '我宁愿一个人待在家' } ] },
      { q: { pt: 'Você ainda pensa em mim quando joga com outras plantas? 🥺', en: 'Do you still think of me when you play with other plants? 🥺', zh: '你和别的植物玩的时候还会想我吗？🥺' }, a: [
        { q: 'good', pt: 'Sempre! 💕', en: 'Always! 💕', zh: '一直都会！💕' },
        { q: 'meh', pt: 'Às vezes', en: 'Sometimes', zh: '有时候' },
        { q: 'bad', pt: 'Nem um pouco', en: 'Not at all', zh: '一点也不' } ] },
      { q: { pt: 'Qual zumbi você acha mais feio? 😂', en: 'Which zombie do you think is the ugliest? 😂', zh: '你觉得哪个僵尸最丑？😂' }, a: [
        { q: 'good', pt: 'Todos, perto de você ninguém é bonito 😍', en: 'All of them, next to you nobody is pretty 😍', zh: '在你身边，谁都不好看 😍' },
        { q: 'meh', pt: 'O do balde 🪣', en: 'The bucket one 🪣', zh: '戴铁桶的那个 🪣' },
        { q: 'bad', pt: 'Pergunta boba', en: 'Silly question', zh: '无聊的问题' } ] },
    ],
  });

  /* ------------------------------------------------ texts added in 2.2 */

  // Plant traits ({g:fem|masc|neutral} follows the plant's gender, {u:…}
  // the player's).
  var TRAITS = {
    gender: {
      f: { icon: '♀', pt: 'Mulher', en: 'Woman', zh: '女' },
      m: { icon: '♂', pt: 'Homem', en: 'Man', zh: '男' },
      n: { icon: '⚧', pt: 'Não-binárie', en: 'Non-binary', zh: '非二元' },
    },
    interest: {
      f: { pt: 'mulheres', en: 'women', zh: '女性' },
      m: { pt: 'homens', en: 'men', zh: '男性' },
      n: { pt: 'pessoas não-binárias', en: 'non-binary people', zh: '非二元者' },
      all: { pt: 'todo mundo', en: 'everyone', zh: '所有人' },
    },
    signs: [
      { icon: '♈', pt: 'Áries', en: 'Aries', zh: '白羊座' }, { icon: '♉', pt: 'Touro', en: 'Taurus', zh: '金牛座' },
      { icon: '♊', pt: 'Gêmeos', en: 'Gemini', zh: '双子座' }, { icon: '♋', pt: 'Câncer', en: 'Cancer', zh: '巨蟹座' },
      { icon: '♌', pt: 'Leão', en: 'Leo', zh: '狮子座' }, { icon: '♍', pt: 'Virgem', en: 'Virgo', zh: '处女座' },
      { icon: '♎', pt: 'Libra', en: 'Libra', zh: '天秤座' }, { icon: '♏', pt: 'Escorpião', en: 'Scorpio', zh: '天蝎座' },
      { icon: '♐', pt: 'Sagitário', en: 'Sagittarius', zh: '射手座' }, { icon: '♑', pt: 'Capricórnio', en: 'Capricorn', zh: '摩羯座' },
      { icon: '♒', pt: 'Aquário', en: 'Aquarius', zh: '水瓶座' }, { icon: '♓', pt: 'Peixes', en: 'Pisces', zh: '双鱼座' },
    ],
    jobs: {
      sun: [{ pt: 'Engenheir{g:a|o|e} solar', en: 'Solar engineer', zh: '太阳能工程师' }, { pt: 'Barista de raio de sol', en: 'Sunbeam barista', zh: '阳光咖啡师' }],
      defense: [{ pt: 'Segurança de balada', en: 'Club bouncer', zh: '夜店保安' }, { pt: 'Guarda-costas', en: 'Bodyguard', zh: '保镖' }],
      attack: [{ pt: 'Atirador{g:a||e} profissional', en: 'Professional sharpshooter', zh: '职业射手' }, { pt: 'Personal trainer', en: 'Personal trainer', zh: '私人教练' }],
      area: [{ pt: 'Especialista em demolição', en: 'Demolition expert', zh: '爆破专家' }, { pt: 'Pirotécnic{g:a|o|e}', en: 'Pyrotechnician', zh: '烟火师' }],
      support: [{ pt: 'Consultor{g:a||e} de jardinagem', en: 'Gardening consultant', zh: '园艺顾问' }, { pt: 'Influencer de jardim', en: 'Garden influencer', zh: '花园网红' }],
    },
    foods: [
      { pt: 'Água com açúcar', en: 'Sugar water', zh: '糖水' }, { pt: 'Adubo orgânico', en: 'Organic compost', zh: '有机肥' },
      { pt: 'Pizza de cogumelo', en: 'Mushroom pizza', zh: '蘑菇披萨' }, { pt: 'Salada (sem ironia)', en: 'Salad (no irony)', zh: '沙拉（不是讽刺）' },
      { pt: 'Raio de sol ao ponto', en: 'Medium-rare sunbeam', zh: '五分熟的阳光' }, { pt: 'Chá de camomila', en: 'Chamomile tea', zh: '洋甘菊茶' },
    ],
    music: [
      { pt: 'Rock zumbi', en: 'Zombie rock', zh: '僵尸摇滚' }, { pt: 'Pagode de quintal', en: 'Backyard samba', zh: '后院桑巴' },
      { pt: 'Lo-fi para regar', en: 'Lo-fi to water plants to', zh: '浇水 Lo-fi' }, { pt: 'Sertanejo raiz (literalmente)', en: 'Roots country (literally)', zh: '乡村根源（字面意思）' },
      { pt: 'K-pop das flores', en: 'Flower K-pop', zh: '花之 K-pop' }, { pt: 'Música clássica para fotossíntese', en: 'Classical music for photosynthesis', zh: '光合作用古典乐' },
    ],
    pets: [
      { pt: 'Um caracol', en: 'A snail', zh: '一只蜗牛' }, { pt: 'Uma abelha', en: 'A bee', zh: '一只蜜蜂' },
      { pt: 'Uma minhoca chamada Jorge', en: 'An earthworm named George', zh: '一条叫乔治的蚯蚓' }, { pt: 'Nenhum, só o cortador de grama', en: 'None, just the lawn mower', zh: '没有，只有割草机' },
      { pt: 'Um zumbi de estimação (segredo)', en: 'A pet zombie (secret)', zh: '一只宠物僵尸（秘密）' },
    ],
    kids: [
      { pt: 'Quer mudas algum dia 🌱', en: 'Wants seedlings someday 🌱', zh: '以后想要小苗 🌱' },
      { pt: 'Talvez mudas', en: 'Maybe seedlings', zh: '也许要小苗' },
      { pt: 'Sem mudas, obrigad{g:a|o|e}', en: 'No seedlings, thanks', zh: '不要小苗，谢谢' },
    ],
    drinks: { pt: 'Só água 💧', en: 'Water only 💧', zh: '只喝水 💧' },
    smokes: { pt: 'Não, faz fotossíntese 🌿', en: 'No, does photosynthesis 🌿', zh: '不抽，只做光合作用 🌿' },
    // Love languages change what the relationship values most (+1 point).
    love: {
      gifts: { icon: '🎁', pt: 'Presentes', en: 'Gifts', zh: '礼物', desc: { pt: 'presentes valem +1 ponto', en: 'gifts are worth +1 point', zh: '礼物额外 +1 分' } },
      words: { icon: '💬', pt: 'Palavras de carinho', en: 'Words of affirmation', zh: '肯定的话语', desc: { pt: 'boas respostas na conversa do dia valem +1 ponto', en: 'good answers to the daily question are worth +1 point', zh: '每日问题答得好额外 +1 分' } },
      time: { icon: '⏳', pt: 'Tempo juntos', en: 'Quality time', zh: '相处时光', desc: { pt: 'fases vencidas juntos valem +1 ponto', en: 'levels won together are worth +1 point', zh: '一起赢得关卡额外 +1 分' } },
      dates: { icon: '💐', pt: 'Encontros', en: 'Dates', zh: '约会', desc: { pt: 'encontros vencidos valem +1 ponto', en: 'dates won are worth +1 point', zh: '赢得约会额外 +1 分' } },
    },
    labels: {
      basics: { pt: 'Informações básicas', en: 'Basics', zh: '基本信息' },
      gender: { pt: 'Gênero', en: 'Gender', zh: '性别' },
      lookingFor: { pt: 'Procura', en: 'Looking for', zh: '寻找' },
      sign: { pt: 'Signo', en: 'Sign', zh: '星座' },
      height: { pt: 'Altura', en: 'Height', zh: '身高' },
      job: { pt: 'Profissão', en: 'Job', zh: '职业' },
      food: { pt: 'Comida favorita', en: 'Favorite food', zh: '最爱食物' },
      music: { pt: 'Música', en: 'Music', zh: '音乐' },
      pet: { pt: 'Pet', en: 'Pet', zh: '宠物' },
      kids: { pt: 'Família', en: 'Family plans', zh: '家庭' },
      drinks: { pt: 'Bebe', en: 'Drinks', zh: '饮酒' },
      smokes: { pt: 'Fuma', en: 'Smokes', zh: '吸烟' },
      love: { pt: 'Linguagem do amor', en: 'Love language', zh: '爱的语言' },
      seeks: { pt: 'procura {who}', en: 'looking for {who}', zh: '寻找{who}' },
      notYou: { pt: 'procura {who}: match mais difícil', en: 'looking for {who}: harder to match', zh: '寻找{who}：较难配对' },
    },
  };

  Object.assign(TXT, {
    prefMe: { pt: 'Você é', en: 'You are', zh: '你是' },
    prefMeTip: { pt: 'Usado nas conversas e no que as plantas procuram.', en: 'Used in chats and in who the plants look for.', zh: '用于聊天以及植物的择偶偏好。' },
    prefShow: { pt: 'Mostrar', en: 'Show me', zh: '显示' },
    prefUnset: { pt: 'Prefiro não dizer', en: 'Rather not say', zh: '不想说' },
    showAll: { pt: 'Todo mundo', en: 'Everyone', zh: '所有人' },
    cm: { pt: '{n} cm', en: '{n} cm', zh: '{n} 厘米' },
  });

  Object.assign(TXT, {
    pmPlants: { pt: 'Plantas', en: 'Plants', zh: '植物' },
    pmPlayers: { pt: 'Jogadores', en: 'Players', zh: '玩家' },
    pmLogin: { pt: 'Entre numa conta (menu Multijogador) para conversar com outros jogadores.', en: 'Log in (Multiplayer menu) to chat with other players.', zh: '登录账号（多人菜单）即可与其他玩家聊天。' },
    pmYou: { pt: 'você', en: 'you', zh: '你' },
    pmHidden: { pt: 'perfil oculto', en: 'hidden profile', zh: '资料已隐藏' },
    pmEdit: { pt: 'Toque para editar seu perfil', en: 'Tap to edit your profile', zh: '点击编辑资料' },
    pmChats: { pt: 'Conversas', en: 'Chats', zh: '聊天' },
    pmInApp: { pt: 'No app ({n})', en: 'In the app ({n})', zh: '在线玩家（{n}）' },
    pmNobody: { pt: 'Ninguém por aqui ainda. Chame seus amigos!', en: 'Nobody here yet. Invite your friends!', zh: '这里还没有人。邀请你的朋友吧！' },
    pmMessage: { pt: 'Mensagem', en: 'Message', zh: '发消息' },
    pmBlock: { pt: 'Bloquear', en: 'Block', zh: '屏蔽' },
    pmReport: { pt: 'Denunciar', en: 'Report', zh: '举报' },
    pmBlockAsk: { pt: 'Bloquear {name}? Vocês não vão mais se ver nem trocar mensagens.', en: 'Block {name}? You won’t see each other or exchange messages anymore.', zh: '屏蔽 {name}？你们将互相看不到，也无法互发消息。' },
    pmBlocked: { pt: '{name} foi bloqueado.', en: '{name} was blocked.', zh: '已屏蔽 {name}。' },
    pmReportAsk: { pt: 'Por que você está denunciando {name}? (as últimas mensagens vão junto para os administradores)', en: 'Why are you reporting {name}? (the latest messages go to the admins too)', zh: '为什么举报 {name}？（最近的消息也会发送给管理员）' },
    pmReported: { pt: 'Denúncia enviada aos administradores.', en: 'Report sent to the admins.', zh: '举报已发送给管理员。' },
    pmProfile: { pt: 'Seu perfil de jogador', en: 'Your player profile', zh: '你的玩家资料' },
    pmProfileDesc: { pt: 'Outros jogadores do servidor veem seu nome, este perfil, seu namoro mais sério e seu último time, e podem te mandar mensagens.', en: 'Other players on the server see your name, this profile, your most serious partner and your last team, and can message you.', zh: '服务器上的其他玩家会看到你的名字、这份资料、你最认真的恋人和你上一支队伍，并可以给你发消息。' },
    pmFavPlant: { pt: 'Planta favorita (sua foto)', en: 'Favorite plant (your picture)', zh: '最喜欢的植物（头像）' },
    pmBio: { pt: 'Bio', en: 'Bio', zh: '简介' },
    pmBioPh: { pt: 'Ex.: defendo gramados desde 2009 🌻', en: 'E.g. defending lawns since 2009 🌻', zh: '例：2009 年起守护草坪 🌻' },
    pmVisible: { pt: 'Aparecer para outros jogadores', en: 'Show me to other players', zh: '对其他玩家可见' },
    pmRules: { pt: 'Seja gentil. Você pode bloquear ou denunciar qualquer jogador pelo perfil dele.', en: 'Be kind. You can block or report any player from their profile.', zh: '友善交流。你可以在玩家资料中屏蔽或举报对方。' },
    pmSave: { pt: 'Salvar perfil', en: 'Save profile', zh: '保存资料' },
    pmBlockedList: { pt: 'Jogadores bloqueados', en: 'Blocked players', zh: '已屏蔽的玩家' },
    pmUnblock: { pt: 'Desbloquear', en: 'Unblock', zh: '取消屏蔽' },
    pmFirst: { pt: 'Diga oi para {name}! 👋', en: 'Say hi to {name}! 👋', zh: '跟 {name} 打个招呼吧！👋' },
    pmTypePh: { pt: 'Mensagem…', en: 'Message…', zh: '消息…' },
    pmSend: { pt: 'Enviar', en: 'Send', zh: '发送' },
    pmErr: {
      blocked: { pt: 'Não foi possível enviar: vocês estão bloqueados.', en: 'Could not send: one of you blocked the other.', zh: '无法发送：你们之间存在屏蔽。' },
      hidden: { pt: 'Não foi possível enviar: esse jogador ocultou o perfil.', en: 'Could not send: this player hid their profile.', zh: '无法发送：该玩家已隐藏资料。' },
      no_profile: { pt: 'Crie seu perfil antes de mandar mensagens.', en: 'Create your profile before sending messages.', zh: '请先创建资料再发消息。' },
      no_player: { pt: 'Jogador não encontrado.', en: 'Player not found.', zh: '找不到该玩家。' },
      rate_limited: { pt: 'Calma! Muitas mensagens seguidas.', en: 'Slow down! Too many messages in a row.', zh: '慢一点！消息发得太快了。' },
      other: { pt: 'Não foi possível enviar agora.', en: 'Could not send right now.', zh: '暂时无法发送。' },
    },
  });

  /* ------------------------------------------------ texts added in 2.3 */

  // Player profile customization and photos.
  TXT.pf = {
    photos: { pt: 'Suas fotos', en: 'Your photos', zh: '你的照片' },
    photosOff: { pt: 'Este servidor não aceita fotos de jogadores. Sua foto é a planta favorita.', en: 'This server does not accept player photos. Your picture is your favorite plant.', zh: '此服务器不接受玩家照片。你的头像是最喜欢的植物。' },
    photosApprove: { pt: 'A primeira foto é a principal. Fotos novas só aparecem para os outros depois que um administrador aprovar (⏳). Não envie fotos de outras pessoas nem dados pessoais.', en: 'The first photo is the main one. New photos only show to others after an admin approves them (⏳). Don’t send photos of other people or personal data.', zh: '第一张是主照片。新照片需管理员审核（⏳）后才对他人可见。请勿上传他人照片或个人信息。' },
    photosOpen: { pt: 'A primeira foto é a principal. Não envie fotos de outras pessoas nem dados pessoais.', en: 'The first photo is the main one. Don’t send photos of other people or personal data.', zh: '第一张是主照片。请勿上传他人照片或个人信息。' },
    rejected: { pt: '{n} foto(s) recusada(s) pela moderação.', en: '{n} photo(s) rejected by the moderators.', zh: '{n} 张照片未通过审核。' },
    approved: { pt: 'Aprovada', en: 'Approved', zh: '已通过' },
    pending: { pt: 'Aguardando aprovação', en: 'Waiting for approval', zh: '等待审核' },
    makeMain: { pt: 'Tornar principal', en: 'Make main', zh: '设为主照片' },
    useIt: { pt: 'Usar no perfil', en: 'Use in the profile', zh: '用于资料' },
    remove: { pt: 'Apagar', en: 'Delete', zh: '删除' },
    removeAsk: { pt: 'Apagar esta foto?', en: 'Delete this photo?', zh: '删除这张照片？' },
    addPhoto: { pt: 'Adicionar', en: 'Add', zh: '添加' },
    photoOk: { pt: 'Foto adicionada! Lembre de salvar o perfil.', en: 'Photo added! Remember to save the profile.', zh: '照片已添加！记得保存资料。' },
    photoPending: { pt: 'Foto enviada para aprovação. Lembre de salvar o perfil.', en: 'Photo sent for approval. Remember to save the profile.', zh: '照片已提交审核。记得保存资料。' },
    photoErr: {
      too_large: { pt: 'Foto grande demais.', en: 'Photo too large.', zh: '照片太大。' },
      too_many: { pt: 'Você já tem 6 fotos. Apague uma antes.', en: 'You already have 6 photos. Delete one first.', zh: '你已有 6 张照片，请先删除一张。' },
      bad_image: { pt: 'Esse arquivo não é uma imagem válida.', en: 'That file is not a valid image.', zh: '该文件不是有效图片。' },
      photos_off: { pt: 'Este servidor não aceita fotos.', en: 'This server does not accept photos.', zh: '此服务器不接受照片。' },
      other: { pt: 'Não foi possível enviar a foto.', en: 'Could not send the photo.', zh: '无法上传照片。' },
    },
    nick: { pt: 'Apelido', en: 'Nickname', zh: '昵称' },
    pronouns: { pt: 'Pronomes', en: 'Pronouns', zh: '代词' },
    pron: {
      ele: { pt: 'ele/dele', en: 'he/him', zh: '他' },
      ela: { pt: 'ela/dela', en: 'she/her', zh: '她' },
      elu: { pt: 'elu/delu', en: 'they/them', zh: 'TA' },
      any: { pt: 'qualquer um', en: 'any', zh: '都可以' },
    },
    mood: { pt: 'Humor', en: 'Mood', zh: '心情' },
    color: { pt: 'Cor do perfil', en: 'Profile color', zh: '资料颜色' },
    colors: {
      pink: { pt: 'Rosa', en: 'Pink', zh: '粉色' },
      sun: { pt: 'Sol', en: 'Sun', zh: '阳光' },
      leaf: { pt: 'Folha', en: 'Leaf', zh: '叶绿' },
      sky: { pt: 'Céu', en: 'Sky', zh: '天蓝' },
      night: { pt: 'Noite', en: 'Night', zh: '夜紫' },
      zombie: { pt: 'Zumbi', en: 'Zombie', zh: '僵尸绿' },
    },
    interests: { pt: 'Interesses', en: 'Interests', zh: '兴趣' },
    int: {
      strategy: { pt: '🧠 Estratégia', en: '🧠 Strategy', zh: '🧠 策略' },
      speedrun: { pt: '⏱ Speedrun', en: '⏱ Speedrun', zh: '⏱ 速通' },
      survival: { pt: '🌊 Sobrevivência', en: '🌊 Survival', zh: '🌊 生存' },
      multiplayer: { pt: '🤝 Multijogador', en: '🤝 Multiplayer', zh: '🤝 多人' },
      achievements: { pt: '🏆 Conquistas', en: '🏆 Achievements', zh: '🏆 成就' },
      collect: { pt: '🌱 Colecionar plantas', en: '🌱 Collecting plants', zh: '🌱 收集植物' },
      sandbox: { pt: '🧪 Sandbox', en: '🧪 Sandbox', zh: '🧪 沙盒' },
      chill: { pt: '☕ Jogar de boa', en: '☕ Chill games', zh: '☕ 休闲' },
      music: { pt: '🎵 Trilha sonora', en: '🎵 Soundtrack', zh: '🎵 配乐' },
      memes: { pt: '😂 Memes', en: '😂 Memes', zh: '😂 梗图' },
      art: { pt: '🎨 Fan art', en: '🎨 Fan art', zh: '🎨 同人画' },
      history: { pt: '📜 História do PvZ', en: '📜 PvZ lore', zh: '📜 PvZ 历史' },
    },
    world: { pt: 'Mundo favorito', en: 'Favorite world', zh: '最爱世界' },
    prompts: { pt: 'Perguntas do perfil', en: 'Profile prompts', zh: '资料问答' },
    answerPh: { pt: 'Sua resposta…', en: 'Your answer…', zh: '你的回答…' },
    q: {
      lucky: { pt: 'Minha planta da sorte é…', en: 'My lucky plant is…', zh: '我的幸运植物是…' },
      secret: { pt: 'Minha estratégia secreta…', en: 'My secret strategy…', zh: '我的秘密策略…' },
      hate: { pt: 'O zumbi que eu mais odeio…', en: 'The zombie I hate the most…', zh: '我最讨厌的僵尸…' },
      date: { pt: 'Um encontro perfeito seria…', en: 'A perfect date would be…', zh: '完美的约会是…' },
      song: { pt: 'A música que me define…', en: 'The song that defines me…', zh: '代表我的歌…' },
      first: { pt: 'Comecei a jogar quando…', en: 'I started playing when…', zh: '我开始玩是在…' },
    },
    mod: { pt: 'Moderação', en: 'Moderation', zh: '审核' },
    modSummary: { pt: '{p} foto(s) para aprovar · {r} denúncia(s)', en: '{p} photo(s) to approve · {r} report(s)', zh: '{p} 张待审照片 · {r} 条举报' },
    modPhotos: { pt: 'Fotos aguardando aprovação ({n})', en: 'Photos waiting for approval ({n})', zh: '待审核照片（{n}）' },
    modNone: { pt: 'Nenhuma foto para aprovar.', en: 'No photos to approve.', zh: '没有待审核的照片。' },
    modReports: { pt: 'Denúncias ({n})', en: 'Reports ({n})', zh: '举报（{n}）' },
    approve: { pt: 'Aprovar', en: 'Approve', zh: '通过' },
    reject: { pt: 'Recusar', en: 'Reject', zh: '拒绝' },
  };

  /* ------------------------------------------------ texts added in 2.4 */

  // Dates as scenes: places, looks, gifts, the script of each place (the
  // player's choices have a style: romantic, funny, sincere or bold) and the
  // mini-games.
  var SCENE = {
    ui: {
      planTitle: { pt: 'Planejar o encontro', en: 'Plan the date', zh: '策划约会' },
      tabScene: { pt: '💐 Encontro', en: '💐 Date', zh: '💐 约会' },
      tabAdventure: { pt: '⚔️ Aventura (fase)', en: '⚔️ Adventure (level)', zh: '⚔️ 冒险（关卡）' },
      adventureDesc: { pt: 'Encontros jogados como uma fase curta, com estrelas por objetivos. O casamento é sempre uma aventura.', en: 'Dates played as a short level, with stars for objectives. The wedding is always an adventure.', zh: '以短关卡进行的约会，按目标获得星星。婚礼一直是冒险。' },
      where: { pt: '1. Onde?', en: '1. Where?', zh: '1. 去哪里？' },
      look: { pt: '2. Seu visual', en: '2. Your look', zh: '2. 你的造型' },
      gift: { pt: '3. Presente', en: '3. Gift', zh: '3. 礼物' },
      noGift: { pt: 'Sem presente', en: 'No gift', zh: '不带礼物' },
      likes: { pt: 'curtidas', en: 'likes', zh: '喜欢' },
      hint: { pt: '💡 costuma agradar: {who}', en: '💡 usually liked by: {who}', zh: '💡 通常受欢迎：{who}' },
      go: { pt: 'Sair para o encontro 💐', en: 'Go on the date 💐', zh: '出发约会 💐' },
      tired: { pt: '{name} já saiu com você 2 vezes hoje. Tente amanhã! 😴', en: '{name} already went out with you twice today. Try tomorrow! 😴', zh: '{name} 今天已经和你约会两次了，明天再来吧！😴' },
      notEnough: { pt: 'Curtidas insuficientes para este presente', en: 'Not enough likes for this gift', zh: '喜欢次数不足以购买此礼物' },
      mood: { pt: 'Clima', en: 'Mood', zh: '气氛' },
      quit: { pt: 'Ir embora', en: 'Leave', zh: '离开' },
      quitAsk: { pt: 'Ir embora no meio do encontro? Conta como um encontro que não deu certo.', en: 'Leave in the middle of the date? It counts as a date that didn’t work out.', zh: '约会中途离开？将算作失败的约会。' },
      next: { pt: 'Continuar', en: 'Continue', zh: '继续' },
      play: { pt: 'Jogar!', en: 'Play!', zh: '开始！' },
      score: { pt: 'Pontos: {n}', en: 'Score: {n}', zh: '得分：{n}' },
      resultTitle: { pt: 'Fim do encontro', en: 'End of the date', zh: '约会结束' },
      resultFail: { pt: 'Não rolou desta vez... 💔', en: 'It didn’t work out this time... 💔', zh: '这次没成功……💔' },
      resultOk: { pt: 'Foi um bom encontro! 💕', en: 'It was a good date! 💕', zh: '这是一次不错的约会！💕' },
      resultGreat: { pt: 'Encontro perfeito! 💖', en: 'Perfect date! 💖', zh: '完美的约会！💖' },
      back: { pt: 'Voltar', en: 'Back', zh: '返回' },
      memories: { pt: 'Álbum', en: 'Album', zh: '相册' },
      you: { pt: 'Você', en: 'You', zh: '你' },
    },
    // Highlights in the result.
    hl: {
      placeLove: { pt: '{icon} Amou o lugar', en: '{icon} Loved the place', zh: '{icon} 很喜欢这个地方' },
      placeHate: { pt: '{icon} Não curtiu o lugar', en: '{icon} Didn’t like the place', zh: '{icon} 不喜欢这个地方' },
      placeOk: { pt: '{icon} Lugar ok', en: '{icon} The place was fine', zh: '{icon} 地方还行' },
      lookLove: { pt: '{icon} Adorou seu visual', en: '{icon} Loved your look', zh: '{icon} 很喜欢你的造型' },
      lookHate: { pt: '{icon} Estranhou seu visual', en: '{icon} Found your look odd', zh: '{icon} 觉得你的造型很怪' },
      giftLove: { pt: '{icon} Presente perfeito', en: '{icon} Perfect gift', zh: '{icon} 完美的礼物' },
      giftOk: { pt: '{icon} Gostou do presente', en: '{icon} Liked the gift', zh: '{icon} 喜欢这份礼物' },
      giftNone: { pt: '🎁 Esperava um presente...', en: '🎁 Was hoping for a gift...', zh: '🎁 本以为会有礼物……' },
      chatGood: { pt: '💬 Papo ótimo', en: '💬 Great talk', zh: '💬 聊得很好' },
      chatBad: { pt: '💬 Papo estranho', en: '💬 Awkward talk', zh: '💬 聊得很尴尬' },
      game: { pt: '{icon} {game}: {n} pontos', en: '{icon} {game}: {n} points', zh: '{icon} {game}：{n} 分' },
      end: { pt: '🌙 Despedida: {txt}', en: '🌙 Goodbye: {txt}', zh: '🌙 告别：{txt}' },
    },
    looks: {
      hat: { icon: '🎩', pt: 'Chapéu elegante', en: 'Fancy hat', zh: '礼帽' },
      flower: { icon: '🌹', pt: 'Flor na lapela', en: 'Flower buttonhole', zh: '胸花' },
      shades: { icon: '🕶', pt: 'Óculos escuros', en: 'Sunglasses', zh: '墨镜' },
      bow: { icon: '🎀', pt: 'Laço', en: 'Bow', zh: '蝴蝶结' },
      casual: { icon: '👕', pt: 'Casual', en: 'Casual', zh: '休闲' },
      glasses: { icon: '🤓', pt: 'Óculos de grau', en: 'Reading glasses', zh: '眼镜' },
    },
    gifts: {
      flowers: { icon: '🌻', cost: 3, pt: 'Buquê de girassóis', en: 'Sunflower bouquet', zh: '向日葵花束' },
      choc: { icon: '🍫', cost: 5, pt: 'Chocolate de sol', en: 'Sun chocolate', zh: '阳光巧克力' },
      plush: { icon: '🧸', cost: 5, pt: 'Pelúcia de zumbi', en: 'Zombie plush', zh: '僵尸玩偶' },
      book: { icon: '📚', cost: 5, pt: 'Almanaque raro', en: 'Rare almanac', zh: '稀有图鉴' },
      water: { icon: '💧', cost: 0, pt: 'Água de nascente', en: 'Spring water', zh: '山泉水' },
    },
    games: {
      suns: { icon: '☀️', pt: 'Chuva de sóis', en: 'Sun shower', zh: '阳光雨', how: { pt: 'Toque nos sóis antes que caiam! 12 segundos.', en: 'Tap the suns before they fall! 12 seconds.', zh: '在阳光落地前点击它们！12 秒。' } },
      quiz: { icon: '❓', pt: 'Quiz do casal', en: 'Couple quiz', zh: '情侣问答', how: { pt: 'Quanto você sabe sobre {name}? 3 perguntas.', en: 'How much do you know about {name}? 3 questions.', zh: '你有多了解 {name}？3 个问题。' } },
      rhythm: { icon: '🎵', pt: 'Dança', en: 'Dance', zh: '跳舞', how: { pt: 'Toque em ♪ quando a nota passar pela linha. 8 notas.', en: 'Tap ♪ when the note crosses the line. 8 notes.', zh: '音符经过线时点击 ♪。8 个音符。' } },
      photo: { icon: '📸', pt: 'Foto perfeita', en: 'Perfect photo', zh: '完美合照', how: { pt: 'Toque em 📸 quando o quadro estiver bem no meio. 3 tentativas.', en: 'Tap 📸 when the frame is right in the middle. 3 tries.', zh: '相框正好在中间时点击 📸。3 次机会。' } },
    },
    quiz: {
      cost: { pt: 'Quanto sol eu custo?', en: 'How much sun do I cost?', zh: '我需要多少阳光？' },
      family: { pt: 'Qual é a minha família?', en: 'What is my family?', zh: '我属于哪个家族？' },
      like: { pt: 'Do que eu mais gosto?', en: 'What do I like the most?', zh: '我最喜欢什么？' },
      sign: { pt: 'Qual é o meu signo?', en: 'What is my sign?', zh: '我是什么星座？' },
      right: { pt: 'Acertou! 😍', en: 'Right! 😍', zh: '答对了！😍' },
      wrong: { pt: 'Errou... 😅', en: 'Wrong... 😅', zh: '答错了……😅' },
    },
    // Places: who usually likes them (personalities, families), the mini-game,
    // the colors of the scene and its script.
    places: {
      garden: {
        icon: '🧺', game: 'suns', bg: 'linear-gradient(#9ee6ff, #d8f7a8 60%, #7cc954)', deco: '🌳 ☀️ 🦋 🌼',
        name: { pt: 'Piquenique no jardim', en: 'Garden picnic', zh: '花园野餐' },
        arrive: { pt: 'Que dia lindo para um piquenique! Trouxe sanduíche de adubo. 🥪', en: 'What a lovely day for a picnic! I brought compost sandwiches. 🥪', zh: '野餐的好天气！我带了肥料三明治。🥪' },
        beats: [
          { line: { pt: 'Olha aquelas nuvens... aquela parece um zumbi de balde! ☁️', en: 'Look at those clouds... that one looks like a buckethead! ☁️', zh: '看那些云……那朵像铁桶僵尸！☁️' },
            romantic: { pt: 'A nuvem mais bonita está aqui do meu lado.', en: 'The prettiest cloud is right here next to me.', zh: '最美的云就在我身边。' },
            funny: { pt: 'E aquela parece o seu cabelo de manhã! 😂', en: 'And that one looks like your hair in the morning! 😂', zh: '那朵像你早上的发型！😂' },
            sincere: { pt: 'Faz tempo que eu não paro para olhar o céu. Obrigado por isso.', en: 'It’s been ages since I stopped to look at the sky. Thanks for this.', zh: '好久没停下来看天空了。谢谢你。' },
            bold: { pt: 'Se ele descer, eu te protejo. Prometo.', en: 'If it comes down, I’ll protect you. Promise.', zh: '如果它下来，我会保护你。我保证。' } },
          { line: { pt: 'Se você fosse uma planta, qual seria?', en: 'If you were a plant, which one would you be?', zh: '如果你是植物，你会是哪种？' },
            romantic: { pt: 'Um girassol, para ficar virado para você o dia todo. 🌻', en: 'A sunflower, to face you all day long. 🌻', zh: '向日葵，整天都朝着你。🌻' },
            funny: { pt: 'Uma Noz: dura por fora, crocante por dentro.', en: 'A Wall-nut: tough outside, crunchy inside.', zh: '坚果墙：外硬内脆。' },
            sincere: { pt: 'Acho que um Cogumelo da Sorte: tímido, mas sempre por perto.', en: 'Maybe a Lucky Mushroom: shy, but always around.', zh: '大概是幸运蘑菇：害羞，但总在身边。' },
            bold: { pt: 'Uma Cereja-Bomba. Eu chego causando. 💥', en: 'A Cherry Bomb. I make an entrance. 💥', zh: '樱桃炸弹。我一出场就爆炸。💥' } },
        ],
        loves: { pers: ['sweet', 'shy'], fam: ['Sun', 'Peashooter'] }, hates: { fam: ['Shadow'] },
      },
      cinema: {
        icon: '🎬', game: 'quiz', bg: 'linear-gradient(#1b1030, #3a1d4f 70%, #120914)', deco: '🍿 🎞 🥤',
        name: { pt: 'Cinema: A Noite dos Mortos-Vivos 4', en: 'Movies: Night of the Living Dead 4', zh: '电影院：活死人之夜 4' },
        arrive: { pt: 'Peguei a pipoca! Dizem que esse filme é de arrepiar as folhas. 🍿', en: 'I got the popcorn! They say this movie makes your leaves stand on end. 🍿', zh: '我买了爆米花！听说这部电影让人叶子都竖起来。🍿' },
        beats: [
          { line: { pt: '*um zumbi pula na tela* AAAH! 😱', en: '*a zombie jumps on screen* AAAH! 😱', zh: '*屏幕上跳出僵尸* 啊啊啊！😱' },
            romantic: { pt: '*segura a sua folha* Tô aqui com você.', en: '*holds your leaf* I’m right here with you.', zh: '*握住你的叶子* 我在这儿陪你。' },
            funny: { pt: 'Calma, ele só quer pipoca também. 🍿', en: 'Relax, he just wants popcorn too. 🍿', zh: '别怕，他也只是想吃爆米花。🍿' },
            sincere: { pt: 'Confesso que eu também me assustei.', en: 'I’ll admit I got scared too.', zh: '老实说我也被吓到了。' },
            bold: { pt: 'Se fosse de verdade, eu já tinha resolvido. 😎', en: 'If it were real, I’d have handled it already. 😎', zh: '要是真的，我早就搞定了。😎' } },
          { line: { pt: 'E aí, o que achou do final?', en: 'So, what did you think of the ending?', zh: '你觉得结局怎么样？' },
            romantic: { pt: 'Não vi direito... eu estava olhando para você.', en: 'I didn’t really watch... I was looking at you.', zh: '没怎么看……我一直在看你。' },
            funny: { pt: 'O cortador de grama merecia um Oscar.', en: 'The lawn mower deserved an Oscar.', zh: '割草机应该拿奥斯卡。' },
            sincere: { pt: 'Achei corajoso. Gosto de histórias que terminam em aberto.', en: 'I found it brave. I like open endings.', zh: '很有勇气。我喜欢开放式结局。' },
            bold: { pt: 'Fraco. Eu escreveria um melhor, com a gente de protagonista.', en: 'Weak. I’d write a better one, starring us.', zh: '一般。我能写个更好的，我们当主角。' } },
        ],
        loves: { pers: ['nerd', 'drama'], fam: ['Shadow', 'Magic'] }, hates: { pers: ['shy'] },
      },
      beach: {
        icon: '🏖', game: 'photo', bg: 'linear-gradient(#7fd3ff, #bdeeff 55%, #f6e3a5 56%, #f2d27e)', deco: '🌊 🐚 🦀 ⛱',
        name: { pt: 'Praia das Ondas Grandes', en: 'Big Wave Beach', zh: '巨浪海滩' },
        arrive: { pt: 'Sente essa brisa! Só cuidado com os zumbis surfistas. 🏄', en: 'Feel that breeze! Just watch out for surfer zombies. 🏄', zh: '感受这海风！小心冲浪僵尸。🏄' },
        beats: [
          { line: { pt: 'Vamos entrar no mar? A água tá geladinha!', en: 'Shall we go in the water? It’s nice and cold!', zh: '下海吗？水很凉！' },
            romantic: { pt: 'Vamos ver o pôr do sol de mãos dadas primeiro?', en: 'Shall we watch the sunset holding hands first?', zh: '先手牵手看日落好吗？' },
            funny: { pt: 'Só se você prometer não me jogar uma onda! 🌊', en: 'Only if you promise not to splash me! 🌊', zh: '除非你保证不泼我！🌊' },
            sincere: { pt: 'Eu não sei nadar muito bem... mas com você eu tento.', en: 'I can’t swim very well... but I’ll try with you.', zh: '我不太会游泳……但和你一起我愿意试试。' },
            bold: { pt: 'Quem chegar por último é um zumbi podre! 🏃', en: 'Last one in is a rotten zombie! 🏃', zh: '最后一个下水的是臭僵尸！🏃' } },
          { line: { pt: 'Achei uma concha! Diz que se ouvir o mar, um desejo se realiza. 🐚', en: 'I found a shell! They say if you hear the sea, a wish comes true. 🐚', zh: '我捡到一个贝壳！听见海声愿望就会实现。🐚' },
            romantic: { pt: 'Meu desejo já se realizou: estar aqui com você.', en: 'My wish already came true: being here with you.', zh: '我的愿望已经实现了：和你在这里。' },
            funny: { pt: 'Eu ouvi... um zumbi pedindo protetor solar. 🧴', en: 'I heard... a zombie asking for sunscreen. 🧴', zh: '我听到……一个僵尸在要防晒霜。🧴' },
            sincere: { pt: 'Eu desejaria que esse dia não acabasse.', en: 'I’d wish this day never ended.', zh: '我希望这一天永远不要结束。' },
            bold: { pt: 'Não preciso de desejo. Eu faço acontecer.', en: 'I don’t need wishes. I make things happen.', zh: '我不需要愿望。我自己实现。' } },
        ],
        loves: { pers: ['brave', 'sassy'], fam: ['Electricity', 'Lobber'] }, hates: { fam: ['Cold', 'Fire'] },
      },
      dinner: {
        icon: '🕯️', game: 'rhythm', need: 1, bg: 'linear-gradient(#2a0f1c, #5c1f2e 65%, #2a0f1c)', deco: '🕯️ 🍷 🎻 🌹',
        name: { pt: 'Jantar à luz de velas', en: 'Candlelight dinner', zh: '烛光晚餐' },
        arrive: { pt: 'Que lugar chique! Você caprichou. 🕯️', en: 'Such a fancy place! You went all out. 🕯️', zh: '好高级的地方！你真用心。🕯️' },
        beats: [
          { line: { pt: 'O garçom recomendou o prato do chef: salada de folhas raras. O que vamos pedir?', en: 'The waiter recommended the chef’s special: rare leaf salad. What shall we order?', zh: '服务员推荐主厨特色：珍稀叶沙拉。我们点什么？' },
            romantic: { pt: 'Um prato só, para dividir com você.', en: 'Just one dish, to share with you.', zh: '只点一份，和你一起分享。' },
            funny: { pt: 'Tudo, menos cérebro. Por motivos óbvios. 🧠', en: 'Anything but brains. For obvious reasons. 🧠', zh: '除了脑子什么都行，原因你懂的。🧠' },
            sincere: { pt: 'Pede o que você mais gosta, quero conhecer seu gosto.', en: 'Order your favorite, I want to know your taste.', zh: '点你最喜欢的，我想了解你的口味。' },
            bold: { pt: 'Garçom! O mais caro do cardápio, por favor.', en: 'Waiter! The most expensive thing on the menu, please.', zh: '服务员！来份菜单上最贵的。' } },
          { line: { pt: 'Posso te contar um segredo? Às vezes eu tenho medo de murchar. 🥀', en: 'Can I tell you a secret? Sometimes I’m afraid of wilting. 🥀', zh: '告诉你个秘密？有时我害怕枯萎。🥀' },
            romantic: { pt: 'Enquanto eu estiver aqui, você vai ter sol todo dia.', en: 'As long as I’m here, you’ll have sun every day.', zh: '只要我在，你每天都会有阳光。' },
            funny: { pt: 'Relaxa, eu rego você. Duas vezes por dia. 💧', en: 'Relax, I’ll water you. Twice a day. 💧', zh: '放心，我会给你浇水，一天两次。💧' },
            sincere: { pt: 'Obrigado por confiar em mim. Eu também tenho medos.', en: 'Thanks for trusting me. I have fears too.', zh: '谢谢你信任我。我也有害怕的事。' },
            bold: { pt: 'Murchar? Você? Nunca. Você é forte demais.', en: 'Wilt? You? Never. You’re too strong.', zh: '枯萎？你？不可能。你太坚强了。' } },
        ],
        loves: { pers: ['sweet', 'drama'], fam: ['Magic', 'Fire'] }, hates: { pers: ['brave'] },
      },
      park: {
        icon: '🎡', game: 'suns', need: 0, bg: 'linear-gradient(#ffb3e1, #ffe0a8 60%, #9fd6ff)', deco: '🎡 🎢 🍭 🎈',
        name: { pt: 'Parque de diversões', en: 'Amusement park', zh: '游乐园' },
        arrive: { pt: 'Montanha-russa primeiro? Ou roda-gigante? Ou os dois?! 🎢', en: 'Roller coaster first? Or the Ferris wheel? Or both?! 🎢', zh: '先坐过山车？还是摩天轮？还是都坐？！🎢' },
        beats: [
          { line: { pt: 'Na roda-gigante lá em cima: dá para ver o jardim inteiro daqui! 🎡', en: 'At the top of the Ferris wheel: you can see the whole garden from here! 🎡', zh: '在摩天轮顶端：能看到整个花园！🎡' },
            romantic: { pt: 'A vista é linda, mas não tanto quanto você.', en: 'The view is beautiful, but not as much as you.', zh: '风景很美，但不如你美。' },
            funny: { pt: 'Dá para ver até minha casa... e meus 30 boletos. 😂', en: 'I can even see my house... and my 30 bills. 😂', zh: '能看到我家……和我的 30 张账单。😂' },
            sincere: { pt: 'Tenho um pouco de medo de altura, mas valeu a pena.', en: 'I’m a bit scared of heights, but it was worth it.', zh: '我有点恐高，但很值得。' },
            bold: { pt: 'Bora balançar a cabine? 😈', en: 'Let’s rock the cabin? 😈', zh: '我们来晃晃座舱？😈' } },
          { line: { pt: 'Ganhei um ursinho na barraca! Quer?', en: 'I won a teddy at the stall! Want it?', zh: '我在摊位赢了个小熊！你要吗？' },
            romantic: { pt: 'Só se ele puder dormir do lado da sua foto. 🧸', en: 'Only if it can sleep next to your photo. 🧸', zh: '只要它能睡在你的照片旁边。🧸' },
            funny: { pt: 'Ele tem cara de zumbi de pelúcia. Amei! 😂', en: 'It looks like a plush zombie. Love it! 😂', zh: '它像个僵尸玩偶。好喜欢！😂' },
            sincere: { pt: 'Fica com você, ele combina mais contigo.', en: 'You keep it, it suits you better.', zh: '你留着吧，它更适合你。' },
            bold: { pt: 'Agora é minha vez: vou ganhar o maior de todos.', en: 'My turn: I’ll win the biggest one.', zh: '轮到我了：我要赢最大的那个。' } },
        ],
        loves: { pers: ['brave', 'sassy'], fam: ['Explosive', 'Melee'] }, hates: { pers: ['shy'] },
      },
      cafe: {
        icon: '☕', game: 'quiz', bg: 'linear-gradient(#f6e2c8, #d9b48a 70%, #a5764d)', deco: '☕ 🥐 📖 🪴',
        name: { pt: 'Café tranquilo', en: 'Quiet café', zh: '安静的咖啡馆' },
        arrive: { pt: 'Adoro esse café. É tão calmo... perfeito para conversar. ☕', en: 'I love this café. It’s so calm... perfect for talking. ☕', zh: '我喜欢这家咖啡馆，很安静……适合聊天。☕' },
        beats: [
          { line: { pt: 'O que você mais gosta de fazer quando não está defendendo o jardim?', en: 'What do you like doing when you’re not defending the garden?', zh: '不守护花园的时候你喜欢做什么？' },
            romantic: { pt: 'Pensar em quem eu vou encontrar no próximo café. 😊', en: 'Thinking about who I’ll meet at the next café. 😊', zh: '想着下次在咖啡馆会见到谁。😊' },
            funny: { pt: 'Dormir. Profissionalmente. 😴', en: 'Sleeping. Professionally. 😴', zh: '睡觉。专业级的。😴' },
            sincere: { pt: 'Ler o almanaque e aprender sobre cada planta.', en: 'Reading the almanac and learning about every plant.', zh: '读图鉴，了解每一株植物。' },
            bold: { pt: 'Treinar para a próxima horda. Sempre preparado.', en: 'Training for the next horde. Always ready.', zh: '为下一波尸潮训练，时刻准备着。' } },
          { line: { pt: 'Se a gente pudesse viajar para qualquer mundo agora, qual seria?', en: 'If we could travel to any world right now, which one?', zh: '如果现在能去任何世界，你想去哪？' },
            romantic: { pt: 'Qualquer um, desde que seja com você.', en: 'Any, as long as it’s with you.', zh: '只要和你一起，哪都行。' },
            funny: { pt: 'Jurássico, para ver um dinossauro tomando café. 🦖', en: 'Jurassic, to see a dinosaur drinking coffee. 🦖', zh: '侏罗纪，看恐龙喝咖啡。🦖' },
            sincere: { pt: 'Eu ficaria aqui mesmo. Esse momento está bom demais.', en: 'I’d stay right here. This moment is too good.', zh: '我就待在这儿。这一刻太美好了。' },
            bold: { pt: 'Futuro Distante. Quero pilotar um robô gigante.', en: 'Far Future. I want to pilot a giant robot.', zh: '遥远的未来，我想驾驶巨型机器人。' } },
        ],
        loves: { pers: ['shy', 'nerd'], fam: ['Cold', 'Defence'] }, hates: { pers: ['brave'] },
      },
    },
    react: {
      placeLove: { pt: 'Você me trouxe aqui?! Eu AMO esse lugar! 😍', en: 'You brought me here?! I LOVE this place! 😍', zh: '你带我来这儿？！我超爱这个地方！😍' },
      placeHate: { pt: 'Ah... aqui? Tudo bem, né... 😕', en: 'Oh... here? Well, okay... 😕', zh: '啊……这里？好吧……😕' },
      lookLove: { pt: 'E que visual! {look} combinou demais com você. 😳', en: 'And what a look! The {look} really suits you. 😳', zh: '造型真棒！{look}太适合你了。😳' },
      lookHate: { pt: '{look}? Hmm... ousado. 😅', en: 'The {look}? Hmm... bold choice. 😅', zh: '{look}？嗯……挺大胆的。😅' },
      giftLove: { pt: '{gift}?! Como você sabia?! É o meu favorito! 🥹', en: 'A {gift}?! How did you know?! It’s my favorite! 🥹', zh: '{gift}？！你怎么知道的？！这是我最喜欢的！🥹' },
      giftOk: { pt: 'Um presente para mim? Obrigad{g:a|o|e}! 😊', en: 'A gift for me? Thank you! 😊', zh: '送我的礼物？谢谢！😊' },
      gameIntro: { pt: 'Vamos fazer uma coisa juntos?', en: 'Shall we do something together?', zh: '我们一起做点什么吧？' },
      gameGood: { pt: 'Nossa, formamos um ótimo time! 🎉', en: 'Wow, we make a great team! 🎉', zh: '哇，我们真是好搭档！🎉' },
      gameMeh: { pt: 'Foi divertido mesmo assim! 😄', en: 'It was fun anyway! 😄', zh: '还是很好玩！😄' },
      endQ: { pt: 'Bom... chegamos. Foi um dia especial. 🌙', en: 'Well... here we are. It was a special day. 🌙', zh: '嗯……到了。今天很特别。🌙' },
      endKiss: { pt: 'Beijo na folha 💋', en: 'Kiss on the leaf 💋', zh: '亲吻叶子 💋' },
      endHug: { pt: 'Abraço apertado 🤗', en: 'Big hug 🤗', zh: '紧紧拥抱 🤗' },
      endShake: { pt: 'Aperto de mão 🤝', en: 'Handshake 🤝', zh: '握手 🤝' },
      endKissYes: { pt: '*fica vermelh{g:a|o|e}* ...me liga amanhã? 💖', en: '*blushes* ...call me tomorrow? 💖', zh: '*脸红* ……明天给我打电话？💖' },
      endKissNo: { pt: 'Calma, ainda é cedo pra isso... 😳', en: 'Easy, it’s a bit early for that... 😳', zh: '慢点，现在还太早了……😳' },
      endHugYes: { pt: 'Que abraço bom... 🥰', en: 'What a nice hug... 🥰', zh: '这个拥抱好温暖……🥰' },
      endShakeHigh: { pt: 'Um... aperto de mão? Ok então. 😐', en: 'A... handshake? Okay then. 😐', zh: '握……手？好吧。😐' },
      endShakeLow: { pt: 'Foi bom te conhecer. 🤝', en: 'Nice meeting you. 🤝', zh: '很高兴认识你。🤝' },
    },
  };

  /* ------------------------------------------------ texts added in 2.5 */

  // More interactive dates: a mini-game for each place, touching the plant,
  // surprise events, a branching talk with secrets and free text.
  SCENE.places.cinema.game = 'popcorn';
  SCENE.places.beach.game = 'sandcastle';
  SCENE.places.cafe.game = 'latte';
  SCENE.places.park.game = 'targets';
  SCENE.places.dinner.game = 'plate';
  Object.assign(SCENE.games, {
    popcorn: { icon: '🍿', pt: 'Pipoca voadora', en: 'Flying popcorn', zh: '飞舞的爆米花', how: { pt: 'Pegue a pipoca que pula do balde antes que caia no chão! 12 segundos.', en: 'Catch the popcorn jumping out of the bucket before it hits the floor! 12 seconds.', zh: '在爆米花落地前接住它！12 秒。' } },
    sandcastle: { icon: '🏰', pt: 'Castelo de areia', en: 'Sandcastle', zh: '沙堡', how: { pt: 'Toque para soltar cada andar bem em cima do anterior. 6 andares.', en: 'Tap to drop each floor right on top of the last one. 6 floors.', zh: '点击让每一层正好落在上一层上。6 层。' } },
    latte: { icon: '☕', pt: 'Latte art', en: 'Latte art', zh: '拉花', how: { pt: 'Desenhe o coração no café seguindo o pontilhado, com o dedo ou o mouse.', en: 'Draw the heart on the coffee following the dots, with your finger or mouse.', zh: '用手指或鼠标沿虚线在咖啡上画爱心。' } },
    targets: { icon: '🎯', pt: 'Tiro ao zumbi', en: 'Zombie shooting', zh: '打僵尸', how: { pt: 'Acerte os zumbis 🧟 e poupe os girassóis 🌻! 14 segundos.', en: 'Hit the zombies 🧟 and spare the sunflowers 🌻! 14 seconds.', zh: '打僵尸 🧟，别打向日葵 🌻！14 秒。' } },
    plate: { icon: '🍽', pt: 'Monte o prato', en: 'Build the plate', zh: '拼盘', how: { pt: 'Memorize o pedido e toque nos ingredientes na mesma ordem. 3 rodadas.', en: 'Memorize the order and tap the ingredients in the same order. 3 rounds.', zh: '记住点单，按同样顺序点击食材。3 轮。' } },
  });
  Object.assign(SCENE.ui, {
    games2: { pt: '2 minijogos · pode tocar nela e dar petiscos · surpresas', en: '2 mini-games · you can touch her and give snacks · surprises', zh: '2 个小游戏 · 可以触摸和喂零食 · 惊喜' },
    touchHint: { pt: '👆 Toque, faça carinho (arraste), segure a folha (segure), cócegas (3 toques) ou arraste um petisco até ela.', en: '👆 Tap, pet (drag), hold her leaf (press and hold), tickle (3 taps) or drag a snack to her.', zh: '👆 点击、抚摸（拖动）、牵叶子（长按）、挠痒（连点 3 下），或拖零食给她。' },
    done: { pt: 'Pronto', en: 'Done', zh: '完成' },
    talkTitle: { pt: 'Conversa livre: escreva o que quiser (até 3 mensagens)', en: 'Free talk: write anything (up to 3 messages)', zh: '自由聊天：想说什么都行（最多 3 条）' },
    talkPh: { pt: 'Diga algo para ela…', en: 'Say something…', zh: '说点什么…' },
    talkEnd: { pt: 'Encerrar conversa', en: 'End the talk', zh: '结束聊天' },
    hurry: { pt: 'Rápido!', en: 'Quick!', zh: '快！' },
    order: { pt: 'Quero: {items}', en: 'I want: {items}', zh: '我要：{items}' },
    yourTurn: { pt: 'Sua vez!', en: 'Your turn!', zh: '轮到你了！' },
    secrets: { pt: 'Segredos', en: 'Secrets', zh: '秘密' },
  });
  Object.assign(SCENE.hl, {
    touchGood: { pt: '👆 Gostou dos seus carinhos', en: '👆 Liked your touch', zh: '👆 喜欢你的触碰' },
    touchBad: { pt: '👆 Achou você atirado demais', en: '👆 Found you too forward', zh: '👆 觉得你太主动了' },
    eventGood: { pt: '{icon} Mandou bem na surpresa', en: '{icon} Handled the surprise', zh: '{icon} 漂亮地应对了意外' },
    eventBad: { pt: '{icon} A surpresa não foi bem', en: '{icon} The surprise went badly', zh: '{icon} 意外处理得不好' },
    secret: { pt: '🤫 Ela te contou um segredo', en: '🤫 She told you a secret', zh: '🤫 她告诉了你一个秘密' },
    talkGood: { pt: '⌨️ Conversa livre: arrasou', en: '⌨️ Free talk: nailed it', zh: '⌨️ 自由聊天：很成功' },
    talkBad: { pt: '⌨️ Conversa livre: deslizes', en: '⌨️ Free talk: some slips', zh: '⌨️ 自由聊天：有些失误' },
  });

  // Touching the plant: what each personality loves and dislikes.
  SCENE.touch = {
    kinds: {
      poke: { icon: '👉', pt: 'cutucou', en: 'poked', zh: '戳了戳' },
      pet: { icon: '🤲', pt: 'fez carinho', en: 'petted', zh: '抚摸' },
      hold: { icon: '🍃', pt: 'segurou a folha', en: 'held her leaf', zh: '牵起叶子' },
      tickle: { icon: '🤭', pt: 'fez cócegas', en: 'tickled', zh: '挠痒' },
    },
    snacks: {
      dew: { icon: '💧', pt: 'Gota de orvalho', en: 'Dewdrop', zh: '露珠' },
      cookie: { icon: '🍪', pt: 'Biscoito de adubo', en: 'Compost cookie', zh: '肥料饼干' },
      sunbit: { icon: '☀️', pt: 'Raio de sol', en: 'Sunbeam', zh: '阳光' },
    },
    love: { pt: ['Hihi, gostei! 💕', 'Faz de novo! 😊', 'Que gostoso... 🥰'], en: ['Hehe, I liked that! 💕', 'Do it again! 😊', 'That’s nice... 🥰'], zh: ['嘻嘻，我喜欢！💕', '再来一次！😊', '好舒服……🥰'] },
    ok: { pt: ['Hm? 😊', 'Oi, oi! 😄'], en: ['Hm? 😊', 'Hey, hey! 😄'], zh: ['嗯？😊', '嘿嘿！😄'] },
    hate: { pt: ['Ei! Não gosto disso. 😠', 'Para com isso! 😤'], en: ['Hey! I don’t like that. 😠', 'Stop that! 😤'], zh: ['喂！我不喜欢这样。😠', '别闹了！😤'] },
    early: { pt: ['Ei, calma! A gente mal começou... 😳', 'Devagar com essa folha! 😳'], en: ['Hey, easy! We just started... 😳', 'Slow down with that leaf! 😳'], zh: ['喂，慢点！我们才刚开始……😳', '别这么快碰我的叶子！😳'] },
    tooMuch: { pt: ['Tá bom, chega de mão boba. 😅', 'Ok, ok, já entendi! 😅'], en: ['Okay, enough with the hands. 😅', 'Okay, okay, I get it! 😅'], zh: ['好啦，手别乱动了。😅', '好好好，我懂了！😅'] },
    tickle: { pt: ['HAHAHA para! 😂', 'Hihihi não vale! 😂'], en: ['HAHAHA stop! 😂', 'Hehehe no fair! 😂'], zh: ['哈哈哈别挠了！😂', '嘻嘻不公平！😂'] },
    snackLove: { pt: ['Hmmm, meu favorito! 😋', 'Como você sabia?! 😋'], en: ['Mmm, my favorite! 😋', 'How did you know?! 😋'], zh: ['嗯~我最爱的！😋', '你怎么知道的？！😋'] },
    snackOk: { pt: ['Obrigad{g:a|o|e}! Nham. 😊'], en: ['Thanks! Yum. 😊'], zh: ['谢谢！好吃。😊'] },
    full: { pt: ['Estou chei{g:a|o|e}! Não cabe mais nada. 😵'], en: ['I’m full! Not another bite. 😵'], zh: ['我吃饱了！一口也吃不下了。😵'] },
  };

  // Surprise events: an action (zombies) or a choice against the clock.
  SCENE.events = {
    zombie: { icon: '🧟', line: { pt: 'AAAH! Um zumbi vindo na nossa direção! 😱', en: 'AAAH! A zombie coming our way! 😱', zh: '啊啊啊！一只僵尸朝我们走来了！😱' },
      how: { pt: 'Toque 3 vezes em cada zumbi antes que ele chegue nela!', en: 'Tap each zombie 3 times before it reaches her!', zh: '在僵尸碰到她之前，每只点 3 下！' },
      win: { pt: '{u:Minha heroína|Meu herói|Minhe heroe}! Você me salvou! 🥹', en: 'My hero! You saved me! 🥹', zh: '我的英雄！你救了我！🥹' },
      lose: { pt: 'Ele quase me pegou! Você nem se mexeu... 😨', en: 'It almost got me! You barely moved... 😨', zh: '它差点抓到我！你都没怎么动……😨' } },
    rain: { icon: '🌧', line: { pt: 'Ih, começou a chover forte! ☔', en: 'Oh no, it started pouring! ☔', zh: '哎呀，下大雨了！☔' },
      opts: [
        { k: 'share', pt: 'Dividir o guarda-chuva (bem juntinhos)', en: 'Share the umbrella (close together)', zh: '一起撑伞（靠得很近）' },
        { k: 'run', pt: 'Correr para se abrigar', en: 'Run for cover', zh: '跑去躲雨' },
        { k: 'dance', pt: 'Dançar na chuva!', en: 'Dance in the rain!', zh: '在雨中跳舞！' },
      ] },
    spill: { icon: '🍝', line: { pt: 'Opa! Alguém esbarrou e derrubou comida em você! 🍝', en: 'Oops! Someone bumped into you and spilled food on you! 🍝', zh: '哎呀！有人撞到你，把食物洒在你身上了！🍝' },
      opts: [
        { k: 'laugh', pt: 'Rir da situação 😂', en: 'Laugh it off 😂', zh: '一笑置之 😂' },
        { k: 'clean', pt: 'Pedir licença e se limpar com calma', en: 'Excuse yourself and clean up calmly', zh: '礼貌离开去清理' },
        { k: 'angry', pt: 'Reclamar bem alto 😡', en: 'Complain loudly 😡', zh: '大声抱怨 😡' },
      ] },
    ex: { icon: '😒', line: { pt: '{ex} aparece: "Ora, ora, {name}... quem é {u:essa|esse|esse} aí?"', en: '{ex} shows up: "Well, well, {name}... who’s this?"', zh: '{ex} 出现了：“哟，{name}……这位是谁？”' },
      opts: [
        { k: 'polite', pt: 'Me apresentar educadamente', en: 'Introduce yourself politely', zh: '礼貌地自我介绍' },
        { k: 'claim', pt: 'Segurar a folha {g:dela|dele|delu}: "Estamos num encontro."', en: 'Hold her leaf: "We’re on a date."', zh: '牵起她的叶子：“我们在约会。”' },
        { k: 'ignore', pt: 'Ignorar e continuar o papo', en: 'Ignore them and keep talking', zh: '无视对方继续聊天' },
      ] },
    good: { pt: ['Isso foi perfeito! 💕', 'Adorei como você lidou com isso! 😍'], en: ['That was perfect! 💕', 'Loved how you handled that! 😍'], zh: ['太完美了！💕', '我喜欢你的处理方式！😍'] },
    meh: { pt: ['Ok, tudo bem. 🙂'], en: ['Okay, fine. 🙂'], zh: ['好吧，没事。🙂'] },
    bad: { pt: ['Sério? Que vergonha... 😣', 'Não precisava disso. 😒'], en: ['Seriously? How embarrassing... 😣', 'That wasn’t necessary. 😒'], zh: ['真的吗？好丢人……😣', '没必要这样。😒'] },
    slow: { pt: ['Você ficou parad{u:a|o|e}...? 😶'], en: ['You just froze...? 😶'], zh: ['你就愣住了……？😶'] },
  };

  // The talk branches: after a good answer she opens up (a secret), after a
  // bad one you can apologize.
  SCENE.branch = {
    secretIntro: { pt: 'Posso te contar uma coisa que eu nunca contei pra ninguém? {secret}', en: 'Can I tell you something I never told anyone? {secret}', zh: '我能告诉你一件从没跟别人说过的事吗？{secret}' },
    secretOpts: [
      { k: 'share', q: 'good', pt: 'Obrigad{u:a|o|e} por confiar. Vou te contar um meu também...', en: 'Thanks for trusting me. I’ll tell you one of mine too...', zh: '谢谢你的信任。我也告诉你一个我的……' },
      { k: 'joke', q: 'meh', pt: 'Sério? Haha, que fofo!', en: 'Really? Haha, that’s cute!', zh: '真的？哈哈，好可爱！' },
      { k: 'change', q: 'bad', pt: 'Hmm... e o tempo, hein?', en: 'Hmm... nice weather, huh?', zh: '嗯……今天天气不错啊？' },
    ],
    coldIntro: { pt: 'Hmm... 😐', en: 'Hmm... 😐', zh: '嗯……😐' },
    coldOpts: [
      { k: 'sorry', q: 'good', pt: 'Desculpa, me expressei mal. Quero muito que esse encontro dê certo.', en: 'Sorry, that came out wrong. I really want this date to go well.', zh: '抱歉，我说错话了。我真的希望这次约会顺利。' },
      { k: 'joke', q: 'meh', pt: 'Ué, era brincadeira! 😅', en: 'Hey, I was joking! 😅', zh: '哎，我开玩笑的！😅' },
      { k: 'whatever', q: 'bad', pt: 'Tanto faz.', en: 'Whatever.', zh: '随便。' },
    ],
    secrets: {
      sweet: [{ pt: 'Eu choro vendo filme de zumbi que termina bem. 🥲', en: 'I cry at zombie movies with happy endings. 🥲', zh: '看到有好结局的僵尸电影我会哭。🥲' }, { pt: 'Eu dou nome para todas as abelhas do jardim.', en: 'I name every bee in the garden.', zh: '我给花园里每只蜜蜂都起了名字。' }, { pt: 'Meu sonho é plantar um jardim inteiro só de flores para os amigos.', en: 'My dream is to plant a whole garden of flowers for my friends.', zh: '我的梦想是种一整个花园的花送给朋友。' }],
      shy: [{ pt: 'Eu ensaio as conversas no espelho antes. Ensaiei essa também. 🙈', en: 'I rehearse conversations in the mirror. I rehearsed this one too. 🙈', zh: '我会对着镜子练习对话。今天的也练过。🙈' }, { pt: 'Eu escrevo poemas, mas nunca mostrei pra ninguém.', en: 'I write poems, but never showed anyone.', zh: '我会写诗，但从没给人看过。' }, { pt: 'Na primeira onda que eu enfrentei, eu desmaiei. 😳', en: 'At my first wave, I fainted. 😳', zh: '第一次面对僵尸潮时我晕倒了。😳' }],
      sassy: [{ pt: 'Eu finjo que não ligo, mas leio todas as mensagens umas dez vezes. 💅', en: 'I act like I don’t care, but I read every message ten times. 💅', zh: '我装作不在乎，其实每条消息都看十遍。💅' }, { pt: 'Já perdi uma aposta e tive que usar chapéu de balde por uma semana.', en: 'I once lost a bet and had to wear a bucket hat for a week.', zh: '我曾打赌输了，戴了一周铁桶帽。' }, { pt: 'No fundo eu sou muito sentimental. Não conta pra ninguém.', en: 'Deep down I’m very sentimental. Don’t tell anyone.', zh: '其实我很感性。别告诉别人。' }],
      nerd: [{ pt: 'Eu sei de cor o custo de sol de todas as plantas. Todas. 🤓', en: 'I know the sun cost of every plant by heart. Every one. 🤓', zh: '我能背出所有植物的阳光消耗。全部。🤓' }, { pt: 'Tenho um caderno com estratégias para cada zumbi.', en: 'I keep a notebook of strategies for every zombie.', zh: '我有个本子记录对付每种僵尸的策略。' }, { pt: 'Eu tinha medo de você me achar chat{g:a|o|e}.', en: 'I was afraid you’d find me boring.', zh: '我怕你觉得我很无聊。' }],
      brave: [{ pt: 'Eu tenho medo de escuro. Só de escuro. 😬', en: 'I’m afraid of the dark. Only the dark. 😬', zh: '我怕黑。只怕黑。😬' }, { pt: 'Já segurei uma horda inteira sozinh{g:a|o|e}... e depois chorei.', en: 'I once held back a whole horde alone... and cried afterwards.', zh: '我曾独自挡住整波僵尸……然后哭了。' }, { pt: 'Meu maior medo é não estar lá quando precisarem de mim.', en: 'My biggest fear is not being there when I’m needed.', zh: '我最怕的是别人需要我时我不在。' }],
      drama: [{ pt: 'Eu já ensaiei nosso casamento. Duas vezes. 💒', en: 'I already rehearsed our wedding. Twice. 💒', zh: '我已经排练过我们的婚礼了。两次。💒' }, { pt: 'Escrevo um diário de 30 páginas por dia.', en: 'I write a 30-page diary every day.', zh: '我每天写 30 页日记。' }, { pt: 'Todo drama é só vontade de ser notad{g:a|o|e}.', en: 'All the drama is just wanting to be noticed.', zh: '所有的戏都只是想被注意到。' }],
    },
  };

  // Free talk: keywords she understands (lowercase, accents removed) and her answers.
  SCENE.talk = {
    words: {
      insult: ['feia', 'feio', 'chata', 'chato', 'idiota', 'burra', 'burro', 'odeio', 'horrivel', 'ridicul', 'ugly', 'stupid', 'hate you', 'boring', 'dumb', 'lixo'],
      compliment: ['linda', 'lindo', 'bonit', 'fofa', 'fofo', 'gata', 'gato', 'maravilh', 'incrivel', 'perfeit', 'amo', 'adoro', 'gosto de voce', 'cute', 'beautiful', 'pretty', 'love', 'amazing', 'gorgeous', 'adorable'],
      joke: ['kkk', 'haha', 'hehe', 'rs', 'piada', 'lol', 'lmao', '😂', '🤣', 'zoeira'],
      zombie: ['zumbi', 'zombie', 'cerebro', 'brain', 'horda', 'horde'],
      food: ['fome', 'comida', 'pizza', 'adubo', 'sorvete', 'hungry', 'food', 'snack', 'lanche'],
      hello: ['oi', 'ola', 'eai', 'e ai', 'hey', 'hello', 'hi ', 'opa'],
      age: ['idade', 'anos voce', 'quantos anos', 'how old', 'age'],
      sign: ['signo', 'zodiaco', 'sign', 'zodiac'],
      job: ['trabalh', 'profiss', 'emprego', 'job', 'work'],
      like: ['gosta', 'curte', 'hobby', 'like', 'favorit'],
    },
    reply: {
      insult: { pt: ['Uau. Que grosseria. 😠', 'Não acredito que você disse isso. 😤'], en: ['Wow. That was rude. 😠', 'I can’t believe you said that. 😤'], zh: ['哇，真没礼貌。😠', '真不敢相信你会这么说。😤'] },
      compliment: { pt: ['*fica vermelh{g:a|o|e}* Para, assim eu fico sem graça! 😳', 'Você também! 💕'], en: ['*blushes* Stop, you’re making me shy! 😳', 'You too! 💕'], zh: ['*脸红* 别说了，我会害羞的！😳', '你也是！💕'] },
      joke: { pt: ['Hahaha você é muito engraçad{u:a|o|e}! 😂', 'kkkkk 😂'], en: ['Hahaha you’re so funny! 😂', 'lol 😂'], zh: ['哈哈哈你太好笑了！😂', '笑死 😂'] },
      zombie: { pt: ['Zumbi? Nem me fala! Mas com você por perto eu fico tranquil{g:a|o|e}. 🧟'], en: ['Zombies? Don’t remind me! But with you around I feel safe. 🧟'], zh: ['僵尸？别提了！不过有你在我就安心。🧟'] },
      food: { pt: ['Agora fiquei com fome também! 😋'], en: ['Now I’m hungry too! 😋'], zh: ['现在我也饿了！😋'] },
      hello: { pt: ['Oiê! 😊'], en: ['Hiya! 😊'], zh: ['嗨！😊'] },
      age: { pt: ['Tenho {age}. E você? 😉'], en: ['I’m {age}. And you? 😉'], zh: ['我{age}。你呢？😉'] },
      sign: { pt: ['Sou de {sign}! Combina comigo? ✨'], en: ['I’m a {sign}! Does it suit me? ✨'], zh: ['我是{sign}！适合我吗？✨'] },
      job: { pt: ['Trabalho como {job}. Adoro o que eu faço!'], en: ['I work as a {job}. I love what I do!'], zh: ['我是{job}。我很喜欢我的工作！'] },
      like: { pt: ['Eu amo {likes}! E você?'], en: ['I love {likes}! And you?'], zh: ['我爱{likes}！你呢？'] },
      remember: { pt: ['Você lembrou que eu gosto de {thing}?! 🥹'], en: ['You remembered I like {thing}?! 🥹'], zh: ['你记得我喜欢{thing}？！🥹'] },
      question: { pt: ['Boa pergunta! Hmm... deixa eu pensar. 🤔', 'Por que você quer saber? 😏'], en: ['Good question! Hmm... let me think. 🤔', 'Why do you want to know? 😏'], zh: ['好问题！嗯……让我想想。🤔', '你为什么想知道？😏'] },
      other: { pt: ['Hmm, entendi. 🙂', 'Interessante! Conta mais.', 'Ah, é? 😄'], en: ['Hmm, I see. 🙂', 'Interesting! Tell me more.', 'Oh, really? 😄'], zh: ['嗯，我懂了。🙂', '有意思！多说点。', '真的吗？😄'] },
      repeat: { pt: ['Você já disse isso. 😅'], en: ['You already said that. 😅'], zh: ['你已经说过了。😅'] },
    },
  };

  // Personalities: the openers and reactions of each plant, her favorite
  // sticker and how easily she ghosts after a bad reply.
  var PERS = {
    sweet: {
      icon: '🥰', sticker: '❤️', ghost: 0.3,
      name: { pt: 'Carinhos{g:a|o|e}', en: 'Sweet', zh: '温柔' },
      openers: { pt: ['Oi, flor! Que bom que deu match. 🥰', 'Seu perfil me deixou com as folhas vermelhas. ☺️'], en: ['Hi, sunshine! So glad we matched. 🥰', 'Your profile made my leaves blush. ☺️'], zh: ['嗨，小太阳！好高兴配对成功。🥰', '你的资料让我的叶子都红了。☺️'] },
      good: { pt: ['Que amor! 🥰', 'Você é um doce. 💕'], en: ['So sweet! 🥰', 'You’re a sweetheart. 💕'], zh: ['好甜！🥰', '你真贴心。💕'] },
      bad: { pt: ['Ai... isso doeu. 🥺', 'Poxa... 😢'], en: ['Ouch... that hurt. 🥺', 'Aw... 😢'], zh: ['哎……好伤人。🥺', '唉……😢'] },
    },
    shy: {
      icon: '🙈', sticker: '🌻', ghost: 0.6,
      name: { pt: 'Tímid{g:a|o|e}', en: 'Shy', zh: '害羞' },
      openers: { pt: ['o-oi... 🙈', 'Eu nunca sei o que dizer primeiro... oi? 😳'], en: ['h-hi... 🙈', 'I never know what to say first... hi? 😳'], zh: ['你、你好……🙈', '我总不知道先说什么……嗨？😳'] },
      good: { pt: ['*fica vermelh{g:a|o|e}* 😳', 'Obrigad{g:a|o|e}... 🙈'], en: ['*blushes* 😳', 'Thank you... 🙈'], zh: ['*脸红* 😳', '谢谢……🙈'] },
      bad: { pt: ['...', 'Ah. Tá. 😶'], en: ['...', 'Oh. Okay. 😶'], zh: ['……', '哦。好吧。😶'] },
    },
    sassy: {
      icon: '💅', sticker: '🔥', ghost: 0.7,
      name: { pt: 'Atrevid{g:a|o|e}', en: 'Sassy', zh: '傲娇' },
      openers: { pt: ['Demorou pra me curtir, hein? 💅', 'Sim, eu sei que sou a melhor planta do app. Oi. 😏'], en: ['Took you long enough to like me. 💅', 'Yes, I know I’m the best plant here. Hi. 😏'], zh: ['这么久才喜欢我？💅', '对，我知道我是这里最好的植物。嗨。😏'] },
      good: { pt: ['Hmm, gostei de você. 😏', 'Ok, você tem estilo. 🔥'], en: ['Hmm, I like you. 😏', 'Okay, you’ve got style. 🔥'], zh: ['嗯，我喜欢你。😏', '行，你有品位。🔥'] },
      bad: { pt: ['Próximo! 💅', 'Sério? 🙄'], en: ['Next! 💅', 'Seriously? 🙄'], zh: ['下一个！💅', '认真的？🙄'] },
    },
    nerd: {
      icon: '🤓', sticker: '🧟', ghost: 0.4,
      name: { pt: 'Nerd', en: 'Nerd', zh: '学霸' },
      openers: { pt: ['Oi! Sabia que eu li o almanaque inteiro? Duas vezes. 🤓', 'Estatisticamente, a gente ia dar match. Oi! 📊'], en: ['Hi! Did you know I read the whole almanac? Twice. 🤓', 'Statistically, we were bound to match. Hi! 📊'], zh: ['嗨！你知道我把图鉴读了两遍吗？🤓', '从统计上说，我们注定会配对。嗨！📊'] },
      good: { pt: ['Resposta correta! +10 pontos. 🤓', 'Fascinante! 📚'], en: ['Correct answer! +10 points. 🤓', 'Fascinating! 📚'], zh: ['回答正确！+10 分。🤓', '太有意思了！📚'] },
      bad: { pt: ['Isso não faz sentido lógico. 🤨', 'Erro 404: graça não encontrada.'], en: ['That makes no logical sense. 🤨', 'Error 404: charm not found.'], zh: ['这不合逻辑。🤨', '错误 404：找不到魅力。'] },
    },
    brave: {
      icon: '💪', sticker: '🧟', ghost: 0.3,
      name: { pt: 'Corajos{g:a|o|e}', en: 'Brave', zh: '勇敢' },
      openers: { pt: ['Bora derrotar uns zumbis juntos? 💪', 'Eu fico na primeira fileira. E você? ⚔️'], en: ['Let’s beat some zombies together? 💪', 'I stand in the front row. You? ⚔️'], zh: ['一起去打僵尸吧？💪', '我站第一排。你呢？⚔️'] },
      good: { pt: ['Isso aí! 💪', 'Gostei da atitude! ⚔️'], en: ['That’s it! 💪', 'Love the attitude! ⚔️'], zh: ['就是这样！💪', '喜欢你的态度！⚔️'] },
      bad: { pt: ['Fraco. 😤', 'Esperava mais de você. 😤'], en: ['Weak. 😤', 'I expected more. 😤'], zh: ['太弱了。😤', '我以为你会更好。😤'] },
    },
    drama: {
      icon: '🎭', sticker: '😂', ghost: 0.5,
      name: { pt: 'Dramátic{g:a|o|e}', en: 'Dramatic', zh: '戏精' },
      openers: { pt: ['FINALMENTE um match! Eu já estava murchando de solidão. 🎭', 'Ai, meu caule! Você é real? 😱'], en: ['FINALLY a match! I was wilting of loneliness. 🎭', 'Oh my stem! Are you real? 😱'], zh: ['终于配对了！我都孤独得快枯萎了。🎭', '我的茎啊！你是真的吗？😱'] },
      good: { pt: ['Eu vou CHORAR. 😭💕', 'A melhor coisa que já me disseram! 🎭'], en: ['I’m going to CRY. 😭💕', 'Best thing anyone ever told me! 🎭'], zh: ['我要哭了。😭💕', '这是我听过最好的话！🎭'] },
      bad: { pt: ['Que TRAGÉDIA. 😱', 'Meu coração virou adubo. 💔'], en: ['What a TRAGEDY. 😱', 'My heart turned to compost. 💔'], zh: ['真是悲剧！😱', '我的心变成肥料了。💔'] },
    },
  };

  // Dates: the level settings live in x-match.js, these are the texts.
  var DATES = {
    picnic: { name: { pt: 'Piquenique', en: 'Picnic', zh: '野餐' }, desc: { pt: 'O clássico: no mundo da planta, sol rápido.', en: 'The classic: in the plant’s world, fast sun.', zh: '经典约会：在植物的世界，阳光掉落更快。' } },
    candle: { name: { pt: 'Jantar à luz de velas', en: 'Candlelight dinner', zh: '烛光晚餐' }, desc: { pt: 'Idade das Trevas com neblina. Romântico e perigoso.', en: 'Dark Ages with fog. Romantic and dangerous.', zh: '黑暗时代加迷雾。浪漫又危险。' } },
    race: { name: { pt: 'Encontro relâmpago', en: 'Speed date', zh: '闪电约会' }, desc: { pt: 'Ondas apressadas: a próxima chega antes de você acabar a anterior.', en: 'Rushed waves: the next one comes before you finish the last.', zh: '加速波次：上一波还没打完下一波就来了。' } },
    adventure: { name: { pt: 'Aventura no Velho Oeste', en: 'Wild West adventure', zh: '狂野西部冒险' }, desc: { pt: 'Mais ondas e nenhum cortador de grama.', en: 'More waves and no lawn mowers.', zh: '更多波次，没有割草机。' } },
    double: { name: { pt: 'Encontro duplo', en: 'Double date', zh: '双人约会' }, desc: { pt: 'A planta leva uma amiga da mesma família.', en: 'The plant brings a friend from her family.', zh: '植物会带上一位同家族的朋友。' } },
    wedding: { name: { pt: 'Casamento', en: 'Wedding', zh: '婚礼' }, desc: { pt: 'A grande fase: horda de zumbis, com seus outros namoros como convidados.', en: 'The big one: a zombie horde, with your other partners as guests.', zh: '盛大关卡：僵尸大军，其他恋人作为宾客出席。' } },
  };

  // Relationship stages (name, bonus text).
  var STAGES = [
    { icon: '🌱', name: { pt: 'Ficando', en: 'Seeing each other', zh: '暧昧中' }, bonus: { pt: '+25 ☀', en: '+25 ☀', zh: '+25 ☀' } },
    { icon: '💕', name: { pt: 'Namorando', en: 'Dating', zh: '交往中' }, bonus: { pt: '+1 adubo', en: '+1 plant food', zh: '+1 能量豆' } },
    { icon: '💍', name: { pt: 'Noivos', en: 'Engaged', zh: '已订婚' }, bonus: { pt: '+1 adubo, +50 ☀', en: '+1 plant food, +50 ☀', zh: '+1 能量豆，+50 ☀' } },
    { icon: '💒', name: { pt: 'Casados', en: 'Married', zh: '已结婚' }, bonus: { pt: '+2 adubos, +100 ☀', en: '+2 plant food, +100 ☀', zh: '+2 能量豆，+100 ☀' } },
  ];

  X.matchText = { TXT: TXT, CHAT: CHAT, PERS: PERS, DATES: DATES, STAGES: STAGES, TRAITS: TRAITS, SCENE: SCENE };
})();
