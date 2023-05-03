import { useEffect, useRef, useState } from "react";
import successSound from './mixkit-correct-answer-tone-2870 (1).wav';
import workSound from './mixkit-doorbell-tone-2864.wav';

export const Counter = () => {
    const [started, setStarted] = useState(false);
    const countStudySessions = useRef(0);
    const countRestSessions = useRef(0);
    const secondCounter = useRef(0);
    const minuteCounter = useRef(25);
    const [seconds, setSeconds] = useState(secondCounter.current);
    const [minutes, setMinutes] = useState(minuteCounter.current);
    const [moreRestEnable, setMoreRestEnable] = useState(false);
    const interval = useRef(null);
    const restTimeRef = useRef(null);
    const studyTimeRef = useRef(null);
    const paused = useRef(false);

    useEffect(() => {
            function countDown() {
                interval.current = setInterval(() => {
                    if(paused.current === true) {
                        setStarted(false);
                        paused.current = false;
                        clearInterval(interval.current);
                        return;
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
                        countStudySessions.current > countRestSessions.current ? countRestSessions.current++ : countStudySessions.current++;
                        playSound();
                        if(countStudySessions.current === 4) {
                            setMoreRestEnable(true);
                            countStudySessions.current = 0;
                        }
                        if(countRestSessions.current === 4) countRestSessions.current = 0;
                            secondCounter.current = 0;
                            minuteCounter.current = countStudySessions.current > countRestSessions.current ? restTimeRef.current.value : studyTimeRef.current.value;
                            setSeconds(secondCounter.current);
                            setMinutes(minuteCounter.current);
                            paused.current = true;
                    }
                }, 1000);
            }


            if(started) {
                countDown();
            }
        
    },[started])


    const handleChangeTime = (e) => {
        minuteCounter.current = e.target.value;
        setMinutes(minuteCounter.current);
        secondCounter.current = 0;
        setSeconds(secondCounter.current);
    }


    const handleReset = () => {
        minuteCounter.current = 25;
        secondCounter.current = 0;
        countRestSessions.current = 0;
        countStudySessions.current = 0;
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
        countStudySessions.current > countRestSessions.current ? audio1.play() : audio2.play();
    }


    const disableStudyOptions = started || countStudySessions.current > countRestSessions.current;
    const disableRestOptions = started || (countRestSessions.current === countStudySessions.current && countStudySessions.current !== 0);

    return ( 
        <div>
        <span className="timer">{minutes} : {seconds >= 10 ? seconds : '0' + seconds}</span>
        <button 
            disabled = {started}
            onClick={() => {
            setStarted(true);
            paused.current = false;
            }} 
            className="start-button"
        >
        Start</button>

        <button disabled={!started} onClick={() => paused.current = true} className="pause-button">Pause</button>

        <button className="reset-button" onClick={handleReset}>Reset</button>

        <br />
        <label className="study-label">Choose study time</label>
        <select disabled = {disableStudyOptions} onChange={handleChangeTime} ref={studyTimeRef}>
            {timeOptions}
        </select>

        <br />
        <label className="rest-label">Choose Rest Time</label>
        <select onChange={(e) => {
            setMinutes(e.target.value)
            setSeconds(0);
            }} 
            ref={restTimeRef} disabled={disableRestOptions}>
            <option value={5} key={5}>5</option>
            <option disabled={!moreRestEnable} value={10} key={10}>10</option>
        </select>

        <br />
        {moreRestEnable ? <label className="more-rest">you can Choose 10 minute option now</label> : <label className="session-count">Study {4-countStudySessions.current} more sessions to allow 10 minute rest option</label>}
        </div>
    );
}