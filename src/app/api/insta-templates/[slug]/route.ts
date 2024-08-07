import { NextRequest, NextResponse } from "next/server";
import { checkIfError } from "@/utils/helpers";
import {
  getInstaTemplate,
  updateMetadata,
  updatePosts,
  updateStories,
  updateWeddingHall,
} from "../action";
import { transformTemplate } from "../helpers/transformToClient";
import { UpdateTemplateDto, updateTemplateSchema } from "../schemas/update";

export const GET = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const templateCode = pathname.split("/").pop() || "";

  try {
    // 데이터 가져오기
    const responseData = await getInstaTemplate(templateCode);

    // 데이터 변환하기
    const instaTemplate = transformTemplate(responseData);

    return NextResponse.json(instaTemplate);
  } catch (error) {
    if (!checkIfError(error)) {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }

    if (error.message === "Not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

const parseUpdateRequestBody = (responseBody: unknown): UpdateTemplateDto => {
  const validationResult = updateTemplateSchema.parse(responseBody);

  return validationResult;
};

export const PATCH = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const templateCode = pathname.split("/").pop() || "";

  if (!templateCode || templateCode === ":slug") {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  const requestBody = await request.json();

  const updateData = parseUpdateRequestBody(requestBody);

  // 데이터 가져오기
  const template = await getInstaTemplate(templateCode);

  // TODO: template.userId === request.userId 인지 확인하기

  if (updateData.stories) {
    await updateStories(template.id, updateData.stories);
  }

  if (updateData.posts) {
    await updatePosts(template.id, updateData.posts);
  }

  if (updateData.metadata) {
    await updateMetadata(template.id, updateData.metadata);
  }

  if (updateData.weddingHall) {
    await updateWeddingHall(template.id, updateData.weddingHall);
  }

  return NextResponse.json({ message: "OK" });
};
