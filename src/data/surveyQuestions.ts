export interface QuestionConfig {
  id: string;
  stepIndex: number;
  number: number;
  title: string;
  subtitle?: string;
  type: 'single' | 'multiple' | 'text';
  maxSelections?: number;
  required: boolean;
  options?: { id: string; label: string; description?: string }[];
  placeholder?: string;
}

export const SURVEY_METADATA = {
  title: "Finding a Church – What Matters to You?",
  description: "We want to understand what people look for when choosing a church and what makes them feel welcomed, connected and spiritually fulfilled.",
  estimatedTime: "3 minutes",
  totalQuestions: 7,
  contactFieldsCount: 3,
};

export const QUESTIONS: QuestionConfig[] = [
  {
    id: "q1_journey",
    stepIndex: 1,
    number: 1,
    title: "Which best describes your current church journey?",
    subtitle: "Select the option that feels closest to where you are right now.",
    type: "single",
    required: true,
    options: [
      {
        id: "active_regular",
        label: "Actively attending church regularly",
        description: "Committed to a regular community or actively participating weekly."
      },
      {
        id: "occasional_searching",
        label: "Attending occasionally / searching for a new church",
        description: "Looking for a spiritual home that feels like the right fit."
      },
      {
        id: "stepped_away",
        label: "Stopped attending church, considering returning",
        description: "Took a break or had a pause and open to reconnecting."
      },
      {
        id: "exploring_faith",
        label: "New to faith / exploring Christianity for the first time",
        description: "Curious to discover what following Jesus and faith is all about."
      },
      {
        id: "not_religious",
        label: "Not currently religious / curious about faith communities",
        description: "Interested in the community, values, or life questions without pressure."
      },
      {
        id: "transition_life",
        label: "In a season of life transition",
        description: "Recently relocated, started university, new job, or family changes."
      }
    ]
  },
  {
    id: "q2_discovery",
    stepIndex: 2,
    number: 2,
    title: "How do you usually discover or find a church?",
    subtitle: "Select all channels you have used or would naturally turn to.",
    type: "multiple",
    required: true,
    options: [
      {
        id: "personal_recommendation",
        label: "Personal recommendation from family, friends, or colleagues",
        description: "Word of mouth and personal invitations from people I trust."
      },
      {
        id: "social_media",
        label: "Social media (Instagram, YouTube, TikTok, Facebook)",
        description: "Clips, sermon snippets, community stories, or social posts."
      },
      {
        id: "search_maps",
        label: "Google search, church website, or Google Maps reviews",
        description: "Searching local churches nearby, reading reviews and exploring the website."
      },
      {
        id: "passing_by",
        label: "Driving or walking past the church building / neighborhood signage",
        description: "Noticeable physical presence, banners, or community building."
      },
      {
        id: "community_events",
        label: "Community outreach events, charity, or local workshops",
        description: "Food drives, family fun days, concerts, or neighborhood support initiatives."
      },
      {
        id: "livestream_podcasts",
        label: "Online livestreams, podcasts, or Spotify teachings",
        description: "Listening or watching before ever deciding to step into a physical building."
      },
      {
        id: "other_channel",
        label: "Other discovery methods",
        description: "Flyers, bulletin boards, denominational directories, etc."
      }
    ]
  },
  {
    id: "q3_top3",
    stepIndex: 3,
    number: 3,
    title: "What are the three most important things you look for when choosing a church?",
    subtitle: "Choose up to 3 qualities that matter most to your heart and spiritual life.",
    type: "multiple",
    maxSelections: 3,
    required: true,
    options: [
      {
        id: "biblical_teaching",
        label: "Clear, inspiring Biblical preaching and practical teaching",
        description: "Messages rooted in Scripture that apply practically to everyday challenges."
      },
      {
        id: "uplifting_worship",
        label: "Vibrant, uplifting and heartfelt worship experience",
        description: "A genuine, reverent, and engaging musical & prayer atmosphere."
      },
      {
        id: "authentic_community",
        label: "Warm, authentic community where it's easy to make real friends",
        description: "A welcoming culture with genuine connection, not superficial polite smiles."
      },
      {
        id: "youth_children",
        label: "Strong children, family and youth ministry programs",
        description: "Safe, engaging, and formative environments for the next generation."
      },
      {
        id: "small_groups",
        label: "Small groups, life circles and personal discipleship",
        description: "Intentional mid-week gatherings for deeper discussion, study, and care."
      },
      {
        id: "community_impact",
        label: "Opportunities to serve and make a local community impact",
        description: "Active compassion, charity, volunteering, and local neighborhood outreach."
      },
      {
        id: "diversity_inclusion",
        label: "Diversity, inclusivity, and multi-generational fellowship",
        description: "A rich mix of ages, ethnic backgrounds, life stages, and walks of life."
      },
      {
        id: "healthy_leadership",
        label: "Sound leadership, humility, transparency, and healthy culture",
        description: "Accountable, approachable leaders and an atmosphere free from manipulation."
      },
      {
        id: "convenience_parking",
        label: "Convenient location, modern facilities, and easy parking",
        description: "Accessible venue, good transit options, comfortable and clean environment."
      }
    ]
  },
  {
    id: "q4_first_visit",
    stepIndex: 4,
    number: 4,
    title: "What would make you feel comfortable visiting a church for the first time?",
    subtitle: "Select the single biggest factor that lowers the barrier for your first visit.",
    type: "single",
    required: true,
    options: [
      {
        id: "watch_online_preview",
        label: "Watching a service online beforehand (livestream or video preview)",
        description: "Getting a preview of the music style, sermon tone, and atmosphere beforehand."
      },
      {
        id: "attend_with_friend",
        label: "Attending with someone I know or having a host meet me at the door",
        description: "Having a familiar friendly face to sit with and guide me through the experience."
      },
      {
        id: "clear_website_expectations",
        label: "Clear website details on what to expect, parking, and dress code",
        description: "Transparent answers to practical questions like 'What do people wear?' and 'Where do I park?'"
      },
      {
        id: "warm_greeters_no_spotlight",
        label: "Friendly greeters who welcome warmly without spotlighting visitors",
        description: "Genuine kindness without asking visitors to stand up or draw awkward attention."
      },
      {
        id: "clear_signage_welcome_desk",
        label: "Clear signage, intuitive navigation, and a dedicated welcome desk",
        description: "Effortless wayfinding to the sanctuary, restrooms, and kids check-in."
      },
      {
        id: "low_pressure_sit_back",
        label: "The freedom to sit quietly in the back and observe without pressure",
        description: "Zero pressure to speak, raise hands, or fill out cards unless I choose to."
      }
    ]
  },
  {
    id: "q5_reasons_stay",
    stepIndex: 5,
    number: 5,
    title: "What would encourage you to keep attending and become part of a church?",
    subtitle: "Select all elements that help you put down roots and call a church 'home'.",
    type: "multiple",
    required: true,
    options: [
      {
        id: "genuine_friendships",
        label: "Genuine friendships and feeling known and valued",
        description: "Building deep relationships where people check in on you and remember your story."
      },
      {
        id: "relevant_sermons",
        label: "Engaging sermons that speak directly to daily life and spiritual growth",
        description: "Teachings that challenge, give hope, and equip you for Monday through Saturday."
      },
      {
        id: "small_group_fit",
        label: "Finding a small group or life group tailored to my life stage",
        description: "Belonging to a smaller circle of peers sharing life, meals, and prayer."
      },
      {
        id: "meaningful_serving",
        label: "Opportunities to get involved and serve using my personal gifts",
        description: "A chance to contribute to music, hospitality, tech, outreach, or leadership."
      },
      {
        id: "pastoral_care",
        label: "Personal care, pastoral support, and prayer during tough seasons",
        description: "Knowing there is empathetic support when life hits unexpected grief or hardship."
      },
      {
        id: "safe_for_questions",
        label: "A safe environment where honest doubts and tough questions are respected",
        description: "A culture of intellectual and spiritual honesty rather than rigid conformity."
      },
      {
        id: "family_growth",
        label: "Seeing positive spiritual growth and joy in my children and family",
        description: "When my kids or spouse genuinely look forward to Sunday mornings."
      }
    ]
  },
  {
    id: "q6_communication",
    stepIndex: 6,
    number: 6,
    title: "How would you prefer a church to communicate with you after your first visit?",
    subtitle: "Select your most comfortable follow-up channel.",
    type: "single",
    required: true,
    options: [
      {
        id: "whatsapp_sms",
        label: "WhatsApp message or friendly SMS text",
        description: "Quick, convenient, and easy to reply when free."
      },
      {
        id: "warm_email",
        label: "A thoughtful email thanking me for visiting with helpful links",
        description: "Non-intrusive summary of upcoming events, service times, and resources."
      },
      {
        id: "phone_call",
        label: "A direct brief phone call from a member of the welcome team",
        description: "A warm voice welcoming me and asking if I have any questions."
      },
      {
        id: "in_person_refreshments",
        label: "An informal conversation over coffee/refreshments right after service",
        description: "Prefer personal connection on Sunday without follow-up during the busy week."
      },
      {
        id: "no_immediate_followup",
        label: "No immediate follow-up; I prefer to reach out when I am ready",
        description: "Giving me space to reflect and take things at my own pace."
      }
    ]
  },
  {
    id: "q7_feedback",
    stepIndex: 7,
    number: 7,
    title: "What is one thing you wish churches would do better to attract, welcome and retain people?",
    subtitle: "Optional open-ended response. Your honest perspective is deeply appreciated.",
    type: "text",
    required: false,
    placeholder: "For example: More focus on young professionals, clearer communication on websites, less pressure on donations, more community outreach, warmer follow-ups..."
  }
];
