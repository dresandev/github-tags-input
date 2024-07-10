import { tags } from "../data/tags";

export const searchTags = (term: string) => {
  return tags.filter((tag) => tag.name.startsWith(term));
};
