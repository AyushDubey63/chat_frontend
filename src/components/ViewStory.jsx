import React from "react";
import Stories from "react-insta-stories";
import parse from "html-react-parser";
function transformContent(content) {
  console.log(content, 5);
  return parse(content);
}
const ViewStory = ({ data, setOpenStory }) => {
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
        url: story.data.file.path,
        type: type,
      };
    }
  });

  return (
    <Stories
      stories={stories}
      defaultInterval={2500}
      width="100%"
      height="90dvh"
      onAllStoriesEnd={() => setOpenStory(false)}
      keyboardNavigation={true}
    />
  );
};

export default ViewStory;
