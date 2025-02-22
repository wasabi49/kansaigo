import { HStack, Text, Image } from "@yamada-ui/react";

/**
 * StatusBadge コンポーネント
 * 
 * アイコンと数値を表示するシンプルなバッジコンポーネント。
 * - 背景色は白、文字色は黒で統一。
 * - 数値 (`count`) は自由に指定可能。
 * - アイコン (`imgSrc`) をカスタマイズして様々な用途に対応。
 *
 * @param {string} imgSrc - バッジに表示するアイコン画像のパス
 * @param {number} count - バッジに表示する数値
 */
const StatusBadge = ({ imgSrc, count }) => {
  return (
    <HStack 
      p="2"  // 外側の余白（padding）
      px="4"  // 横方向の余白（アイコンとテキスト間のスペース確保）
      bg="white"  // 背景色（固定）
      color="black"  // 文字色（固定）
      borderRadius="full"  // 丸みのあるバッジ
      border="2px solid"
      borderColor="black"  // 境界線の色
      spacing="2"  // アイコンとテキストの間隔
      align="center"  // 垂直方向に中央揃え
      minWidth="80px"  // バッジの最小横幅（数値が増えてもレイアウトが崩れないように）
    >
      {/* バッジのアイコン画像（サイズ: 24x24px） */}
      <Image src={imgSrc} alt="status icon" width="24px" height="24px" />

      {/* バッジの数値（フォントサイズ: md、太字） */}
      <Text fontSize="md" fontWeight="bold">{count}</Text>
    </HStack>
  );
};

export default StatusBadge;
