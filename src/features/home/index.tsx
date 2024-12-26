import Link from "next/link";
import Image from "next/image";
import AnimatedBackground from "@/components/ui/animated-background";

const links = [
  {
    img: "calendar",
    title: "Today's",
    link: "/",
  },
  {
    img: "book",
    title: "Book",
    link: "/bookprep",
  },
  {
    img: "graduate",
    title: "Form",
    link: "/fee",
  },
  {
    img: "graduate",
    title: "Other",
    link: "/other",
  },
];

export function SegmentedControl() {
  return (
    <div className="rounded-t-[1.2rem] border inline-flex justify-center w-full  bg-gray-100 p-2 pb-2 dark:bg-zinc-800">
      <AnimatedBackground
        defaultValue={links[0].title}
        className="rounded-xl bg-white dark:bg-zinc-700"
        transition={{
          ease: "easeInOut",
          duration: 0.2,
        }}
      >
        {links.map((link) => {
          return (
            <button
              key={link.title}
              data-id={link.title}
              type="button"
              aria-label={`${link.title} view`}
              className="inline-flex w-full h-16 items-center justify-center text-center text-zinc-800 transition-transform active:scale-[0.98] dark:text-zinc-50"
            >
              <Link href={link.link}>
                <Image
                  width={40}
                  height={40}
                  src={`/images/${link.img}.png`}
                  alt={`Logo ${link.img}.png`}
                />
                <span className="text-sm">{link.title}</span>
              </Link>
            </button>
          );
        })}
      </AnimatedBackground>
    </div>
  );
}
