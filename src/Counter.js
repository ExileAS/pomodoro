import { useEffect, useRef, useState } from "react";
import successSound from './mixkit-correct-answer-tone-2870 (1).wav';
import workSound from './mixkit-doorbell-tone-2864.wav';

export const Counter = () => {
    const [started, setStarted] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(25);
    const countSessions = useRef(0);
    const secondCounter = useRef(seconds);
    const minuteCounter = useRef(minutes);
    const interval = useRef(null);
    const restTimeRef = useRef(null);
    const [remainingSessions, setRemainingSessions] = useState(4);

    const [paused, setPaused] = useState(false);
    const pausedRef = useRef(paused);

    useEffect(() => {
            function countDown() {
                interval.current = setInterval(() => {
                    if(pausedRef.current === true) {
                        setStarted(false);
                        pausedRef.current = paused;
                        clearInterval(interval.current);
                    }
                    if(secondCounter.current === 0) {
                        secondCounter.current = 59;
                        minuteCounter.current--;
                        setSeconds(secondCounter.current);
                        setMinutes(minuteCounter.current);
                    }
                    else {
                        secondCounter.current--;
                        setSeconds(secondCounter.current);
                    }
                    if(secondCounter.current === 0 && minuteCounter.current === 0) {
                        playSound();
                        countSessions.current++;
                        if(countSessions.current % 8 === 0 && countSessions.current > 0) {
                            countSessions.current = 0;
                        }
                        secondCounter.current = 0;
                        minuteCounter.current = restTimeRef.current.value;
                        setSeconds(secondCounter.current);
                        setMinutes(minuteCounter.current);
                        pausedRef.current = true;
                        setPaused(pausedRef.current);
                    }

                }, 1000);
            }


            if(started && !paused) {
                countDown();
            }
        //return () => clearInterval(interval.current);
    },[started, paused])


    const handleChangeTime = (e) => {
        minuteCounter.current = e.target.value
        setMinutes(minuteCounter.current)
        secondCounter.current = 0;
        setSeconds(secondCounter.current)
    }


    const handleReset = () => {
        minuteCounter.current = 25;
        secondCounter.current = 0;
        setMinutes(minuteCounter.current);
        setSeconds(secondCounter.current);
        clearInterval(interval.current);
        setStarted(false);
    }


    const timeOptions = [25,30].map(timeOption => (
       <option key={timeOption} value={timeOption}>
            {timeOption}
       </option> 
    ))

    const playSound = () => {
        const audio1 = new Audio(successSound);
        const audio2 = new Audio(workSound);
        countSessions.current % 2 === 0 ? audio2.play() : audio1.play();
    }

    useEffect(() => {
        if(countSessions.current % 2 !== 0) {
            setRemainingSessions(prev => prev - 1)
        }
        if(countSessions.current === 0) setRemainingSessions(4);
    },[countSessions.current])


    return ( 
        <div>
        <span className="timer">{minutes} : {seconds >= 10 ? seconds : '0' + seconds}</span>
        <button 
            disabled = {started}
            onClick={() => {
            setStarted(true)
            setPaused(false)
            }} 
            className="start-button"
        >
        Start</button>
        <button disabled={!started} onClick={() => pausedRef.current = true} className="pause-button">Pause</button>
        <button className="reset-button" onClick={handleReset}>Reset</button>
        <br />
        <label className="study-label">Choose study time</label>
        <select disabled = {started} onChange={handleChangeTime}>
            {timeOptions}
        </select>
        <br />
        <label className="rest-label">Choose Rest Time</label>
        <select onChange={(e) => {
            setMinutes(e.target.value)
            setSeconds(0);
            }} 
            ref={restTimeRef} disabled={started}>
            <option value={5} key={5}>5</option>
            <option disabled={!(countSessions.current === 7 && countSessions.current > 0)} value={10} key={10}>10</option>
        </select>
        <br />
        <label className="session-count">Study {remainingSessions} more sessions to allow 10 minute rest option</label>
        </div>
    );
}