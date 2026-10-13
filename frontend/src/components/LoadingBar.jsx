import { useEffect, useState } from "react";

export default function LoadingBar() {

    const [progress, setProgress] = useState(0);

    useEffect(() => {

        let value = 0;

        const interval = setInterval(() => {

            value += 1;

            setProgress(value);

            if (value >= 100) {

                clearInterval(interval);

            }

        }, 12);

        return () => clearInterval(interval);

    }, []);

    return (

        <div className="h-1 w-full bg-[#2b110d]">

            <div
                className="h-full bg-orange-500"
                style={{ width: `${progress}%` }}
            />

        </div>

    );
}