import type {
  InputHTMLAttributes,
  FC,
  KeyboardEvent,
  KeyboardEventHandler,
  ChangeEventHandler,
} from "react";
import { useRef, useState } from "react";
import { Tag } from "../../types";
import { TagSuggester } from "../TagSuggester";
import { X } from "../X";
import styles from "./TagsInput.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

type HandledEvent = " " | "Enter" | "Backspace" | "ArrowUp" | "ArrowDown";

type KeyDownHandledEvent = {
  [key in HandledEvent]: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export const TagsInput: FC<Props> = ({
  className,
  tags,
  setTags,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
  const [suggestedTagIdx, setSuggestedTagIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxSuggestedTagsLength = suggestedTags.length - 1;

  const addTag = (tagName: string) => {
    const isTagAdded = tags.some((tag) => tag.name === tagName);

    if (isTagAdded) return;

    setTags([...tags, { name: tagName }]);
    setInputValue("");
  };

  const addSuggestedTag = (idx: number) => {
    addTag(suggestedTags.at(idx)!.name);
    setSuggestedTagIdx(null);
    setSuggestedTags([]);
  };

  const keyDownHandledEvents: KeyDownHandledEvent = {
    " ": (e) => {
      if (!inputValue) {
        e.preventDefault();

        if (suggestedTagIdx !== null) {
          return addSuggestedTag(suggestedTagIdx);
        }

        return;
      }

      addTag(inputValue);
    },
    Enter: (e) => {
      if (!inputValue) return;

      e.preventDefault();

      if (suggestedTagIdx !== null) {
        return addSuggestedTag(suggestedTagIdx);
      }

      addTag(inputValue);
    },
    Backspace: () => {
      if (inputValue || !tags.length) return;
      const filteredTags = tags.slice(0, -1);
      setTags(filteredTags);
    },
    ArrowUp: (e) => {
      if (suggestedTags.length) e.preventDefault();

      if (suggestedTagIdx === null) {
        return setSuggestedTagIdx(maxSuggestedTagsLength);
      }

      if (suggestedTagIdx > 0) {
        return setSuggestedTagIdx(suggestedTagIdx - 1);
      }

      setSuggestedTagIdx(null);
    },
    ArrowDown: (e) => {
      if (suggestedTags.length) e.preventDefault();

      if (suggestedTagIdx === null) {
        return setSuggestedTagIdx(0);
      }

      if (suggestedTagIdx < maxSuggestedTagsLength) {
        return setSuggestedTagIdx(suggestedTagIdx + 1);
      }

      setSuggestedTagIdx(null);
    },
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!(e.key in keyDownHandledEvents)) return;

    const handler = keyDownHandledEvents[e.key as keyof KeyDownHandledEvent];
    handler(e);
  };

  const handleRemoveTag = (idx: number) => {
    const filteredTags = tags.filter((_, i) => i !== idx);
    setTags(filteredTags);
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.currentTarget.value.trim().toLowerCase());
  };

  const handleOnSelect = (tag: Tag) => {
    addTag(tag.name);
    setSuggestedTags([]);
  };

  const handleSetSuggestedTags = (suggestedTags: Tag[]) => {
    setSuggestedTags([...suggestedTags]);
  };

  return (
    <div className={styles.wrapper} onClick={handleFocusInput}>
      <ul className={styles.tagList}>
        {tags.map((tag, idx) => (
          <li className={styles.tagPill} key={tag.name}>
            <span>{tag.name}</span>
            <button
              className={styles.deleteTagBtn}
              type="button"
              tabIndex={-1}
              onClick={() => handleRemoveTag(idx)}
            >
              <X className={styles.closeIcon} />
            </button>
          </li>
        ))}
      </ul>
      <input
        role="combobox"
        aria-expanded={!!suggestedTags.length}
        aria-controls="tags-popup"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        className={styles.input}
        type="text"
        autoComplete="off"
        spellCheck="false"
        ref={inputRef}
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={handleOnChange}
        {...props}
      />
      <TagSuggester
        suggestionTerm={inputValue}
        onSelect={handleOnSelect}
        suggestedTags={suggestedTags}
        setSuggestedTags={handleSetSuggestedTags}
        suggestedTagIdx={suggestedTagIdx}
      />
    </div>
  );
};
