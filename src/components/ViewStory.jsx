import React from "react";
import Stories from "react-insta-stories";
import ReactHtmlParser from "react-html-parser";
function transformContent(content) {
  console.log(content, 5);
  return ReactHtmlParser(content);
}
const ViewStory = ({ data }) => {
  console.log(data, 8);
  const stories = data.map((story) => {
    // let url =
    let type = story.type;

    if (story.type === "raw") {
      console.log(story.data.replace("/", ""), 15);
      return {
        content: () => {
          return transformContent(story.data.replace("/", ""));
        },
        // type: "text",
      };
    } else {
      return {
        url: JSON.parse(story.data).file.path,
        type: type,
      };
    }
  });
  console.log(stories);
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
