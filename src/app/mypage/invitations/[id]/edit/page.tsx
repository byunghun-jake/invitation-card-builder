import { getInvitationV1, getWedding } from "@/actions/invitations";
import Link from "next/link";
import AddWidgetModal from "./_components/AddWidgetModal";
import Widget from "./_components/Widget";
import { InvitationContextProvider } from "./_contexts/InvitationContext";

type PageProps = {
  params: {
    id: string;
  };
};

const InvitationEditPage = async ({ params }: PageProps) => {
  const invitationId = Number(params.id);

  const invitation = await getInvitationV1(invitationId);
  const wedding = await getWedding(invitation.weddingId);

  const weddingId = invitation.weddingId;

  // 위젯의 마지막 order 값을 가져옵니다.
  const lastOrder = invitation.widgets.reduce((acc, widget) => {
    return widget.order > acc ? widget.order : acc;
  }, -1);

  return (
    <InvitationContextProvider invitation={invitation} wedding={wedding}>
      <div className="relative flex-1 flex flex-col pb-20 bg-slate-50 overflow-y-auto">
        <section className="flex-1 max-w-lg w-full mx-auto flex flex-col p-4">
          {/* 인스타그램 초대장 레이아웃 */}
          <div className="flex flex-col gap-3">
            {/* InstaHeader */}
            <div className="flex-none h-10 px-3 flex items-center">
              <span className="flex font-bold">청첩장 수정하기</span>
              <div className="ml-auto flex items-center">
                <Link
                  href={`/mypage/invitations/${invitationId}/preview`}
                  className="flex text-sm font-bold text-slate-700"
                  target="_blank"
                >
                  미리보기
                </Link>
              </div>
            </div>

            {/* Widgets */}
            <div className="flex-none flex flex-col gap-6">
              {invitation.widgets.map(widget => (
                <Widget
                  key={widget.id}
                  widget={widget}
                  invitationId={invitationId}
                  weddingId={weddingId}
                />
              ))}
            </div>
          </div>
        </section>
        <AddWidgetModal
          widgetLastOrder={lastOrder}
          weddingId={weddingId}
          invitationId={invitationId}
        />
      </div>
    </InvitationContextProvider>
  );
};

export default InvitationEditPage;