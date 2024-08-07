import InstaHeader from "@/app/[id]/ui/InstaHeader";
import PostImageViewerV2 from "@/components/PostImageViewerV2";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getInstaPost, getMetadataByTemplateCode } from "../../api";
import CommentItem from "./CommentItem";
import CreateCommentForm from "./CreateCommentForm";
import PostLikeSection from "./PostLikeSection";

type MetadataProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: MetadataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const templateCode = params.id;

  try {
    const instaTemplateMetadata = await getMetadataByTemplateCode(templateCode);

    return {
      title: instaTemplateMetadata.title,
      description: instaTemplateMetadata.description,
    };
  } catch (error) {
    return {
      title: "결혼식 청첩장",
      description: "결혼식에 초대합니다.",
    };
  }
}

type Props = {
  params: {
    id: string;
    postId: string;
  };
};

const Page = async (props: Props) => {
  const templateCode = props.params.id;

  const instaPost = await getInstaPost(props.params.postId);

  if (!instaPost) {
    notFound();
  }

  const isCommentEmpty = instaPost.comments.length === 0;

  const instaTemplateMetadata = await getMetadataByTemplateCode(templateCode);

  return (
    <div className="w-full h-full flex flex-col">
      <InstaHeader
        templateCode={templateCode}
        metaTitle={instaTemplateMetadata.title}
      />

      <PostImageViewerV2 images={instaPost.images} />

      <div className="flex-none flex flex-col gap-2 pt-1 pb-2">
        <PostLikeSection postId={instaPost.id} defaultLikes={instaPost.likes} />
        {instaPost.content && (
          <p className="text-sm whitespace-pre-line px-2">
            {instaPost.content}
          </p>
        )}
      </div>

      <div className="flex-1 py-4 flex flex-col gap-6 border-t">
        {!isCommentEmpty && (
          <ul className="flex-none flex flex-col gap-1">
            {instaPost.comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ul>
        )}

        <CreateCommentForm postId={instaPost.id} />
      </div>
    </div>
  );
};

export default Page;
