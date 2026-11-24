// =========================================================================
// TECHNOTSAV 2026 - Central Fest Configuration & Editable Placeholders
// =========================================================================
// Update these values to customize the fest branding, dates, venue,
// registration fees, coordinators, and schedule across the entire website.
// =========================================================================

export const FEST_CONFIG = {
  name: "TECHNOTSAV 2026",
  edition: "Annual National Technology Fest",
  tagline: "Think. Create. Compete. Celebrate.",
  shortIntro:
    "Get ready for an exciting celebration of technology, creativity, gaming and innovation. Participate, showcase your skills, challenge yourself and compete with the best!",

  // Editable Placeholders (organizers can change anytime)
  collegeName: "College / University Name Placeholder",
  department: "Department of Computer Science & Engineering",
  festDate: "March 2026 (Dates to be announced)",
  venue: "College Campus / Auditorium & Computer Labs",
  registrationFee: "Free Entry / As Applicable per Event",
  brochureUrl: "#",

  // Key Statistics Counter
  stats: [
    { label: "Flagship Events", value: "6" },
    { label: "Expected Innovators", value: "1,500+" },
    { label: "Participating Colleges", value: "50+" },
    { label: "Prize Pool Worth", value: "Attractive Prizes" }
  ],

  // Schedule Timeline (Editable placeholders)
  schedule: [
    {
      day: "Day 1",
      date: "Date Placeholder - Morning Session",
      items: [
        {
          time: "09:00 AM – 10:00 AM",
          title: "Inaugural Ceremony & Keynote Address",
          venue: "Main Auditorium",
          description: "Grand opening of TECHNOTSAV 2026 with dignitaries, chief guests, and tech visionary speech."
        },
        {
          time: "10:30 AM – 01:00 PM",
          title: "Ideathon: Phase 1 (Pitch & Architecture)",
          venue: "Seminar Hall A",
          description: "Teams present their solution designs on Smart Campus & Daily Life Productivity."
        },
        {
          time: "11:00 AM – 01:30 PM",
          title: "Digital Treasure Hunt (Prelims & Online Clues)",
          venue: "Campus Wide & CS Lab 1",
          description: "Decipher cryptic digital puzzles, uncover hidden coordinates, and advance to finals."
        },
        {
          time: "02:00 PM – 04:30 PM",
          title: "Tech Quiz (Preliminary Elimination Round)",
          venue: "Auditorium Hall B",
          description: "Rapid buzzer rounds testing CS algorithms, AI, emerging tech, and history."
        }
      ]
    },
    {
      day: "Day 2",
      date: "Date Placeholder - Finals & Valedictory",
      items: [
        {
          time: "09:30 AM – 12:30 PM",
          title: "Gaming – Free Fire Championship (Squad Finals)",
          venue: "High-Speed Esports Arena / Lab 3",
          description: "Battle royale tournament across custom rooms to determine the ultimate champions."
        },
        {
          time: "10:00 AM – 01:00 PM",
          title: "Video Editing Showcase & Live Screening",
          venue: "Media Center & AV Lab",
          description: "Screening of creative cinematic submissions and live judging on VFX and storytelling."
        },
        {
          time: "11:30 AM – 01:30 PM",
          title: "Minute to Win It (Individual Agility Challenges)",
          venue: "Student Activity Center",
          description: "High-energy individual rapid challenges with 60-second time limits."
        },
        {
          time: "03:30 PM – 05:00 PM",
          title: "Grand Valedictory & Prize Distribution",
          venue: "Main Auditorium",
          description: "Awarding trophies, certificates, cash prizes, and closing celebration."
        }
      ]
    }
  ],

  // Organisers & Coordinators
  coordinators: {
    faculty: [
      {
        name: "Dr. Murthy DHR",
        designation: "Faculty Coordinator (Ideathon)",
        department: "Dept. of CSE",
        phone: "+91 96111 60318",
        email: ""
      },
      {
        name: "Mrs. Divya M N",
        designation: "Faculty Coordinator (Ideathon)",
        department: "Dept. of CSE",
        phone: "+91 63636 45869",
        email: ""
      },
      {
        name: "Dr. Gavina CG",
        designation: "Faculty Coordinator (Digital Tech Hunt)",
        department: "Dept. of CSE",
        phone: "+91 99019 37508",
        email: ""
      },
      {
        name: "Anita TM",
        designation: "Faculty Coordinator (Digital Tech Hunt)",
        department: "Dept. of CSE",
        phone: "+91 70220 92489",
        email: ""
      },
      {
        name: "Dr. Ajay N",
        designation: "Faculty Coordinator (Tech Quiz)",
        department: "Dept. of CSE",
        phone: "+91 97404 39787",
        email: ""
      },
      {
        name: "Varun Kumar N",
        designation: "Faculty Coordinator (Tech Quiz)",
        department: "Dept. of CSE",
        phone: "+91 94499 16212",
        email: ""
      },
      {
        name: "E Akhilla",
        designation: "Faculty Coordinator (Tech Quiz)",
        department: "Dept. of CSE",
        phone: "+91 89784 79426",
        email: ""
      },
      {
        name: "Dr. Shrihari MR",
        designation: "Faculty Coordinator (Free Fire)",
        department: "Dept. of CSE",
        phone: "+91 99800 19411",
        email: ""
      },
      {
        name: "Divakar K M",
        designation: "Faculty Coordinator (Free Fire)",
        department: "Dept. of CSE",
        phone: "+91 99458 09011",
        email: ""
      },
      {
        name: "Dr. Shwetha T",
        designation: "Faculty Coordinator (Logo Mania)",
        department: "Dept. of CSE",
        phone: "+91 86180 84599",
        email: ""
      },
      {
        name: "Suman J",
        designation: "Faculty Coordinator (Logo Mania)",
        department: "Dept. of CSE",
        phone: "+91 98451 08438",
        email: ""
      },
      {
        name: "Udayapriya",
        designation: "Faculty Coordinator (Logo Mania)",
        department: "Dept. of CSE",
        phone: "+91 94488 65557",
        email: ""
      },
      {
        name: "Dr. Rashmi KA",
        designation: "Faculty Coordinator (Videography)",
        department: "Dept. of CSE",
        phone: "+91 85534 19599",
        email: ""
      },
      {
        name: "Mrs. Navyashri N",
        designation: "Faculty Coordinator (Videography)",
        department: "Dept. of CSE",
        phone: "+91 84387 32911",
        email: ""
      },
      {
        name: "Mamatha",
        designation: "Faculty Coordinator (Minute to Win-It)",
        department: "Dept. of CSE",
        phone: "+91 99009 67894",
        email: ""
      },
      {
        name: "Divyshree V",
        designation: "Faculty Coordinator (Minute to Win-It)",
        department: "Dept. of CSE",
        phone: "+91 82176 66763",
        email: ""
      },
      {
        name: "Chanadana D Swamy",
        designation: "Faculty Coordinator (Minute to Win-It)",
        department: "Dept. of CSE",
        phone: "+91 63612 64955",
        email: ""
      }
    ],
    student: [
      {
        name: "Sohan Gowda K",
        role: "Main Student Coordinator",
        usn: "1SJ24CS145",
        branchYear: "5th Sem",
        phone: "+91 80505 73782",
        email: ""
      },
      {
        name: "Ruchitha L",
        role: "Main Student Coordinator",
        usn: "1SJ24CS124",
        branchYear: "5th Sem",
        phone: "+91 63618 00423",
        email: ""
      },
      {
        name: "Brunda S",
        role: "Main Student Coordinator",
        usn: "1SJ24CS022",
        branchYear: "5th Sem",
        phone: "+91 78994 09898",
        email: ""
      },
      {
        name: "Kruthika M G",
        role: "Main Student Coordinator",
        usn: "1SJ24CS061",
        branchYear: "5th Sem",
        phone: "+91 94485 49609",
        email: ""
      },
      {
        name: "Tejas J V",
        role: "Main Student Coordinator",
        usn: "1SJ25CS153",
        branchYear: "3rd Sem",
        phone: "+91 72595 96177",
        email: ""
      }
    ]
  },

  // Social & Quick Links
  socials: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    youtube: "https://youtube.com",
    discord: "https://discord.com"
  }
};
