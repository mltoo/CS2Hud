import React, { useState, useEffect } from 'react';
import { HealthBar } from './HealthBar';

export function PlayerBar(props) {
    const player = props.data;
    const dydx = 0.37388513540873675 * (player.observer_slot >= 5 ? 1 : -1);
    const dxdy = 1 / dydx;
    const barHeight = 80;
    const barPadding = 8;
    const barLength = 350;
    const totalBarLength = barLength + Math.abs(dydx * barHeight);

    return <div style={{ marginLeft: (barHeight + barPadding) * Math.abs(dydx) * (player.observer_slot % 5), marginRight: (barHeight + barPadding) * dydx * (player.observer_slot % 5), marginBottom: barPadding, height: barHeight, width: totalBarLength }} className={player.observer_slot >= 5 ? "justify-self-end" : "justify-self-start"}>
        <svg
            className='absolute -z-10'
            height={barHeight}
            viewBox={(player.observer_slot >= 5 ? 0 : -totalBarLength) + " 0 " + totalBarLength + " " + barHeight}
        >
            <defs id="defs1">
                <linearGradient id={"playerbar-grad" + player.observer_slot}>
                    <stop stopColor='black' stopOpacity={dydx > 0 ? 100 : 0} offset="0%" />
                    <stop stopColor='black' stopOpacity={dydx > 0 ? 0 : 100} offset="100%" />
                </linearGradient>
            </defs>
            <g id="layer1">
                <path
                    fill={"url(#playerbar-grad" + player.observer_slot + ")"}
                    d={"m 0 " + barHeight +
                        " " + dydx * barHeight + " " + -barHeight
                        + " h " + barLength * Math.sign(dydx)
                        + " v " + barHeight
                        //+ " l " + -dydx * barHeight + " " + barHeight
                        + " Z"}
                />
                <path
                    className={dydx > 0 ? 'fill-southLanGreen' : 'fill-southLanPurple'}
                    d={"m 0 " + barHeight +
                        " " + dydx * barHeight + " " + -barHeight
                        + " h " + 12 * Math.sign(dydx)
                        + " l " + -dydx * barHeight + " " + barHeight
                        + " Z"}
                />
            </g>
        </svg>
        <div className="absolute" style={{height: barHeight, width: totalBarLength }}>
            <HealthBar className="" style={{position: "absolute", bottom: 10, right: dydx > 0 ? undefined : 30, left: dydx < 0 ? undefined : 30}} data={props.data}/>
        </div>
        <div className={(dydx > 0 ? "text-left ml-14" : "text-right mr-14") + " text-2xl mt-1.5 font-bold text-white z-20"}>{player.name}</div>
    </div>;
}

