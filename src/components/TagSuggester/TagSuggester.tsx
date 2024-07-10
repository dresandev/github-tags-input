import type { FC, MouseEventHandler } from "react";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { useDebounce } from "use-debounce";
import type { Tag } from "../../types";
import { searchTags } from "../../helpers/search-tags";
import styles from "./TagSuggester.module.css";

interface Props {
  suggestionTerm: string;
  suggestedTags: Tag[];
  setSuggestedTags: (suggestedTags: Tag[]) => void;
  suggestedTagIdx: number | null;
  onSelect: (tagName: Tag) => void;
}

const DEBOUNCE_TIME = 250;

export const TagSuggester: FC<Props> = ({
  suggestionTerm,
  suggestedTags,
  setSuggestedTags,
  suggestedTagIdx,
  onSelect,
}) => {
  const [debouncedSearchTerm] = useDebounce(suggestionTerm, DEBOUNCE_TIME);
  const listboxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!debouncedSearchTerm) return setSuggestedTags([]);

    const getTags = async () => {
      const suggestedTags = searchTags(debouncedSearchTerm);
      if (!suggestedTags) return setSuggestedTags([]);
      setSuggestedTags(suggestedTags);
    };

    getTags();
  }, [debouncedSearchTerm]);

  const handleOnClick: MouseEventHandler<HTMLLIElement> = (e) => {
    const idx = Number(e.currentTarget.dataset.idx);
    onSelect(suggestedTags[idx]);
  };

  return (
    <ul
      ref={listboxRef}
      className={clsx(styles.suggestedTagList, {
        [styles.display]: suggestedTags.length,
      })}
      role="listbox"
    >
      {suggestedTags.map((tag, idx) => (
        <li
          role="option"
          aria-selected={suggestedTagIdx === idx}
          data-idx={idx}
          key={tag.id}
          className={clsx(styles.suggestedTag, {
            [styles.selected]: styles.selected,
          })}
          onClick={handleOnClick}
        >
          {tag.name}
        </li>
      ))}
    </ul>
  );
};
