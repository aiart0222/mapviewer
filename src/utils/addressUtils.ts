export const normalizeJapaneseAddress = (address: string): string => {
  if (!address) return '';
  
  let normalized = address
    // 全角英数字を半角に変換
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    // 全角スペースを半角に変換
    .replace(/\u3000/g, ' ')
    // 都道府県の表記を統一
    .replace(/([都道府県])$/g, '$1')
    .replace(/([都道府県])\s/g, '$1')
    // 市区町村の表記を統一
    .replace(/([市区町村])$/g, '$1')
    .replace(/([市区町村])\s/g, '$1')
    // 番地の表記を統一
    .replace(/([0-9０-９]+)[-－﹣−‐⁃‑‒–—﹘―⎯⏤ーｰ─━]/g, '$1-')
    // 不要な空白を削除
    .trim();

  // 住所の先頭に「日本」を追加（ない場合のみ）
  if (!/^日本/.test(normalized)) {
    normalized = `日本 ${normalized}`;
  }

  return normalized;
};

export const validateJapaneseAddress = (address: string): boolean => {
  if (!address) return false;
  
  // 基本的な日本の住所パターンをチェック
  const hasPrefecture = /[都道府県]/.test(address);
  const hasCityOrWard = /[市区町村]/.test(address);
  
  // より厳密なバリデーション
  if (!hasPrefecture || !hasCityOrWard) {
    return false;
  }

  // 住所に含まれる文字が日本語として有効かチェック
  const hasJapaneseCharacters = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(address);
  
  return hasJapaneseCharacters;
};