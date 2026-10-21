/*
  SAVEMORE GAMES: Quiz Challenge question bank (Stage 2 draft, for review)

  Each question:
    id       unique text id
    cat      category id (must match a category below)
    level    "easy" | "medium" | "hard"   (drives the difficulty choice and the points: 10 / 15 / 20)
    q        the question
    options  exactly 4 answer choices
    answer   position of the correct option in "options" (0 to 3)
    explain  short explanation shown after the player answers

  The quiz shuffles the questions and the options every round,
  so the order written here does not matter.
*/
window.SM_QUIZ = {
  categories: [
    {
      id: "savings",
      name: "Savings & Budgeting",
      blurb: "Budgeting, the 50-30-20 rule, tracking expenses and saving first."
    },
    {
      id: "business",
      name: "Business & Economics",
      blurb: "Profit, inflation, supply and demand, and running a small business."
    },
    {
      id: "islamic",
      name: "Islamic Finance Basics",
      blurb: "Riba, zakat, halal earning and the principles of Islamic partnerships."
    },
    {
      id: "general",
      name: "General Knowledge",
      blurb: "Nigeria, Africa, science and the world around us."
    },
    {
      id: "entrepreneurship",
      name: "Entrepreneurship",
      blurb: "Starting, pricing and growing a small business."
    }
  ],

  questions: [
    /* ---------- Savings & Budgeting (based on the SAVEMORE Financial Education Series) ---------- */
    {
      id: "sav-01", cat: "savings", level: "easy",
      q: "In the 50-30-20 rule, what share of your take-home income goes to savings and financial goals?",
      options: ["10%", "20%", "30%", "50%"],
      answer: 1,
      explain: "The rule suggests 50% for needs, 30% for wants and 20% for savings and financial goals, such as emergency savings, business capital, debt repayment or charity."
    },
    {
      id: "sav-02", cat: "savings", level: "easy",
      q: "Which of these is a need rather than a want?",
      options: ["A new video game", "Rent for your home", "Eating out every day", "Luxury items"],
      answer: 1,
      explain: "Needs are expenses you cannot reasonably avoid, such as housing, food, transport, utilities, school fees and basic healthcare. Wants make life more enjoyable but are not essential."
    },
    {
      id: "sav-03", cat: "savings", level: "easy",
      q: "What does \u201Cpay yourself first\u201D mean?",
      options: [
        "Spend on yourself before paying bills",
        "Set aside your savings as soon as you receive income",
        "Borrow money so you can save more",
        "Save only what is left at the end of the month"
      ],
      answer: 1,
      explain: "Save first, then spend what remains, rather than spending first and saving what is left. Saving only what is left often means saving nothing."
    },
    {
      id: "sav-04", cat: "savings", level: "easy",
      q: "\u201CYou cannot control what you do not ___.\u201D Which word completes the SAVEMORE tip?",
      options: ["Track", "Borrow", "Hide", "Forget"],
      answer: 0,
      explain: "Writing down every expense, even small ones, shows you where your money really goes so you can decide where it should go."
    },
    {
      id: "sav-05", cat: "savings", level: "medium",
      q: "If you spend \u20A61,000 unnecessarily every day, about how much is that in a 30-day month?",
      options: ["\u20A63,000", "\u20A610,000", "\u20A630,000", "\u20A6100,000"],
      answer: 2,
      explain: "\u20A61,000 \u00D7 30 days = \u20A630,000 a month. Small, repeated expenses can become significant costs."
    },
    {
      id: "sav-06", cat: "savings", level: "medium",
      q: "Your monthly income is \u20A6200,000. Under the 50-30-20 rule, how much goes to savings and financial goals?",
      options: ["\u20A620,000", "\u20A640,000", "\u20A660,000", "\u20A6100,000"],
      answer: 1,
      explain: "20% of \u20A6200,000 is \u20A640,000. The rest is \u20A6100,000 for needs and \u20A660,000 for wants."
    },
    {
      id: "sav-07", cat: "savings", level: "easy",
      q: "An emergency fund is best used for…",
      options: [
        "Holiday trips",
        "Unexpected, urgent costs such as an illness or an essential repair",
        "Buying the latest phone",
        "Gifts for friends"
      ],
      answer: 1,
      explain: "Money set aside before an emergency means you may not have to borrow or sell something valuable when trouble comes."
    },
    {
      id: "sav-08", cat: "savings", level: "medium",
      q: "Which habit helps you avoid impulse buying?",
      options: [
        "Shopping without a plan",
        "Giving yourself a waiting period before buying non-essentials",
        "Buying things only because they look attractive",
        "Spending because friends or social media make you feel you should"
      ],
      answer: 1,
      explain: "A waiting period, a shopping list and price comparison all help you buy what you planned, not what you felt like in the moment."
    },
    {
      id: "sav-09", cat: "savings", level: "hard",
      q: "Your income is \u20A680,000 and your needs cost \u20A644,000. What share of your income goes on needs?",
      options: ["45%", "50%", "55%", "60%"],
      answer: 2,
      explain: "44,000 \u00F7 80,000 = 0.55, or 55%. That is above the 50% guide, which is not a reason to feel guilty. Look for ways to reduce unnecessary costs or increase income."
    },
    {
      id: "sav-10", cat: "savings", level: "easy",
      q: "What is a budget?",
      options: [
        "A record of money you spent last year",
        "A simple plan for how you will spend and save your money, usually over a month",
        "A loan from a bank",
        "A type of savings account"
      ],
      answer: 1,
      explain: "A budget is like a roadmap. It tells your money where to go instead of leaving you to wonder where it went."
    },
    {
      id: "sav-11", cat: "savings", level: "medium",
      q: "Mobile banking, digital wallets and instant transfers are examples of…",
      options: ["Financial innovation (fintech)", "Inflation", "Taxation", "Bankruptcy"],
      answer: 0,
      explain: "Financial innovation means new products, services or technologies that make financial activities faster, cheaper or more accessible. It also brings new risks, so protect your PIN and password."
    },
    {
      id: "sav-12", cat: "savings", level: "medium",
      q: "Someone saves \u20A62,000 every week. About how much will they have saved after 52 weeks (contributions only)?",
      options: ["\u20A652,000", "\u20A6104,000", "\u20A6208,000", "\u20A620,000"],
      answer: 1,
      explain: "\u20A62,000 \u00D7 52 = \u20A6104,000. Small, regular contributions can build into a meaningful amount over time."
    },
    {
      id: "sav-13", cat: "savings", level: "medium",
      q: "The 50-30-20 rule is best described as…",
      options: [
        "A law everyone must follow exactly",
        "A guideline you can adjust to your income and situation",
        "A rule only for high earners",
        "A way to avoid saving"
      ],
      answer: 1,
      explain: "Income, family responsibilities, location, debts and goals can all change the right split. The real goal is intentional money management."
    },
    {
      id: "sav-14", cat: "savings", level: "medium",
      q: "Your income is low and needs take about 70% of it. What does the SAVEMORE series suggest?",
      options: [
        "Give up saving completely",
        "Start with a small saving habit, even 5% or 2%, and work to reduce costs or raise income",
        "Borrow so you can reach 20% savings",
        "Stop budgeting"
      ],
      answer: 1,
      explain: "Start where you are and save something consistently. The habit matters more than the size of the first amount."
    },
    {
      id: "sav-15", cat: "savings", level: "medium",
      q: "Before cutting your spending, what should you do first?",
      options: [
        "Track your expenses to find where money is leaking",
        "Stop spending on everything",
        "Take a loan",
        "Ignore small expenses"
      ],
      answer: 0,
      explain: "Track before you cut. Reviewing your expenses shows which ones are unnecessary."
    },
    {
      id: "sav-16", cat: "savings", level: "medium",
      q: "How can digital payments change the way people spend?",
      options: [
        "They always make people save more",
        "They make it easier to spend without feeling the money leave your hand",
        "They remove all risk of fraud",
        "They stop prices from rising"
      ],
      answer: 1,
      explain: "With cash you feel yourself spending. With digital money it is easy to make several small purchases without noticing, so discipline matters more."
    },
    {
      id: "sav-17", cat: "savings", level: "easy",
      q: "Which is a common saving mistake?",
      options: [
        "Saving only when money is left over",
        "Setting a savings goal",
        "Tracking your progress",
        "Starting with an affordable amount"
      ],
      answer: 0,
      explain: "Saving only what is left makes saving depend on chance. Plan your savings before spending the rest."
    },
    {
      id: "sav-18", cat: "savings", level: "hard",
      q: "What danger comes with easy digital borrowing?",
      options: [
        "A cycle of borrowing to spend, repaying, and borrowing again",
        "It always lowers your debts",
        "It makes saving unnecessary",
        "It guarantees a higher income"
      ],
      answer: 0,
      explain: "Borrowing can help with a genuine temporary cash-flow problem. The danger is using it to fund consumption instead of the pattern earn, save, then buy."
    },

    /* ---------- Business & Economics ---------- */
    {
      id: "bus-01", cat: "business", level: "easy",
      q: "Revenue minus costs equals…",
      options: ["Profit (or loss)", "Capital", "Inflation", "Tax"],
      answer: 0,
      explain: "If revenue is higher than costs, you make a profit. If it is lower, you make a loss."
    },
    {
      id: "bus-02", cat: "business", level: "easy",
      q: "What is inflation?",
      options: [
        "A fall in prices",
        "A general rise in prices over time",
        "An increase in savings",
        "A type of business loan"
      ],
      answer: 1,
      explain: "When prices rise generally, each naira buys less than before."
    },
    {
      id: "bus-03", cat: "business", level: "easy",
      q: "An entrepreneur is someone who…",
      options: [
        "Works only for the government",
        "Starts and runs a business and takes on risk",
        "Only lends money to others",
        "Only buys shares"
      ],
      answer: 1,
      explain: "Entrepreneurs spot an opportunity, put in time and money, and accept that the business may not succeed."
    },
    {
      id: "bus-04", cat: "business", level: "easy",
      q: "In business, what does \u201Ccapital\u201D mean?",
      options: [
        "Only the capital city of a country",
        "Money and assets used to start and run the business",
        "Only last year\u2019s profit",
        "Only the debts of the business"
      ],
      answer: 1,
      explain: "Capital is what the business uses to operate, such as cash, stock and equipment."
    },
    {
      id: "bus-05", cat: "business", level: "medium",
      q: "If demand for an item rises while supply stays the same, its price will usually…",
      options: ["Fall", "Rise", "Stay fixed forever", "Drop to zero"],
      answer: 1,
      explain: "When more people want something and there is no extra supply, sellers can charge more. This is the law of supply and demand."
    },
    {
      id: "bus-06", cat: "business", level: "medium",
      q: "Which is a fixed cost for a shop?",
      options: [
        "Monthly shop rent",
        "Cost of goods bought for resale",
        "Packaging used for each item sold",
        "Sales commission"
      ],
      answer: 0,
      explain: "Fixed costs stay the same however much you sell. Costs that rise with sales, such as stock and packaging, are variable costs."
    },
    {
      id: "bus-07", cat: "business", level: "medium",
      q: "Why should a business keep its money separate from personal money?",
      options: [
        "To see the true profit and keep clear records",
        "To avoid keeping any records",
        "To pay less rent",
        "So customers cannot see the prices"
      ],
      answer: 0,
      explain: "Mixing the two makes it hard to know whether the business is really making money."
    },
    {
      id: "bus-08", cat: "business", level: "hard",
      q: "A shop buys an item for \u20A6800 and sells it for \u20A61,000. What is the profit margin on that sale?",
      options: ["20%", "25%", "80%", "200%"],
      answer: 0,
      explain: "Profit is \u20A6200. Margin is profit as a share of the selling price: 200 \u00F7 1,000 = 20%. (Markup, which is profit as a share of cost, would be 25%.)"
    },
    {
      id: "bus-09", cat: "business", level: "medium",
      q: "GDP measures…",
      options: [
        "The number of people in a country",
        "The total value of goods and services a country produces",
        "The amount of government debt",
        "The price of fuel"
      ],
      answer: 1,
      explain: "Gross Domestic Product is a common way to measure the size of a country\u2019s economy."
    },
    {
      id: "bus-10", cat: "business", level: "medium",
      q: "Which of these is a business asset?",
      options: [
        "A loan the business still owes",
        "A delivery motorbike owned by the business",
        "Unpaid staff wages",
        "A bill waiting to be paid"
      ],
      answer: 1,
      explain: "An asset is something the business owns that has value. Loans, unpaid wages and unpaid bills are liabilities, meaning money the business owes."
    },
    {
      id: "bus-11", cat: "business", level: "medium",
      q: "Why is depending on only one customer risky?",
      options: [
        "It is not risky",
        "If that customer leaves, most of your income disappears",
        "It means you pay more tax",
        "It lowers your costs"
      ],
      answer: 1,
      explain: "Having several customers or income sources spreads the risk. This is called diversification."
    },
    {
      id: "bus-12", cat: "business", level: "hard",
      q: "A business reaches its break-even point when…",
      options: [
        "It makes the highest profit it has ever made",
        "Its revenue equals its total costs",
        "It has no customers",
        "It has repaid all its loans"
      ],
      answer: 1,
      explain: "At break-even there is no profit and no loss. Every sale after that point starts to add profit."
    },
    /* ---------- Islamic Finance Basics (DRAFT: needs review by a knowledgeable scholar before publishing) ---------- */
    {
      id: "isl-01", cat: "islamic", level: "easy",
      q: "In Islamic finance, riba generally refers to…",
      options: [
        "Interest, or a guaranteed extra amount charged on a loan",
        "A voluntary gift to the poor",
        "A business partnership",
        "A tax paid to the government"
      ],
      answer: 0,
      explain: "Riba (often translated as usury or interest) is prohibited in Islam. A loan that brings the lender a guaranteed increase is the classic example."
    },
    {
      id: "isl-02", cat: "islamic", level: "medium",
      q: "Gharar in a contract means…",
      options: [
        "Excessive uncertainty or ambiguity about what is being sold or paid",
        "A gift given in secret",
        "A debt that has been fully paid",
        "Profit shared between partners"
      ],
      answer: 0,
      explain: "Contracts should be clear to both sides. Excessive gharar, such as selling something that does not exist or whose price or quality is unknown, makes a deal unacceptable."
    },
    {
      id: "isl-03", cat: "islamic", level: "easy",
      q: "Maysir refers to…",
      options: [
        "Gambling, or gaining money purely by chance",
        "Honest trade",
        "Giving charity",
        "Saving for the future"
      ],
      answer: 0,
      explain: "Maysir is gambling. Islam encourages earning through honest work, trade and fair exchange, not through games of chance."
    },
    {
      id: "isl-04", cat: "islamic", level: "medium",
      q: "What rate of zakat generally applies to cash savings held for a full lunar year above the nisab?",
      options: ["1%", "2.5%", "5%", "10%"],
      answer: 1,
      explain: "The standard rate on cash and savings that reach the nisab and are held for a year is 2.5%. For your own situation, ask a trusted scholar."
    },
    {
      id: "isl-05", cat: "islamic", level: "medium",
      q: "What is the nisab?",
      options: [
        "The minimum amount of wealth above which zakat becomes due",
        "A type of Islamic contract",
        "The penalty for late payment",
        "The month in which zakat must be paid"
      ],
      answer: 0,
      explain: "Zakat is due only on wealth that reaches the nisab and has been held for a full lunar year. Scholars set the nisab using the value of gold or silver."
    },
    {
      id: "isl-06", cat: "islamic", level: "easy",
      q: "Which of these is generally a halal source of income?",
      options: [
        "Honest wages from lawful work",
        "Interest on a loan",
        "Gambling winnings",
        "Selling goods you know are fake"
      ],
      answer: 0,
      explain: "Islam encourages earning through lawful, honest work and trade. Income from interest, gambling or deception is not acceptable."
    },
    {
      id: "isl-07", cat: "islamic", level: "hard",
      q: "In a mudarabah partnership, who normally bears a financial loss if the manager was not negligent?",
      options: [
        "The partner who provided the capital",
        "The manager",
        "Both equally",
        "The government"
      ],
      answer: 0,
      explain: "In mudarabah one partner provides capital and the other provides work. Profit is shared by an agreed ratio, the capital provider bears the financial loss, and the manager loses the effort he put in."
    },
    {
      id: "isl-08", cat: "islamic", level: "hard",
      q: "In a musharakah partnership, how are losses normally shared?",
      options: [
        "In proportion to each partner\u2019s capital contribution",
        "Equally, whatever each partner invested",
        "Only the active partner bears them",
        "They are ignored"
      ],
      answer: 0,
      explain: "In musharakah all partners contribute capital. Profit is shared as agreed in advance, but losses follow each partner\u2019s share of the capital."
    },
    {
      id: "isl-09", cat: "islamic", level: "medium",
      q: "A murabaha sale is one where…",
      options: [
        "The seller discloses the cost and adds an agreed profit",
        "The price is kept secret",
        "The buyer pays interest on the price",
        "The goods are chosen by chance"
      ],
      answer: 0,
      explain: "Murabaha is cost-plus selling. Both sides know the seller\u2019s cost and the agreed profit, which keeps the deal transparent."
    },
    {
      id: "isl-10", cat: "islamic", level: "medium",
      q: "Qard hasan is…",
      options: [
        "A kind loan repaid without any extra charge",
        "A loan with a fixed interest rate",
        "A type of lottery",
        "A tax on savings"
      ],
      answer: 0,
      explain: "Qard hasan means a good loan. The borrower repays only what was borrowed, and the lender seeks reward from Allah, not profit."
    },
    {
      id: "isl-11", cat: "islamic", level: "easy",
      q: "What is voluntary charity given for the sake of Allah called?",
      options: ["Sadaqah", "Riba", "Gharar", "Maysir"],
      answer: 0,
      explain: "Sadaqah is voluntary charity. Unlike zakat, it has no fixed amount and can be given at any time."
    },
    {
      id: "isl-12", cat: "islamic", level: "easy",
      q: "Which behaviour is encouraged in Islamic business ethics?",
      options: [
        "Being honest about the goods and the price",
        "Hiding defects in the goods",
        "Giving short measure",
        "Making false claims to win customers"
      ],
      answer: 0,
      explain: "Honesty and fair dealing are central. A trader who is open about the quality and price builds trust and earns blessing in trade."
    },
    {
      id: "isl-13", cat: "islamic", level: "medium",
      q: "Islamic teaching discourages israf. What does israf mean?",
      options: [
        "Wastefulness and extravagance",
        "Saving money",
        "Paying zakat",
        "Giving to the poor"
      ],
      answer: 0,
      explain: "Believers are encouraged to be moderate in spending: neither wasteful nor stingy. This fits well with budgeting and avoiding unnecessary spending."
    },
    {
      id: "isl-14", cat: "islamic", level: "medium",
      q: "Why is a clear written contract important in Islamic finance?",
      options: [
        "It reduces uncertainty and disputes between the parties",
        "It lets one side hide the terms",
        "It allows hidden charges",
        "It is only needed for large companies"
      ],
      answer: 0,
      explain: "Clear terms reduce gharar and protect everyone involved. This is why Islamic finance puts so much weight on transparency."
    },
    {
      id: "isl-15", cat: "islamic", level: "medium",
      q: "The longest verse of the Quran (Al-Baqarah 2:282) encourages believers to do what with debts?",
      options: [
        "Write them down",
        "Keep them secret",
        "Forget them",
        "Pay them only if asked"
      ],
      answer: 0,
      explain: "The verse teaches believers to record debts with the amount and the due date. Clear records protect both the lender and the borrower."
    },
    {
      id: "isl-16", cat: "islamic", level: "easy",
      q: "In Islamic finance, what does \u201Charam\u201D mean?",
      options: ["Prohibited", "Permitted", "Recommended", "Optional"],
      answer: 0,
      explain: "Haram means prohibited. Its opposite is halal, which means permitted. Islamic finance aims to keep money dealings halal."
    },

    /* ---------- General Knowledge ---------- */
    {
      id: "gen-01", cat: "general", level: "easy",
      q: "What is the capital city of Nigeria?",
      options: ["Lagos", "Abuja", "Kano", "Ibadan"],
      answer: 1,
      explain: "Abuja became Nigeria\u2019s capital in 1991, replacing Lagos."
    },
    {
      id: "gen-02", cat: "general", level: "easy",
      q: "In which year did Nigeria gain independence?",
      options: ["1957", "1960", "1963", "1966"],
      answer: 1,
      explain: "Nigeria became independent from Britain on 1 October 1960."
    },
    {
      id: "gen-03", cat: "general", level: "easy",
      q: "Which colours are on the Nigerian flag?",
      options: ["Green and white", "Green and yellow", "Red and white", "Blue and green"],
      answer: 0,
      explain: "The flag has two green stripes with a white stripe in the middle."
    },
    {
      id: "gen-04", cat: "general", level: "easy",
      q: "Which is the longest river in Africa?",
      options: ["Niger", "Congo", "Nile", "Zambezi"],
      answer: 2,
      explain: "The Nile is about 6,650 km long, and it is generally considered the longest river in Africa."
    },
    {
      id: "gen-05", cat: "general", level: "easy",
      q: "Which is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      answer: 3,
      explain: "The Pacific Ocean covers more area than all the land on Earth put together."
    },
    {
      id: "gen-06", cat: "general", level: "medium",
      q: "How many states does Nigeria have (not counting the Federal Capital Territory)?",
      options: ["30", "34", "36", "40"],
      answer: 2,
      explain: "Nigeria has 36 states, plus the Federal Capital Territory, Abuja."
    },
    {
      id: "gen-07", cat: "general", level: "easy",
      q: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Mercury"],
      answer: 1,
      explain: "Mars looks red because its surface is rich in iron oxide, which is rust."
    },
    {
      id: "gen-08", cat: "general", level: "easy",
      q: "What is the chemical formula of water?",
      options: ["CO\u2082", "O\u2082", "H\u2082O", "NaCl"],
      answer: 2,
      explain: "A water molecule has two hydrogen atoms and one oxygen atom."
    },
    {
      id: "gen-09", cat: "general", level: "medium",
      q: "Which is the largest country in Africa by area?",
      options: ["Nigeria", "Algeria", "DR Congo", "Sudan"],
      answer: 1,
      explain: "Algeria is the largest African country by area. Nigeria is the most populous."
    },
    {
      id: "gen-10", cat: "general", level: "medium",
      q: "What is the capital of Osun State?",
      options: ["Ile-Ife", "Ilesa", "Osogbo", "Ede"],
      answer: 2,
      explain: "Osogbo is the capital of Osun State, known for the Osun-Osogbo Sacred Grove, a UNESCO World Heritage Site."
    },
    {
      id: "gen-11", cat: "general", level: "easy",
      q: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      answer: 2,
      explain: "The seven continents are Africa, Antarctica, Asia, Australia (Oceania), Europe, North America and South America."
    },
    {
      id: "gen-12", cat: "general", level: "hard",
      q: "At which Nigerian town do the Niger and Benue rivers meet?",
      options: ["Lokoja", "Makurdi", "Onitsha", "Jebba"],
      answer: 0,
      explain: "The two rivers meet at Lokoja in Kogi State, forming a famous confluence."
    },
    {
      id: "gen-13", cat: "general", level: "easy",
      q: "What is the hardest natural substance?",
      options: ["Iron", "Diamond", "Quartz", "Granite"],
      answer: 1,
      explain: "Diamond is the hardest known natural material."
    },
    {
      id: "gen-14", cat: "general", level: "medium",
      q: "How many minutes are there in 2\u00BD hours?",
      options: ["120", "150", "180", "210"],
      answer: 1,
      explain: "2 hours is 120 minutes, and half an hour is 30 minutes, so the total is 150 minutes."
    },
    {
      id: "gen-15", cat: "general", level: "easy",
      q: "Which is the largest hot desert in the world, found in Africa?",
      options: ["Kalahari", "Namib", "Sahara", "Gobi"],
      answer: 2,
      explain: "The Sahara stretches across North Africa and is about the size of the United States."
    },

    /* ---------- Entrepreneurship ---------- */
    {
      id: "ent-01", cat: "entrepreneurship", level: "easy",
      q: "What is a business plan?",
      options: [
        "A written plan describing your goals, customers and finances",
        "A loan application",
        "A tax receipt",
        "A list of your friends"
      ],
      answer: 0,
      explain: "A business plan sets out what you will sell, who will buy it, what it will cost and how you expect to earn money. It guides your decisions."
    },
    {
      id: "ent-02", cat: "entrepreneurship", level: "easy",
      q: "What does market research help you discover?",
      options: [
        "What customers want and who your competitors are",
        "How to avoid keeping records",
        "How to skip paying suppliers",
        "How to hide your prices"
      ],
      answer: 0,
      explain: "Researching the market before you invest reduces the risk of making something nobody wants."
    },
    {
      id: "ent-03", cat: "entrepreneurship", level: "easy",
      q: "Your \u201Ctarget market\u201D is…",
      options: [
        "The group of customers you most want to serve",
        "The place where you buy stock",
        "Your biggest competitor",
        "Your monthly sales figure"
      ],
      answer: 0,
      explain: "Knowing exactly who you serve helps you choose the right product, price and place to sell."
    },
    {
      id: "ent-04", cat: "entrepreneurship", level: "medium",
      q: "A \u201Cunique selling point\u201D (USP) is…",
      options: [
        "What makes your product or service different from others",
        "The lowest price in the market",
        "A discount for family members",
        "The name of your shop"
      ],
      answer: 0,
      explain: "A USP gives customers a reason to choose you, such as better quality, faster delivery or friendlier service."
    },
    {
      id: "ent-05", cat: "entrepreneurship", level: "medium",
      q: "What is a sensible way to test a new product idea?",
      options: [
        "Sell a small batch to a few customers and ask for feedback",
        "Spend all your savings on stock at once",
        "Copy a competitor exactly",
        "Wait until everything is perfect"
      ],
      answer: 0,
      explain: "A small test shows whether people really want the product before you risk a lot of money."
    },
    {
      id: "ent-06", cat: "entrepreneurship", level: "medium",
      q: "What does \u201Ccash flow\u201D mean?",
      options: [
        "The movement of money into and out of the business over time",
        "The total value of your stock",
        "The profit you made last year",
        "The cash kept at home"
      ],
      answer: 0,
      explain: "Cash flow shows whether you will have enough money on hand to pay suppliers, staff and bills when they are due."
    },
    {
      id: "ent-07", cat: "entrepreneurship", level: "hard",
      q: "A profitable business can still fail if…",
      options: [
        "It runs out of cash to pay its bills on time",
        "It has too many happy customers",
        "It keeps good records",
        "It sells at a price above cost"
      ],
      answer: 0,
      explain: "Profit on paper is not the same as cash in hand. If customers pay late while bills are due now, the business can run short."
    },
    {
      id: "ent-08", cat: "entrepreneurship", level: "easy",
      q: "Which is a sign of good customer service?",
      options: [
        "Listening to complaints and fixing problems quickly",
        "Ignoring complaints",
        "Arguing with customers",
        "Changing prices without telling anyone"
      ],
      answer: 0,
      explain: "Customers who feel respected come back and recommend you to others."
    },
    {
      id: "ent-09", cat: "entrepreneurship", level: "easy",
      q: "Why is it useful to keep a record of your customers?",
      options: [
        "You can follow up and serve repeat customers better",
        "It makes your shop look bigger",
        "It removes the need to sell",
        "It lowers your costs automatically"
      ],
      answer: 0,
      explain: "Knowing who buys, what they buy and when helps you plan stock and keep them coming back."
    },
    {
      id: "ent-10", cat: "entrepreneurship", level: "medium",
      q: "What is \u201Cworking capital\u201D?",
      options: [
        "Money available for the day-to-day running of the business",
        "The owner\u2019s salary",
        "The value of the building",
        "Last year\u2019s profit only"
      ],
      answer: 0,
      explain: "Working capital pays for stock, wages, transport and other daily costs while you wait for sales money to come in."
    },
    {
      id: "ent-11", cat: "entrepreneurship", level: "medium",
      q: "What does \u201Cbootstrapping\u201D a business mean?",
      options: [
        "Starting and growing it with your own savings and sales",
        "Buying shoes for staff",
        "Selling the business immediately",
        "Relying only on outside investors"
      ],
      answer: 0,
      explain: "Bootstrapping keeps control in your hands and forces discipline, though growth can be slower."
    },
    {
      id: "ent-12", cat: "entrepreneurship", level: "medium",
      q: "Selling goods on credit without keeping records mainly risks…",
      options: [
        "Losing track of who owes you and not recovering your money",
        "Having too many customers",
        "Paying too much tax",
        "Getting better prices"
      ],
      answer: 0,
      explain: "Always write down who owes what and when it is due. Unrecorded credit is one of the most common ways small businesses lose money."
    },
    {
      id: "ent-13", cat: "entrepreneurship", level: "hard",
      q: "It costs \u20A6600 to make an item. You want a 25% markup on cost. What should the selling price be?",
      options: ["\u20A6625", "\u20A6700", "\u20A6750", "\u20A6800"],
      answer: 2,
      explain: "25% of \u20A6600 is \u20A6150. Add it to the cost: \u20A6600 + \u20A6150 = \u20A6750."
    },
    {
      id: "ent-14", cat: "entrepreneurship", level: "medium",
      q: "What does it mean to reinvest profit?",
      options: [
        "Use part of the profit to grow the business",
        "Spend all of it on personal items",
        "Hide it from the records",
        "Give it all away"
      ],
      answer: 0,
      explain: "Putting part of the profit back into stock, equipment or marketing helps the business grow stronger over time."
    }
  ]
};
