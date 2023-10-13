import { History } from "@/types";
import React, { useEffect, useState } from "react";

function HistoryAudio({ history }: { history: History }) {
  const [url, setUrl] = useState<string>("");
  const init = async (history_id: string) => {
    try {
      const data = await fetch(
        "https://api.elevenlabs.io/v1/history/" + history_id + "/audio",
        {
          headers: {
            "xi-api-key": process.env.NEXT_PUBLIC_APP_API_KEY as string,
            accept: "audio/mpeg",
          },
        }
      );
      const blob = await data.blob();
      const _url = URL.createObjectURL(blob);
      setUrl(_url);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (history.history_item_id) {
      init(history.history_item_id);
    }
  }, [history.history_item_id]);
  return (
    <div className="flex flex-col gap-3 bg-purple-500 p-4 rounded-lg">
      <div>{history.text}</div>
      <audio controls src={url} />
    </div>
  );
}

export default HistoryAudio;
