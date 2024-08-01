import { InstaCoverWidgetType } from "@/types/invitation";
import EditInstaCoverWidgetModal from "./EditInstaCoverWidgetModal";
import WidgetReorderer from "./WidgetReorderer";
import InstaCoverItem from "./previewModal/InstaCoverItem";

type Props = {
  widget: InstaCoverWidgetType;
  index: number;
};

const InstaCoverWidget = ({ widget, index }: Props) => {
  const { title, content } = widget;

  return (
    <div className="flex-none flex flex-col border border-slate-200 rounded-lg bg-white">
      <div className="flex items-center p-4 border-b border-slate-200">
        <div className="flex-1 flex items-center">
          <span className="font-bold">표지</span>
        </div>
        <div className="flex-none flex items-center gap-1">
          <WidgetReorderer widgetIndex={index} />
          <EditInstaCoverWidgetModal widget={widget} index={index} />
        </div>
      </div>

      <InstaCoverItem widget={widget} />
    </div>
  );
};

export default InstaCoverWidget;
