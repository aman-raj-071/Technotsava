// =========================================================================
// TECHNOTSAV 2026 - Events Configuration Data
// =========================================================================

export const EVENTS = [
  {
    id: "digital-treasure-hunt",
    code: "DTH",
    name: "Digital Treasure Hunt",
    category: "Exploration & Problem Solving",
    type: "team",
    minTeamSize: 2,
    maxTeamSize: 4,
    teamSizeText: "2–4 Participants",
    shortDescription:
      "Decode cryptic cyber clues, traverse online security puzzles, decrypt hidden keys, and uncover virtual checkpoints in a high-octane race against time.",
    detailedDescription:
      "Put your analytical thinking, cyber sleuthing, and digital problem-solving skills to the ultimate test. Teams will navigate through multi-tier digital riddles, cryptic steganography, geo-coordinates, and web challenges to claim victory.",
    accentColor: "from-cyan-500 to-blue-600",
    glowColor: "rgba(6, 182, 212, 0.4)",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    icon: "Compass",
    rules: [
      "Each team must consist of 2 to 4 participants including the team leader.",
      "A laptop or smartphone with high-speed internet connection is required.",
      "The use of unauthorized external automation tools or bot scripts will result in immediate disqualification.",
      "Time is critical: ties will be broken based on exact submission timestamps."
    ]
  },
  {
    id: "tech-quiz",
    code: "QUIZ",
    name: "Tech Quiz",
    category: "Knowledge & Technical Trivia",
    type: "pair",
    minTeamSize: 2,
    maxTeamSize: 2,
    teamSizeText: "Exactly 2 Participants",
    shortDescription:
      "Face off in a thrilling battle of tech intellect spanning Computer Science algorithms, AI advancements, tech giants history, and cutting-edge innovations.",
    detailedDescription:
      "A competitive quiz tournament crafted for genuine technology enthusiasts. Spanning preliminary elimination rounds to the electrifying on-stage buzzer finals with negative markings and lightning rounds.",
    accentColor: "from-purple-500 to-indigo-600",
    glowColor: "rgba(168, 85, 247, 0.4)",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    icon: "HelpCircle",
    rules: [
      "Participation requires exactly 2 members per team. Individual entries are strictly prohibited.",
      "Both members must belong to a recognized college/university.",
      "Preliminary round consists of 30 rapid-fire multiple-choice questions.",
      "Top 6 qualifying teams will advance to the onstage buzzer finals."
    ]
  },
  {
    id: "ideathon",
    code: "IDEA",
    name: "Ideathon",
    category: "Innovation & Pitching",
    type: "team",
    minTeamSize: 2,
    maxTeamSize: 4,
    teamSizeText: "2–4 Participants",
    shortDescription:
      "Architect and present visionary tech innovations tackling critical challenges in Smart Campus ecosystems or Daily Productivity utilities.",
    detailedDescription:
      "Ideathon provides a prestigious launchpad for student innovators to formulate breakthrough concepts, architectural wireframes, and business viability pitches evaluated by industry veterans and academic mentors.",
    accentColor: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icon: "Lightbulb",
    themes: [
      {
        id: "smart-campus",
        title: "Smart Campus & Student Life",
        description:
          "Transform educational ecosystems: automated attendance, campus safety, resource optimization, smart hostel logistics, or student collaboration hubs.",
        icon: "GraduationCap"
      },
      {
        id: "daily-productivity",
        title: "Daily Life Productivity & Digital Utilities",
        description:
          "Streamline daily existence: AI personal organizers, sustainable lifestyle trackers, micro-task management, mental wellness utilities, or accessibility tools.",
        icon: "Cpu"
      }
    ],
    rules: [
      "Team size must be between 2 and 4 participants including the team leader.",
      "Teams must select exactly ONE theme during registration.",
      "Each team will be allotted 7 minutes to pitch followed by 3 minutes of Q&A with jury.",
      "Evaluation criteria: Innovation (30%), Technical Feasibility (30%), Impact (20%), Presentation (20%)."
    ]
  },
  {
    id: "gaming-free-fire",
    code: "GAME",
    name: "Gaming – Free Fire",
    category: "Esports Championship",
    type: "team",
    minTeamSize: 2,
    maxTeamSize: 4,
    teamSizeText: "2–4 Participants",
    shortDescription:
      "Drop into the battleground, synchronize your squad strategies, out-aim opponents, and battle for the ultimate Booyah in high-stakes Free Fire lobbies.",
    detailedDescription:
      "Experience pulse-pounding mobile esports warfare. Squads face off across multiple classic map rotations with official tournament competitive settings and kill-placement scoring matrix.",
    accentColor: "from-rose-500 to-red-600",
    glowColor: "rgba(244, 63, 94, 0.4)",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    icon: "Gamepad2",
    rules: [
      "Squad size is 2 to 4 players. Only mobile devices are allowed (emulators, iPads, triggers are prohibited).",
      "All squad members must be ready in the custom room 10 minutes prior to match schedule.",
      "Official scoring: Placement points + 1 point per kill.",
      "Any third-party mods, hacks, or abusive conduct results in an instant ban."
    ]
  },
  {
    id: "minute-to-win-it",
    code: "MWI",
    name: "Minute to Win It",
    category: "Individual Agility & Fun",
    type: "individual",
    minTeamSize: 1,
    maxTeamSize: 1,
    teamSizeText: "Individual Participation",
    shortDescription:
      "Sixty seconds on the clock. Put your reflexes, motor coordination, cognitive speed, and nerve of steel to the test in fast-paced micro-challenges.",
    detailedDescription:
      "A fast-paced, high-energy individual showdown! Participants tackle a gauntlet of 60-second tech-inspired physical and mental agility games where every single millisecond dictates the leaderboard.",
    accentColor: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16, 185, 129, 0.4)",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: "Timer",
    rules: [
      "Strictly individual participation. No team entries permitted.",
      "Each participant receives exactly 60 seconds per challenge station.",
      "Points awarded based on speed of completion and penalty deductions.",
      "Decisions by the round ref/judge are final and binding."
    ]
  },
  {
    id: "video-editing",
    code: "VID",
    name: "Video Editing",
    category: "Creative Media & Visual Arts",
    type: "team",
    minTeamSize: 2,
    maxTeamSize: 4,
    teamSizeText: "2–4 Participants",
    shortDescription:
      "Transform raw fest footage into cinematic masterpieces with seamless transitions, sound design, color grading, and captivating storytelling.",
    detailedDescription:
      "Showcase your mastery of visual pacing, cinematic rhythm, motion graphics, and audio mixing. Teams are provided raw video clips and creative prompts to edit an impactful fest promotional video or visual reel.",
    accentColor: "from-violet-500 to-fuchsia-600",
    glowColor: "rgba(192, 132, 252, 0.4)",
    badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    icon: "Video",
    rules: [
      "Teams can comprise 2 to 4 participants including the team leader.",
      "Raw footage and theme audio assets will be provided at the start of the event.",
      "Editing software of choice is permitted (Premiere Pro, DaVinci Resolve, After Effects, CapCut, etc.).",
      "Final video duration must be between 60 to 90 seconds. Submissions must be in 1080p MP4 format."
    ]
  },
  {
    id: "logo-mania",
    code: "LOGO",
    name: "Logo Mania",
    category: "Visual Trivia & Brand Recognition",
    type: "team",
    minTeamSize: 2,
    maxTeamSize: 2,
    teamSizeText: "2 Participants (Exactly)",
    shortDescription:
      "Fastest-finger buzzer contest identifying iconic brands, tech logos, cropped emblems, and company origins.",
    detailedDescription:
      "A high-stakes visual brand contest. A logo will be displayed on screen; the first team to buzz after recognizing the brand gets the chance to answer within the time limit. Accuracy, lightning reflexes, and composure under pressure determine the champion.",
    accentColor: "from-cyan-500 to-blue-600",
    glowColor: "rgba(34, 211, 238, 0.4)",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    icon: "Crown",
    rules: [
      "Teams: Each team must have exactly 2 members. Students may not compete alone or in groups larger than 2.",
      "How the game works: A logo will be displayed on screen. The first team to press the buzzer after recognizing the brand or company gets the chance to answer.",
      "Answering: Only the team that buzzes first may answer. Answers must be given within the time limit announced by the judge.",
      "Scoring: A correct answer earns points as announced before the round begins. An incorrect answer may result in a point deduction or loss of the chance to answer, as announced by the judge.",
      "Buzzer etiquette: Do not press the buzzer before the logo is fully displayed. Pressing early may result in a penalty.",
      "Judge's decision: The judge's decision is final. Any disputes must be raised politely and respectfully before the next logo is shown.",
      "Internet access: No Wi-Fi access will be provided at the venue. Participants are responsible for their own mobile data or networks, and the organizers are not liable for any connectivity issues.",
      "Conduct: Teams must behave respectfully toward other participants, judges, and organizers. Cheating, sharing answers with other teams, or using outside help is not allowed and will lead to disqualification.",
      "Disqualification: Teams that break these rules may be warned, penalized, or disqualified at the organizers' discretion.",
      "Winners: The team with the highest score at the end of the contest will be declared the winner. In the event of a tie, a tiebreaker round will be held.",
      "Organizer's rights: The organizers reserve the right to modify these rules if necessary. Any changes will be announced before the contest begins."
    ]
  }
];

export const getEventById = (id) => EVENTS.find((e) => e.id === id);
