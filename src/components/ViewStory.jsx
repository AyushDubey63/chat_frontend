import React from "react";
import Stories from "react-insta-stories";
import ReactHtmlParser from "react-html-parser";
function transformContent(content) {
  return ReactHtmlParser(content);
}
const ViewStory = () => {
  const stories = [
    {
      id: 1,
      type: "image",
      url: "https://res.cloudinary.com/dh5u4lvhz/image/upload/v1739127861/onpomnqh1rk321al8cph.jpg",
    },
    {
      id: 2,
      type: "image",
      url: "https://res.cloudinary.com/dh5u4lvhz/image/upload/v1739127996/tbfo9nzhl2khjeuzpcsd.jpg",
    },
    {
      id: 3,
      type: "video",
      url: "https://res.cloudinary.com/dh5u4lvhz/video/upload/v1739171025/qyvs5e7txa7rri0bvm59.mp4",
    },
    {
      id: 4,
      content: () =>
        transformContent(
          `<div id="story-text" class="flex max-w-full h-[250px] rounded-lg p-4 justify-center overflow-hidden items-center" style="background-color: rgb(248, 113, 113); color: rgb(0, 0, 0); font-size: 16px;"><p class="whitespace-pre-wrap break-words max-w-full justify-center">sdvfbf😍scwvwev😜</p></div>`
        ),
    },
  ];

  return (
    <Stories
      stories={stories}
      defaultInterval={1500}
      width={432}
      height={768}
    />
  );
};

export default ViewStory;
