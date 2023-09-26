interface Props {
  id: string;
  currentUserID: string;
  parentID: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}
const ThreadCard = ({
  id,
  currentUserID,
  parentID,
  content,
  author,
  community,
  createdAt,
  comments,
}: Props) => {
  return (
    <article>
      <h2 className="text-small-regular text-light-2">{content}</h2>
    </article>
  );
};

export default ThreadCard;
