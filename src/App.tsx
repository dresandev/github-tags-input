import { useState } from "react";
import type { Tag } from "./types";
import { TagsInput } from "./components/TagsInput";
import styles from "./App.module.css";

function App() {
  const [tags, setTags] = useState<Tag[]>([]);

  const handleAddTags = (tags: Tag[]) => {
    setTags(tags);
  };

  return (
    <main className={styles.main}>
      <form>
        <label htmlFor="repo_topics" className={styles.label}>
          Topics <span>(separate with spaces)</span>
        </label>
        <TagsInput id="repo_topics" tags={tags} setTags={handleAddTags} />
      </form>
    </main>
  );
}

export default App;
