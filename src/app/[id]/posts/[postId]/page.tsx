import InstaHeader from "@/app/[id]/InstaHeader";
import PostImageViewerV2 from "@/components/PostImageViewerV2";
import { instaMetadataSchema, instaPostSchema } from "@/schemas/instagram";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import CommentItem from "./CommentItem";
import CreateCommentForm from "./CreateCommentForm";
import PostLikeSection from "./PostLikeSection";

export const revalidate = 1;

type MetadataProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: MetadataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const templateCode = params.id;
  const host = headers().get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/api/insta-templates/${templateCode}/metadata`;

  const res = await fetch(url);

  if (!res.ok) {
    return {
      title: "결혼식 청첩장",
      description: "결혼식에 초대합니다.",
    };
  }

  const body = await res.json();
  const instaTemplateMetadata = instaMetadataSchema.safeParse(body);

  if (!instaTemplateMetadata.success) {
    return {
      title: "결혼식 청첩장",
      description: "결혼식에 초대합니다.",
    };
  }

  return {
    title: instaTemplateMetadata.data.title,
    description: instaTemplateMetadata.data.description,
  };
}

const getPost = async (postId: string) => {
  const host = headers().get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/api/posts/${postId}`;

  const res = await fetch(url, {
    next: {
      tags: ["posts", "comments"],
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const body = await res.json();

  const instaPost = instaPostSchema.parse(body);

  return instaPost;
};

const getMetadata = async (templateCode: string) => {
  const host = headers().get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/api/insta-templates/${templateCode}/metadata`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch metadata");
  }

  const body = await res.json();
  const instaTemplateMetadata = instaMetadataSchema.parse(body);

  return instaTemplateMetadata;
};

type Props = {
  params: {
    id: string;
    postId: string;
  };
};

const Page = async (props: Props) => {
  const templateCode = props.params.id;

  const instaPost = await getPost(props.params.postId);
  const instaTemplateMetadata = await getMetadata(templateCode);

  return (
    <div className="w-full h-full flex flex-col">
      <InstaHeader
        templateCode={templateCode}
        metaTitle={instaTemplateMetadata.title}
      />

      {/* ImageViewer */}
      <PostImageViewerV2 images={instaPost.images} />
      {/* ImageViewer */}

      <div className="flex-none flex flex-col gap-2 pt-1 pb-2">
        <PostLikeSection postId={instaPost.id} likes={instaPost.likes} />
        <p className="text-sm whitespace-pre-line px-2">{instaPost.content}</p>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-10 border-t">
        <ul className="flex-none flex flex-col gap-1">
          {instaPost.comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </ul>

        <CreateCommentForm postId={instaPost.id} />
      </div>
    </div>
  );
};

export default Page;
