import React, { useState } from "react";
import axios, { spread } from "axios";

const VoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptFields, setPromptFields] = useState(null);
  const [fieldValues, setFieldValues] = useState({});

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    setListening(true);
    setUserQuery(""); // Reset user query
    setResponseText(""); // Reset response text
  };

  recognition.onend = () => {
    setListening(false);
  };

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("Recognized:", transcript);
    setUserQuery(transcript);
    // handleCommand(transcript);
    await handleCommand(transcript);
  };

  const speak = (message) => {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const handleCommand = async (command) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/process_query", {
        query: command,
      });

      if (response.data.navigation) {
        //Check if the response has a navigation key.
        window.location.href = response.data.navigation;
      } else if (response.data.response) {
        setResponseText(response.data.response);
        speak(response.data.response);
      } else {
        setResponseText("Sorry, I couldn't process that request.");
        speak("Sorry, I couldn't process that request.");
      }
    } catch (error) {
      console.error("Error processing command:", error);
      setResponseText("An error occurred while processing your request.");
      speak("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFieldValues({ ...fieldValues, [field]: value });
  };

  const submitFieldValues = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/process_query", {
        query: JSON.stringify(fieldValues),
      });

      if (response.data.response) {
        setResponseText(response.data.response);
        speak(response.data.response);
      } else {
        setResponseText("Sorry, I couldn't process that request.");
        speak("Sorry, I couldn't process that request.");
      }
      setPromptFields(null);
      setFieldValues({});
    } catch (error) {
      console.error("Error submitting field values:", error);
      setResponseText("An error occurred while processing your request.");
      speak("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="p-4 border rounded-xl shadow-lg text-center">
      <button
        onClick={() => recognition.start()}
        className="px-4 py-2  text-white rounded-lg"
      >
        {listening ? (
          <>
            <div className="border-2 h-20 rounded-full">
              <lord-icon
                src="https://cdn.lordicon.com/vycwlttg.json"
                trigger="loop"
                style={{ width: "75px", height: "75px" }}
                state="loop-recording"
              ></lord-icon>
            </div>
            <h2 className="text-black">Listening...</h2>
          </>
        ) : (
          <>
            <div className="border-2 h-20 rounded-full">
              <lord-icon
                src="https://cdn.lordicon.com/vycwlttg.json"
                trigger="hover"
                style={{ width: "75px", height: "75px" }}
              ></lord-icon>
            </div>
            <h2 className="text-black">Tap to Speak</h2>
          </>
        )}
      </button>

      {userQuery && (
        <p className="mt-4 text-black">
          <strong>You:</strong> {userQuery}
        </p>
      )}

      {loading ? (
        <p className="mt-2 text-gray-500">Processing...</p>
      ) : (
        responseText && (
          <p className="mt-2 text-black">
            <strong>Assistant:</strong> {responseText}
          </p>
        )
      )}

      {promptFields && (
        <div>
          <p>{promptFields.message}</p>
          {promptFields.fields.map((field) => (
            <input
              key={field}
              placeholder={field}
              value={fieldValues[field] || ""}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            />
          ))}
          <button onClick={submitFieldValues}>Submit</button>
        </div>
      )}

      {/* <p className="mt-4 text-black">{responseText}</p> */}
      {/* <button onClick={stopSpeech}>Stop Speech</button> */}
      {window.speechSynthesis.speaking && ( // Only show when speaking
        <div className="mt-4">
          <button
            onClick={stopSpeech}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Stop Speech
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
