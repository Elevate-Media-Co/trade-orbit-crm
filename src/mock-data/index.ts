import type {
  Activity,
  Call,
  Campaign,
  DailyActivityPoint,
  FollowUp,
  Lead,
  NotificationItem,
  TeamPerformance,
  User,
} from "@/types";

/** Anchor "today" for deterministic prototype demo data */
export const DEMO_TODAY = "2026-08-11T10:30:00+05:30";

export const currentUser: User = {
  id: "user-komal",
  name: "Komal Deshmukh",
  email: "komal@tradeorbit.in",
  phone: "9876543210",
  role: "telecaller",
  avatarInitials: "KD",
  isActive: true,
  city: "Pune",
};

export const users: User[] = [
  currentUser,
  {
    id: "user-rohit",
    name: "Rohit Jadhav",
    email: "rohit@tradeorbit.in",
    phone: "9876543211",
    role: "telecaller",
    avatarInitials: "RJ",
    isActive: true,
    city: "Pune",
  },
  {
    id: "user-sneha",
    name: "Sneha Kulkarni",
    email: "sneha@tradeorbit.in",
    phone: "9876543212",
    role: "nurturing",
    avatarInitials: "SK",
    isActive: true,
    city: "Mumbai",
  },
  {
    id: "user-ajay",
    name: "Ajay Patil",
    email: "ajay@tradeorbit.in",
    phone: "9876543213",
    role: "nurturing",
    avatarInitials: "AP",
    isActive: true,
    city: "Kolhapur",
  },
  {
    id: "user-manager",
    name: "Priya Sharma",
    email: "priya@tradeorbit.in",
    phone: "9876543214",
    role: "admin",
    avatarInitials: "PS",
    isActive: true,
    city: "Pune",
  },
];

export const campaigns: Campaign[] = [
  {
    id: "camp-pune",
    name: "Pune Trading Bootcamp",
    city: "Pune",
    status: "active",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    leadsCount: 186,
    enrollments: 24,
    budget: 185000,
  },
  {
    id: "camp-kolhapur",
    name: "Kolhapur Trading Bootcamp",
    city: "Kolhapur",
    status: "active",
    startDate: "2026-08-05",
    endDate: "2026-09-05",
    leadsCount: 142,
    enrollments: 18,
    budget: 120000,
  },
  {
    id: "camp-free-class",
    name: "Free Trading Class",
    city: "Pune",
    status: "active",
    startDate: "2026-07-20",
    endDate: "2026-08-20",
    leadsCount: 312,
    enrollments: 41,
    budget: 95000,
  },
  {
    id: "camp-mentorship",
    name: "30-Day Mentorship",
    city: "Pan India",
    status: "active",
    startDate: "2026-07-15",
    endDate: "2026-09-15",
    leadsCount: 98,
    enrollments: 29,
    budget: 210000,
  },
];

const leadSeed: Array<Omit<Lead, "id" | "updatedAt">> = [
  {
    name: "Rahul Patil",
    phone: "9823456710",
    email: "rahul.patil@gmail.com",
    city: "Pune",
    campaignId: "camp-pune",
    source: "meta_ads",
    ownerId: "user-komal",
    status: "new_lead",
    priority: "warm",
    lastContactAt: null,
    nextFollowUpAt: "2026-08-11T11:00:00+05:30",
    createdAt: "2026-08-11T08:15:00+05:30",
    notes: "Filled Meta lead form after evening ad.",
    courseInterest: "Pune Trading Bootcamp",
    probability: 35,
    paymentStatus: "not_started",
  },
  {
    name: "Snehal More",
    phone: "9890123456",
    city: "Pune",
    campaignId: "camp-pune",
    source: "instagram",
    ownerId: "user-komal",
    status: "attempted",
    priority: "warm",
    lastContactAt: "2026-08-11T09:20:00+05:30",
    nextFollowUpAt: "2026-08-11T14:30:00+05:30",
    createdAt: "2026-08-10T18:40:00+05:30",
    notes: "No answer on first attempt. Left WhatsApp note.",
    courseInterest: "Pune Trading Bootcamp",
    probability: 30,
    paymentStatus: "not_started",
  },
  {
    name: "Amit Deshmukh",
    phone: "9765432109",
    email: "amit.d@outlook.com",
    city: "Pune",
    campaignId: "camp-free-class",
    source: "website",
    ownerId: "user-komal",
    status: "connected",
    priority: "warm",
    lastContactAt: "2026-08-11T09:45:00+05:30",
    nextFollowUpAt: "2026-08-11T16:00:00+05:30",
    createdAt: "2026-08-09T11:10:00+05:30",
    notes: "Connected — wants details on weekend batch.",
    courseInterest: "Free Trading Class",
    probability: 45,
    paymentStatus: "not_started",
  },
  {
    name: "Priyanka Joshi",
    phone: "9901234567",
    city: "Mumbai",
    campaignId: "camp-mentorship",
    source: "whatsapp",
    ownerId: "user-sneha",
    status: "interested",
    priority: "hot",
    lastContactAt: "2026-08-10T17:15:00+05:30",
    nextFollowUpAt: "2026-08-11T12:00:00+05:30",
    createdAt: "2026-08-07T14:00:00+05:30",
    notes: "Interested in mentorship. Asked about EMI.",
    objection: "Price / EMI options",
    courseInterest: "30-Day Mentorship",
    closerId: "user-sneha",
    probability: 65,
    paymentStatus: "not_started",
  },
  {
    name: "Vikram Shinde",
    phone: "9812345670",
    city: "Kolhapur",
    campaignId: "camp-kolhapur",
    source: "meta_ads",
    ownerId: "user-rohit",
    status: "hot",
    priority: "hot",
    lastContactAt: "2026-08-10T19:00:00+05:30",
    nextFollowUpAt: "2026-08-11T10:45:00+05:30",
    createdAt: "2026-08-05T09:30:00+05:30",
    notes: "Ready to join Kolhapur bootcamp. Waiting for salary credit.",
    objection: "Timing of payment",
    courseInterest: "Kolhapur Trading Bootcamp",
    closerId: "user-ajay",
    probability: 80,
    paymentStatus: "pending",
  },
  {
    name: "Anjali Gaikwad",
    phone: "9876012345",
    city: "Pune",
    campaignId: "camp-pune",
    source: "referral",
    ownerId: "user-komal",
    status: "payment_pending",
    priority: "hot",
    lastContactAt: "2026-08-11T08:50:00+05:30",
    nextFollowUpAt: "2026-08-11T18:00:00+05:30",
    createdAt: "2026-08-03T16:20:00+05:30",
    notes: "Partial payment of ₹5,000 received. Balance pending.",
    objection: "Need invoice for company reimbursement",
    courseInterest: "Pune Trading Bootcamp",
    closerId: "user-sneha",
    probability: 90,
    paymentStatus: "partial",
  },
  {
    name: "Sagar Kadam",
    phone: "9923456781",
    city: "Nashik",
    campaignId: "camp-free-class",
    source: "instagram",
    ownerId: "user-rohit",
    status: "follow_up",
    priority: "warm",
    lastContactAt: "2026-08-09T15:30:00+05:30",
    nextFollowUpAt: "2026-08-10T11:00:00+05:30",
    createdAt: "2026-08-06T10:00:00+05:30",
    notes: "Overdue follow-up. Was travelling.",
    courseInterest: "Free Trading Class",
    probability: 40,
    paymentStatus: "not_started",
  },
  {
    name: "Neha Pawar",
    phone: "9834567892",
    city: "Pune",
    campaignId: "camp-mentorship",
    source: "website",
    ownerId: "user-sneha",
    status: "nurturing",
    priority: "hot",
    lastContactAt: "2026-08-10T13:20:00+05:30",
    nextFollowUpAt: "2026-08-12T11:30:00+05:30",
    createdAt: "2026-08-02T12:45:00+05:30",
    notes: "Comparing with another mentor. Share case studies.",
    objection: "Comparing mentors",
    courseInterest: "30-Day Mentorship",
    closerId: "user-sneha",
    probability: 55,
    paymentStatus: "not_started",
  },
  {
    name: "Rohan Bhosale",
    phone: "9845678903",
    city: "Satara",
    campaignId: "camp-kolhapur",
    source: "whatsapp",
    ownerId: "user-ajay",
    status: "enrolled",
    priority: "hot",
    lastContactAt: "2026-08-08T16:00:00+05:30",
    nextFollowUpAt: null,
    createdAt: "2026-07-28T09:15:00+05:30",
    notes: "Full payment received. Onboarding WhatsApp group added.",
    courseInterest: "Kolhapur Trading Bootcamp",
    closerId: "user-ajay",
    probability: 100,
    paymentStatus: "completed",
  },
  {
    name: "Meera Naik",
    phone: "9856789014",
    city: "Pune",
    campaignId: "camp-pune",
    source: "meta_ads",
    ownerId: "user-komal",
    status: "interested",
    priority: "warm",
    lastContactAt: "2026-08-11T07:55:00+05:30",
    nextFollowUpAt: "2026-08-12T10:00:00+05:30",
    createdAt: "2026-08-08T08:00:00+05:30",
    notes: "Wants evening batch due to job.",
    objection: "Batch timing",
    courseInterest: "Pune Trading Bootcamp",
    closerId: "user-sneha",
    probability: 60,
    paymentStatus: "not_started",
  },
  {
    name: "Kiran Salunkhe",
    phone: "9867890125",
    city: "Kolhapur",
    campaignId: "camp-kolhapur",
    source: "referral",
    ownerId: "user-rohit",
    status: "attempted",
    priority: "cold",
    lastContactAt: "2026-08-10T12:10:00+05:30",
    nextFollowUpAt: "2026-08-11T15:00:00+05:30",
    createdAt: "2026-08-09T19:30:00+05:30",
    notes: "Busy — asked to call after 3 PM.",
    courseInterest: "Kolhapur Trading Bootcamp",
    probability: 25,
    paymentStatus: "not_started",
  },
  {
    name: "Deepa Chavan",
    phone: "9878901236",
    city: "Mumbai",
    campaignId: "camp-free-class",
    source: "meta_ads",
    ownerId: "user-komal",
    status: "new_lead",
    priority: "warm",
    lastContactAt: null,
    nextFollowUpAt: "2026-08-11T11:30:00+05:30",
    createdAt: "2026-08-11T09:05:00+05:30",
    notes: "New Meta lead from Free Class creative.",
    courseInterest: "Free Trading Class",
    probability: 30,
    paymentStatus: "not_started",
  },
  {
    name: "Yogesh Mane",
    phone: "9889012347",
    city: "Sangli",
    campaignId: "camp-kolhapur",
    source: "instagram",
    ownerId: "user-ajay",
    status: "payment_pending",
    priority: "hot",
    lastContactAt: "2026-08-09T18:40:00+05:30",
    nextFollowUpAt: "2026-08-11T17:30:00+05:30",
    createdAt: "2026-08-01T11:00:00+05:30",
    notes: "UPI payment link sent. Waiting for confirmation.",
    objection: "Needs family approval",
    courseInterest: "Kolhapur Trading Bootcamp",
    closerId: "user-ajay",
    probability: 75,
    paymentStatus: "pending",
  },
  {
    name: "Pooja Kamble",
    phone: "9890123458",
    city: "Pune",
    campaignId: "camp-mentorship",
    source: "website",
    ownerId: "user-sneha",
    status: "hot",
    priority: "hot",
    lastContactAt: "2026-08-10T20:10:00+05:30",
    nextFollowUpAt: "2026-08-12T16:00:00+05:30",
    createdAt: "2026-08-04T15:45:00+05:30",
    notes: "Very engaged on discovery call. High intent.",
    objection: "Wants written curriculum",
    courseInterest: "30-Day Mentorship",
    closerId: "user-sneha",
    probability: 78,
    paymentStatus: "not_started",
  },
  {
    name: "Nitin Raut",
    phone: "9701234568",
    city: "Aurangabad",
    campaignId: "camp-free-class",
    source: "whatsapp",
    ownerId: "user-rohit",
    status: "connected",
    priority: "warm",
    lastContactAt: "2026-08-08T14:00:00+05:30",
    nextFollowUpAt: "2026-08-13T12:00:00+05:30",
    createdAt: "2026-08-07T10:20:00+05:30",
    notes: "Attended free class online. Need conversion call.",
    courseInterest: "Free Trading Class",
    probability: 50,
    paymentStatus: "not_started",
  },
  {
    name: "Ashwini Divekar",
    phone: "9712345679",
    city: "Pune",
    campaignId: "camp-pune",
    source: "referral",
    ownerId: "user-komal",
    status: "enrolled",
    priority: "hot",
    lastContactAt: "2026-08-06T11:30:00+05:30",
    nextFollowUpAt: null,
    createdAt: "2026-07-25T13:00:00+05:30",
    notes: "Referred by Rohan Bhosale. Enrolled same week.",
    courseInterest: "Pune Trading Bootcamp",
    closerId: "user-sneha",
    probability: 100,
    paymentStatus: "completed",
  },
  {
    name: "Mahesh Pawar",
    phone: "9723456780",
    city: "Kolhapur",
    campaignId: "camp-kolhapur",
    source: "meta_ads",
    ownerId: "user-rohit",
    status: "lost",
    priority: "cold",
    lastContactAt: "2026-08-05T16:45:00+05:30",
    nextFollowUpAt: null,
    createdAt: "2026-07-30T09:40:00+05:30",
    notes: "Joined another institute. Marked lost.",
    objection: "Chose competitor",
    courseInterest: "Kolhapur Trading Bootcamp",
    probability: 0,
    paymentStatus: "not_started",
  },
  {
    name: "Shweta Lokhande",
    phone: "9734567891",
    city: "Pune",
    campaignId: "camp-pune",
    source: "instagram",
    ownerId: "user-komal",
    status: "call_back" as never,
    priority: "warm",
    lastContactAt: "2026-08-11T08:30:00+05:30",
    nextFollowUpAt: "2026-08-11T13:00:00+05:30",
    createdAt: "2026-08-10T21:00:00+05:30",
    notes: "Asked for callback after lunch.",
    courseInterest: "Pune Trading Bootcamp",
    probability: 40,
    paymentStatus: "not_started",
  },
];

// Fix Shweta status - use follow_up instead of invalid call_back
leadSeed[leadSeed.length - 1].status = "follow_up";

const extraNames = [
  ["Siddharth", "Kale", "Pune", "camp-pune", "meta_ads", "user-komal", "new_lead", "warm"],
  ["Rutuja", "Phadke", "Pune", "camp-free-class", "website", "user-komal", "attempted", "cold"],
  ["Omkar", "Bhandari", "Kolhapur", "camp-kolhapur", "instagram", "user-rohit", "connected", "warm"],
  ["Tanvi", "Sawant", "Mumbai", "camp-mentorship", "whatsapp", "user-sneha", "interested", "hot"],
  ["Pratik", "Ghorpade", "Sangli", "camp-kolhapur", "referral", "user-ajay", "follow_up", "warm"],
  ["Isha", "Mhatre", "Thane", "camp-mentorship", "meta_ads", "user-sneha", "hot", "hot"],
  ["Harsh", "Zope", "Nashik", "camp-free-class", "instagram", "user-rohit", "nurturing", "warm"],
  ["Komal", "Barve", "Pune", "camp-pune", "website", "user-komal", "payment_pending", "hot"],
  ["Aditya", "Shahane", "Pune", "camp-pune", "meta_ads", "user-rohit", "enrolled", "hot"],
  ["Shruti", "Wagh", "Kolhapur", "camp-kolhapur", "whatsapp", "user-ajay", "new_lead", "warm"],
  ["Varun", "Dhumal", "Satara", "camp-free-class", "referral", "user-komal", "attempted", "cold"],
  ["Nikita", "Bhosale", "Pune", "camp-mentorship", "instagram", "user-sneha", "interested", "hot"],
  ["Gaurav", "Kale", "Aurangabad", "camp-free-class", "meta_ads", "user-rohit", "connected", "warm"],
  ["Ankita", "More", "Pune", "camp-pune", "website", "user-komal", "follow_up", "warm"],
  ["Saurabh", "Patil", "Kolhapur", "camp-kolhapur", "meta_ads", "user-ajay", "hot", "hot"],
  ["Divya", "Jagtap", "Mumbai", "camp-mentorship", "whatsapp", "user-sneha", "nurturing", "hot"],
  ["Akash", "Nikam", "Pune", "camp-pune", "instagram", "user-komal", "new_lead", "warm"],
  ["Prajakta", "Shinde", "Pune", "camp-free-class", "website", "user-rohit", "attempted", "cold"],
  ["Tejas", "Joshi", "Kolhapur", "camp-kolhapur", "referral", "user-ajay", "payment_pending", "hot"],
  ["Rucha", "Deshpande", "Pune", "camp-pune", "meta_ads", "user-komal", "interested", "warm"],
  ["Mandar", "Kulkarni", "Nashik", "camp-free-class", "instagram", "user-rohit", "connected", "warm"],
  ["Sonal", "Gokhale", "Mumbai", "camp-mentorship", "website", "user-sneha", "enrolled", "hot"],
  ["Vivek", "Pawar", "Sangli", "camp-kolhapur", "whatsapp", "user-ajay", "lost", "cold"],
  ["Aishwarya", "Naik", "Pune", "camp-pune", "meta_ads", "user-komal", "follow_up", "warm"],
  ["Rohit", "Chavan", "Pune", "camp-free-class", "instagram", "user-rohit", "new_lead", "warm"],
  ["Mansi", "Kadam", "Thane", "camp-mentorship", "referral", "user-sneha", "hot", "hot"],
  ["Suraj", "Mane", "Kolhapur", "camp-kolhapur", "meta_ads", "user-ajay", "attempted", "cold"],
  ["Ketaki", "Rane", "Pune", "camp-pune", "website", "user-komal", "nurturing", "hot"],
  ["Abhishek", "Thakur", "Aurangabad", "camp-free-class", "whatsapp", "user-rohit", "interested", "warm"],
  ["Pallavi", "Jadhav", "Satara", "camp-kolhapur", "instagram", "user-ajay", "connected", "warm"],
] as const;

function phoneFromIndex(i: number) {
  const base = 9100000000 + i * 137 + 24680;
  return String(base).slice(0, 10);
}

export const leads: Lead[] = [
  ...leadSeed.map((lead, index) => ({
    ...lead,
    id: `lead-${String(index + 1).padStart(3, "0")}`,
    updatedAt: lead.lastContactAt ?? lead.createdAt,
  })),
  ...extraNames.map((row, index) => {
    const [first, last, city, campaignId, source, ownerId, status, priority] = row;
    const dayOffset = index % 10;
    const createdAt = `2026-08-${String(11 - dayOffset).padStart(2, "0")}T${String(8 + (index % 10)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}:00+05:30`;
    const hasContact = status !== "new_lead";
    const lastContactAt = hasContact
      ? `2026-08-${String(Math.max(1, 11 - (dayOffset % 5))).padStart(2, "0")}T${String(10 + (index % 8)).padStart(2, "0")}:15:00+05:30`
      : null;
    const needsFollowUp = ![
      "enrolled",
      "lost",
      "not_interested",
      "wrong_number",
    ].includes(status);
    const followDay = 10 + (index % 4);
    return {
      id: `lead-${String(leadSeed.length + index + 1).padStart(3, "0")}`,
      name: `${first} ${last}`,
      phone: phoneFromIndex(index + 20),
      email: `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`,
      city,
      campaignId,
      source,
      ownerId,
      status,
      priority,
      lastContactAt,
      nextFollowUpAt: needsFollowUp
        ? `2026-08-${String(followDay).padStart(2, "0")}T${String(10 + (index % 7)).padStart(2, "0")}:00:00+05:30`
        : null,
      createdAt,
      updatedAt: lastContactAt ?? createdAt,
      notes: `${first} inquired about ${campaigns.find((c) => c.id === campaignId)?.name ?? "course"}.`,
      objection:
        status === "hot" || status === "nurturing" || status === "payment_pending"
          ? ["Price", "Timing", "Family approval", "Comparing options"][index % 4]
          : undefined,
      courseInterest: campaigns.find((c) => c.id === campaignId)?.name,
      closerId:
        status === "interested" ||
        status === "hot" ||
        status === "nurturing" ||
        status === "payment_pending" ||
        status === "enrolled"
          ? index % 2 === 0
            ? "user-sneha"
            : "user-ajay"
          : undefined,
      probability:
        status === "enrolled"
          ? 100
          : status === "lost"
            ? 0
            : status === "payment_pending"
              ? 85
              : status === "hot"
                ? 70
                : status === "nurturing"
                  ? 55
                  : status === "interested"
                    ? 50
                    : 30,
      paymentStatus:
        status === "enrolled"
          ? "completed"
          : status === "payment_pending"
            ? index % 2 === 0
              ? "pending"
              : "partial"
            : "not_started",
    } satisfies Lead;
  }),
];

export const calls: Call[] = [
  {
    id: "call-001",
    leadId: "lead-002",
    userId: "user-komal",
    outcome: "no_answer",
    durationSeconds: 18,
    notes: "Ringing, no pickup. Will retry afternoon.",
    createdAt: "2026-08-11T09:20:00+05:30",
  },
  {
    id: "call-002",
    leadId: "lead-003",
    userId: "user-komal",
    outcome: "connected",
    durationSeconds: 246,
    notes: "Discussed weekend batch and fee structure.",
    createdAt: "2026-08-11T09:45:00+05:30",
  },
  {
    id: "call-003",
    leadId: "lead-004",
    userId: "user-sneha",
    outcome: "interested",
    durationSeconds: 512,
    notes: "Strong interest in mentorship. Sent brochure on WhatsApp.",
    createdAt: "2026-08-10T17:15:00+05:30",
  },
  {
    id: "call-004",
    leadId: "lead-005",
    userId: "user-ajay",
    outcome: "interested",
    durationSeconds: 388,
    notes: "Salary credit expected tomorrow. Payment follow-up set.",
    createdAt: "2026-08-10T19:00:00+05:30",
  },
  {
    id: "call-005",
    leadId: "lead-006",
    userId: "user-sneha",
    outcome: "connected",
    durationSeconds: 190,
    notes: "Confirmed partial payment. Waiting for balance.",
    createdAt: "2026-08-11T08:50:00+05:30",
  },
  {
    id: "call-006",
    leadId: "lead-007",
    userId: "user-rohit",
    outcome: "call_back",
    durationSeconds: 42,
    notes: "Travelling. Asked to call next day.",
    createdAt: "2026-08-09T15:30:00+05:30",
  },
  {
    id: "call-007",
    leadId: "lead-010",
    userId: "user-komal",
    outcome: "interested",
    durationSeconds: 301,
    notes: "Job timings constraint — prefers evening batch.",
    createdAt: "2026-08-11T07:55:00+05:30",
  },
  {
    id: "call-008",
    leadId: "lead-011",
    userId: "user-rohit",
    outcome: "busy",
    durationSeconds: 12,
    notes: "Line busy. Scheduled 3 PM retry.",
    createdAt: "2026-08-10T12:10:00+05:30",
  },
  {
    id: "call-009",
    leadId: "lead-014",
    userId: "user-sneha",
    outcome: "interested",
    durationSeconds: 640,
    notes: "Discovery call completed. High intent.",
    createdAt: "2026-08-10T20:10:00+05:30",
  },
  {
    id: "call-010",
    leadId: "lead-018",
    userId: "user-komal",
    outcome: "call_back",
    durationSeconds: 55,
    notes: "Callback after lunch requested.",
    createdAt: "2026-08-11T08:30:00+05:30",
  },
];

export const followUps: FollowUp[] = leads
  .filter((lead) => lead.nextFollowUpAt)
  .map((lead, index) => {
    const scheduledAt = lead.nextFollowUpAt!;
    const isOverdue = scheduledAt < "2026-08-11T00:00:00+05:30";
    return {
      id: `fu-${String(index + 1).padStart(3, "0")}`,
      leadId: lead.id,
      userId: lead.closerId ?? lead.ownerId,
      scheduledAt,
      status: isOverdue ? "missed" : "pending",
      notes: lead.notes ?? "Follow-up as discussed.",
      createdAt: lead.createdAt,
    } satisfies FollowUp;
  });

export const activities: Activity[] = [
  {
    id: "act-001",
    leadId: "lead-001",
    userId: "user-manager",
    type: "assignment",
    title: "Lead assigned",
    description: "Assigned to Komal Deshmukh from Meta Ads intake.",
    createdAt: "2026-08-11T08:16:00+05:30",
  },
  {
    id: "act-002",
    leadId: "lead-002",
    userId: "user-komal",
    type: "call",
    title: "Call attempt — No Answer",
    description: "Ringing, no pickup. Will retry afternoon.",
    createdAt: "2026-08-11T09:20:00+05:30",
  },
  {
    id: "act-003",
    leadId: "lead-003",
    userId: "user-komal",
    type: "call",
    title: "Connected call",
    description: "Discussed weekend batch and fee structure.",
    createdAt: "2026-08-11T09:45:00+05:30",
  },
  {
    id: "act-004",
    leadId: "lead-003",
    userId: "user-komal",
    type: "status_change",
    title: "Status updated to Connected",
    description: "Moved from Attempted to Connected.",
    createdAt: "2026-08-11T09:46:00+05:30",
  },
  {
    id: "act-005",
    leadId: "lead-004",
    userId: "user-sneha",
    type: "whatsapp",
    title: "Brochure shared on WhatsApp",
    description: "Sent 30-Day Mentorship overview and EMI options.",
    createdAt: "2026-08-10T17:20:00+05:30",
  },
  {
    id: "act-006",
    leadId: "lead-005",
    userId: "user-ajay",
    type: "follow_up",
    title: "Follow-up scheduled",
    description: "Payment discussion after salary credit.",
    createdAt: "2026-08-10T19:05:00+05:30",
  },
  {
    id: "act-007",
    leadId: "lead-006",
    userId: "user-sneha",
    type: "payment",
    title: "Partial payment received",
    description: "₹5,000 received via UPI. Balance pending.",
    createdAt: "2026-08-10T12:30:00+05:30",
  },
  {
    id: "act-008",
    leadId: "lead-006",
    userId: "user-sneha",
    type: "status_change",
    title: "Moved to Payment Pending",
    description: "Awaiting remaining course fee.",
    createdAt: "2026-08-10T12:31:00+05:30",
  },
  {
    id: "act-009",
    leadId: "lead-009",
    userId: "user-ajay",
    type: "payment",
    title: "Full payment received",
    description: "Enrollment confirmed for Kolhapur Trading Bootcamp.",
    createdAt: "2026-08-08T16:05:00+05:30",
  },
  {
    id: "act-010",
    leadId: "lead-010",
    userId: "user-komal",
    type: "note",
    title: "Note added",
    description: "Prefers evening batch due to full-time job.",
    createdAt: "2026-08-11T07:56:00+05:30",
  },
  {
    id: "act-011",
    leadId: "lead-014",
    userId: "user-sneha",
    type: "status_change",
    title: "Marked as Hot Lead",
    description: "High intent after discovery call.",
    createdAt: "2026-08-10T20:15:00+05:30",
  },
  {
    id: "act-012",
    leadId: "lead-007",
    userId: "user-rohit",
    type: "follow_up",
    title: "Follow-up overdue",
    description: "Scheduled follow-up missed while lead was travelling.",
    createdAt: "2026-08-10T11:05:00+05:30",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "notif-001",
    title: "3 follow-ups overdue",
    description: "Sagar Kadam and 2 others need immediate attention.",
    createdAt: "2026-08-11T09:00:00+05:30",
    read: false,
    href: "/follow-ups",
  },
  {
    id: "notif-002",
    title: "New Meta lead assigned",
    description: "Rahul Patil — Pune Trading Bootcamp.",
    createdAt: "2026-08-11T08:16:00+05:30",
    read: false,
    href: "/leads/lead-001",
  },
  {
    id: "notif-003",
    title: "Payment pending reminder",
    description: "Anjali Gaikwad balance due today evening.",
    createdAt: "2026-08-11T08:00:00+05:30",
    read: true,
    href: "/leads/lead-006",
  },
  {
    id: "notif-004",
    title: "Enrollment confirmed",
    description: "Rohan Bhosale enrolled in Kolhapur Bootcamp.",
    createdAt: "2026-08-08T16:10:00+05:30",
    read: true,
    href: "/leads/lead-009",
  },
];

export const dailyActivity: DailyActivityPoint[] = [
  { date: "2026-08-05", calls: 68, connected: 29, interested: 11, enrollments: 2 },
  { date: "2026-08-06", calls: 74, connected: 31, interested: 13, enrollments: 3 },
  { date: "2026-08-07", calls: 81, connected: 34, interested: 14, enrollments: 2 },
  { date: "2026-08-08", calls: 79, connected: 36, interested: 15, enrollments: 4 },
  { date: "2026-08-09", calls: 62, connected: 25, interested: 9, enrollments: 1 },
  { date: "2026-08-10", calls: 88, connected: 39, interested: 17, enrollments: 3 },
  { date: "2026-08-11", calls: 54, connected: 22, interested: 10, enrollments: 2 },
];

export const teamPerformance: TeamPerformance[] = [
  {
    userId: "user-komal",
    calls: 146,
    connected: 61,
    interested: 28,
    followUps: 34,
    enrollments: 7,
  },
  {
    userId: "user-rohit",
    calls: 132,
    connected: 52,
    interested: 22,
    followUps: 29,
    enrollments: 5,
  },
  {
    userId: "user-sneha",
    calls: 98,
    connected: 54,
    interested: 31,
    followUps: 41,
    enrollments: 12,
  },
  {
    userId: "user-ajay",
    calls: 87,
    connected: 48,
    interested: 27,
    followUps: 36,
    enrollments: 10,
  },
];

export function getUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function getCampaignById(id: string) {
  return campaigns.find((campaign) => campaign.id === id);
}

export function getLeadById(id: string) {
  return leads.find((lead) => lead.id === id);
}

export function getCallsForLead(leadId: string) {
  return calls
    .filter((call) => call.leadId === leadId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getActivitiesForLead(leadId: string) {
  return activities
    .filter((activity) => activity.leadId === leadId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getFollowUpsForLead(leadId: string) {
  return followUps
    .filter((item) => item.leadId === leadId)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
}
