const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generateEzraPDF() {
  const pdfDoc = await PDFDocument.create();
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontHelveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Page 1
  const page1 = pdfDoc.addPage([612, 792]); // Letter size (8.5 x 11 in)
  const { width, height } = page1.getSize();

  // Primary colors
  const primaryEmerald = rgb(0.01, 0.35, 0.25); // Deep emerald #025940
  const accentBlue = rgb(0.2, 0.5, 0.9); // #3380e6
  const textDark = rgb(0.1, 0.12, 0.15); // #1a1f26
  const textMuted = rgb(0.35, 0.4, 0.45);
  const bgLightBox = rgb(0.95, 0.97, 0.96);
  const lineBorder = rgb(0.85, 0.9, 0.88);

  // Header Banner Page 1
  page1.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: primaryEmerald,
  });

  page1.drawText("ORIGIN BY MINDVEST", {
    x: 40,
    y: height - 40,
    size: 9,
    font: fontHelveticaBold,
    color: rgb(0.8, 0.95, 0.9),
  });

  page1.drawText("The Ezra Rebuild Mindset", {
    x: 40,
    y: height - 70,
    size: 24,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText("Becoming the Ezra of Your Generation | Rebuilding Life, Business & Community", {
    x: 40,
    y: height - 95,
    size: 11,
    font: fontHelvetica,
    color: rgb(0.7, 0.9, 0.85),
  });

  let currentY = height - 150;

  // Introduction section
  page1.drawText("Listen —", {
    x: 40,
    y: currentY,
    size: 14,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 20;

  const introText1 = "Rebuilding is never easy. You'll question your strength, your timing, and your worth. You'll be tempted to walk away, to call your failure final, to scroll through success stories and ask, \"Why not me?\" But hear me — rebuilding is not punishment. It's an invitation. It's God whispering, \"Let Me build it again, this time with you fully awake.\"";

  const drawWrappedText = (page, text, font, size, color, startX, startY, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let y = startY;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth > maxWidth && i > 0) {
        page.drawText(line, { x: startX, y: y, size: size, font: font, color: color });
        line = words[i] + ' ';
        y -= lineHeight;
      } else {
        line = testLine;
      }
    }
    page.drawText(line, { x: startX, y: y, size: size, font: font, color: color });
    return y - lineHeight;
  };

  currentY = drawWrappedText(page1, introText1, fontHelvetica, 10.5, textDark, 40, currentY, 532, 15);
  currentY -= 8;

  const introText2 = "Ezra didn't rebuild Jerusalem's walls — he rebuilt its mindset. He transformed a culture that had forgotten truth into a generation that walked in conviction. He was not a king or soldier — he was a teacher, a reformer, a restorer of inner order.";
  currentY = drawWrappedText(page1, introText2, fontHelvetica, 10.5, textDark, 40, currentY, 532, 15);
  currentY -= 20;

  // Draw separator line
  page1.drawLine({
    start: { x: 40, y: currentY },
    end: { x: 572, y: currentY },
    thickness: 1,
    color: lineBorder,
  });
  currentY -= 25;

  // Pillar 1
  page1.drawText("1 | From Collapse to Clarity — \"Rebuild Your Inner Blueprint\"", {
    x: 40,
    y: currentY,
    size: 13,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 18;

  const pillar1Text = "Ezra didn't start rebuilding temples — he started rebuilding truth. He asked the people, \"Who have we become?\" Before you rebuild your brand, your business, your marriage, or your faith, ask: \"Who have I become — and what do I believe now?\"\nClarity births direction. The rebuilding of your world begins with the renovation of your inner world.";
  
  const p1Lines = pillar1Text.split('\n');
  for (let lineText of p1Lines) {
    currentY = drawWrappedText(page1, lineText, fontHelvetica, 10, textDark, 40, currentY, 532, 14);
  }
  currentY -= 6;

  // Key Thought Box 1
  page1.drawRectangle({
    x: 40,
    y: currentY - 22,
    width: 532,
    height: 28,
    color: bgLightBox,
    borderColor: lineBorder,
    borderWidth: 1,
  });
  page1.drawText("Key Thought: You can't build a new life with an old mindset.", {
    x: 52,
    y: currentY - 11,
    size: 9.5,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 42;

  // Pillar 2
  page1.drawText("2 | From Pollution to Purity — \"Clean the Mental Altars\"", {
    x: 40,
    y: currentY,
    size: 13,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 18;

  const pillar2Text = "Ezra saw people mixing sacred with ordinary, holy with hollow. That's what happens when we let culture corrupt our convictions. We start to trade depth for speed, peace for popularity, and purpose for pleasure.\nPurity of mind produces clarity of decision. Detox your thoughts. Remove mental debt, emotional clutter, and spiritual confusion.";
  
  const p2Lines = pillar2Text.split('\n');
  for (let lineText of p2Lines) {
    currentY = drawWrappedText(page1, lineText, fontHelvetica, 10, textDark, 40, currentY, 532, 14);
  }
  currentY -= 6;

  // Key Thought Box 2
  page1.drawRectangle({
    x: 40,
    y: currentY - 22,
    width: 532,
    height: 28,
    color: bgLightBox,
    borderColor: lineBorder,
    borderWidth: 1,
  });
  page1.drawText("Key Thought: The first wealth is a clean mind.", {
    x: 52,
    y: currentY - 11,
    size: 9.5,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 42;

  // Pillar 3
  page1.drawText("3 | From Emotion to Intention — \"Recommit to Your Purpose\"", {
    x: 40,
    y: currentY,
    size: 13,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 18;

  const pillar3Text = "Ezra didn't rebuild with excitement — he rebuilt with endurance. Transformation isn't about hype; it's about habit. You don't change because you feel like it; you change because you're called to it.";
  currentY = drawWrappedText(page1, pillar3Text, fontHelvetica, 10, textDark, 40, currentY, 532, 14);
  currentY -= 6;

  // Key Thought Box 3
  page1.drawRectangle({
    x: 40,
    y: currentY - 22,
    width: 532,
    height: 28,
    color: bgLightBox,
    borderColor: lineBorder,
    borderWidth: 1,
  });
  page1.drawText("Key Thought: Purpose without commitment is just potential on pause.", {
    x: 52,
    y: currentY - 11,
    size: 9.5,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });

  // Footer Page 1
  page1.drawText("Origin by Mindvest • Free Blueprint Series", {
    x: 40,
    y: 25,
    size: 8,
    font: fontHelvetica,
    color: textMuted,
  });
  page1.drawText("Page 1 of 2", {
    x: 525,
    y: 25,
    size: 8,
    font: fontHelvetica,
    color: textMuted,
  });


  // PAGE 2
  const page2 = pdfDoc.addPage([612, 792]);

  // Header Banner Page 2
  page2.drawRectangle({
    x: 0,
    y: height - 60,
    width: width,
    height: 60,
    color: primaryEmerald,
  });

  page2.drawText("ORIGIN BY MINDVEST | THE EZRA REBUILD MINDSET", {
    x: 40,
    y: height - 38,
    size: 11,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  currentY = height - 90;

  // Pillar 4
  page2.drawText("4 | From Noise to Order — \"Reform Your Environment\"", {
    x: 40,
    y: currentY,
    size: 13,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 18;

  const pillar4Text = "Ezra restructured the people's associations — because no matter how strong your conviction, you can't grow in an environment that drains you. Change your circle. Reorganize your workspace. Silence what distracts you.";
  currentY = drawWrappedText(page2, pillar4Text, fontHelvetica, 10, textDark, 40, currentY, 532, 14);
  currentY -= 6;

  // Key Thought Box 4
  page2.drawRectangle({
    x: 40,
    y: currentY - 22,
    width: 532,
    height: 28,
    color: bgLightBox,
    borderColor: lineBorder,
    borderWidth: 1,
  });
  page2.drawText("Key Thought: Rebuilding demands order — not noise.", {
    x: 52,
    y: currentY - 11,
    size: 9.5,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 45;

  // Pillar 5
  page2.drawText("5 | From Pressure to Power — \"Reignite Your Faith and Fire\"", {
    x: 40,
    y: currentY,
    size: 13,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 18;

  const pillar5Text = "When the temple's foundation was laid, Ezra led the people in worship. They praised — not because it was finished, but because they had started again. God uses pressure to reveal power.";
  currentY = drawWrappedText(page2, pillar5Text, fontHelvetica, 10, textDark, 40, currentY, 532, 14);
  currentY -= 6;

  // Key Thought Box 5
  page2.drawRectangle({
    x: 40,
    y: currentY - 22,
    width: 532,
    height: 28,
    color: bgLightBox,
    borderColor: lineBorder,
    borderWidth: 1,
  });
  page2.drawText("Key Thought: Rebuilding isn't about recovering what you lost — it's about discovering what was always inside you.", {
    x: 52,
    y: currentY - 11,
    size: 8.5,
    font: fontHelveticaBold,
    color: primaryEmerald,
  });
  currentY -= 45;

  // Separator Line
  page2.drawLine({
    start: { x: 40, y: currentY },
    end: { x: 572, y: currentY },
    thickness: 1,
    color: lineBorder,
  });
  currentY -= 25;

  // Final Word Section
  page2.drawRectangle({
    x: 40,
    y: currentY - 190,
    width: 532,
    height: 190,
    color: rgb(0.96, 0.98, 1),
    borderColor: rgb(0.75, 0.85, 0.98),
    borderWidth: 1.5,
  });

  page2.drawText("FINAL WORD — THE EZRA REBUILD MINDSET", {
    x: 60,
    y: currentY - 30,
    size: 12,
    font: fontHelveticaBold,
    color: rgb(0.1, 0.35, 0.8),
  });

  const finalWord1 = "If your world has fallen apart, it's not over — it's under construction. You are not behind time; you are being rebuilt for your appointed time. Ezra didn't just raise a city — he raised a standard.";
  let boxY = currentY - 50;
  boxY = drawWrappedText(page2, finalWord1, fontHelvetica, 10, textDark, 60, boxY, 492, 14);
  boxY -= 10;

  const finalWord2 = "Rise. Not just to rebuild what was, but to become who you were always meant to be — renewed in mind, refined in faith, and reborn in purpose.";
  boxY = drawWrappedText(page2, finalWord2, fontHelveticaBold, 10, textDark, 60, boxY, 492, 14);
  boxY -= 12;

  const finalWord3 = "Because the true wealth, the true success, the true rebuilding — begins within.";
  boxY = drawWrappedText(page2, finalWord3, fontHelveticaOblique, 10.5, primaryEmerald, 60, boxY, 492, 14);

  // Footer Page 2
  page2.drawText("Origin by Mindvest • www.sof-beta.vercel.app", {
    x: 40,
    y: 25,
    size: 8,
    font: fontHelvetica,
    color: textMuted,
  });
  page2.drawText("Page 2 of 2", {
    x: 525,
    y: 25,
    size: 8,
    font: fontHelvetica,
    color: textMuted,
  });

  const pdfBytes = await pdfDoc.save();
  const targetPath1 = path.join(__dirname, '..', 'public', 'documents', 'a-free-guide-to-rebuilding.pdf');
  const targetPath2 = path.join(__dirname, '..', 'public', 'documents', 'the-ezra-rebuild-mindset.pdf');

  fs.writeFileSync(targetPath1, pdfBytes);
  fs.writeFileSync(targetPath2, pdfBytes);

  console.log('PDF successfully generated at:', targetPath1);
}

generateEzraPDF().catch(err => console.error(err));
