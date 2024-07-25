import { useState } from "react";
import type { Tag } from "./types";
import { tags as dbTags } from "./data/tags";
import { TagsInput } from "./components/TagsInput";
import styles from "./App.module.css";

function App() {
  const [tags, setTags] = useState<Tag[]>([]);

  const handleAddTags = (tags: Tag[]) => {
    setTags(tags);
  };

  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>
        <p className={styles.hint}>tags de la "Base de datos"</p>
        <div className={styles.tagsWrapper}>
          {dbTags.map(({ id, name }) => (
            <span key={id}>#{name}</span>
          ))}
        </div>

        <form className={styles.form}>
          <label htmlFor="repo_topics" className={styles.label}>
            Topics <span>(separate with spaces)</span>
          </label>
          <TagsInput id="repo_topics" tags={tags} setTags={handleAddTags} />
        </form>
      </div>
    </main>
  );
}

export default App;
