/**
 * Mission Data for Mission Tracker
 * Data embedded directly to avoid CORS issues with file:// protocol
 * Source: Missions_Timeline_PT-BR.md
 */

const MISSIONS_DATA = {
  "metadata": {
    "season": 4,
    "seasonName": "Caçada no Aeroporto",
    "totalMissions": 59,
    "version": "1.0.1",
    "lastUpdated": "2026-01-15",
    "note": "Missão 42 não existe no jogo original"
  },
  "maps": {
    "fazenda": { "id": "fazenda", "name": "Fazenda", "nameEn": "Farm", "link": "https://maps.tcno.co/abi/farm" },
    "vale": { "id": "vale", "name": "Vale", "nameEn": "Valley", "link": "https://maps.tcno.co/abi/valley" },
    "northridge": { "id": "northridge", "name": "Northridge", "nameEn": "Northridge", "link": "https://maps.tcno.co/abi/northridge" },
    "arsenal": { "id": "arsenal", "name": "Arsenal", "nameEn": "Armory", "link": "https://maps.tcno.co/abi/armory" },
    "tvstation": { "id": "tvstation", "name": "Estação de TV", "nameEn": "TV Station", "link": "https://maps.tcno.co/abi/tv-station" },
    "aeroporto": { "id": "aeroporto", "name": "Aeroporto", "nameEn": "Airport", "link": "https://maps.tcno.co/abi/airport" }
  },
  "missions": [
    {
      "id": 1,
      "title": "Obstáculo Pacífico",
      "titleEn": "Peaceful Obstacle",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Destrua os suprimentos em Cabana da Estação de Reciclagem na Fazenda.",
        "Destrua os suprimentos em Tenda Militar do Motel na Fazenda."
      ],
      "taskCount": 2,
      "canDoTogether": [2],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 2,
      "title": "Corrente Subjacente",
      "titleEn": "Undercurrent",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Elimine 6 inimigos (Scavs ou Players) em Estábulo/Estação de Reciclagem/Motel na Fazenda.",
        "Vá até Cabana do Lago Artificial na Fazenda e vasculhe 1 computador doméstico não vasculhado."
      ],
      "taskCount": 2,
      "canDoTogether": [1],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 3,
      "title": "Jogo de Longo Prazo",
      "titleEn": "Long Game",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Vá até Casa da Fazenda do Campo de Trigo no lado leste da Fazenda e deixe uma marca na parede do quarto.",
        "Vá até Cabana do Cemitério no lado oeste da Fazenda e deixe uma marca na parede do quarto.",
        "Extraia da Fazenda 1 vez."
      ],
      "taskCount": 3,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 4,
      "title": "Reconhecimento da Linha de Frente",
      "titleEn": "Frontline Reconnaissance",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": ["Água de Nascente da Montanha", "Bolacha"],
      "tasks": [
        "Entre no Vale carregando Água de Nascente da Montanha.",
        "Entre no Vale carregando Bolacha.",
        "Coloque Água de Nascente da Montanha dentro de Cabana Abandonada no Vale.",
        "Coloque Bolacha dentro de Cabana Abandonada no Vale."
      ],
      "taskCount": 4,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 5,
      "title": "Carta do Abismo",
      "titleEn": "Letter from the Abyss",
      "map": ["northridge"],
      "mapLinks": ["https://maps.tcno.co/abi/northridge"],
      "requiredItems": ["Inibidor de Sinal"],
      "tasks": [
        "Vá até Ponto de Helicóptero à Beira do Lago e permaneça por 45 segundos.",
        "Entre em Northridge com Inibidor de Sinal.",
        "Vá até Ponte de Acesso e coloque Inibidor de Sinal.",
        "Entre em Northridge com Inibidor de Sinal."
      ],
      "taskCount": 4,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story",
      "notes": "O mapa não está atualizado para mostrar o Ponto de Helicóptero à Beira do Lago, pois só é possível ver esse ponto no Northridge durante o período que o lago está congelado."
    },
    {
      "id": 6,
      "title": "Dente por Dente",
      "titleEn": "Tooth for Tooth",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": [],
      "tasks": [
        "Conclua 4 Missões Urgentes em equipe no Vale."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story",
      "notes": "Não é possível marcar no mapa pois são lugares aleatórios."
    },
    {
      "id": 7,
      "title": "Apoie o Flanco",
      "titleEn": "Support the Flank",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Elimine 3 mercenários (Players) no lado oeste da Fazenda.",
        "Extraia da Fazenda 1 vez."
      ],
      "taskCount": 2,
      "canDoTogether": [8],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 8,
      "title": "Proteção e Responsabilidade",
      "titleEn": "Protection and Responsibility",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Elimine 3 mercenários (Players) no lado leste da Fazenda.",
        "Vá até Villa na Fazenda e interaja no 2F da casa."
      ],
      "taskCount": 2,
      "canDoTogether": [7],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 9,
      "title": "Língua da Víbora",
      "titleEn": "Viper's Tongue",
      "map": ["northridge"],
      "mapLinks": ["https://maps.tcno.co/abi/northridge"],
      "requiredItems": [],
      "tasks": [
        "Elimine 6 inimigos (Scavs ou Players) em Estação do Teleférico, Estacionamento, ou Hotel de Northridge."
      ],
      "taskCount": 1,
      "canDoTogether": [10],
      "difficulty": "normal",
      "category": "story",
      "notes": "Pode ser qualquer combinação, como 2 na Estação do Teleférico, 3 no Estacionamento e 1 no Hotel."
    },
    {
      "id": 10,
      "title": "Avaliação de Risco",
      "titleEn": "Risk Assessment",
      "map": ["northridge"],
      "mapLinks": ["https://maps.tcno.co/abi/northridge"],
      "requiredItems": ["Rifle M110"],
      "tasks": [
        "Elimine 6 inimigos (Scavs ou Players) em Northridge usando M110."
      ],
      "taskCount": 1,
      "canDoTogether": [9],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 11,
      "title": "A Isca",
      "titleEn": "The Bait",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Entregue 20 diversos itens de papel encontrados na Zona Proibida (Forbidden).",
        "Recupere o documento de inteligência do segundo andar da Casa na Fazenda."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 12,
      "title": "Operação Especial",
      "titleEn": "Special Operation",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": [],
      "tasks": [
        "Elimine 3 mercenários (Players) no Vale."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 13,
      "title": "Caixa-Preta",
      "titleEn": "Black Box",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Conclua 4 Missões Urgentes em equipe na Fazenda."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story",
      "notes": "Não é possível marcar no mapa pois são lugares aleatórios."
    },
    {
      "id": 14,
      "title": "Controle de Danos",
      "titleEn": "Damage Control",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Vasculhe 2 cofres criptografados não vasculhados na Fazenda.",
        "Colete 350.000 de valor em itens coletados em uma única incursão."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 15,
      "title": "Boas Intenções",
      "titleEn": "Good Intentions",
      "map": ["arsenal"],
      "mapLinks": ["https://maps.tcno.co/abi/armory"],
      "requiredItems": [],
      "tasks": [
        "Elimine 6 inimigos (Scavs ou Players) na Periferia do Arsenal."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story",
      "notes": "Periferia do Arsenal: Área externa ao redor do Arsenal, não dentro dele."
    },
    {
      "id": 16,
      "title": "Sinergia",
      "titleEn": "Synergy",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": [],
      "tasks": [
        "Elimine 6 inimigos (Scavs ou Players) em Pequena Fábrica, Pátio Noan (Igreja), ou Acampamento de Suprimentos no Vale."
      ],
      "taskCount": 1,
      "canDoTogether": [17],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 17,
      "title": "Sem Desafiar",
      "titleEn": "Without Challenge",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": [],
      "tasks": [
        "Investigue completamente Pátio Noan (Igreja) no Vale e extraia com sucesso.",
        "Progresso +10 para cada contêiner vasculhado, +20 para cada inimigo eliminado e +10 para cada minuto sobrevivido.",
        "Investigue completamente Porão da Pequena Fábrica no Vale e extraia com sucesso.",
        "Progresso +10 para cada contêiner vasculhado, +20 para cada inimigo eliminado e +10 para cada minuto sobrevivido."
      ],
      "taskCount": 4,
      "canDoTogether": [16],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 18,
      "title": "Queimando Pontes",
      "titleEn": "Burning Bridges",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": [],
      "tasks": [
        "Conclua 1 partida em qualquer dificuldade no Vale."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "easy",
      "category": "story",
      "notes": "Só é possível ir no Normal e no Lockdown (Zona de Isolamento). A dificuldade Forbidden (Zona Proibida) não está disponível no momento."
    },
    {
      "id": 19,
      "title": "Sapo no Poço",
      "titleEn": "Frog in the Well",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": [],
      "tasks": [
        "Ganhe Koen no Mercado.",
        "Vasculhe 3 malas não vasculhadas em Acampamento de Trailers no Vale."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 20,
      "title": "Respeito",
      "titleEn": "Respect",
      "map": ["arsenal"],
      "mapLinks": ["https://maps.tcno.co/abi/armory"],
      "requiredItems": [],
      "tasks": [
        "Entregue 20 diversas peças de computador encontradas na Zona Proibida (Forbidden).",
        "Coloque documento de inteligência em Centro de Inteligência Subterrâneo no Arsenal."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 21,
      "title": "Descoberta Surpreendente",
      "titleEn": "Surprising Discovery",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": [],
      "tasks": [
        "Extraia pela Cabana Abandonada no Vale 1 vez.",
        "Fabrique 120 munições de 5.7x28mm L191 em Bancada da Sala de Troféus."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 22,
      "title": "Aeroporto Abandonado",
      "titleEn": "Abandoned Airport",
      "map": ["tvstation"],
      "mapLinks": ["https://maps.tcno.co/abi/tv-station"],
      "requiredItems": [],
      "tasks": [
        "Investigue completamente o Estacionamento na Estação de TV.",
        "Progresso +10 para cada contêiner vasculhado, +20 para cada inimigo eliminado e +10 para cada minuto sobrevivido.",
        "Vasculhe 7 Maletas de Negócios não vasculhadas na Estação de TV."
      ],
      "taskCount": 3,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 23,
      "title": "Reagrupamento",
      "titleEn": "Regrouping",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": ["Transceptor Portátil"],
      "tasks": [
        "Vá até o Porto no Vale e permaneça por 60 segundos.",
        "Entre no Vale carregando Transceptor Portátil.",
        "Elimine 6 inimigos (Scavs ou Players) no Porto, no Vale."
      ],
      "taskCount": 3,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 24,
      "title": "Sinal",
      "titleEn": "Signal",
      "map": ["tvstation"],
      "mapLinks": ["https://maps.tcno.co/abi/tv-station"],
      "requiredItems": ["AMB-17, T191 ou U191"],
      "tasks": [
        "Elimine 3 mercenários (Players) na Estação de TV usando AMB-17/T191/U191."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 25,
      "title": "Passagem Secreta do Sudoeste",
      "titleEn": "Southwest Secret Passage",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": ["Binóculos com Telêmetro"],
      "tasks": [
        "Faça reconhecimento do interior da Área de Controle dentro da área designada do Saguão de Bilheteria 2F no Aeroporto.",
        "Entre no Aeroporto carregando Binóculos com Telêmetro.",
        "Abra o porta-malas de um carro no Aeroporto 3 vezes."
      ],
      "taskCount": 3,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 26,
      "title": "Construindo uma Fortaleza",
      "titleEn": "Building a Fortress",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Elimine 10 inimigos (Scavs ou Players) na margem norte do Lago Artificial (Depósito de Combustível, Canteiro de Obras, etc.) no Aeroporto.",
        "Vasculhe 3 cofres criptografados não vasculhados no Aeroporto."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 27,
      "title": "Investigação",
      "titleEn": "Investigation",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": ["Capacete Tático KSS2", "Colete/Armadura Corporal Spartan B", "Rifle de Assalto M4A1"],
      "tasks": [
        "Elimine 8 White Wolves (Scavs Elite) no Aeroporto.",
        "Entre no Aeroporto vestindo Capacete Tático KSS2 e Colete/Armadura Corporal Spartan B e equipado com um rifle de assalto M4A1."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 28,
      "title": "Zona de Isolamento (Lockdown)",
      "titleEn": "Lockdown",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Vasculhe 10 caixas de biscoitos não vasculhadas no Aeroporto."
      ],
      "taskCount": 1,
      "canDoTogether": [29],
      "difficulty": "easy",
      "category": "story"
    },
    {
      "id": 29,
      "title": "Encontros Próximos",
      "titleEn": "Close Encounters",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Vasculhe 4 cofres pequenos não vasculhados no Aeroporto."
      ],
      "taskCount": 1,
      "canDoTogether": [28],
      "difficulty": "easy",
      "category": "story"
    },
    {
      "id": 30,
      "title": "Emboscado",
      "titleEn": "Ambushed",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Conclua 3 Missões Urgentes em equipe no Aeroporto."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 31,
      "title": "Chamariz",
      "titleEn": "Decoy",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Investigue aeronave designada em Área de Exposição Externa no Aeroporto.",
        "Investigue o veículo designado no Estacionamento do Aeroporto.",
        "Investigue buraco na parede em Torre de Controle no Aeroporto."
      ],
      "taskCount": 3,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 32,
      "title": "Velho Rival",
      "titleEn": "Old Rival",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": ["Dispositivo de Comunicação Individual T-147"],
      "tasks": [
        "Entre no Aeroporto carregando Dispositivo de Comunicação Individual T-147.",
        "Coloque Dispositivo de Comunicação Individual T-147 em Posto Militar no Aeroporto.",
        "Colete 2 armas primárias do Aeroporto."
      ],
      "taskCount": 3,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 33,
      "title": "Movimento de Pinça",
      "titleEn": "Pincer Movement",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Colete 15 provisões (Comidas e Bebidas) no Aeroporto.",
        "Use Dispositivo de Recuperação de Suprimentos no Aeroporto e colete um total de itens no valor de 750.000."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 34,
      "title": "A Armadilha",
      "titleEn": "The Trap",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Vasculhe 6 caçambas de lixo não vasculhadas no Aeroporto."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "easy",
      "category": "story"
    },
    {
      "id": 35,
      "title": "Interceptação na Linha de Frente",
      "titleEn": "Frontline Interception",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Vá até área designada na Zona Militar no Aeroporto para investigar (Área de Controle: É necessário a chave)."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 36,
      "title": "Avanço Imprudente",
      "titleEn": "Reckless Advance",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Elimine ou ajude eliminar 3 mercenários (Players) fora da Área de Controle no Aeroporto."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 37,
      "title": "Corrida Contra o Tempo",
      "titleEn": "Race Against Time",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Colete 7 itens de energia do Aeroporto.",
        "Entregue 3 itens de energia de qualidade roxa ou superior encontrados na Zona Cega."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 38,
      "title": "Medidas de Emergência",
      "titleEn": "Emergency Measures",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Colete 15 diversos itens médicos do Aeroporto.",
        "Fabrique 120 munições de .45 AP em Bancada da Sala de Troféus."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 39,
      "title": "Contra o Vento",
      "titleEn": "Against the Wind",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Elimine 6 inimigos (Scavs ou Players) no Aeroporto com granada.",
        "Extraia pelo Ponto de Extração de Helicóptero no Aeroporto 1 vez."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 40,
      "title": "Fuga",
      "titleEn": "Escape",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Elimine 1 mercenário (Player) na Área de Controle no Aeroporto.",
        "Extraia pelo Elevador Central no Aeroporto 1 vez."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 41,
      "title": "Próximo Campo de Batalha",
      "titleEn": "Next Battlefield",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Vá até Cabana do Estábulo na Fazenda e investigue as pistas.",
        "Investigue completamente Motel na Fazenda.",
        "Progresso +10 para cada contêiner vasculhado, +20 para cada inimigo eliminado e +10 para cada minuto sobrevivido."
      ],
      "taskCount": 3,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 43,
      "title": "Missão Fracassada",
      "titleEn": "Failed Mission",
      "map": ["tvstation"],
      "mapLinks": ["https://maps.tcno.co/abi/tv-station"],
      "requiredItems": [],
      "tasks": [
        "Colete 15 diversos itens de qualidade roxa ou superior da Estação de TV.",
        "Extraia de Entrada Principal na Estação de TV 1 vez."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 44,
      "title": "Passado de Edelweiss",
      "titleEn": "Edelweiss Past",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": ["Capacete Militar SH18", "Colete/Armadura 6B23", "Rifle de Assalto AKM"],
      "tasks": [
        "Entre no Vale vestindo Capacete Militar SH18 e Colete/Armadura 6B23, e segurando um rifle de assalto AKM.",
        "Vá até Estação de Radar no Vale e permaneça por 30 segundos.",
        "Vá até Posições da Fronteira no Vale e permaneça por 30 segundos.",
        "Vá até Acampamento de Suprimentos no Vale e permaneça por 30 segundos."
      ],
      "taskCount": 4,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 45,
      "title": "Coisas Estranhas na Fazenda",
      "titleEn": "Strange Things at Farm",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), elimine 2 chefes na Fazenda."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 46,
      "title": "Rápido nos Pés",
      "titleEn": "Quick on Feet",
      "map": ["northridge"],
      "mapLinks": ["https://maps.tcno.co/abi/northridge"],
      "requiredItems": ["Rifle ML"],
      "tasks": [
        "Elimine 5 inimigos (Scavs ou Players) em Northridge usando rifle ML."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 47,
      "title": "Fantasma do Passado",
      "titleEn": "Ghost of the Past",
      "map": ["arsenal", "fazenda", "tvstation", "vale"],
      "mapLinks": ["https://maps.tcno.co/abi/armory", "https://maps.tcno.co/abi/farm", "https://maps.tcno.co/abi/tv-station", "https://maps.tcno.co/abi/valley"],
      "requiredItems": [],
      "tasks": [
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), vasculhe contêineres de airdrop 3 vezes na Fazenda.",
        "Na dificuldade Zona de Isolamento (Lockdown), vasculhe contêineres de airdrop 3 vezes no Vale.",
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), vasculhe caixas de airdrop 2 vezes na Estação de TV.",
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), vasculhe contêineres de airdrop 3 vezes no Arsenal."
      ],
      "taskCount": 4,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 48,
      "title": "Retorno de Edelweiss",
      "titleEn": "Edelweiss Return",
      "map": ["vale"],
      "mapLinks": ["https://maps.tcno.co/abi/valley"],
      "requiredItems": [],
      "tasks": [
        "Na dificuldade Zona de Isolamento (Lockdown), elimine 8 inimigos (Scavs ou Players) no Vale enquanto as duas pernas estão quebradas."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 49,
      "title": "Aniquilação em Equipe",
      "titleEn": "Team Annihilation",
      "map": ["tvstation"],
      "mapLinks": ["https://maps.tcno.co/abi/tv-station"],
      "requiredItems": [],
      "tasks": [
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), vasculhe 7 contêineres médicos não vasculhados na Estação de TV.",
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), extraia pelo Elevador na Estação de TV 1 vez."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 50,
      "title": "Tropas Adicionais",
      "titleEn": "Additional Troops",
      "map": ["arsenal"],
      "mapLinks": ["https://maps.tcno.co/abi/armory"],
      "requiredItems": [],
      "tasks": [
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), use Dispositivo de Recuperação de Suprimentos no Arsenal para retirar um total de itens coletados no valor de 750.000.",
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), extraia pelo Canal Subterrâneo no Arsenal 1 vez."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 51,
      "title": "Pelo Nome",
      "titleEn": "By Name",
      "map": ["tvstation"],
      "mapLinks": ["https://maps.tcno.co/abi/tv-station"],
      "requiredItems": [],
      "tasks": [
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), extraia pela Área dos Bastidores na Estação de TV 1 vez.",
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), extraia pela Sala de Entrevistas (Bastidores) na Estação de TV 1 vez.",
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), extraia pelo elevador de carga na Estação de TV 1 vez."
      ],
      "taskCount": 3,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 52,
      "title": "Contra-ataque",
      "titleEn": "Counterattack",
      "map": ["tvstation"],
      "mapLinks": ["https://maps.tcno.co/abi/tv-station"],
      "requiredItems": ["Granada de Luz M84"],
      "tasks": [
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), use Granada de Luz M84 para afetar inimigos (Scavs ou Players) 6 vezes na Estação de TV.",
        "Conclua 3 partidas em qualquer dificuldade na Estação de TV."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 53,
      "title": "Predador",
      "titleEn": "Predator",
      "map": ["aeroporto", "tvstation"],
      "mapLinks": ["https://maps.tcno.co/abi/airport", "https://maps.tcno.co/abi/tv-station"],
      "requiredItems": [],
      "tasks": [
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), vasculhe 5 vezes cofres não vasculhados na Estação de TV ou Aeroporto (excluindo cofres pequenos).",
        "Extraia com sucesso da Estação de TV ou Aeroporto 1 vez."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 54,
      "title": "Golpe Pesado",
      "titleEn": "Heavy Blow",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": ["AEK, AK-12 ou AMB17"],
      "tasks": [
        "Elimine 8 inimigos (Scavs ou Players) no Aeroporto usando AEK/AK-12/AMB17."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 55,
      "title": "Oportunidade de Ouro",
      "titleEn": "Golden Opportunity",
      "map": ["tvstation"],
      "mapLinks": ["https://maps.tcno.co/abi/tv-station"],
      "requiredItems": [],
      "tasks": [
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), vá até Central Área de Controle na Estação de TV e investigue completamente.",
        "Progresso +10 para cada contêiner vasculhado, +20 para cada inimigo eliminado e +10 para cada minuto sobrevivido.",
        "No modo Zona de Isolamento (Lockdown) ou na Zona Proibida (Forbidden), vá até O Cofre na Estação de TV e esconda o arquivo."
      ],
      "taskCount": 3,
      "canDoTogether": [],
      "difficulty": "hard",
      "category": "story"
    },
    {
      "id": 56,
      "title": "Pena de Corvo",
      "titleEn": "Raven's Feather",
      "map": ["northridge"],
      "mapLinks": ["https://maps.tcno.co/abi/northridge"],
      "requiredItems": [],
      "tasks": [
        "Vasculhe 1 cofre não vasculhado em Serviços do Acampamento em Northridge.",
        "Vasculhe 1 cofre não vasculhado em Serraria ou Estação de Esgoto em Northridge.",
        "Vasculhe 1 cofre não vasculhado em Estação de Comunicações em Northridge.",
        "Vasculhe 1 cofre não vasculhado em Estação do Teleférico em Northridge."
      ],
      "taskCount": 4,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 57,
      "title": "Janela de Oportunidade",
      "titleEn": "Window of Opportunity",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Colete 15 itens diversos de qualidade dourada ou maior do Aeroporto."
      ],
      "taskCount": 1,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 58,
      "title": "Déjà Vu",
      "titleEn": "Déjà Vu",
      "map": ["fazenda"],
      "mapLinks": ["https://maps.tcno.co/abi/farm"],
      "requiredItems": [],
      "tasks": [
        "Sobreviva por um total de 15 minutos na Fazenda.",
        "Vá até Cemitério na Fazenda e observe lápide."
      ],
      "taskCount": 2,
      "canDoTogether": [],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 59,
      "title": "Confronto Final",
      "titleEn": "Final Confrontation",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Investigue Lounge na Torre de Controle 2F (Segundo Andar) no Aeroporto.",
        "Vá até Escritório na Torre de Controle 2F (Segundo Andar) no Aeroporto para investigar.",
        "Investigue Sala de Observação na Torre de Controle 2F (Segundo Andar) no Aeroporto.",
        "Vá até Sala de Armazenamento do Centro de Controle na Torre de Controle 1F (Primeiro Andar) no Aeroporto para investigar."
      ],
      "taskCount": 4,
      "canDoTogether": [60],
      "difficulty": "normal",
      "category": "story"
    },
    {
      "id": 60,
      "title": "Bandeira ao Vento",
      "titleEn": "Flag in the Wind",
      "map": ["aeroporto"],
      "mapLinks": ["https://maps.tcno.co/abi/airport"],
      "requiredItems": [],
      "tasks": [
        "Elimine 10 inimigos (Scavs ou Players) dentro de Torre de Controle no Aeroporto.",
        "Vasculhe 2 cofres criptografados não vasculhados dentro de Torre de Controle no Aeroporto."
      ],
      "taskCount": 2,
      "canDoTogether": [59],
      "difficulty": "normal",
      "category": "story"
    }
  ]
};
