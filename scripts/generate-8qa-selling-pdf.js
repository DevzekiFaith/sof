const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generate8QASellingPDF() {
  const pdfDoc = await PDFDocument.create();
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontHelveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Color Palette - Red & Crimson Theme matching book cover
  const primaryRed = rgb(0.8, 0.15, 0.15); // Crimson Red #cc2626
  const darkCharcoal = rgb(0.12, 0.14, 0.16);
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

  const addPageDecorations = (page, title, pageNum, totalPages) => {
    const { width, height } = page.getSize();
    page.drawLine({
      start: { x: 40, y: height - 40 },
      end: { x: width - 40, y: height - 40 },
      thickness: 0.8,
      color: borderLine,
    });
    page.drawText(`8 Q & A TO SELLING — ${title.toUpperCase()}`, {
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

  // Top Red Header Band
  coverPage.drawRectangle({
    x: 0,
    y: height - 100,
    width: width,
    height: 100,
    color: primaryRed,
  });

  coverPage.drawText("ZEKI FAITH", {
    x: 40,
    y: height - 60,
    size: 20,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  // Title Graphic Box
  coverPage.drawRectangle({
    x: 40,
    y: height - 380,
    width: 532,
    height: 250,
    color: darkCharcoal,
  });

  coverPage.drawText("THERE IS A", {
    x: 70,
    y: height - 210,
    size: 42,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText("MARKET", {
    x: 70,
    y: height - 310,
    size: 90,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  // Middle Red Accent Box
  coverPage.drawRectangle({
    x: 40,
    y: height - 460,
    width: 532,
    height: 60,
    color: primaryRed,
  });

  coverPage.drawText("8 Q & A To Selling", {
    x: 70,
    y: height - 440,
    size: 32,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText("For Those Ready to Share Their Unique Value", {
    x: 70,
    y: height - 500,
    size: 14,
    font: fontHelveticaOblique,
    color: darkCharcoal,
  });

  coverPage.drawText("MINDVEST PUBLISHING HOUSE", {
    x: 70,
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
  page2.drawText("There is a Market: 8 Questions & Answers to Selling with Purpose", { x: 50, y: y, size: 11, font: fontHelveticaOblique, color: textDark });
  y -= 16;
  page2.drawText("Author: Zeki Faith", { x: 50, y: y, size: 10, font: fontHelvetica, color: textDark });
  y -= 16;
  page2.drawText("Publisher: Mindvest Publishing House", { x: 50, y: y, size: 10, font: fontHelvetica, color: textDark });

  y -= 80;
  page2.drawText("DEDICATION", { x: 50, y: y, size: 14, font: fontHelveticaBold, color: primaryRed });
  y -= 25;
  const dedText = "To the visionaries, dreamers, and doers —\nMay you always find your market and may your value be recognized.";
  y = drawWrappedText(page2, dedText, fontHelveticaOblique, 11, textDark, 50, y, 512, 16);

  y -= 60;
  page2.drawText("ACKNOWLEDGMENT", { x: 50, y: y, size: 14, font: fontHelveticaBold, color: primaryRed });
  y -= 25;
  const ackText = "This book would not have been possible without the unwavering support of my family, friends, and mentors who continuously inspire me. Special thanks to everyone who believed in this vision and encouraged me to bring this work to life. To my readers, you are the true market—thank you for your time, energy, and belief in the ideas within these pages.";
  y = drawWrappedText(page2, ackText, fontHelvetica, 10.5, textDark, 50, y, 512, 16);

  y -= 60;
  page2.drawRectangle({ x: 50, y: y - 40, width: 512, height: 45, color: lightBg, borderColor: primaryRed, borderWidth: 1 });
  page2.drawText("\"When you find out what you can do as a trade, do it with excellence.\"", { x: 70, y: y - 25, size: 11, font: fontHelveticaOblique, color: primaryRed });

  addPageDecorations(page2, "Copyright & Dedication", 2, 10);

  // -------------------------------------------------------------
  // TABLE OF CONTENTS (Page 3)
  // -------------------------------------------------------------
  const page3 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page3.drawText("TABLE OF CONTENTS", { x: 50, y: y, size: 18, font: fontHelveticaBold, color: darkCharcoal });
  y -= 30;

  const chapters = [
    { num: "Chap 1", title: "The Marketplace of Possibilities", page: "12" },
    { num: "Chap 2", title: "How Do You See Yourself?", page: "18" },
    { num: "Chap 3", title: "The Foundation of Trade", page: "24" },
    { num: "Chap 4", title: "Crafting Your Trade Message", page: "30" },
    { num: "Chap 5", title: "Finding and Understanding Your Audience", page: "37" },
    { num: "Chap 6", title: "Speaking Their Language", page: "44" },
    { num: "Chap 7", title: "Building Offers That Overdeliver", page: "51" },
    { num: "Chap 8", title: "The Solution-Oriented Trade", page: "58" },
    { num: "Chap 9", title: "Positioning Yourself in the Market", page: "65" },
    { num: "Chap 10", title: "The Path to Mastery and Legacy", page: "72" },
    { num: "Chap 11", title: "Discovery, Learning, and Perfecting", page: "79" },
    { num: "Chap 12", title: "The Integration of Trade and Transformation", page: "86" },
    { num: "Chap 13", title: "The Mastery of Positioning for Legacy", page: "93" },
    { num: "Chap 14", title: "The Energy of Persistence and Momentum", page: "100" },
    { num: "Chap 15", title: "Amplifying Impact Through Generosity", page: "107" },
  ];

  for (let c of chapters) {
    page3.drawText(c.num, { x: 50, y: y, size: 10, font: fontHelveticaBold, color: primaryRed });
    page3.drawText(c.title, { x: 120, y: y, size: 10, font: fontHelvetica, color: textDark });
    page3.drawText(c.page, { x: 530, y: y, size: 10, font: fontHelveticaBold, color: mutedText });
    y -= 22;
  }
  addPageDecorations(page3, "Contents", 3, 10);

  // -------------------------------------------------------------
  // CHAPTER 1 & 2: MARKETPLACE & SELF PERCEPTION (Page 4)
  // -------------------------------------------------------------
  const page4 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page4.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page4.drawText("CHAPTER 1 | The Marketplace of Possibilities", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap1Body = `The marketplace today is more than a space for buying and selling. It’s a complex network of interactions—a space where people exchange ideas, share skills, and contribute to each other’s growth. Platforms like LinkedIn, Etsy, and Shopify have turned the traditional market into a dynamic ecosystem of value exchange.

Key Rules of Engagement:
1. Have something valuable to offer.
2. Know how to present that value effectively.

The takeaway is simple: the way you share your trade matters as much as the trade itself. In a world where stories sell, your narrative is your most powerful tool. Shift from competition to contribution.`;

  y = drawWrappedText(page4, chap1Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page4.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryRed });
  page4.drawText("CHAPTER 2 | How Do You See Yourself?", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap2Body = `Before you can bring value to the marketplace, you need to understand your own worth. How do you see yourself? The way you perceive your abilities and potential shapes how others respond to you.

The Mirror of Perception:
If you can’t see yourself as valuable, it’s unlikely others will. Recognizing your individuality as a source of energy and solutions unlocks confidence that draws people toward you.

Action Steps to Build Confidence:
• Celebrate Progress — Acknowledge every win.
• Focus on Service — Shift from "Am I good enough?" to "How can I help?"
• Visualize Your Future Self — Let your ideal outcome guide your actions today.`;

  y = drawWrappedText(page4, chap2Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page4, "Chapters 1 & 2", 4, 10);

  // -------------------------------------------------------------
  // CHAPTER 3 & 4: FOUNDATION OF TRADE & TRADE MESSAGE (Page 5)
  // -------------------------------------------------------------
  const page5 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page5.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page5.drawText("CHAPTER 3 | The Foundation of Trade: Gateway to Value", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap3Body = `Your trade is the sum of your skills, knowledge, and passions. The marketplace recognizes one currency above all others: value. And value flows from your trade.

The Anatomy of a Trade:
1. Skill: The expertise or ability you bring to the table.
2. Purpose: The deeper meaning and resonance behind what you do.
3. Impact: The measurable difference your trade makes in the lives of others.`;

  y = drawWrappedText(page5, chap3Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page5.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryRed });
  page5.drawText("CHAPTER 4 | Crafting Your Trade Message", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap4Body = `As Myron Golden often says: "The most important thing you sell is not your product or service—it's yourself. People buy into who you are before they buy what you offer."

"People don't buy drills because they want drills. They buy drills because they want holes."

Three Pillars of a Transformative Message:
• 1. Clarity (Make It Plain): Clear messaging inspires immediate trust.
• 2. Empathy (Speak to Their Hearts): Address their frustrations, fears, and core desires.
• 3. Alignment (Be True to Yourself): Speak from a place of truth and authenticity.`;

  y = drawWrappedText(page5, chap4Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page5, "Chapters 3 & 4", 5, 10);

  // -------------------------------------------------------------
  // CHAPTER 5, 6, 7: AUDIENCE, LANGUAGE & OFFERS THAT OVERDELIVER (Page 6)
  // -------------------------------------------------------------
  const page6 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page6.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page6.drawText("CHAPTER 5 & 6 | Finding Your Audience & Speaking Their Language", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap56Body = `"If you're talking to everyone, you're talking to no one." (Myron Golden). Your audience is a specific group whose pain points you are uniquely positioned to solve.

The Mirror Effect:
When you speak your audience's language using their exact words and emotions, they think: "That's exactly how I feel!" Emotion creates action; logic reinforces the decision.`;

  y = drawWrappedText(page6, chap56Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page6.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryRed });
  page6.drawText("CHAPTER 7 | Building Offers That Overdeliver", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap7Body = `"When you add massive value, people see you as the only logical choice." (Myron Golden). "Trade your expectations for appreciation and your world changes instantly." (Tony Robbins).

Overdelivering turns customers into raving fans by creating an unexpected, transformative experience from the very first interaction.`;

  y = drawWrappedText(page6, chap7Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page6, "Chapters 5, 6 & 7", 6, 10);

  // -------------------------------------------------------------
  // CHAPTER 8, 9, 10: SOLUTION-ORIENTED TRADE, POSITIONING & MASTERY (Page 7)
  // -------------------------------------------------------------
  const page7 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page7.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page7.drawText("CHAPTER 8 & 9 | Solution-Oriented Trade & Market Positioning", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap89Body = `"People don't pay for effort; they pay for outcomes." Shift your mindset from offering services ("What do I do?") to offering solutions ("What does my audience need and how can I solve it?").

Positioning: "If you're not positioned, you're invisible." (Myron Golden). "Proximity is power." (Tony Robbins). Focus on clarity, credibility, and visibility. The riches are in the niches.`;

  y = drawWrappedText(page7, chap89Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page7.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryRed });
  page7.drawText("CHAPTER 10 | The Path to Mastery and Legacy", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap10Body = `"Mastery isn't about knowing everything; it's about doing the right things consistently at the highest level possible." (Myron Golden).

Mastery is built on discipline, intentionality, and contribution. When you master your craft, the market rewards you; when you master yourself, the world remembers you.`;

  y = drawWrappedText(page7, chap10Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page7, "Chapters 8, 9 & 10", 7, 10);

  // -------------------------------------------------------------
  // CHAPTER 11, 12, 13: DISCOVERY, TRANSFORMATION & LEGACY POSITIONING (Page 8)
  // -------------------------------------------------------------
  const page8 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page8.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page8.drawText("CHAPTER 11 & 12 | Discovery, Learning & Trade Transformation", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap1112Body = `"Knowledge is potential power; execution is where the magic happens." (Tony Robbins).

Trade is the platform, but transformation is the product. Focus on creating long-term, lasting value that changes lives beyond basic transaction.`;

  y = drawWrappedText(page8, chap1112Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  y -= 20;

  page8.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: primaryRed });
  page8.drawText("CHAPTER 13 | Mastery of Positioning for Legacy", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap13Body = `"Positioning is what separates those who are remembered from those who are forgotten." Operate on 3 levels: Personal Positioning (owning identity), Professional Positioning (standing out), and Legacy Positioning (designing long-term impact).`;

  y = drawWrappedText(page8, chap13Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page8, "Chapters 11, 12 & 13", 8, 10);

  // -------------------------------------------------------------
  // CHAPTER 14, 15 & ABOUT THE AUTHOR (Page 9 & 10)
  // -------------------------------------------------------------
  const page9 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page9.drawRectangle({ x: 50, y: y - 28, width: 512, height: 35, color: darkCharcoal });
  page9.drawText("CHAPTER 14 & 15 | Persistence, Momentum & Generosity", { x: 65, y: y - 16, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  y -= 50;

  const chap1415Body = `"Persistence is the price of greatness—it's what separates dreamers from doers." (Myron Golden). "Momentum is power. When you create it, you become unstoppable." (Tony Robbins).

Generosity is the heartbeat of legacy. "The more you give, the more room you create to receive." (Myron Golden). When you lead with generosity and serve at the highest level, the universe conspires to reward you.`;

  y = drawWrappedText(page9, chap1415Body, fontHelvetica, 9.5, textDark, 50, y, 512, 14.5);
  addPageDecorations(page9, "Chapters 14 & 15", 9, 10);

  // Page 10: About the Author
  const page10 = pdfDoc.addPage([612, 792]);
  y = height - 70;

  page10.drawRectangle({ x: 50, y: y - 120, width: 512, height: 120, color: primaryRed });
  page10.drawText("ABOUT THE AUTHOR", { x: 70, y: y - 40, size: 18, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  page10.drawText("Zeki Faith — Architect of Transformation and Innovation", { x: 70, y: y - 65, size: 11, font: fontHelveticaBold, color: rgb(1, 1, 1) });
  page10.drawText("Mindvest Publishing House", { x: 70, y: y - 85, size: 10, font: fontHelvetica, color: rgb(0.95, 0.9, 0.9) });
  y -= 150;

  const authorBio = `Zeki Faith is a distinguished architect, transformational trainer, and visionary entrepreneur dedicated to shaping both the physical and human landscape. As the founder of Lifebuild Innovators, Unova Consulting, Unova Designs, and Yonan Technologies, he seamlessly blends creativity, strategy, and innovation to drive meaningful change across industries.

Beyond his architectural expertise, Zeki is a catalyst for personal and professional growth. He is the facilitator of the "3 Steps Transformational Journey Blueprint," a structured pathway to unlocking human potential, and the creator of "Becoming a Person of Interest," a program designed to empower individuals to establish influence, relevance, and impact in their fields.

With a deep commitment to excellence and value-driven leadership, Zeki Faith is on a mission to equip individuals and organizations with the tools they need to build, innovate, and thrive in an ever-evolving world.`;

  y = drawWrappedText(page10, authorBio, fontHelvetica, 10, textDark, 50, y, 512, 16);
  addPageDecorations(page10, "About the Author", 10, 10);

  const pdfBytes = await pdfDoc.save();
  const targetPath = path.join(__dirname, '..', 'public', 'documents', '8-qa-to-selling.pdf');

  fs.writeFileSync(targetPath, pdfBytes);

  console.log('8-qa-to-selling PDF successfully generated at:', targetPath);
}

generate8QASellingPDF().catch(err => console.error(err));
