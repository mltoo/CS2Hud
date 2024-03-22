import React, { useState, useEffect } from 'react';
import logo from 'url:../res/logo.svg';
import * as weaponIcons from "url:../res/weapons/*.svg";
import * as generalIcons from 'url:../res/icons/*.svg';

export function TopDevice(props) {
    const [ lastBombTimer, setLastBombTimer ] = useState(0);
    let ctName = "Counter-Terrorists";
    let tName = "Terrorists";
    let ctScore = 0;
    let tScore = 0;
    let timer = "00:00";
    if (props.data) {

        ctName = props.data.team_ct.name ?? ctName;
        ctScore = props.data.team_ct.score;
        tName = props.data.team_t.name ?? tName;
        tScore = props.data.team_t.score;
    }
    if (props.phaseCountdowns.phase === "bomb" && props.phaseCountdowns.phase_ends_in != lastBombTimer) {
        console.log("updating last bomb");
        setLastBombTimer(props.phaseCountdowns.phase_ends_in);
    }
    //console.log(props);
    if (props.phaseCountdowns) {
        const mins = Math.floor(props.phaseCountdowns.phase_ends_in / 60);
        const secs = String(Math.round(props.phaseCountdowns.phase_ends_in % 60));
        timer = mins + ":" + secs.padStart(2, '0');
    }
    console.log(props);
    console.log(props.phaseCountdowns.phase === 'bomb');
    return <div className="fixed mt-3 left-1/2 -translate-x-1/2">
        <svg
            height="20vh"
            viewBox="-550 0 1242.99998 199.5648"

        >
            <defs id="defs1" >
                <linearGradient id="grad1">
                    <stop stopColor='black' stopOpacity="100" offset="0%" />
                    <stop stopColor='black' stopOpacity="0" offset="100%" />
                </linearGradient>
                <linearGradient id="grad2">
                    <stop stopColor='black' stopOpacity="0" offset="0%" />
                    <stop stopColor='black' stopOpacity="100" offset="100%" />
                </linearGradient>
            </defs>
            <g id="layer1">
                <path
                    fill='black'
                    className={['bomb', 'defuse'].includes(props.phaseCountdowns.phase) ? 'bombAnim' : ''}
                    style={{animationDuration: `${lastBombTimer / 45 * 1.75 + 1}s`}}
                    opacity="0.75"
                    strokeWidth="0.265"
                    stroke-dasharray="none"
                    d="M 5.291667,0 H 137.70833 A 5.2916667,5.2916667 0 0 1 143,5.291667 V 62.44375 a 22.215858,22.215858 0 0 1 -2.61566,10.458318 L 73.866542,197.5648 a 2.6823616,2.6823616 0 0 1 -4.733087,0 L 2.615656,72.902068 A 22.215858,22.215858 0 0 1 0,62.44375 V 5.291667 A 5.2916667,5.2916667 0 0 1 5.291667,0 Z"

                    id="path1"
                />
                <path
                    fill="url(#grad1)"
                    stroke-width="0.265"
                    strokeDasharray="none"
                    d="m 153.07292,72.177083 -35.99921,67.468747 h 300 V 72.177083 Z"
                    id="path1"
                />
                <path
                    className='fill-southLanGreen'
                    strokeWidth="0.265"
                    strokeDasharray="none"
                    d="m 152,72 -36,68 h 12 l 36,-68 Z"
                    id="path1"
                />
                <path
                    fill="url(#grad2)"
                    strokeWidth="0.265"
                    strokeDasharray="none"
                    d="m -8.93,72.177083 35.99921,67.468747 h -300 V 72.177083 Z"
                    id="path1"
                />
                <path
                    className='fill-southLanPurple'
                    strokeWidth="0.265"
                    strokeDasharray="none"
                    d="m -8,72 36,68 h -12 l -36,-68 Z"
                    id="path1"
                />
                <text dominantBaseline="central" x="180" y="103" className="font-sans font-bold text-5xl fill-[#ffffff] drop-shadow-lg">{ctName}</text>
                <text dominantBaseline="central" x="77.5" y="105" className="font-sans font-bold text-4xl fill-southLanGreen drop-shadow-lg">{ctScore}</text>
                <text dominantBaseline="central" textAnchor="end" x="-25" y="103" className="font-sans font-bold text-5xl fill-[#ffffff] drop-shadow-lg">{tName}</text>
                <text dominantBaseline="central" textAnchor="end" x="65.5" y="105" className="font-sans font-bold text-4xl fill-southLanPurple drop-shadow-lg">{tScore}</text>
                {!(["paused", "warmup", "bomb", "defuse"].includes(props.phaseCountdowns.phase)) &&
                    <text dominantBaseline="central" textAnchor='middle' x="71.5" y="58" className="font-sans font-bold text-5xl fill-[#ffffff] drop-shadow-lg">{timer}</text>
                }
                {["paused", "warmup"].includes(props.phaseCountdowns.phase) &&
                    <image x="71.5" y="44" width="20" transform='translate(-10,0)' xlinkHref={generalIcons['pause']} />
                }
                {["bomb", "defuse"].includes(props.phaseCountdowns.phase) &&
                    <image x="71.5" y="38" width="30" transform='translate(-15,0)' xlinkHref={weaponIcons['c4red']} />
                }
                <image x="71.5" y="8" width="80" className="" transform='translate(-40,0)' xlinkHref={logo} />
            </g>
        </svg>
    </div>;
}
