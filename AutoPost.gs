const GEMINI_API = PropertiesService.getScriptProperties().getProperty("GEMINI_API");
const CLIENT_ID = PropertiesService.getScriptProperties().getProperty("CLIENT_ID")
const CLIENT_SECRET = PropertiesService.getScriptProperties().getProperty("CLIENT_SECRET")

function getService() {
  pkceChallengeVerifier();
  const userProps = PropertiesService.getUserProperties();
  const scriptProps = PropertiesService.getScriptProperties();
  return OAuth2.createService('twitter')
    .setAuthorizationBaseUrl('https://twitter.com/i/oauth2/authorize')
    .setTokenUrl('https://api.twitter.com/2/oauth2/token?code_verifier=' + userProps.getProperty("code_verifier"))
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(userProps)
    .setScope('users.read tweet.read tweet.write offline.access')
    .setParam('response_type', 'code')
    .setParam('code_challenge_method', 'S256')
    .setParam('code_challenge', userProps.getProperty("code_challenge"))
    .setTokenHeaders({
      'Authorization': 'Basic ' + Utilities.base64Encode(CLIENT_ID + ':' + CLIENT_SECRET),
      'Content-Type': 'application/x-www-form-urlencoded'
    })
}

function authCallback(request) {
  const service = getService();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}

function pkceChallengeVerifier() {
  var userProps = PropertiesService.getUserProperties();
  if (!userProps.getProperty("code_verifier")) {
    var verifier = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

    for (var i = 0; i < 128; i++) {
      verifier += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    var sha256Hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, verifier)

    var challenge = Utilities.base64Encode(sha256Hash)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    userProps.setProperty("code_verifier", verifier)
    userProps.setProperty("code_challenge", challenge)
  }
}

function logRedirectUri() {
  var service = getService();
  Logger.log(service.getRedirectUri());
}

function main() {
  var payload = {
    text: gaslog_GeminiPro()
  }

  var service = getService();
  if (service.hasAccess()) {
    var url = `https://api.twitter.com/2/tweets`;
    var response = UrlFetchApp.fetch(url, {
      method: 'POST',
      'contentType': 'application/json',
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      },
      muteHttpExceptions: true,
      payload: JSON.stringify(payload)
    });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',authorizationUrl);
  }
}

function gaslog_GeminiPro() {
// 基本的な設定とデータ
const LOCATIONS = {
  cities: [
      // 北海道
      { name: "札幌", features: ["時計台", "ラーメン", "雪まつり"] },
      { name: "函館", features: ["夜景", "朝市", "いか"] },
      // 東北
      { name: "青森", features: ["ねぶた祭り", "りんご", "帆立"] },
      { name: "仙台", features: ["牛タン", "七夕祭り", "松島"] },
      // 関東
      { name: "東京", features: ["スカイツリー", "渋谷", "秋葉原"] },
      { name: "横浜", features: ["中華街", "みなとみらい", "赤レンガ倉庫"] },
      // 中部
      { name: "名古屋", features: ["味噌カツ", "城", "テレビ塔"] },
      { name: "金沢", features: ["兼六園", "21世紀美術館", "近江町市場"] },
      // 関西
      { name: "京都", features: ["金閣寺", "清水寺", "嵐山"] },
      { name: "大阪", features: ["通天閣", "道頓堀", "たこ焼き"] },
      // 中国
      { name: "広島", features: ["宮島", "お好み焼き", "原爆ドーム"] },
      { name: "松江", features: ["出雲大社", "宍道湖", "抹茶"] },
      // 四国
      { name: "高知", features: ["カツオ", "よさこい祭り", "四万十川"] },
      { name: "松山", features: ["道後温泉", "みかん", "城"] },
      // 九州
      { name: "福岡", features: ["太宰府", "ラーメン", "博多どんたく"] },
      { name: "長崎", features: ["端島", "グラバー園", "稲佐山"] },
      // 沖縄
      { name: "那覇", features: ["首里城", "国際通り", "漫湖"] },
      { name: "石垣島", features: ["マンタ", "星空", "八重山そば"] }
  ],
  localAreas: [
      "松川村",
      "安曇野",
      "白馬村",
      "大町市",
      "松本市",
      "佐久市"
  ]
};

class TsuneGenerator {
  constructor() {
      this.friends = [
        "迎",
        "はやちゃん",
        "hgzt",
        "popo",
        "泥散らす",
        "take",
        "ドラガジェ",
        "さっきー",
        "ガジェ中",
        "四六五五",
        "ナカネ"
      ];
      this.devices = [
        "iPhone 16 Pro",
        "Xperia 1 VI",
        "Galaxy S24 Ultra",
        "Vivo X200",
        "Oppo Find X8",
        "Xiaomi 14 Ultra",
        "Xiaomi Mix Fold 4",
        "Huawei P60 Pro",
        "Vivo X90 Pro+",
        "AQUOS R9 pro",
        "AQUOS sense9",
        "motorola edge 50s pro",
        "arrows We2 Plus",
        "Zenfone 11 Ultra"
      ];
      this.favorites = ["トロピカルジュース", "焼き米", "わかめうどん"];
  }

  // 現在の日時情報を取得
  getCurrentTimeInfo() {
      const now = new Date();
      const hours = now.getHours();
      const timeOfDay = 
          hours >= 5 && hours < 12 ? "朝" :
          hours >= 12 && hours < 17 ? "昼" :
          hours >= 17 && hours < 20 ? "夕方" : "夜";

      return {
          time: now.toLocaleTimeString('ja-JP'),
          dayOfWeek: new Intl.DateTimeFormat('ja-JP', { weekday: 'long' }).format(now),
          month: now.getMonth() + 1,
          timeOfDay: timeOfDay
      };
  }

  // 季節を取得
  getSeason(month) {
      if (month >= 3 && month <= 5) return '春';
      if (month >= 6 && month <= 8) return '夏';
      if (month >= 9 && month <= 11) return '秋';
      return '冬';
  }

  // ランダムな要素を取得
  getRandomElement(array) {
      return array[Math.floor(Math.random() * array.length)];
  }

  // 旅行先を生成
  generateDestination() {
      const useLocalArea = Math.random() < 0.2; // 20%の確率で地元エリア
      if (useLocalArea) {
          return {
              name: this.getRandomElement(LOCATIONS.localAreas),
              features: ["自然", "のんびり", "田舎"]
          };
      }
      return this.getRandomElement(LOCATIONS.cities);
  }

  // プロンプトを生成
  generatePrompt() {
      const timeInfo = this.getCurrentTimeInfo();
      const season = this.getSeason(timeInfo.month);
      const destination = this.generateDestination();
      const friend = this.getRandomElement(this.friends);
      const device = this.getRandomElement(this.devices);
      const food = this.getRandomElement(this.favorites);
      const feature = this.getRandomElement(destination.features);

      return `
# システム情報
現在の状況：
- 時刻: ${timeInfo.time}
- 曜日: ${timeInfo.dayOfWeek}
- 時間帯: ${timeInfo.timeOfDay}
- 季節: ${season}
- 旅行先: ${destination.name}
- 旅行先の特徴: ${feature}

# キャラクター設定：ツネ
- 基本設定：自然豊かな松川村在住の旅好き
- 口調：「ツーネツネツネ！」で始まり「ツネ！」で終わる
- 性格：陽気で予測不能な行動をする

# コンテキスト情報
- 共に遊ぶ友達: ${friend}
- 使用するデバイス: ${device}
- 今食べたい好物: ${food}

# 応答ルール
1. 必ず短い1文で回答
2. 現在時刻(${timeInfo.time})を考慮した内容、ただし時刻そのものは出力しない
3. バカっぽく予測できない奇想天外な展開
4. ${destination.name}の特徴(${feature})を含める
5. 与えられた要素を2つ以上使用

# 応答例
- ツーネツネツネ！${timeInfo.timeOfDay}の${destination.name}で${friend}と${feature}を${device}で撮影しながら逆立ち散歩するツネ！
- ツーネツネツネ！${season}の${destination.name}で${food}を食べながら${feature}でスカイダイビングするツネ！
- ツーネツネツネ！${destination.name}の${feature}で${friend}と一緒に${device}を投げて輪投げ大会を開催するツネ！

応答を生成してください。`;
  }
}

// 使用
const generator = new TsuneGenerator();
const prompt = generator.generatePrompt();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API}`
        , payload = {
            'contents': [
              {
                'parts': [{
                  'text': prompt
                }]
              }
            ],
            'generationConfig':{
              "temperature": 1.5,
              "topP": 0.97,
              "topK": 50
            },
           "safetySettings": [
             {         
               "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
               "threshold": "BLOCK_NONE"
             },
             {
               "category": "HARM_CATEGORY_HATE_SPEECH",
               "threshold": "BLOCK_NONE"
             },
             {
               "category": "HARM_CATEGORY_HARASSMENT",
               "threshold": "BLOCK_NONE"
             },
             {
               "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
               "threshold": "BLOCK_NONE"
             }
            ]
          }
        , options = {
            'method': 'post',
            'contentType': 'application/json',
            'payload': JSON.stringify(payload)
          };

  const res = UrlFetchApp.fetch(url, options)
        , resJson = JSON.parse(res.getContentText());

  // responseがちゃんと返ってきていることを確認
  if (resJson && resJson.candidates && resJson.candidates.length > 0) {
    /** 以下の位置を取得
    {
      "candidates": [
      {
        "content": {
        "parts": [
        {
          "text": 
    */
    console.log(resJson.candidates[0].content.parts[0].text);
    return resJson.candidates[0].content.parts[0].text
  } else {
    // HARM_CATEGORYによって、無回答の場合も多々あり
    console.log('回答が返されませんでした。');
    return false
  }
}

function judge_hour() {
  const time = new Date();
  
  //ポスト時間の数字範囲を判定する正規表現
  const regWorkHours =  /^(12|1[5-9]|2[0-3]|[7-9])$/; 
  //const regWorkHours =  /^(30)$/; 

  if (regWorkHours.test(time.getHours())) {
    Logger.log('ポスト時間内')

    //実行したい関数を以下に記載
    main()
  }
}
