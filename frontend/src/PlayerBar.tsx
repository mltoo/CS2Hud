import React, { useState, useEffect } from 'react';
import { HealthBar } from './HealthBar';
import '../svgImport.d';
import * as weaponIcons from "url:../res/weapons/*.svg";
import * as generalIcons from "url:../res/icons/*.svg";

export function PlayerBar(props) {
    const [currentHealth, setCurrentHealth] = React.useState(100);
    const player = props.data;
    props.roundPhase !== 'freezetime' && player.state.health != currentHealth && setCurrentHealth(player.state.health);
    const dydx = 0.37388513540873675 * (player.observer_slot >= 5 ? 1 : -1);
    const dxdy = 1 / dydx;
    const barHeight = 80;
    const barPadding = 8;
    const barLength = 350;
    const deathOffset = player.state.health === 0 ? 100 : 0;
    const totalBarLength = barLength + Math.abs(dydx * barHeight);
    const isCT = player.team === 'CT';
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
    
    const strokeAccentColour = player.state.health === 0 ? "stroke-gray-500" : !isCT ? "stroke-southLanGreen" : "stroke-southLanPurple";
    const fillAccentColour = player.state.health === 0 ? "fill-gray-500" : !isCT ? "fill-southLanGreen" : "fill-southLanPurple";
    const gradientBaseColour = player.state.health == 0 ? "rgb(140 140 140)" : props.isSpecced ? "rgb(200,200,200)" : "rgb(40,40,40)";
    const roundDamage = (props.roundDamage[player.steamid] as { [round: number]: number })
    const adr = Object.keys(roundDamage)
        .filter(k => k < props.round + (props.roundPhase != "freezetime" ? 1 : 0))
        .reduce((acc, k) => acc += roundDamage[k], 0) / Math.max(1,(props.round + (props.roundPhase != "freezetime" ? 1 : 0)));

    return <div style={{ marginLeft: (barHeight + barPadding) * Math.abs(dydx) * (player.observer_slot % 5), marginRight: (barHeight + barPadding) * dydx * (player.observer_slot % 5), marginBottom: barPadding, height: barHeight, width: totalBarLength, transform: `translate(${Math.sign(dydx)*deathOffset}px,0)` }} className={`${props.isSpecced ? 'text-black' : 'text-white'} transition-transform ${player.observer_slot >= 5 ? "justify-self-end" : "justify-self-start"}`}>
        <svg
            className='absolute -z-10'
            height={barHeight}
            viewBox={(player.observer_slot >= 5 ? 0 : -totalBarLength) + " 0 " + totalBarLength + " " + barHeight}
        >
            <defs id="defs1">
                <linearGradient id={"playerbar-grad" + player.observer_slot}>
                    <stop stopColor={gradientBaseColour} stopOpacity={dydx > 0 ? 100 : 0} offset="0%" />
                    <stop className='transition' stopColor={gradientBaseColour} stopOpacity={dydx > 0 ? 0 : 100} offset="100%" />
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
                    className={fillAccentColour}
                    d={"m 0 " + barHeight +
                        " " + dydx * barHeight + " " + -barHeight
                        + " h " + 12 * Math.sign(dydx)
                        + " l " + -dydx * barHeight + " " + barHeight
                        + " Z"}
                />
                <circle
                    cy={barHeight / 2}
                    cx={(barHeight / 2) * dydx + 6 * Math.sign(dydx)}
                    r="12"
                    className={`stroke-[5px] ${strokeAccentColour} fill-black`}
                />
                <text x={(barHeight / 2) * dydx + 6 * Math.sign(dydx)} y={barHeight / 2} textAnchor='middle' dominantBaseline='middle' className='font-black translate-y-[1.5px] fill-white'>{player.observer_slot + 1}</text>
            </g>
        </svg>
        <div className="absolute" style={{ height: barHeight, width: totalBarLength }}>


            <img className={`invert opacity-80 drop-shadow-lg absolute ${dydx > 0 ? "-scale-x-100 left-0 -translate-x-full" : "right-0 translate-x-full"}`} style={{ height: barHeight * 2 / 3 }} src={weaponToIcon(primary)} />
            <div className={`absolute w-full flex ${dydx > 0 ? "-scale-x-100 -left-2 -translate-x-full" : "-right-2 translate-x-full"}`} style={{ top: barHeight * 2 / 3 }}>
                {offhandInventoryIcons.map(icon => <img key={icon} className="invert px-0.5 opacity-80" style={{ height: barHeight / 3 }} src={icon} />)}
            </div>

            {player.state.health === 0 ? //PLAYER IS DEAD:
                <div
                    className={`absolute flex items-center ${dydx > 0 ? "-translate-x-full -left-3" : "translate-x-full -right-3"}`}
                    style={{ height: barHeight }}
                >
                    <img
                        className={`brightness-50`} style={{ height: barHeight * 0.65 }} src={generalIcons["dead"]}
                    />
                </div>
                : //PLAYER IS ALIVE
                <HealthBar className={`transition-opacity duration-500 ${props.roundPhase === 'freezetime' ? 'opacity-0' : ''}`} style={{ position: "absolute", bottom: 10, right: dydx > 0 ? undefined : 75, left: dydx < 0 ? undefined : 75 }} health={currentHealth} data={props.data} />
            }

            <div className={`${props.isSpecced ? 'text-black' : 'text-white'} py-2 grid grid-cols-1 flex-col items-stretch absolute ${dydx > 0 ? "left-6" : "right-6 justify-items-end"}`} style={{ height: barHeight }}>
                <div className={`w-12 h-0 font-bold flex items-baseline ${dydx > 0 ? '' : 'flex-row-reverse'}`} style={{ marginLeft: Math.abs(dydx * barHeight * 3 / 4), marginRight: Math.abs(dydx * barHeight * 3 / 4) }}>
                    <span className="text-xs mx-1.5 font-normal">K</span>{player.match_stats.kills}
                </div>
                <div className={`w-12 h-0 font-bold flex items-baseline ${dydx > 0 ? '' : 'flex-row-reverse'}`} style={{ marginLeft: Math.abs(dydx * barHeight / 2), marginRight: Math.abs(dydx * barHeight / 2) }}>
                    <span className="text-xs mx-1.5 font-normal">A</span>{player.match_stats.assists}
                </div>
                <div className={`w-12 h-0 font-bold flex items-baseline ${dydx > 0 ? '' : 'flex-row-reverse'}`} style={{}}>
                    <span className={`text-xs ${dydx > 0 ? "pl-3.5 mr-1.5" : "pr-3.5 ml-1.5"} font-normal`}>D</span>{player.match_stats.deaths}
                </div>
            </div>
            <div
                className={(dydx > 0 ? "text-left pl-[5.5rem]" : "text-right right-0 pr-[5.5rem] flex-row-reverse") + " absolute text-base flex items-center font-bold text-green-600 z-20"}
                style={{ height: barHeight }}
            >
                ${player.state.money}
                {player.state.defusekit &&
                    <div
                        className='bg-blue-500 w-[1em] h-[1em] mx-1'
                        style={{ WebkitMask: `url(${generalIcons['defuse']}) no-repeat center`, mask: `url(${generalIcons['defuse']}) no-repeat center` }}
                    />
                }
                {hasBomb &&
                    <div
                        className='bg-red-700 w-[1em] h-[1em] mx-1'
                        style={{ WebkitMask: `url(${weaponIcons['c4']}) no-repeat center`, mask: `url(${weaponIcons['c4']}) no-repeat center` }}
                    />
                }
            </div>
            {
                <div
                    className={`absolute ${props.isSpecced ? 'text-black' : 'text-white'} flex bottom-2 transition-opacity duration-500
                    ${player.state.health === 0 || props.roundPhase === 'freezetime' ? '' : 'opacity-0'} 
                    ${dydx > 0 ? "text-left pl-[5.0rem]" : "text-right right-0 pr-[5.0rem] flex-row-reverse"}`}
                >
                    <span className='mx-1 text-xs self-end pb-[.15rem]'>ADR</span>
                    <span className='text-bold self-end font-bold'>{Math.round(adr*10)/10}</span>
                </div>
            }
        </div>
        <div className={(dydx > 0 ? "text-left ml-[5.8rem]" : "text-right mr-[5.8rem]") + ` text-xl mt-1 font-bold ${ props.isSpecced ? 'text-black' : 'text-white'} z-20`}>{player.name}</div>
    </div>;
}

