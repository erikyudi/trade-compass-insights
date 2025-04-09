
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  tradesDates?: Date[];
  journalDates?: Date[];
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  tradesDates = [],
  journalDates = [],
  ...props
}: CalendarProps) {
  // Convert date arrays to string format (YYYY-MM-DD) for easier comparison
  const tradesDateStrings = tradesDates.map(date => date.toISOString().split('T')[0]);
  const journalDateStrings = journalDates.map(date => date.toISOString().split('T')[0]);

  // Function to determine the day's CSS classes based on event data
  const getDayClassName = (date: Date): string => {
    const dateStr = date.toISOString().split('T')[0];
    const hasTrades = tradesDateStrings.includes(dateStr);
    const hasJournal = journalDateStrings.includes(dateStr);

    if (hasTrades && hasJournal) {
      return "bg-green-100 text-green-800";
    } else if (hasTrades) {
      return "bg-yellow-100 text-yellow-800";
    }
    return "";
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative rounded-md overflow-hidden border border-transparent hover:bg-accent/20 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-blue-50 border border-blue-200 text-blue-800 font-semibold",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      modifiersClassNames={{
        ...props.modifiersClassNames,
        today: "bg-blue-50 border border-blue-200 text-blue-800 font-semibold",
      }}
      modifiers={{
        ...props.modifiers,
        customDay: (date) => getDayClassName(date) !== "",
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: (props) => {
          const customClass = getDayClassName(props.date);
          return (
            <div className={`h-full w-full flex items-center justify-center ${customClass}`}>
              <span className="inline-block text-center w-full">{props.date.getDate()}</span>
            </div>
          );
        },
      }}
      {...props}
      styles={{
        root: { backgroundColor: '#f9f9f9', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
        month: { margin: '0.5rem' },
        day_selected: { backgroundColor: 'var(--primary)', color: 'white' },
        ...props.styles
      }}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
