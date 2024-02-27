import { instaMetadataSchema } from "@/schemas/instagram";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import InstaStories from "./InstaStories";
import { GetStorySchema } from "@/app/api/stories/[id]/schema";

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
  const instaTemplateMetadata = instaMetadataSchema.parse(body);

  return {
    title: instaTemplateMetadata.title,
    description: instaTemplateMetadata.description,
  };
}

type Props = {
  params: {
    id: string;
    storyId: string;
  };
  searchParams: Record<string, any>;
};

const StoriesPage = async ({ params, searchParams }: Props) => {
  // :id/stories/:storyId
  const invitationId = params.id;
  const storyId = params.storyId;
  const host = headers().get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/api/stories/${storyId}`;

  const res = await fetch(url);

  if (!res.ok) {
    return <div>Internal server error</div>;
  }

  const body = await res.json();
  const story = GetStorySchema.parse(body);

  return (
    <InstaStories
      images={story.images}
      invitationId={invitationId}
      storyId={storyId}
    />
  );
};

export default StoriesPage;
