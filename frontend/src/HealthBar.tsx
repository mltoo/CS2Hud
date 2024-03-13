import React, { ReactNode } from 'react';

export function HealthBar(props) {
    const player = props.data;
    const dydx = 0.37388513540873675 * (player.observer_slot >= 5 ? 1 : -1);
    const dxdy = 1 / dydx;
    const barHeight = 15;
    const barLength = 300;
    const numSegments = 4;
    const segmentPadding = 3;
    const segmentLength = (barLength - (numSegments - 1) * segmentPadding - Math.abs(dydx)*barHeight) / numSegments;

    function Segment(segProps) {
        const fullHealth = 100/numSegments;
        const length = Math.max(0, (Math.min(fullHealth, player.state.health - segProps.index * fullHealth) / (fullHealth))) * segmentLength;
        return <path
            className={dydx > 0 ? 'fill-southLanGreen' : 'fill-southLanPurple'}
            d={"m " + segProps.index * (segmentLength + segmentPadding) * Math.sign(dydx) + " ,0 " + dydx * barHeight + "," + -barHeight + " h " + length*Math.sign(dydx) + " l " + -dydx * barHeight + "," + barHeight + " Z"}
        />;
    }

    let segments : ReactNode[] = []
    for (let i = 0; i < numSegments; i++) {
        segments.push(<Segment index={i}/>);
    }
    return <div className={props.className} style={{width: barLength, ...props.style}}>
        <svg
            className="absolute bottom-0"
            height={barHeight}
            viewBox={(dydx > 0 ? 0 : -barLength) + " " + -barHeight + " " + barLength + " " + barHeight}>
            <g id="layer1">
                {segments}
            </g>
        </svg>
    </div>
}
