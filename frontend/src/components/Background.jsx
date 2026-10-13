export default function Background() {
    return (
        <>
            <div className="fixed inset-0 -z-30 bg-[#120605]" />

            <div className="fixed inset-0 -z-20 bg-[linear-gradient(rgba(255,90,31,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,90,31,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle,rgba(255,90,31,0.2)_1px,transparent_1px)] bg-[size:24px_24px]" />
        </>
    );
}