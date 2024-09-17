import type * as StackbitTypes from "@stackbit/types";
import config from "./config.json"; // has to be generated with ./scripts/build-custom-controls-config.sh, missing by default

const currentValue = document.getElementById("current-value") as HTMLElement;
const generatedValue = document.getElementById(
  "generated-value"
) as HTMLElement;
const startButton = document.getElementById("start-rec") as HTMLButtonElement;
const stopButton = document.getElementById("stop-rec") as HTMLButtonElement;
const saveButton = document.getElementById("save-value") as HTMLButtonElement;
const audioPlayback = document.getElementById(
  "audio-playback"
) as HTMLAudioElement;

// Function to start recording
let mediaRecorder;
let audioChunks: Blob[] = [];

const initialContextWindow =
  window as unknown as StackbitTypes.CustomControlWindow;
// create object if page script loads before control
initialContextWindow.stackbit = initialContextWindow.stackbit || {};

initialContextWindow.stackbit.onUpdate = (
  options: StackbitTypes.OnUpdateOptions
) => {
  const docStringField = options.documentField as
    | StackbitTypes.DocumentJsonFieldNonLocalized
    | undefined;
  const value = docStringField?.value ?? "";

  currentValue.innerText = value;

  if (options.init) {
    const update = function () {
      options
        .updateDocument({
          operations: [
            {
              opType: "set",
              fieldPath: options.fieldPath,
              field: {
                type: "string",
                value: generatedValue.innerText,
              },
            },
          ],
        })
        .then((result) => {
          console.log("saved, result:", result);
          generatedValue.innerText = "";
        })
        .catch((err) => {
          console.log(`Error ${err}`);
        });
    };

    saveButton.addEventListener("click", () => {
      update();
    });

    startButton.addEventListener("click", async () => {
      try {
        // Request access to the user's microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        startButton.disabled = true;
        stopButton.disabled = false;

        mediaRecorder.ondataavailable = ({ data }) => {
          audioChunks.push(data);
        };

        stopButton.addEventListener("click", () => {
          mediaRecorder.stop();

          startButton.disabled = false;
          stopButton.disabled = true;
        });

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          audioChunks = []; // Reset chunks for the next recording

          const audioUrl = URL.createObjectURL(audioBlob);
          audioPlayback.src = audioUrl;

          const text = (await speechToText(audioBlob)) ?? "";
          generatedValue.innerText = text;
        };
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    });
  }
};

// Function to send audio to the server
async function speechToText(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");

  try {
    const response = await fetch(`${config.API_HOST}/api/speech-to-text`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Audio successfully processed!");
      const data = await response.json();
      return data.text;
    } else {
      console.error("Error processing audio:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to send audio to server:", error);
  }
}
