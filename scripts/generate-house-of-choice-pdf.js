const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generateHouseOfChoicePDF() {
  const pdfDoc = await PDFDocument.create();
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontHelveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Color Palette - Deep Ocean Navy Blue & Gold accent
  const primaryNavy = rgb(0.05, 0.25, 0.45); // #0d4073 Deep Navy
  const accentGold = rgb(0.9, 0.75, 0.2); // #e6bf33
  const darkCharcoal = rgb(0.12, 0.14, 0.16);
  const textDark = rgb(0.18, 0.2, 0.22);
  const mutedText = rgb(0.45, 0.5, 0.55);
  const lightBg = rgb(0.96, 0.97, 0.98);
  const borderLine = rgb(0.88, 0.88, 0.88);

  const drawWrappedText = (page, text, font, size, color, startX, startY, maxWidth, lineHeight) => {
    const paragraphs = text.split('\n');
    let y = startY;

    for (let para of paragraphs) {
      if (para.trim() === '') {
        y -= lineHeight * 0.8;
        continue;
      }

      const words = para.split(' ');
      let line = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, size);
        if (testWidth > maxWidth && i > 0) {
          page.drawText(line.trim(), { x: startX, y: y, size: size, font: font, color: color });
          line = words[i] + ' ';
          y -= lineHeight;
        } else {
          line = testLine;
        }
      }
      if (line.trim().length > 0) {
        page.drawText(line.trim(), { x: startX, y: y, size: size, font: font, color: color });
        y -= lineHeight;
      }
    }
    return y;
  };

  const addPageDecorations = (page, title, pageNum, totalPages) => {
    const { width, height } = page.getSize();
    page.drawLine({
      start: { x: 40, y: height - 40 },
      end: { x: width - 40, y: height - 40 },
      thickness: 0.8,
      color: borderLine,
    });
    page.drawText(`HOUSE OF CHOICE — ${title.toUpperCase()}`, {
      x: 40,
      y: height - 32,
      size: 8,
      font: fontHelveticaBold,
      color: mutedText,
    });

    page.drawLine({
      start: { x: 40, y: 40 },
      end: { x: width - 40, y: 40 },
      thickness: 0.8,
      color: borderLine,
    });
    page.drawText("© 2025 Zeki Faith • Mindvest Publishing House", {
      x: 40,
      y: 25,
      size: 8,
      font: fontHelvetica,
      color: mutedText,
    });
    page.drawText(`Page ${pageNum} of ${totalPages}`, {
      x: width - 90,
      y: 25,
      size: 8,
      font: fontHelvetica,
      color: mutedText,
    });
  };

  // -------------------------------------------------------------
  // COVER PAGE (Page 1)
  // -------------------------------------------------------------
  const coverPage = pdfDoc.addPage([612, 792]);
  const { width, height } = coverPage.getSize();

  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: lightBg,
  });

  // Deep Navy Left Side Block
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: width * 0.45,
    height: height,
    color: primaryNavy,
  });

  coverPage.drawText("H O U S E", {
    x: 240,
    y: height - 200,
    size: 42,
    font: fontHelveticaBold,
    color: primaryNavy,
  });

  coverPage.drawText("O F", {
    x: 240,
    y: height - 260,
    size: 42,
    font: fontHelveticaBold,
    color: primaryNavy,
  });

  coverPage.drawText("C H O I C E", {
    x: 240,
    y: height - 320,
    size: 42,
    font: fontHelveticaBold,
    color: primaryNavy,
  });

  coverPage.drawText("RESHAPE YOUR DECISION", {
    x: 240,
    y: height - 380,
    size: 14,
    font: fontHelveticaBold,
    color: darkCharcoal,
  });

  coverPage.drawText("RESHAPING YOUR ESSENCE", {
    x: 240,
    y: height - 400,
    size: 14,
    font: fontHelveticaBold,
    color: darkCharcoal,
  });

  // Gold Blob Badge
  coverPage.drawRectangle({
    x: 320,
    y: 120,
    width: 220,
    height: 90,
    color: accentGold,
  });

  coverPage.drawText("ZEKI FAITH", {
    x: 350,
    y: 155,
    size: 20,
    font: fontHelveticaBold,
    color: darkCharcoal,
  });

  coverPage.drawText("MINDVEST PUBLISHING HOUSE", {
    x: 50,
    y: 40,
    size: 10,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  // -------------------------------------------------------------
  // COPYRIGHT & INTRODUCTION (Page 2)
  // -------------------------------------------------------------
  const page2 = pdfDoc.addPage([612, 792]);
  let y = height - 80;

  page2.drawText("© 2025 Zeki Faith", { x: 50, y: y, size: 11, font: fontHelveticaBold, color: darkCharcoal });
  y -= 20;
  page2.drawText("House Of Choice: Reshape Your Decision, Reshaping Your Essence", { x: 50, y: y, size: 11, font: fontHelveticaOblique, color: textDark });
  y -= 16;
  page2.drawText("Author: Zeki Faith", { x: 50, y: y, size: 10, font: fontHelvetica, color: textDark });
  y -= 16;
  page2.drawText("Publisher: Mindvest Publishing House", { x: 50, y: y, size: 10, font: fontHelvetica, color: textDark });

  y -= 60;
  page2.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryNavy });
  page2.drawText("INTRODUCTION | A Journey Through Choices", { x: 65, y: y - 16, size: 12, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const introText = `From the beginning, when time became resident, direction became more powerful than decisions. Even though you need both, direction shapes the course while decisions provide the fuel.

In this book, we will explore the art of making better choices, diving deep into the mechanics of decision-making, the psychology behind it, and actionable strategies to improve it. The journey ahead promises to be transformative, practical, and enduring.

The state you stand in right now is a direct result of choices—whether made actively, passively, or inactively.

Dan Lok often says: "All the mistakes I've made in the past, I've educated myself on them all." To understand the "house of choice", you must dissect the pillars that hold decisions upright: values, emotions, reasoning, and environment.`;

  y = drawWrappedText(page2, introText, fontHelvetica, 10, textDark, 50, y, 512, 15);
  addPageDecorations(page2, "Introduction", 2, 10);

  // -------------------------------------------------------------
  // TABLE OF CONTENTS (Page 3)
  // -------------------------------------------------------------
  const page3 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page3.drawText("TABLE OF CONTENTS", { x: 50, y: y, size: 18, font: fontHelveticaBold, color: darkCharcoal });
  y -= 30;

  const chapters = [
    { num: "Intro", title: "A Journey Through Choices & Decision Framework", page: "i" },
    { num: "Chap 1", title: "The Foundation of Choice: Birth of a Choice & Psychology", page: "1" },
    { num: "Chap 2", title: "The Mechanism of Decision-Making (System 1 vs System 2)", page: "6" },
    { num: "Chap 3", title: "Values and Emotions: The Compass Within & Nelson Mandela", page: "12" },
    { num: "Chap 4", title: "Direction and Its Power: True North & Elon Musk SpaceX", page: "18" },
    { num: "Chap 5", title: "The Role of Environment: Silicon Valley & Starbucks", page: "23" },
    { num: "Chap 6", title: "Short-Term vs. Long-Term Thinking: Bezos & Delayed Gratification", page: "29" },
    { num: "Chap 7", title: "The Decision Checklist: 7 Steps & Oprah Winfrey Pivot", page: "35" },
    { num: "Chap 8", title: "Coaching vs. Training: Satya Nadella Leadership Transformation", page: "40" },
    { num: "Chap 9", title: "Case Studies of Success: Jobs, Wright Brothers, Schultz, Malala", page: "46" },
    { num: "Chap 10", title: "Overcoming Decision Paralysis: Barack Obama & Netflix", page: "52" },
    { num: "Chap 11", title: "Building Decision-Making Habits: Warren Buffett & Serena Williams", page: "58" },
    { num: "Chap 12", title: "Creating a Legacy Through Choices: Mandela, Rosa Parks, Goodall", page: "64" },
  ];

  for (let c of chapters) {
    page3.drawText(c.num, { x: 50, y: y, size: 10, font: fontHelveticaBold, color: primaryNavy });
    page3.drawText(c.title, { x: 120, y: y, size: 10, font: fontHelvetica, color: textDark });
    page3.drawText(c.page, { x: 530, y: y, size: 10, font: fontHelveticaBold, color: mutedText });
    y -= 24;
  }
  addPageDecorations(page3, "Contents", 3, 10);

  // -------------------------------------------------------------
  // CHAPTER 1 & 2: FOUNDATION OF CHOICE & MECHANISM (Page 4)
  // -------------------------------------------------------------
  const page4 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page4.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryNavy });
  page4.drawText("CHAPTER 1 | The Foundation of Choice", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap1Body = `At its core, a choice is the bridge between thought and action. It stems from the intersection of internal values, external stimuli, and the intangible pull of emotions.

The Anatomy of a Choice:
1. Values: Deeply held beliefs serving as your compass.
2. Emotions: Happiness, fear, anger, and hope that color possibilities.
3. Reasoning: Logic evaluating pros and cons.
4. Environment: People, places, and circumstances shaping options.

Psychological Biases: Confirmation bias, Loss aversion, and Overconfidence bias subtlely tilt decisions. Recognizing them allows you to build counter-strategies.`;

  y = drawWrappedText(page4, chap1Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page4.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page4.drawText("CHAPTER 2 | The Mechanism of Decision-Making", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap2Body = `As Nobel laureate Daniel Kahneman described in Thinking, Fast and Slow:
• System 1 (Intuition & Instinct): Fast, automatic, and emotional.
• System 2 (Logic & Deliberation): Slow, conscious, and analytical.

Neuroscientist Antonio Damasio's research shows that without emotion, decision-making becomes nearly impossible. Emotions act as a filter prioritizing what matters most.

Case Study: Steve Jobs & Apple's "Think Different" Campaign (1997)
Jobs combined logical product streamlining with emotional storytelling, aligning Apple's identity with innovation and turning a near-bankrupt company into a global powerhouse.`;

  y = drawWrappedText(page4, chap2Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page4, "Chapters 1 & 2", 4, 10);

  // -------------------------------------------------------------
  // CHAPTER 3 & 4: VALUES, EMOTIONS & DIRECTION (Page 5)
  // -------------------------------------------------------------
  const page5 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page5.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryNavy });
  page5.drawText("CHAPTER 3 | Values and Emotions: The Compass Within", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap3Body = `Values provide stability and direction. When values and emotions harmonize, decisions feel natural and empowering.

Case Study: Nelson Mandela's Choice for Unity
After 27 years in prison, Mandela chose reconciliation over revenge. By leaning on his core values of peace and equality, his choice transformed South Africa and inspired the world.`;

  y = drawWrappedText(page5, chap3Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page5.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page5.drawText("CHAPTER 4 | Direction and Its Power: Defining Your True North", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap4Body = `Direction is the unseen force that shapes the course of our lives. Where decisions act as individual steps, direction determines the path those steps create.

Case Study: Elon Musk & SpaceX
Musk founded SpaceX with the audacious vision of enabling human colonization of Mars. This clear True North guided every technical and strategic decision, enabling SpaceX to achieve reusable rocket milestones despite initial failures.`;

  y = drawWrappedText(page5, chap4Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page5, "Chapters 3 & 4", 5, 10);

  // -------------------------------------------------------------
  // CHAPTER 5 & 6: ENVIRONMENT & TIME HORIZONS (Page 6)
  // -------------------------------------------------------------
  const page6 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page6.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryNavy });
  page6.drawText("CHAPTER 5 | The Role of Environment: The Hidden Architect", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap5Body = `Your environment encompasses social, digital, and physical layers. Like a seed in rich vs rocky soil, environment determines growth.

Case Studies:
• Starbucks "Third Place": Designing welcoming stores outside home and work created an empowering community space.
• Silicon Valley Ecosystem: Bringing together investors, universities, and tech culture created fertile ground for innovation.`;

  y = drawWrappedText(page6, chap5Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page6.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page6.drawText("CHAPTER 6 | Short-Term vs. Long-Term Thinking", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap6Body = `The Marshmallow Test illustrates delayed gratification.

Case Study: Jeff Bezos & Amazon's Long-Term Strategy
When Bezos founded Amazon, he prioritized long-term customer experience and innovation over immediate profitability. Weathering years of Wall Street criticism, his relentless long-term focus transformed Amazon into a global powerhouse.`;

  y = drawWrappedText(page6, chap6Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page6, "Chapters 5 & 6", 6, 10);

  // -------------------------------------------------------------
  // CHAPTER 7 & 8: THE DECISION CHECKLIST & COACHING VS TRAINING (Page 7)
  // -------------------------------------------------------------
  const page7 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page7.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryNavy });
  page7.drawText("CHAPTER 7 | The 7-Step Decision Checklist", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap7Body = `The 7-Step Decision Checklist:
1. Define the decision clearly | 2. Clarify goals & priorities | 3. Gather relevant data | 4. Consider all options | 5. Evaluate pros & cons | 6. Imagine outcomes | 7. Make choice & commit.

Case Study: Oprah Winfrey's Career Pivot from daytime TV to launching OWN network.`;

  y = drawWrappedText(page7, chap7Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page7.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page7.drawText("CHAPTER 8 | Coaching vs. Training", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap8Body = `• Training provides the "how" (equipping specific skills/competencies).
• Coaching uncovers the "why" (unlocking personal potential & mindset).

Case Study: Satya Nadella at Microsoft combined technical leadership training with empathetic coaching to transform Microsoft's culture from internal competition to seamless collaboration.`;

  y = drawWrappedText(page7, chap8Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page7, "Chapters 7 & 8", 7, 10);

  // -------------------------------------------------------------
  // CHAPTER 9, 10 & 11: CASE STUDIES, PARALYSIS & HABITS (Page 8)
  // -------------------------------------------------------------
  const page8 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page8.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryNavy });
  page8.drawText("CHAPTER 9 & 10 | Case Studies of Success & Overcoming Decision Paralysis", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap910Body = `Historical Patterns of Success: Wright Brothers (perseverance in flight), Malala Yousafzai (courage in education), Toyota (Prius hybrid revolution).

Overcoming Decision Paralysis:
Barack Obama's Decision Strategy: Minimized daily decision fatigue by wearing only gray or blue suits and delegating routine choices to conserve mental energy for high-stakes policy.
Netflix Pivot to Streaming: Leadership avoided paralysis by taking calculated steps toward long-term streaming vision.`;

  y = drawWrappedText(page8, chap910Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page8.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page8.drawText("CHAPTER 11 | Building Decision-Making Habits", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap11Body = `Using James Clear's Atomic Habits framework (Cue, Routine, Reward):
• Warren Buffett's Discipline: Sticking strictly to core competencies, evaluating risks, and saying "no" to distractions.
• Serena Williams' Power of Routine: Daily preparation and disciplined execution ensure peak performance on and off the court.`;

  y = drawWrappedText(page8, chap11Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page8, "Chapters 9, 10 & 11", 8, 10);

  // -------------------------------------------------------------
  // CHAPTER 12 & ABOUT THE AUTHOR (Page 9 & 10)
  // -------------------------------------------------------------
  const page9 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page9.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryNavy });
  page9.drawText("CHAPTER 12 | Creating a Legacy Through Choices", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap12Body = `Legacy is the sum of the impact you create through your decisions, actions, and values.

Inspirational Examples:
• Rosa Parks: Refusing to give up her bus seat—a single act of courage that sparked the civil rights movement.
• Jane Goodall: Lifelong dedication to chimpanzee research and conservation that transformed global environmental consciousness.

Conclusion: Legacy as a Gift to the World
Every decision carries weight. By building a solid foundation of self-awareness, values, and strategic thinking, you empower yourself to create a life aligned with your true purpose.`;

  y = drawWrappedText(page9, chap12Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page9, "Chapter 12 & Legacy", 9, 10);

  // Page 10: About the Author
  const page10 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page10.drawRectangle({ x: 50, y: y - 120, width: 512, height: 120, color: primaryNavy });
  page10.drawText("ABOUT THE AUTHOR", { x: 70, y: y - 40, size: 18, font: fontHelveticaBold, color: accentGold });
  page10.drawText("Zeki Faith — Architect of Transformation and Innovation", { x: 70, y: y - 65, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  page10.drawText("Mindvest Publishing House", { x: 70, y: y - 85, size: 10, font: fontHelvetica, color: rgb(0.85, 0.9, 0.95) });
  y -= 150;

  const authorBio = `Zeki Faith is a distinguished architect, transformational trainer, and visionary entrepreneur dedicated to shaping both the physical and human landscape. As the founder of Lifebuild Innovators, Unova Consulting, Unova Designs, and Yonan Technologies, he seamlessly blends creativity, strategy, and innovation to drive meaningful change across industries.

Beyond his architectural expertise, Zeki is a catalyst for personal and professional growth. He is the facilitator of the "3 Steps Transformational Journey Blueprint," a structured pathway to unlocking human potential, and the creator of "Becoming a Person of Interest," a program designed to empower individuals to establish influence, relevance, and impact in their fields.

With a deep commitment to excellence and value-driven leadership, Zeki Faith is on a mission to equip individuals and organizations with the tools they need to build, innovate, and thrive in an ever-evolving world.`;

  y = drawWrappedText(page10, authorBio, fontHelvetica, 10, textDark, 50, y, 512, 16);
  addPageDecorations(page10, "About the Author", 10, 10);

  const pdfBytes = await pdfDoc.save();
  const targetPath = path.join(__dirname, '..', 'public', 'documents', 'house-of-choice.pdf');

  fs.writeFileSync(targetPath, pdfBytes);

  console.log('House of Choice PDF successfully generated at:', targetPath);
}

generateHouseOfChoicePDF().catch(err => console.error(err));
