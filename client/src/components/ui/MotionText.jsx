import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MotionText = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    const content = (
        <>
            <div className="w-10 h-10 rounded-full bg-white flex justify-center items-center">
                <img src="/img/watermelon.png" alt="watermelon" className="w-8 h-8" />
            </div>
            <p className='text-2xl text-white uppercase whitespace-nowrap'>
                Únete ahora y empieza a ahorrar!
            </p>
        </>
    );

    useEffect(() => {
        const timeline = gsap.timeline({
            repeat: -1,
            defaults: { ease: "none" }
        });

        timeline.to(textRef.current, {
            x: "-50%",
            duration: 20,
        });

        return () => timeline.kill();
    }, []);

    return (
        <aside className='w-full overflow-hidden h-16 bg-black'>
            <div ref={containerRef} className="w-full h-full flex justify-center">
                <div
                    ref={textRef}
                    className="flex justify-center items-center gap-6"
                    style={{ width: "200%" }}
                >
                    <div className="flex-1 flex justify-center items-center gap-6">
                        {content}
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        {content}
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        {content}
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        {content}
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        {content}
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        {content}
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        {content}
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        {content}
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        {content}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default MotionText;
