import { createVoice } from "@/lib/backend";
import React, { RefObject, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { useForm } from "react-hook-form";

interface AddVoiceFormData {
  name: string;
  files: FileList;
  description: string;
  accent: string;
  language: string;
}

function AddVoiceForm({
  getAllClonedVoices,
  voiceModal,
}: {
  getAllClonedVoices: () => void;
  voiceModal: RefObject<HTMLDialogElement>;
}) {
  const { handleSubmit, register, reset } = useForm<AddVoiceFormData>({
    mode: "onSubmit",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const submitForm = async (data: AddVoiceFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    for (let i = 0; i < data.files.length; i++) {
      formData.append("files", data.files[i]);
    }
    formData.append("description", data.description);
    const labels = {
      accent: data.accent,
      language: data.language,
    };
    formData.append("labels", JSON.stringify(labels));
    setLoading(true);
    const voiceAdded = await createVoice(formData);
    voiceModal.current?.close();
    reset();
    setLoading(false);
    if (voiceAdded) getAllClonedVoices();
  };
  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="flex my-8  flex-col w-full gap-3"
    >
      <input
        {...register("name", {
          required: true,
        })}
        className="input input-primary"
        placeholder="Voice Name"
      />
      <input
        type="file"
        multiple
        accept="audio/*"
        {...register("files", {
          required: true,
        })}
        className="file-input file-input-bordered file-input-info w-full max-w-xs"
        placeholder="Audio Files"
      />
      <input
        {...register("description", {
          required: true,
        })}
        className="input input-primary"
        placeholder="Voice Description"
      />
      <input
        {...register("accent", {
          required: true,
        })}
        className="input input-primary"
        placeholder="Voice Accent (ex: Indian/Amarican/Chinese)"
      />
      <input
        {...register("language", {
          required: true,
        })}
        className="input input-primary"
        placeholder="Language (ex: English/Hindi/Japanese)"
      />
      <button
        disabled={loading}
        className="btn disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed mt-3 btn-primary"
        type="submit"
      >
        {loading ? (
          <div className="flex item-center gap-2">
            <div className="animate-spin">
              <ImSpinner9 size={20} />
            </div>{" "}
            Adding Voice
          </div>
        ) : (
          "Add Voice"
        )}
      </button>
    </form>
  );
}

export default AddVoiceForm;
