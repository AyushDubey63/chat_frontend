import React, { useState } from "react";
import InputEmoji from "react-input-emoji";
import {
  CiTextAlignCenter,
  CiTextAlignLeft,
  CiTextAlignRight,
} from "react-icons/ci";
import { MdOutlineTextIncrease, MdOutlineTextDecrease } from "react-icons/md";
import {
  RxTextAlignBottom,
  RxTextAlignMiddle,
  RxTextAlignTop,
} from "react-icons/rx";

function TextStory({ setSelectStatusData, handleSendStatus }) {
  const [bgColor, setBgColor] = useState("#f87171"); // Background color
  const [textColor, setTextColor] = useState("#000000"); // Text color
  const [fontSize, setFontSize] = useState(16); // Font size in pixels
  const [textAlign, setTextAlign] = useState("justify-center");
  const [text, setText] = useState("");
  const [verticalAlign, setVerticalAlign] = useState("items-center");

  const handleSend = () => {
    const elem = document.getElementById("story-text");
    // setSelectStatusData({type});
    console.log(elem);
    const data = elem.outerHTML;
    // console.log(data.replace("h-[250px]", "h-full w-full"));
    setSelectStatusData({
      type: "raw",
      data: data.replace("h-[250px]", "h-full w-full"),
    });
    handleSendStatus();
    console.log("send");
  };

  return (
    <div className="h-full p-4">
      <h1 className="text-lg font-semibold mb-4">Type text for story</h1>

      {/* Controls for text customization */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Background Color Picker */}
        <div>
          <label className="text-sm font-medium">Background Color</label>
          <input
            type="color"
            onChange={(e) => setBgColor(e.target.value)}
            value={bgColor}
            className="ml-2 p-1"
          />
        </div>

        {/* Text Color Picker */}
        <div>
          <label className="text-sm font-medium">Text Color</label>
          <input
            type="color"
            onChange={(e) => setTextColor(e.target.value)}
            value={textColor}
            className="ml-2 p-1"
          />
        </div>

        {/* Font Size Controls */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Font Size</label>
          <MdOutlineTextIncrease
            onClick={() => setFontSize((prev) => prev + 2)}
            className="cursor-pointer"
          />
          <MdOutlineTextDecrease
            onClick={() => setFontSize((prev) => Math.max(8, prev - 2))}
            className="cursor-pointer"
          />
        </div>

        {/* Text Alignment Controls */}
        <div className="flex gap-2">
          <CiTextAlignLeft
            onClick={() => setTextAlign("text-left")}
            className={`cursor-pointer ${
              textAlign === "text-left" ? "text-blue-500" : ""
            }`}
          />
          <CiTextAlignCenter
            onClick={() => setTextAlign("text-center")}
            className={`cursor-pointer ${
              textAlign === "text-center" ? "text-blue-500" : ""
            }`}
          />
          <CiTextAlignRight
            onClick={() => setTextAlign("text-right")}
            className={`cursor-pointer ${
              textAlign === "text-right" ? "text-blue-500" : ""
            }`}
          />
          <RxTextAlignTop
            onClick={() => setVerticalAlign("items-start")}
            className={`cursor-pointer ${
              verticalAlign === "items-start" ? "text-blue-500" : ""
            }`}
          />
          <RxTextAlignMiddle
            onClick={() => setVerticalAlign("items-center")}
            className={`cursor-pointer ${
              verticalAlign === "items-center" ? "text-blue-500" : ""
            }`}
          />
          <RxTextAlignBottom
            onClick={() => setVerticalAlign("items-end")}
            className={`cursor-pointer ${
              verticalAlign === "items-end" ? "text-blue-500" : ""
            }`}
          />
        </div>
      </div>

      {/* Display the styled text */}
      <div
        id="story-text"
        className={`flex max-w-full h-[250px]  p-4 justify-center overflow-hidden ${verticalAlign}`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontSize: `${fontSize}px`,
        }}
      >
        <p
          className={`whitespace-pre-wrap break-words max-w-full ${textAlign}`}
        >
          {text}
        </p>
      </div>

      {/* Text Input Field */}
      <div className="flex gap-2 mt-4 items-center">
        <div className="flex-grow w-[88%]">
          <InputEmoji
            value={text}
            onChange={setText}
            placeholder="Type a message"
            className="w-full max-h-12 h-12"
            keepOpened={true}
          />
        </div>
        <button
          onClick={handleSend}
          className="rounded-lg px-4 py-2 bg-blue-400 text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default TextStory;
