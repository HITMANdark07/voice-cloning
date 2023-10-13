"use client";
import "regenerator-runtime/runtime";
import HistoryAudio from "@/components/common/HistoryAudio";
import { getHistory, getVoices, textToSpeech } from "@/lib/backend";
import { History, Voice } from "@/types";
import { AiFillAudio } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import AddVoiceForm from "@/components/common/AddVoiceForm";

export default function Home() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [histories, setHistories] = useState<History[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [loading, setLoading] = useState<boolean>(false);
  const lastMessage = useRef<HTMLDivElement>(null);
  const addVoiceModal = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState<string>("");
  const getAllClonedVoices = async () => {
    const _voices = await getVoices();
    if (_voices) setVoices(_voices);
  };
  const getHistoryMessages = async () => {
    const _history = await getHistory();
    if (_history) setHistories(_history);
  };
  useEffect(() => {
    getAllClonedVoices();
    getHistoryMessages();
  }, []);

  const callTextToSpeech = async () => {
    try {
      setLoading(true);
      const gotResponse = await textToSpeech(selectedVoice, text);
      if (gotResponse) {
        getHistoryMessages();
        resetTranscript();
        setText("");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [histories]);

  useEffect(() => {
    if (transcript) setText(transcript);
  }, [transcript]);
  return (
    <div className="flex text-white relative w-full h-[100vh] flex-row">
      <div className="w-[300px] bg-purple-800 p-3 flex flex-col absolute top-0 left-0 h-[100vh]">
        <div className="font-semibold text-2xl self-center">Chats Voices</div>
        <div className="flex h-full flex-col my-10 gap-4 ">
          {voices.map((voice) => (
            <div
              className={`${
                voice.voice_id === selectedVoice && "bg-white text-purple-800"
              } border-2 cursor-pointer p-4 py-2 rounded-lg font-semibold`}
              key={voice.voice_id}
              onClick={() => {
                setSelectedVoice(voice.voice_id);
              }}
            >
              {voice.name}
            </div>
          ))}
        </div>
        {/* modal  */}
        <button
          className="btn"
          onClick={() => {
            if (addVoiceModal.current) {
              addVoiceModal.current.showModal();
            }
          }}
        >
          Add Voice
        </button>
        <dialog ref={addVoiceModal} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-2xl">Add Voice</h3>
            <AddVoiceForm
              getAllClonedVoices={getAllClonedVoices}
              voiceModal={addVoiceModal}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        {/* modal  */}
      </div>
      <div className="flex flex-col justify-between ml-[300px] p-4  w-full bg-purple-400 h-[100vh]">
        <div className="flex h-[85vh] my-3 overflow-scroll  flex-col gap-4">
          {histories.map((history) => (
            <HistoryAudio history={history} key={history.history_item_id} />
          ))}
          <div ref={lastMessage} />
        </div>
        <div className="flex flex-col gap-2">
          {text.length > 50 && !loading && (
            <button
              onClick={callTextToSpeech}
              className="bg-purple-800 p-4 py-3 rounded-lg self-center text-white"
            >
              convert to speech
            </button>
          )}
          <div className="flex gap-2">
            <textarea
              rows={1}
              value={text}
              disabled={selectedVoice === "" || loading}
              onChange={(e) => setText(e.target.value)}
              placeholder="text-to-speech"
              className="w-full bg-purple-100 text-purple-950 px-4 py-3 rounded-lg"
            />
            {loading ? (
              <div className="animate-spin bg-purple-800 p-4 rounded-full">
                <ImSpinner9 color="#ffffff" />
              </div>
            ) : (
              <>
                {listening ? (
                  <div
                    className="relative cursor-pointer"
                    onClick={() => {
                      if (selectedVoice !== "")
                        SpeechRecognition.stopListening();
                    }}
                  >
                    <button className="absolute top-0 left-0 animate-ping bg-red-800  rounded-full p-4">
                      <AiFillAudio size={20} color="#ffffff" />
                    </button>
                    <button className=" bg-red-800  rounded-full p-4">
                      <AiFillAudio size={20} color="#ffffff" />
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={selectedVoice === ""}
                    onClick={() => {
                      SpeechRecognition.startListening();
                    }}
                    className={`bg-purple-800 disabled:bg-gray-500 disabled:cursor-not-allowed   rounded-full p-4`}
                  >
                    <AiFillAudio color="#ffffff" size={20} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
