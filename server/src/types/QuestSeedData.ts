// シード用のJSONの型定義
interface QuestSeedData {
  quests: {
    dialect_mode_id: number;
    sequence_number: number;
    type: number;          // 1: 選択問題, 2: 難読地名
    question: string;
    choices?: {
      id: number;
      content: string;
      is_correct: boolean;
    }[];
    answer?: string;      // type=2の場合のみ使用
  }[];
}


export default QuestSeedData;
