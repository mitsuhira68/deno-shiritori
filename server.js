import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

let previousWord = "しりとり";
let combo = 0;
let maxc = 0;
let turn = 0;
var list = [];
console.log("Listening on http://localhost:8000");

serve(async (req) => {
  const pathname = new URL(req.url).pathname;

  if (req.method === "GET" && pathname === "/shiritori") {
    return new Response(previousWord);
  }

  if (req.method === "POST" && pathname === "/shiritori") {
    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;

    let hip = (previousWord.charAt(previousWord.length - 1) !== 'ー')?(previousWord.charAt(previousWord.length - 1)):(previousWord.charAt(previousWord.length - 2));
    if (nextWord.length > 0 && hip !== nextWord.charAt(0)) {
      combo = 0;
      return new Response("前の単語に続いていません。", { status: 400 });
    } else if (nextWord.charAt(nextWord.length - 1) === 'ん'||nextWord.charAt(nextWord.length - 1) === 'ン') {
      combo = 0;
      previousWord = "しりとり";
      list.length = 0;
      turn = 0;
      maxc = 0;
      return new Response("GAME OVER" ,{ status: 400 });//status:400 ダイアログを出す
    }else if(nextWord.charAt(nextWord.length - 1) === ''){
    return new Response("文字を入力してください",{status:400});
    }else if(list.includes(nextWord)){
    combo = 0;
    return new Response("一度使用した単語を使うことはできません。", { status: 400 });
    }

    list.push(nextWord);
    previousWord = nextWord;
    combo++;
    maxc = Math.max(maxc,combo);
    turn++;

    return new Response(previousWord + "," + combo + "," + maxc + "," + turn);
  }


  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });

});
