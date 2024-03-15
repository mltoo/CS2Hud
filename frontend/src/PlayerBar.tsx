import React, { useState, useEffect } from 'react';
import { HealthBar } from './HealthBar';
import * as weaponIcons from "url:../res/weapons/*.svg";

export function PlayerBar(props) {
    const player = props.data;
    const dydx = 0.37388513540873675 * (player.observer_slot >= 5 ? 1 : -1);
    const dxdy = 1 / dydx;
    const barHeight = 80;
    const barPadding = 8;
    const barLength = 350;
    const totalBarLength = barLength + Math.abs(dydx * barHeight);
    let bigGun: any = undefined;
    let pistol: any = undefined;
    let knife: any = undefined;
    let taser: any = undefined;
    let grenades: any[] = [];
    let hasBomb = false;
    for (let weapon in player.weapons) {
        const weaponType = player.weapons[weapon].type;
        if (player.weapons[weapon].name === "weapon_taser") {
            taser = player.weapons[weapon];
        } else if (["Machine Gun", "Rifle", "Shotgun", "SniperRifle", "Submachine Gun"].includes(weaponType)) {
            bigGun = player.weapons[weapon];
        } else if (weaponType === "Pistol") {
            pistol = player.weapons[weapon];
        } else if (weaponType === "Knife") {
            knife = player.weapons[weapon];
        } else if (weaponType === "C4") {
            hasBomb = true; 
        } else if (weaponType === "Grenade") {
            grenades.push(player.weapons[weapon]);
        }
    }
    let primary: any = bigGun ?? pistol ?? knife;
    function weaponToIcon(weapon) {
        return weapon && weaponIcons[weapon.name.replace("weapon_", "")];
    }

    let offhandInventoryIcons: any[] = [
        ...grenades.sort((a, b) => a.name > b.name ? 1 : -1).map(grenade => weaponToIcon(grenade))
    ];
    taser && offhandInventoryIcons.push(weaponToIcon(taser));
    bigGun && pistol && offhandInventoryIcons.push(weaponToIcon(pistol));
    console.log(offhandInventoryIcons);

    return <div style={{ marginLeft: (barHeight + barPadding) * Math.abs(dydx) * (player.observer_slot % 5), marginRight: (barHeight + barPadding) * dydx * (player.observer_slot % 5), marginBottom: barPadding, height: barHeight, width: totalBarLength }} className={player.observer_slot >= 5 ? "justify-self-end" : "justify-self-start"}>
        <svg
            className='absolute -z-10'
            height={barHeight}
            viewBox={(player.observer_slot >= 5 ? 0 : -totalBarLength) + " 0 " + totalBarLength + " " + barHeight}
        >
            <defs id="defs1">
                <linearGradient id={"playerbar-grad" + player.observer_slot}>
                    <stop stopColor={hasBomb ? 'red' : 'black'} stopOpacity={dydx > 0 ? 100 : 0} offset="0%" />
                    <stop stopColor={hasBomb ? 'red' : 'black'} stopOpacity={dydx > 0 ? 0 : 100} offset="100%" />
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
                <circle
                    cy={barHeight/2}
                    cx={(barHeight/2)*dydx + 6 * Math.sign(dydx)}
                    r="12"
                    className={`stroke-[5px] ${dydx > 0 ? "stroke-southLanGreen" : "stroke-southLanPurple"} fill-black`}
                    />
                <text x={(barHeight/2)*dydx + 6 * Math.sign(dydx)} y={barHeight/2} textAnchor='middle' dominantBaseline='middle' className='font-black translate-y-[1.5px] fill-white'>{player.observer_slot}</text>
            </g>
        </svg>
        <div className="absolute" style={{ height: barHeight, width: totalBarLength }}>
            <HealthBar className="" style={{ position: "absolute", bottom: 10, right: dydx > 0 ? undefined : 75, left: dydx < 0 ? undefined : 75 }} data={props.data} />
            <img className={`invert opacity-80 drop-shadow-lg absolute ${dydx > 0 ? "-scale-x-100 left-0 -translate-x-full" : "right-0 translate-x-full"}`} style={{height: barHeight * 2/3}} src={weaponToIcon(primary)}/>
            <div className={`absolute w-full flex ${dydx > 0 ? "-scale-x-100 -left-2 -translate-x-full" : "-right-2 translate-x-full"}`} style={{top: barHeight*2/3}}>
                {offhandInventoryIcons.map(icon => <img className="invert px-0.5 opacity-80" style={{height: barHeight/3}} src={icon}/>)}
            </div>
            <div className={`text-white py-2 grid grid-cols-1 flex-col items-stretch absolute ${dydx > 0 ? "left-6" : "right-6 justify-items-end"}`} style={{height: barHeight}}>
                <div className={`w-12 h-0 font-bold flex items-baseline ${dydx > 0 ? '' : 'flex-row-reverse'}`} style={{marginLeft: Math.abs(dydx*barHeight*3/4), marginRight:Math.abs(dydx*barHeight*3/4)}}>
                    <span className="text-xs mx-1.5 font-normal">K</span>{player.match_stats.kills}
                </div>
                <div className={`w-12 h-0 font-bold flex items-baseline ${dydx > 0 ? '' : 'flex-row-reverse'}`} style={{marginLeft: Math.abs(dydx*barHeight/2), marginRight: Math.abs(dydx*barHeight/2)}}>
                    <span className="text-xs mx-1.5 font-normal">A</span>{player.match_stats.assists}
                </div>
                <div className={`w-12 h-0 font-bold flex items-baseline ${dydx > 0 ? '' : 'flex-row-reverse'}`} style={{}}>
                    <span className={`text-xs ${dydx > 0 ? "pl-2.5 mr-1.5" : "pr-2.5 ml-1.5"} font-normal`}>D</span>{player.match_stats.deaths}
                </div>
            </div>
        </div>
        <div className={(dydx > 0 ? "text-left ml-[5.3rem]" : "text-right mr-[5.3rem]") + " text-2xl mt-1.5 font-bold text-white z-20"}>{player.name}</div>
    </div>;
}

