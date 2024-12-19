import { createWorker } from 'tesseract.js';

export async function processGameImage(imageFile: File): Promise<any[]> {
  const worker = await createWorker('fra');
  
  try {
    const imageData = await readFileAsDataURL(imageFile);
    const { data: { text } } = await worker.recognize(imageData);
    
    // Parse the text into rows
    const rows = text.split('\n').filter(row => row.trim().length > 0);
    
    // Extract player data
    const players = rows.map(row => {
      const columns = row.split(/\s+/);
      if (columns.length >= 4) {
        return {
          name: columns[0],
          kills: parseFloat(columns[1]?.replace(',', '.')) || 0,
          assists: parseFloat(columns[2]?.replace(',', '.')) || 0,
          // Les autres statistiques nécessitent une analyse plus poussée de l'image
          timeSpentDead: 0,
          role: "",
          topHeroDamageTeam: false,
          topHeroDamageMatch: false,
          topSiegeDamageTeam: false,
          topSiegeDamageMatch: false,
          topHealingMatch: false,
          topXPContributionTeam: false,
          topXPContributionMatch: false,
          topDamageReceivedTeam: false,
          topDamageReceivedMatch: false,
        };
      }
      return null;
    }).filter(Boolean);

    await worker.terminate();
    return players;
  } catch (error) {
    console.error('Error processing image:', error);
    await worker.terminate();
    throw error;
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}