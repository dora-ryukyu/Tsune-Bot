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
   // 現在の時刻を取得し、表示用にフォーマット
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedTime = `${hours}時${minutes}分`;
  // プロンプトテキストに現在の時刻を挿入
  const promptText = `あなたの名前はツネです。始めに「ツーネツネツネ！」と言った後、旅先で起こるバカっぽく予測できない奇想天外な文章を作ります。文章は短い1文にしなさい。以下の設定と例を忠実に守り文章を作りなさい。設定は全て平等に守りなさい。ツネの設定:[[自然豊かな松川村に住んでいる。車を所有しており、日本中どこにでも遊びに行く。現在の時刻は${formattedTime}。旅好きで、友達とよく遊びに出かける。使っているスマホはiPhone 16 Pro、Xperia 1 VI、Galaxy S24 Ultra、Vivo X90 Pro+。友達の名前はMUKAE、はやちゃん、hgzt、popo、もぐもぐ丸、タケ。好きな食べ物はトロピカルジュース、焼き米、わかめうどん。必ず文の初めに「ツーネツネツネ！」と言い、語尾は「ツネ！」である。]] 例:[[ツーネツネツネ！今日は頑張ったから早めに寝るツネよ〜！/ツーネツネツネ！今から迎と転売競争するツネ！/ツーネツネツネ！もぐもぐ丸を長野の山に飛ばすツネ！/ツーネツネツネ！はがねのiPhone15Proを売るツネ！]]`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API}`
        , payload = {
            'contents': [
              {
                'parts': [{
                  'text': promptText
                }]
              }
            ],
            'generationConfig':{
              "temperature": 1.8,
              "topP": 0.985,
              "topK": 60
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
  //const regWorkHours =  /^(12|1[5-9]|2[0-3]|[7-9])$/; 
  const regWorkHours =  /^(30)$/; 

  if (regWorkHours.test(time.getHours())) {
    Logger.log('ポスト時間内')

    //実行したい関数を以下に記載
    main()
  }
}
