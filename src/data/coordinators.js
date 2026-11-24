// =========================================================================
// TECHNOTSAV 2026 – Student Coordinators (Certificate Lookup & Roster)
// =========================================================================
// The Student Coordinator certificate portal looks up a coordinator's name
// by their USN (the input field on the portal expects a USN).
//
// Extracted from official TECHNOTSAVA 8.0 document:
// - Main Coordinators
// - Event-wise Student Teams (Ideathon, Digital Tech Hunt, Tech Quiz, Free Fire, Logo Mania, Videography, Minute to Win-It)
// - Publishing Coordinators (20 members)
// =========================================================================

export const COORDINATORS = [
  // ── Main Coordinators ──────────────────────────────────────────────────
  { usn: '1SJ24CS145', name: 'Sohan Gowda K', role: 'Main Coordinator', semester: '5th', phone: '8050573782', team: 'Main' },
  { usn: '1SJ24CS124', name: 'Ruchitha L', role: 'Main Coordinator', semester: '5th', phone: '6361800423', team: 'Main' },
  { usn: '1SJ24CS022', name: 'Brunda S', role: 'Main Coordinator', semester: '5th', phone: '7899409898', team: 'Main' },
  { usn: '1SJ24CS061', name: 'Kruthika M G', role: 'Main Coordinator', semester: '5th', phone: '9448549609', team: 'Main' },
  { usn: '1SJ25CS153', name: 'Tejas J V', role: 'Main Coordinator', semester: '3rd', phone: '7259596177', team: 'Main' },

  // ── Ideathon Student Team (Venue: IT2F-02) ─────────────────────────────
  { usn: '1SJ24CS024', name: 'Chandushri V M', role: 'Team Lead', semester: '5th', phone: '9731005505', team: 'Ideathon' },
  { usn: '1SJ24CS012', name: 'Anusha S', role: 'Student Coordinator', semester: '5th', phone: '9740066913', team: 'Ideathon' },
  { usn: '1SJ25CS126', name: 'Sahithi K N', role: 'Student Coordinator', semester: '3rd', phone: '9113534148', team: 'Ideathon' },
  { usn: '1SJ25CS125', name: 'Sahana M', role: 'Student Coordinator', semester: '3rd', phone: '7483795889', team: 'Ideathon' },
  { usn: '1SJ25CS123', name: 'Sagar Metri', role: 'Student Coordinator', semester: '3rd', phone: '9972916216', team: 'Ideathon' },

  // ── Digital Tech Hunt Student Team (Venue: IT2F03) ─────────────────────
  { usn: '1SJ24CS035', name: 'Ganavi V', role: 'Team Lead', semester: '5th', phone: '6362289292', team: 'Digital Tech Hunt' },
  { usn: '1SJ24CS025', name: 'D N Harshitha', role: 'Student Coordinator', semester: '5th', phone: '8074297369', team: 'Digital Tech Hunt' },
  { usn: '1SJ25CS121', name: 'Sadhvika B R', role: 'Student Coordinator', semester: '3rd', phone: '9353188329', team: 'Digital Tech Hunt' },
  { usn: '1SJ25CS135', name: 'Shashirekha G', role: 'Student Coordinator', semester: '3rd', phone: '8088841231', team: 'Digital Tech Hunt' },
  { usn: '1SJ25CS140', name: 'Shrunga N', role: 'Student Coordinator', semester: '3rd', phone: '6361413466', team: 'Digital Tech Hunt' },
  { usn: '1SJ25CS144', name: 'Sowmya V', role: 'Student Coordinator', semester: '3rd', phone: '7411707921', team: 'Digital Tech Hunt' },

  // ── Tech Quiz Student Team (Venue: ITLAB-8) ────────────────────────────
  { usn: '1SJ24CS067', name: 'Likhitha A', role: 'Team Lead', semester: '5th', phone: '8088288313', team: 'Tech Quiz' },
  { usn: '1SJ24CS072', name: 'Madhu P G', role: 'Student Coordinator', semester: '5th', phone: '8088592416', team: 'Tech Quiz' },
  { usn: '1SJ24CS100', name: 'Poojitha R', role: 'Student Coordinator', semester: '5th', phone: '9164883811', team: 'Tech Quiz' },
  { usn: '1SJ24CS088', name: 'Nanditha A', role: 'Student Coordinator', semester: '5th', phone: '8867042328', team: 'Tech Quiz' },
  { usn: '1SJ24CS085', name: 'Namitha A', role: 'Student Coordinator', semester: '5th', phone: '8431691118', team: 'Tech Quiz' },
  { usn: '1SJ24CS064', name: 'Kusuma B M', role: 'Student Coordinator', semester: '5th', phone: '8971770693', team: 'Tech Quiz' },

  // ── Free Fire Student Team (Venue: IT1F03) ─────────────────────────────
  { usn: '1SJ24CS176', name: 'Vivek P M', role: 'Team Lead', semester: '5th', phone: '9110429998', team: 'Free Fire' },
  { usn: 'YASHAS-A', name: 'Yashas A', role: 'Student Coordinator', semester: '5th', phone: '9980581709', team: 'Free Fire' },
  { usn: '1SJ24CS127', name: 'Sai Gagan N K', role: 'Student Coordinator', semester: '5th', phone: '8073190199', team: 'Free Fire' },
  { usn: 'CHIRAYUSH-TM', name: 'Chirayush T M', role: 'Student Coordinator', semester: '5th', phone: '8088740884', team: 'Free Fire' },
  { usn: '1SJ24CS158', name: 'Uday S Reddy', role: 'Student Coordinator', semester: '5th', phone: '8618450881', team: 'Free Fire' },
  { usn: '1SJ24CS169', name: 'Vidit Raj', role: 'Student Coordinator', semester: '5th', phone: '6204093356', team: 'Free Fire' },

  // ── Logo Mania Student Team (Venue: IT1F02) ────────────────────────────
  { usn: '1SJ24CS182', name: 'Yashwanth Gowda R', role: 'Team Lead', semester: '5th', phone: '6366209220', team: 'Logo Mania' },
  { usn: '1SJ24CS184', name: 'Yogish Gowda S', role: 'Student Coordinator', semester: '5th', phone: '9380048468', team: 'Logo Mania' },
  { usn: '1SJ24CS130', name: 'Sandeep N', role: 'Student Coordinator', semester: '5th', phone: '9043930445', team: 'Logo Mania' },
  { usn: '1SJ24CS147', name: 'Sudeep R H', role: 'Student Coordinator', semester: '5th', phone: '7975904497', team: 'Logo Mania' },
  { usn: '1SJ24CS128', name: 'Samith Gowda', role: 'Student Coordinator', semester: '3rd', phone: '9663605727', team: 'Logo Mania' },
  { usn: '1SJ24CS138', name: 'Shodhan V Shetty', role: 'Student Coordinator', semester: '5th', phone: '7975934723', team: 'Logo Mania' },

  // ── Videography Student Team (Venue: ITLAB-10) ─────────────────────────
  { usn: '1SJ25CS153', name: 'Tejas J V', role: 'Team Lead', semester: '3rd', phone: '7259596177', team: 'Videography' },
  { usn: '1SJ25CS137', name: 'Shivanand Konnur', role: 'Student Coordinator', semester: '3rd', phone: '7975433513', team: 'Videography' },
  { usn: '1SJ25CS117', name: 'Rohith C S', role: 'Student Coordinator', semester: '3rd', phone: '9535807566', team: 'Videography' },
  { usn: '1SJ25CS167', name: 'Yashavanth H D', role: 'Student Coordinator', semester: '3rd', phone: '9741396012', team: 'Videography' },
  { usn: '1SJ25CS118', name: 'Rohith S R', role: 'Student Coordinator', semester: '3rd', phone: '9113985775', team: 'Videography' },
  { usn: '1SJ24CS003', name: 'Abhishek E', role: 'Student Coordinator', semester: '5th', phone: '9148730082', team: 'Videography' },

  // ── Minute to Win-It Student Team (Venue: IT2F01) ──────────────────────
  { usn: '1SJ25CS017', name: 'Ayiman Tarannum', role: 'Team Lead', semester: '3rd', phone: '7892306242', team: 'Minute to Win-It' },
  { usn: '1SJ25CS011', name: 'Aman Raj', role: 'Student Coordinator', semester: '3rd', phone: '9931897671', team: 'Minute to Win-It' },
  { usn: '1SJ25CS007', name: 'Afza Farheen A', role: 'Student Coordinator', semester: '3rd', phone: '9535881626', team: 'Minute to Win-It' },
  { usn: '1SJ25CS014', name: 'Aniket', role: 'Student Coordinator', semester: '3rd', phone: '8618444599', team: 'Minute to Win-It' },
  { usn: '1SJ25CS034', name: 'Chaithanya R', role: 'Student Coordinator', semester: '3rd', phone: '9019568692', team: 'Minute to Win-It' },

  // ── Publishing Coordinators (20 Members) ────────────────────────────────
  { usn: '1SJ24CS181', name: 'Yashaswini M', role: 'Publishing Coordinator', semester: '5th', phone: '9901419104', team: 'Publishing' },
  { usn: '1SJ24CS178', name: 'Vyshnavi P', role: 'Publishing Coordinator', semester: '5th', phone: '9902575365', team: 'Publishing' },
  { usn: '1SJ24CS129', name: 'Sanchitha S', role: 'Publishing Coordinator', semester: '5th', phone: '8296545766', team: 'Publishing' },
  { usn: '1SJ25CS045', name: 'Haripriya RM', role: 'Publishing Coordinator', semester: '3rd', phone: '7892310376', team: 'Publishing' },
  { usn: '1SJ25CS026', name: 'Bhavana J', role: 'Publishing Coordinator', semester: '3rd', phone: '9740815955', team: 'Publishing' },
  { usn: '1SJ25CS043', name: 'G.N Meghana', role: 'Publishing Coordinator', semester: '3rd', phone: '8125530028', team: 'Publishing' },
  { usn: '1SJ24CS183', name: 'Yathish V', role: 'Publishing Coordinator', semester: '5th', phone: '9036060954', team: 'Publishing' },
  { usn: '1SJ24CS103', name: 'Pratham S B', role: 'Publishing Coordinator', semester: '5th', phone: '8431503878', team: 'Publishing' },
  { usn: '1SJ24CS132', name: 'Sanika R', role: 'Publishing Coordinator', semester: '5th', phone: '9611424509', team: 'Publishing' },
  { usn: '1SJ24CS168', name: 'Vidhya N', role: 'Publishing Coordinator', semester: '5th', phone: '8088835482', team: 'Publishing' },
  { usn: '1SJ24CS118', name: 'Riya Singh', role: 'Publishing Coordinator', semester: '5th', phone: '7398298975', team: 'Publishing' },
  { usn: '1SJ24CS112', name: 'Rachamalla Kavya', role: 'Publishing Coordinator', semester: '5th', phone: '8099910316', team: 'Publishing' },
  { usn: '1SJ24CS113', name: 'Ragi Rakshitha', role: 'Publishing Coordinator', semester: '5th', phone: '93F98971916', team: 'Publishing' },
  { usn: '1SJ25CS148', name: 'Sumanth Reddy', role: 'Publishing Coordinator', semester: '3rd', phone: '9686758669', team: 'Publishing' },
  { usn: '1SJ24CS141', name: 'Shreya M', role: 'Publishing Coordinator', semester: '5th', phone: '8310983103', team: 'Publishing' },
  { usn: '1SJ25CS173', name: 'Reshika Kirana Kumar', role: 'Publishing Coordinator', semester: '3rd', phone: '9353061063', team: 'Publishing' },
  { usn: '1SJ24CS009', name: 'Akshay S', role: 'Publishing Coordinator', semester: '5th', phone: '7760233718', team: 'Publishing' },
  { usn: '1SJ24CS170', name: 'Vidya Shree D', role: 'Publishing Coordinator', semester: '5th', phone: '9632463745', team: 'Publishing' },
  { usn: '1SJ24CS166', name: 'Varsha Tejamayi R', role: 'Publishing Coordinator', semester: '5th', phone: '9900388439', team: 'Publishing' },
  { usn: '1SJ25CS061', name: 'Keerthi Kumar B J', role: 'Publishing Coordinator', semester: '3rd', phone: '7019253329', team: 'Publishing' },
];
