export default function Button({
    children,
    href,
    primary = false,
}) {
    return (
        <a
            href={href}
            className={`
                pixel
                inline-flex
                items-center
                justify-center
                px-10
                py-4
                font-mono
                uppercase
                tracking-[0.25em]
                text-lg
                border-2
                transition-all
                duration-200

                ${
                    primary
                        ? "pixel bg-orange-600 text-black border-orange-600 hover:bg-orange-500"
                        : "pixel border-orange-600 text-orange-500 hover:bg-orange-600 hover:text-black"
                }
            `}
        >
            {children}
        </a>
    );
}