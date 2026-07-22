const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generateDeepRemakePDF() {
  const pdfDoc = await PDFDocument.create();
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontHelveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Color Palette
  const goldAccent = rgb(0.85, 0.65, 0.15); // #d9a626 (Book cover gold)
  const darkCharcoal = rgb(0.12, 0.14, 0.16); // #1f2429
  const textDark = rgb(0.18, 0.2, 0.22);
  const mutedText = rgb(0.45, 0.5, 0.55);
  const lightBg = rgb(0.96, 0.96, 0.96);
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

  // Helper for adding standard page header & footer
  const addPageDecorations = (page, title, pageNum, totalPages) => {
    const { width, height } = page.getSize();
    // Header line
    page.drawLine({
      start: { x: 40, y: height - 40 },
      end: { x: width - 40, y: height - 40 },
      thickness: 0.8,
      color: borderLine,
    });
    page.drawText(`DEEP RE-MAKE — ${title.toUpperCase()}`, {
      x: 40,
      y: height - 32,
      size: 8,
      font: fontHelveticaBold,
      color: mutedText,
    });

    // Footer
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

  // Big Bold Cover Graphic
  coverPage.drawRectangle({
    x: 80,
    y: height - 320,
    width: 452,
    height: 220,
    color: goldAccent,
  });

  coverPage.drawText("DE", {
    x: 120,
    y: height - 200,
    size: 110,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText("EP", {
    x: 120,
    y: height - 300,
    size: 110,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText("Re-Make", {
    x: 280,
    y: height - 260,
    size: 48,
    font: fontHelveticaOblique,
    color: darkCharcoal,
  });

  coverPage.drawText("Redefining yourself and reclaiming your power.", {
    x: 120,
    y: height - 360,
    size: 14,
    font: fontHelvetica,
    color: darkCharcoal,
  });

  coverPage.drawText("ZEKI FAITH", {
    x: 120,
    y: 120,
    size: 24,
    font: fontHelveticaBold,
    color: darkCharcoal,
  });

  coverPage.drawText("MINDVEST PUBLISHING HOUSE", {
    x: 120,
    y: 95,
    size: 10,
    font: fontHelveticaBold,
    color: mutedText,
  });

  // -------------------------------------------------------------
  // COPYRIGHT & DEDICATION & ACKNOWLEDGMENT (Page 2)
  // -------------------------------------------------------------
  const page2 = pdfDoc.addPage([612, 792]);
  let y = height - 80;

  page2.drawText("© 2025 Zeki Faith", { x: 50, y: y, size: 11, font: fontHelveticaBold, color: darkCharcoal });
  y -= 20;
  page2.drawText("Deep Re-Make", { x: 50, y: y, size: 11, font: fontHelveticaOblique, color: textDark });
  y -= 16;
  page2.drawText("Author: Zeki Faith", { x: 50, y: y, size: 10, font: fontHelvetica, color: textDark });
  y -= 16;
  page2.drawText("Publisher: Mindvest Publishing House", { x: 50, y: y, size: 10, font: fontHelvetica, color: textDark });

  y -= 80;
  page2.drawText("DEDICATION", { x: 50, y: y, size: 14, font: fontHelveticaBold, color: goldAccent });
  y -= 25;
  const dedText = "To the visionaries, dreamers, and doers —\nMay you always find your market and may your value be recognized.";
  y = drawWrappedText(page2, dedText, fontHelveticaOblique, 11, textDark, 50, y, 512, 16);

  y -= 60;
  page2.drawText("ACKNOWLEDGMENT", { x: 50, y: y, size: 14, font: fontHelveticaBold, color: goldAccent });
  y -= 25;
  const ackText = "This book would not have been possible without the unwavering support of my family, friends, and mentors who continuously inspire me. Special thanks to everyone who believed in this vision and encouraged me to bring this work to life. To my readers, you are the true market—thank you for your time, energy, and belief in the ideas within these pages.";
  y = drawWrappedText(page2, ackText, fontHelvetica, 10.5, textDark, 50, y, 512, 16);
  addPageDecorations(page2, "Copyright & Dedication", 2, 10);

  // -------------------------------------------------------------
  // TABLE OF CONTENTS (Page 3)
  // -------------------------------------------------------------
  const page3 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page3.drawText("TABLE OF CONTENTS", { x: 50, y: y, size: 18, font: fontHelveticaBold, color: darkCharcoal });
  y -= 30;

  const chapters = [
    { num: "Intro", title: "As You Think, So You Become", page: "15" },
    { num: "Chap 1", title: "The Seeds of Thought: What Is Personal Tokenism?", page: "17" },
    { num: "Chap 2", title: "Weeding Out the Negatives: Breaking Limiting Beliefs", page: "22" },
    { num: "Chap 3", title: "Cultivating the Garden: Building a Growth-Oriented Mindset", page: "27" },
    { num: "Chap 4", title: "The Law of Design: Becoming the Architect of Your Life", page: "32" },
    { num: "Chap 5", title: "Harnessing Discipline: Daily Habits That Shape Your Future", page: "40" },
    { num: "Chap 6", title: "Expanding Your Horizons: The Power of Vision and Purpose", page: "45" },
    { num: "Chap 7", title: "Overcoming Fear and Breaking Comfort Zones", page: "50" },
    { num: "Chap 8", title: "Rising Stronger: Resilience as a Tool for Growth", page: "55" },
    { num: "Chap 9", title: "Sowing and Reaping: Aligning Actions With Goals", page: "61" },
    { num: "Chap 10", title: "Mastering Relationships: Emotional Intelligence and Influence", page: "66" },
    { num: "Chap 11", title: "Mentorship and Community: Building a Network of Growth", page: "72" },
    { num: "Chap 12", title: "Success and Failure: Two Sides of the Same Coin", page: "78" },
    { num: "Chap 13", title: "Framing Your Legacy: Becoming a Builder of Others", page: "84" },
    { num: "Chap 14", title: "Sustaining Growth: A Lifelong Journey", page: "89" },
    { num: "Chap 15", title: "Becoming a Framer: Shaping Your World and Others'", page: "95" },
    { num: "Conclusion", title: "The Journey of a Lifetime", page: "101" },
  ];

  for (let c of chapters) {
    page3.drawText(c.num, { x: 50, y: y, size: 10, font: fontHelveticaBold, color: goldAccent });
    page3.drawText(c.title, { x: 120, y: y, size: 10, font: fontHelvetica, color: textDark });
    page3.drawText(c.page, { x: 530, y: y, size: 10, font: fontHelveticaBold, color: mutedText });
    y -= 22;
  }
  addPageDecorations(page3, "Contents", 3, 10);

  // -------------------------------------------------------------
  // INTRODUCTION & CHAPTER 1 (Page 4)
  // -------------------------------------------------------------
  const page4 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page4.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page4.drawText("INTRODUCTION | As You Think, So You Become", { x: 65, y: y - 16, size: 12, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const introBody = `Borrowing from As a Man Thinketh, this introduction emphasizes the idea that thought is the seed of all action. Who you are today is a result of the thoughts you’ve cultivated over time, and who you become tomorrow depends on the quality of your thoughts today.

Jim Rohn’s philosophy of personal growth complements this by reminding us:
• "You must take personal responsibility. You cannot change the circumstances, the seasons, or the wind, but you can change yourself."

Key Principles of This Journey:
1. Personal Tokenism: A limitation of thought that traps individuals in narrow roles or beliefs.
2. Transformative Intentional Thinking: Overcoming invisible barriers through conscious daily choices.
3. Call to Action: "Your life changes when you change your thinking."`;

  y = drawWrappedText(page4, introBody, fontHelvetica, 10, textDark, 50, y, 512, 15);
  y -= 25;

  page4.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: goldAccent });
  page4.drawText("CHAPTER 1 | The Seeds of Thought: What Is Personal Tokenism?", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap1Body = `In the quiet of an early morning, as the world stirs itself awake, there is a fleeting moment when the mind is uncluttered, untouched by the day’s demands. It is in this stillness that our thoughts begin to shape the day ahead. For better or worse, those thoughts become the seeds of our reality.

James Allen, in his timeless work As a Man Thinketh, wrote: "A man is literally what he thinks, his character being the complete sum of all his thoughts."

Personal tokenism occurs when we allow narrow roles (the "problem solver", the "reliable employee") to define our identity and behavior. While these roles may be comforting, they confine us to a cycle of underachievement and self-doubt.

Signs of Personal Tokenism:
1. Living Within Labels: Defining yourself solely by a single role.
2. Self-Imposed Limits: Believing you're not capable of achieving beyond past records.
3. Seeking Validation Over Fulfillment: Basing worth on external approval.

Action Step: Observe your inner dialogue today. Challenge every negative belief with an empowering counter-belief.`;

  y = drawWrappedText(page4, chap1Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page4, "Introduction & Chapter 1", 4, 10);

  // -------------------------------------------------------------
  // CHAPTER 2 & 3: LIMITING BELIEFS & GROWTH MINDSET (Page 5)
  // -------------------------------------------------------------
  const page5 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page5.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page5.drawText("CHAPTER 2 | Weeding Out the Negatives: Breaking Limiting Beliefs", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap2Body = `A gardener knows that tending to a healthy crop isn’t just about planting seeds. It requires removing the weeds—those invasive elements that choke out growth. In the garden of your mind, limiting beliefs are the weeds.

James Allen said: "You are today where your thoughts have brought you; you will be tomorrow where your thoughts take you."

How to Break Limiting Beliefs:
• Step 1: Challenge the Belief — Ask yourself: "What evidence supports this belief? Is it helping or hindering me?"
• Step 2: Replace the Belief — Replace "I'm not good enough" with "I am constantly learning and growing stronger every day."
• Step 3: Reinforce the New Belief — Use daily affirmations, visualization, and small wins.`;

  y = drawWrappedText(page5, chap2Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 25;

  page5.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: goldAccent });
  page5.drawText("CHAPTER 3 | Cultivating the Garden: Building a Growth Mindset", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap3Body = `In the garden of your mind, breaking free from limiting beliefs is only the beginning. True transformation comes when you intentionally cultivate thoughts that empower you to grow.

Jim Rohn puts it simply: "Success is something you attract by the person you become."

Growth-Oriented Mindset Principles:
1. Embrace the Power of "Yet": Instead of "I can't do this", say "I can't do this yet."
2. Focus on Process Over Perfection: Celebrate effort and daily progress.
3. Learn From Failure: Setbacks provide valuable feedback guiding you closer to what works.
4. Surround Yourself With Growth-Minded People: You are the average of the five people you spend the most time with.`;

  y = drawWrappedText(page5, chap3Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page5, "Chapters 2 & 3", 5, 10);

  // -------------------------------------------------------------
  // CHAPTER 4, 5, 6: LAW OF DESIGN, DISCIPLINE & VISION (Page 6)
  // -------------------------------------------------------------
  const page6 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page6.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page6.drawText("CHAPTER 4 | The Law of Design: Becoming the Architect of Your Life", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap4Body = `Imagine standing in front of a blank canvas with every color at your disposal. This is your life. Jim Rohn captured this when he said: "Your life does not get better by chance; it gets better by change."

Key Steps to Design Your Life:
1. Define Your Purpose: Identify your core values and what makes you feel alive.
2. Create a Inspiring Vision: Map your ideal outcomes in career, relationships, health, and impact.
3. Set SMART Actionable Goals: Specific, Measurable, Achievable, Relevant, and Time-bound.`;

  y = drawWrappedText(page6, chap4Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page6.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: goldAccent });
  page6.drawText("CHAPTER 5 | Harnessing Discipline: Daily Habits That Shape Your Future", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap5Body = `Every great structure is built one brick at a time. Jim Rohn aptly said: "Discipline is the bridge between goals and accomplishment."

Building Discipline:
• Start Small: Focus on 5 minutes of consistent daily practice (Atomic Habits).
• Habit Stacking: Attach new positive habits to existing daily routines.
• Compound Effect: Reading 10 pages a day equals 12 books a year.`;

  y = drawWrappedText(page6, chap5Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page6, "Chapters 4 & 5", 6, 10);

  // -------------------------------------------------------------
  // CHAPTER 7, 8, 9: FEAR, RESILIENCE, SOWING & REAPING (Page 7)
  // -------------------------------------------------------------
  const page7 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page7.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page7.drawText("CHAPTER 7 & 8 | Overcoming Fear & Rising Stronger in Resilience", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap78Body = `Fear is a silent gatekeeper standing between you and the life you're capable of living. James Allen wrote: "He who has conquered doubt and fear has conquered failure."

Resilience is not simply enduring hardship—it's growing stronger because of it.
• Reframe Adversity: View setbacks as opportunities to sharpen your character.
• Emotional Regulation: Manage stress through deep breathing, mindfulness, and constructive reflection.
• Problem-Solving Mindset: Focus energy entirely on what you can control.`;

  y = drawWrappedText(page7, chap78Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page7.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: goldAccent });
  page7.drawText("CHAPTER 9 | Sowing and Reaping: Aligning Actions With Goals", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap9Body = `You reap what you sow. Your actions today are the seeds of your future outcomes.

Key Principles of Sowing and Reaping:
1. You Reap What You Sow: Results are directly tied to daily actions.
2. You Reap More Than You Sow: Small consistent actions yield exponential compound returns.
3. You Reap After You Sow: Patience and persistence are required before the harvest.`;

  y = drawWrappedText(page7, chap9Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page7, "Chapters 7, 8 & 9", 7, 10);

  // -------------------------------------------------------------
  // CHAPTER 10, 11, 12: RELATIONSHIPS, COMMUNITY & FAILURE (Page 8)
  // -------------------------------------------------------------
  const page8 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page8.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page8.drawText("CHAPTER 10 & 11 | Emotional Intelligence, Influence & Mentorship", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap1011Body = `Emotional Intelligence (EQ) is the ability to understand and manage your emotions while empathizing with others.

The 5 Pillars of EQ:
1. Self-Awareness | 2. Self-Regulation | 3. Motivation | 4. Empathy | 5. Social Skills

Mentorship & Community:
"You are the average of the five people you spend the most time with." (Jim Rohn).
Mentors accelerate your learning, provide accountability, and expand your perspective.`;

  y = drawWrappedText(page8, chap1011Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page8.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: goldAccent });
  page8.drawText("CHAPTER 12 & 13 | Success, Failure & Framing Your Legacy", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap1213Body = `Success and failure are two sides of the same coin. Thomas Edison famously said: "I have not failed. I've just found 10,000 ways that won't work."

Framing Your Legacy:
Your legacy is not something you leave behind after death; it is something you build every day through your decisions, relationships, and contributions. Become a builder of others.`;

  y = drawWrappedText(page8, chap1213Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page8, "Chapters 10, 11, 12 & 13", 8, 10);

  // -------------------------------------------------------------
  // CHAPTER 14, 15 & CONCLUSION (Page 9)
  // -------------------------------------------------------------
  const page9 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page9.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page9.drawText("CHAPTER 14 & 15 | Sustaining Growth & Becoming a Framer", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap1415Body = `Growth is a continuous journey. Jim Rohn emphasized: "Formal education will make you a living; self-education will make you a fortune."

A Framer is someone who doesn't just follow the blueprint—they create it. They set the foundation, erect the structure, and build a future that empowers themselves and others.

Traits of a Framer:
• Clarity of Vision | • Courage in Action | • Empathy & Rapport | • System Consistency`;

  y = drawWrappedText(page9, chap1415Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page9.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: goldAccent });
  page9.drawText("CONCLUSION | The Journey of a Lifetime", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const conclusionBody = `Growth is not a destination; it is a lifelong journey. The person you are becoming—resilient, disciplined, purpose-driven—is the greatest achievement of all.

As James Allen so eloquently stated: "The dreamers are the saviors of the world."

Your next step is simple: Dream big, act boldly, and align your efforts with the life you truly want. Your journey is your legacy. Build it well.`;

  y = drawWrappedText(page9, conclusionBody, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page9, "Conclusion", 9, 10);

  // -------------------------------------------------------------
  // ABOUT THE AUTHOR (Page 10)
  // -------------------------------------------------------------
  const page10 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page10.drawRectangle({ x: 50, y: y - 120, width: 512, height: 120, color: darkCharcoal });
  page10.drawText("ABOUT THE AUTHOR", { x: 70, y: y - 40, size: 18, font: fontHelveticaBold, color: goldAccent });
  page10.drawText("Zeki Faith — Architect of Transformation & Innovation", { x: 70, y: y - 65, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  page10.drawText("Mindvest Publishing House", { x: 70, y: y - 85, size: 10, font: fontHelvetica, color: rgb(0.8, 0.85, 0.9) });
  y -= 150;

  const authorBio = `Zeki Faith is a distinguished architect, transformational trainer, and visionary entrepreneur dedicated to shaping both the physical and human landscape. As the founder of Lifebuild Innovators, Unova Consulting, Unova Designs, and Yonan Technologies, he seamlessly blends creativity, strategy, and innovation to drive meaningful change across industries.

Beyond his architectural expertise, Zeki is a catalyst for personal and professional growth. He is the facilitator of the "3 Steps Transformational Journey Blueprint," a structured pathway to unlocking human potential, and the creator of "Becoming a Person of Interest," a program designed to empower individuals to establish influence, relevance, and impact in their fields.

With a deep commitment to excellence and value-driven leadership, Zeki Faith is on a mission to equip individuals and organizations with the tools they need to build, innovate, and thrive in an ever-evolving world.

With a passion for market dynamics and human potential, Zeki Faith empowers individuals to recognize opportunities and leverage their strengths in the evolving marketplace.`;

  y = drawWrappedText(page10, authorBio, fontHelvetica, 10, textDark, 50, y, 512, 16);

  y -= 40;
  page10.drawRectangle({ x: 50, y: y - 60, width: 512, height: 60, color: lightBg, borderColor: goldAccent, borderWidth: 1 });
  page10.drawText("Official Mindvest eBook Publication", { x: 70, y: y - 25, size: 11, font: fontHelveticaBold, color: darkCharcoal });
  page10.drawText("Downloaded via Origin Store • www.sof-beta.vercel.app", { x: 70, y: y - 45, size: 9.5, font: fontHelvetica, color: mutedText });

  addPageDecorations(page10, "About the Author", 10, 10);

  const pdfBytes = await pdfDoc.save();
  const targetPath = path.join(__dirname, '..', 'public', 'documents', 'deep-remake.pdf');

  fs.writeFileSync(targetPath, pdfBytes);

  console.log('Deep-Remake PDF successfully generated at:', targetPath);
}

generateDeepRemakePDF().catch(err => console.error(err));
