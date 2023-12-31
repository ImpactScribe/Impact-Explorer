import * as Popover from "@radix-ui/react-popover";

interface PopoverButtonProps {
  children: React.ReactNode;
}

function PopoverButton({ children }: PopoverButtonProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={`lg:h-[28px] h-[24px] w-fit font-medium text-black hover:bg-[#3D00B7] flex justify-center items-center hover:text-white active:opacity-50 lg:text-[15px]
           text-[10px] border bg-white rounded-[12px] px-1 lg:px-2`}
        >
          Manage
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-[12] data-[side=bottom]:animate-slideUpAndFade
           data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-fit rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
          sideOffset={5}
        >
          {children}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default PopoverButton;
