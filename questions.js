/*
  SAVEMORE GAMES: Quiz Challenge question bank (Stage 1 draft, for review)

  Each question:
    id       unique text id
    cat      category id (must match a category below)
    level    "easy" | "medium" | "hard"   (not used by the screen yet; kept for Stage 2)
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
    }
  ]
};
