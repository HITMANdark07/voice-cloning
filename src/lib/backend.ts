import { Voice } from "@/types";
import { History } from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.elevenlabs.io/v1",
  headers: { "xi-api-key": process.env.NEXT_PUBLIC_APP_API_KEY },
});

export const getVoices = async () => {
  try {
    const { data } = await api({
      method: "GET",
      url: "/voices",
    });
    const voices = data.voices.filter(
      (voice: any) => voice.category === "cloned"
    );
    return voices as Voice[];
  } catch (err) {
    console.log(err);
  }
};

export const getHistory = async () => {
  try {
    const { data } = await api({
      method: "GET",
      url: `/history?page_size=1000`,
    });
    const history = data.history as History[];
    return history.reverse();
  } catch (err) {
    console.log(err);
  }
};

export const textToSpeech = async (
  voice_id: string,
  text: string
): Promise<Boolean> => {
  try {
    await api({
      method: "POST",
      url: `/text-to-speech/${voice_id}?optimize_streaming_latency=0&output_format=mp3_44100_128`,
      data: {
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0,
          similarity_boost: 0,
          style: 0,
          use_speaker_boost: true,
        },
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const createVoice = async (body: FormData) => {
  try {
    await api({
      method: "POST",
      url: `/voices/add`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: body,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
