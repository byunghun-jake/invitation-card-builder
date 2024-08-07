import InstaMapItem from "@/app/_components/invitations/InstaMapItem";
import { InstaMapWidgetType } from "@/types/invitation";
import EditInstaMapWidgetModal from "./editModal/EditInstaMapWidgetModal";
import WidgetReorderer from "./WidgetReorderer";
import DeleteAlertDialog from "./DeleteAlertDialog";

type Props = {
  widget: InstaMapWidgetType;
  index: number;
};

const InstaMapWidget = ({ widget, index }: Props) => {
  return (
    <div className="flex-none flex flex-col border border-slate-200 rounded-lg bg-white">
      <div className="flex items-center p-4 border-b border-slate-200">
        <div className="flex-1 flex items-center">
          <span className="font-bold">지도</span>
        </div>
        <div className="flex-none flex items-center gap-1">
          <WidgetReorderer widgetIndex={index} />
          <EditInstaMapWidgetModal widget={widget} index={index} />
          <DeleteAlertDialog widgetId={widget.id} />
        </div>
      </div>

      <div className="flex flex-col p-4">
        <InstaMapItem widget={widget} />
      </div>
    </div>
  );
};

export default InstaMapWidget;
