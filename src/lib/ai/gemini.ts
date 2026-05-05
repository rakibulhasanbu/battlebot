import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import type { FightPrediction } from '@/types/prediction';
import type { Robot } from '@/types/robot';
import type { SocialData } from '@/types/social';
import { winRate, weaponLabel } from '@/lib/utils/format';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    winner: { type: SchemaType.STRING },
    winnerSlug: { type: SchemaType.STRING },
    loser: { type: SchemaType.STRING },
    winProbability: { type: SchemaType.NUMBER },
    reasoning: { type: SchemaType.STRING },
    factors: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          category: { type: SchemaType.STRING },
          robotAScore: { type: SchemaType.NUMBER },
          robotBScore: { type: SchemaType.NUMBER },
          explanation: { type: SchemaType.STRING },
        },
        required: ['category', 'robotAScore', 'robotBScore', 'explanation'],
      },
    },
    fanMomentum: {
      type: SchemaType.OBJECT,
      properties: {
        robotA: { type: SchemaType.STRING },
        robotB: { type: SchemaType.STRING },
        impact: { type: SchemaType.STRING },
      },
      required: ['robotA', 'robotB', 'impact'],
    },
    dramaticMoment: { type: SchemaType.STRING },
    confidenceLevel: { type: SchemaType.STRING },
  },
  required: [
    'winner', 'winnerSlug', 'loser', 'winProbability', 'reasoning',
    'factors', 'fanMomentum', 'dramaticMoment', 'confidenceLevel',
  ],
};

const SYSTEM_PROMPT = `You are an expert BattleBots combat analyst with deep knowledge of robot combat engineering,
fight history, weapon mechanics, and armor materials. You analyze robot specifications, fight records, and fan
sentiment to deliver accurate, data-driven predictions with dramatic flair. Your analysis considers weapon matchups,
historical performance, team engineering skill, and current fan hype. Be specific and dramatic but grounded in data.`;

export async function predictFight(
  robotA: Robot,
  socialA: SocialData,
  robotB: Robot,
  socialB: SocialData
): Promise<FightPrediction> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.7,
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  const prompt = `Analyze this BattleBots fight and predict the winner with dramatic detail.

## ROBOT A: ${robotA.name}
- Weapon: ${weaponLabel(robotA.weapon_type)}
- Record: ${robotA.wins}W - ${robotA.losses}L (${winRate(robotA.wins, robotA.losses)}% win rate)
- Team: ${robotA.team}
- Reddit sentiment score: ${socialA.avgRedditSentiment.toFixed(2)} (-1 to 1 scale)
- Reddit mentions this week: ${socialA.redditMentions7d}
- YouTube fan reaction: ${socialA.youtubeCommentCount} videos, ${socialA.totalYoutubeLikes} likes
${socialA.topRedditPosts.slice(0, 2).map((p) => `- Fan post: "${p.title}"`).join('\n')}
${socialA.topYoutubeVideos.slice(0, 2).map((v) => `- Fight video: "${v.title}" (${v.views.toLocaleString()} views)`).join('\n')}

## ROBOT B: ${robotB.name}
- Weapon: ${weaponLabel(robotB.weapon_type)}
- Record: ${robotB.wins}W - ${robotB.losses}L (${winRate(robotB.wins, robotB.losses)}% win rate)
- Team: ${robotB.team}
- Reddit sentiment score: ${socialB.avgRedditSentiment.toFixed(2)} (-1 to 1 scale)
- Reddit mentions this week: ${socialB.redditMentions7d}
- YouTube fan reaction: ${socialB.youtubeCommentCount} videos, ${socialB.totalYoutubeLikes} likes
${socialB.topRedditPosts.slice(0, 2).map((p) => `- Fan post: "${p.title}"`).join('\n')}
${socialB.topYoutubeVideos.slice(0, 2).map((v) => `- Fight video: "${v.title}" (${v.views.toLocaleString()} views)`).join('\n')}

## INSTRUCTIONS
Predict the winner. Consider: weapon matchup, historical records, community hype, and how ${robotA.name}'s ${weaponLabel(robotA.weapon_type)}
performs against ${robotB.name}'s ${weaponLabel(robotB.weapon_type)}.

For the "factors" array, include exactly these 4 categories: "Weapon Effectiveness", "Armor & Durability", "Mobility & Control", "Fight History".

For "fanMomentum", use one of: "strong", "moderate", or "weak" for each robot.

For "confidenceLevel", use: "high" if win rate difference > 20%, "medium" if 10-20%, "low" if < 10%.

For "winnerSlug", use the robot's name converted to lowercase with hyphens replacing spaces.

Make "dramaticMoment" a vivid one-liner about how the fight ends (e.g. "Tombstone's blade tears through End Game's chassis at full speed, sending sparks across the arena at the 2-minute mark").

Return valid JSON matching the schema exactly.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text) as FightPrediction;
}
