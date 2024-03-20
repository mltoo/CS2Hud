import React, { ReactNode } from 'react';
import * as generalIcons from 'url:../res/icons/*.svg';

export function HealthBar(props) {
    const player = props.data;
    const dydx = 0.37388513540873675 * (player.observer_slot >= 5 ? 1 : -1);
    const dxdy = 1 / dydx;
    const barHeight = 19;
    const barLength = 280;
    const numSegments = 4;
    const segmentPadding = 3;
    const segmentLength = (barLength - (numSegments - 1) * segmentPadding - Math.abs(dydx) * barHeight) / numSegments;

    function Segment(segProps) {
        const fullHealth = 100 / numSegments;
        const length = Math.max(0, (Math.min(fullHealth, props.health - segProps.index * fullHealth) / (fullHealth))) * segmentLength;
        return <path
            className={props.health < 25 ? "fill-red-600" : dydx > 0 ? 'fill-southLanGreen' : 'fill-southLanPurple'}
            d={"m " + segProps.index * (segmentLength + segmentPadding) * Math.sign(dydx) + " ,0 " + dydx * barHeight + "," + -barHeight + " h " + length * Math.sign(dydx) + " l " + -dydx * barHeight + "," + barHeight + " Z"}
        />;
    }

    let segments: ReactNode[] = []
    for (let i = 0; i < numSegments; i++) {
        segments.push(<Segment key={i} index={i} />);
    }
    return <div className={props.className} style={{ width: barLength, ...props.style }}>
        <svg
            className={`absolute bottom-0 ${props.health < 100 / numSegments || dydx < 0 ? 'fill-white' : 'fill-black'}`}
            height={barHeight}
            viewBox={(dydx > 0 ? 0 : -barLength) + " " + -barHeight + " " + barLength + " " + barHeight}>
            <g id="layer1">
                {segments}
                <image
                    x={props.health >= 100 / numSegments ? Math.sign(dydx) * 10 : Math.sign(dydx) * (10 + props.health / 100 * segmentLength * numSegments)}
                    y={-barHeight / 2}
                    className={`${dydx > 0 ? 'brightness-0' : 'brightness-100'}`}
                    style={{ height: barHeight * 0.6, width: barHeight * 0.6, transform: `translate(${dydx > 0 ? 0 : -barHeight * 0.6}px, ${-barHeight * 0.3}px)` }}
                    xlinkHref={player.state.helmet ? generalIcons['armor-helmet'] : player.state.armor > 0 ? generalIcons['armor'] : generalIcons['health']}
                />
                <text
                    className={`font-bold ${props.health < 100 / numSegments || dydx < 0 ? 'fill-white' : 'fill-black'}`}
                    dominantBaseline="central"
                    textAnchor={`${dydx > 0 ? 'start' : 'end'}`}
                    x={props.health >= 100 / numSegments ? Math.sign(dydx)*(14 + barHeight*0.6) : Math.sign(dydx) * (14 + barHeight*0.6 + props.health / 100 * segmentLength * numSegments)}
                    y={-barHeight / 2}
                >
                    {props.health}
                </text>
            </g>
        </svg>
    </div>
}
